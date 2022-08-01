import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(`Call Roles Guard`);
    const request = context.switchToHttp().getRequest();

    const { role } = request?.user;

    return true;
  }
}
