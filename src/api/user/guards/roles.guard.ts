import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRoles } from '../enums/user-role';
import { Reflector } from '@nestjs/core';

export const RolesGuard = (roles: UserRoles[]): Type<CanActivate> => {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      console.log(`Call Roles Guard`);
      const request = context.switchToHttp().getRequest();
      const { role } = request?.user;

      return roles.includes(role);
    }
  }

  return mixin(RoleGuardMixin);
};
