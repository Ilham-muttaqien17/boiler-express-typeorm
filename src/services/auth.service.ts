import env from '@config/index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import type { TUser } from '@src/types/user';
import { useValidator } from '@src/utils/validator';
import dataSource from '@src/db/data-source';
import { User } from '@src/db/entities/user.entity';
import ResponseError from '@src/error';
import { Role } from '@src/db/entities/role.entity';
import { UserRole } from '@src/db/entities/user_role.entity';
import { omit } from '@src/utils/helpers';
import { useRedisClient } from '@src/utils/redis';
import { loginSchema, registerUserSchema } from '@src/schema/auth.schema';

const userRepository = dataSource.getRepository(User);
const roleRepository = dataSource.getRepository(Role);
const userRoleRepository = dataSource.getRepository(UserRole);

async function register(req: Request) {
  const parsedBody = useValidator<TUser>({
    data: req.body,
    schema: registerUserSchema
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
    schema: loginSchema
  });

  const user = await userRepository.findOne({
    where: {
      email: parsedBody?.email
    },
    relations: {
      users_roles: {
        role: {
          roles_permissions: {
            permission: true
          }
        }
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

  const roles = user.users_roles.map((user_role) => ({
    id: user_role.role.id,
    name: user_role.role.role_name,
    permissions: user_role.role.roles_permissions.map((role_permission) => ({
      id: role_permission.permission.id,
      name: role_permission.permission.name
    }))
  }));

  const data = {
    id: user.id,
    username: user.username,
    email: user.email,
    roles,
    token: {
      type: 'Bearer',
      value: token,
      maxAge
    }
  };

  return data;
}

async function getCurrentUser(res: Response) {
  const user = res.locals.session;

  const roles = user.users_roles.map((user_role) => ({
    id: user_role.role.id,
    name: user_role.role.role_name,
    permissions: user_role.role.roles_permissions.map((role_permission) => ({
      id: role_permission.permission.id,
      name: role_permission.permission.name
    }))
  }));

  const data = {
    id: user.id,
    username: user.username,
    email: user.email,
    roles
  };

  return data;
}

async function logout(res: Response) {
  const { session, loggedInTime } = res.locals;
  await useRedisClient.deleteData(`user-session:${session.id}:${loggedInTime}`);
  return true;
}

export default {
  login,
  register,
  getCurrentUser,
  logout
};
