import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { UserRoles } from '../enums/user-role';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(`Call JWT Guard`);
    const jwt = request?.headers['authorization']?.split(' ')[1];
    console.log(`JWT: `, jwt);

    /* Todo: Fix User -> data */
    const validUser = await this.userService.jwt(jwt);

    if (!validUser) {
      return false;
    }

    request.user = { role: UserRoles.ADMIN };
    // reqeust.user = { role: UserRoles.ADMIN };
    return true;
    // console.log(`In Guard JWT: `, jwt);
  }
}
