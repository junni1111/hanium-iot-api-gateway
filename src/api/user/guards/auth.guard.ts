import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { ValidateJwtDto } from '../dto/validate-jwt.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(`Call JWT Guard`);

    const jwt = request?.headers['authorization']?.split(' ')[1];
    console.log(`JWT: `, jwt);

    const user: ValidateJwtDto = await this.userService.jwt(jwt);
    if (!user) {
      return false;
    }

    request.body.user = user;
    return true;
  }
}
