import ResponseError from '@src/error';
import { TPermission } from '@src/types/permission';
import { hasPermission } from '@src/utils/permission';
import { NextFunction, Request, Response } from 'express';

function permission(permissions: TPermission[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const flatUserPermission = [
        ...new Set(
          res.locals.session.users_roles
            .map((v) => v.role.roles_permissions.map((role_permission) => role_permission.permission.name))
            .flat(2)
        )
      ];

      if (!hasPermission(permissions, flatUserPermission))
        throw new ResponseError(403, 'You do not have access to this resource');

      next();
    } catch (error: any) {
      next(error);
    }
  };
}

export default permission;
