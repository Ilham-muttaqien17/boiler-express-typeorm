import env from '@config/index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { TUser } from '@src/types/user';
import { useValidator } from '@src/utils/validator';
import dataSource from '@src/db/data-source';
import { User } from '@src/db/entities/user.entity';
import ResponseError from '@src/error';
import { Role } from '@src/db/entities/role.entity';
import { UserRole } from '@src/db/entities/user_role.entity';
import { omit } from '@src/utils/helpers';
import { useRedisClient } from '@src/utils/redis';

const PASSWORD_REGEX = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])');
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userRepository = dataSource.getRepository(User);
const roleRepository = dataSource.getRepository(Role);
const userRoleRepository = dataSource.getRepository(UserRole);

const loginValidation = z.object<Record<keyof Omit<TUser, 'username'>, any>>({
  email: z
    .string()
    .trim()
    .min(1, 'Is required')
    .refine((val) => EMAIL_REGEX.test(val), {
      message: 'Is not valid format'
    }),
  password: z.string().min(1, 'Is required')
});

const storeValidation = z.object<Record<keyof TUser, any>>({
  email: z
    .string()
    .trim()
    .min(1, 'Is required')
    .refine((val) => EMAIL_REGEX.test(val), {
      message: 'Is not valid format'
    }),
  password: z
    .string()
    .min(8)
    .refine((val) => PASSWORD_REGEX.test(val), 'At least contain lower char, upper char & number'),
  username: z.string().trim().min(1, 'Is required')
});

async function register(req: Request) {
  const parsedBody = useValidator<TUser>({
    data: req.body,
    schema: storeValidation
  });

  const existingUser = await userRepository.findOne({
    where: {
      email: parsedBody?.email
    }
  });

  if (existingUser) throw new ResponseError(400, 'Email already registered');

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const role = await roleRepository.findOne({
      where: {
        role_name: 'admin'
      }
    });

    if (!role) {
      throw new ResponseError(400, 'Role is not found');
    }

    const user = userRepository.create({
      email: parsedBody?.email,
      password: parsedBody?.password,
      username: parsedBody?.username
    });
    const savedUser = await userRepository.save(user);

    const user_role = new UserRole();
    user_role.role = role as Role;
    user_role.user = savedUser;
    await userRoleRepository.save(user_role);

    await queryRunner.commitTransaction();

    return omit<User>(savedUser, ['password']);
  } catch (err: any) {
    await queryRunner.rollbackTransaction();
    throw new ResponseError(400, err.message);
  } finally {
    await queryRunner.release();
  }
}

async function login(req: Request) {
  const parsedBody = useValidator<Omit<TUser, 'username'>>({
    data: req.body,
    schema: loginValidation
  });

  const user = await userRepository.findOne({
    where: {
      email: parsedBody?.email
    },
    relations: {
      users_roles: {
        role: true
      }
    }
  });

  if (!user) throw new ResponseError(400, 'Email or password is not valid');

  const isValidCredentials = bcrypt.compareSync(parsedBody?.password as string, user.password);

  if (!isValidCredentials) throw new ResponseError(400, 'Email or password is not valid');

  const maxAge = 60000 * 15;
  const loggedInTime = Date.now();

  const token = jwt.sign({ user_id: user.id, logged_in_time: loggedInTime }, env.JWT_SECRET, {
    expiresIn: maxAge / 1000
  });

  await useRedisClient.setData(
    `user-session:${user.id}:${loggedInTime}`,
    JSON.stringify(user),
    maxAge / 1000
  );

  const data = {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.users_roles.map((user_role) => user_role.role),
    token: {
      type: 'Bearer',
      value: token,
      maxAge
    }
  };

  return data;
}

async function getCurrentUser(res: Response) {
  const user = await userRepository.findOne({
    where: {
      id: res.locals.session.id
    },
    relations: {
      users_roles: {
        role: true
      }
    }
  });

  if (!user) throw new ResponseError(404, 'Data not found, please sign in again');

  const data = {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.users_roles.map((user_role) => user_role.role)
  };

  return data;
}

export default {
  login,
  register,
  getCurrentUser
};
