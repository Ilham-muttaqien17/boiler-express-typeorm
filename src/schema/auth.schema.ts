import { EMAIL_REGEX, PASSWORD_REGEX } from '@src/constants';
import type { TUser } from '@src/types/user';
import z from 'zod';

export const loginSchema = z.object<Record<keyof Omit<TUser, 'username'>, any>>({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .refine((val) => EMAIL_REGEX.test(val), {
      message: 'Email is not valid format'
    }),
  password: z.string().min(1, 'Password is required')
});

export const registerUserSchema = z.object<Record<keyof TUser, any>>({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .refine((val) => EMAIL_REGEX.test(val), {
      message: 'Email is not valid format'
    }),
  password: z
    .string()
    .min(8)
    .refine((val) => PASSWORD_REGEX.test(val), 'Passowrd at least contain lower char, upper char & number'),
  username: z.string().trim().min(1, 'Password is required')
});
