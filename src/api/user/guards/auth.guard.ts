import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log()
    const jwt = request?.header['authorization']?.split(' ')[1];

    const passUser = this.userService.jwt('sadasd');

    if (!passUser) {
      return false;
    }

    request.user = passUser;
    return true;
    // console.log(`In Guard JWT: `, jwt);
  }
}
