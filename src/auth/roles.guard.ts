import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    console.log(user)

    const hasRole = requiredRoles.some((role) => user?.role?.includes(role));


    if (!hasRole) {
      throw new ForbiddenException(`Access denied. One of these roles required: ${requiredRoles.join(", ")}`);
    }

    return hasRole;
  }
}
