import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository';
import { AppError } from '../utils/AppError';
import { config } from '../config';
import { Prisma } from '@prisma/client';

export const authService = {
  async register(data: Prisma.UserCreateInput) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(409, 'Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async login(email: string, passwordString: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(passwordString, user.password);
    if (!isValidPassword) {
      throw new AppError(401, 'Invalid email or password');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },

  async getProfile(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};
