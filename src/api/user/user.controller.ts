import { UserService } from './user.service';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { lastValueFrom } from 'rxjs';
import { ResponseStatus } from '../device/interfaces/response-status';
import { Response } from 'express';

@Controller('api/user-service')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('user')
  async signUp(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      /** Todo: Refactor result */
      const signUpResult = await lastValueFrom(
        this.userService.signUp(createUserDto),
      );

      return res.send({
        status: HttpStatus.CREATED,
        topic: `sign-up`,
        message: `success sign up`,
      });
    } catch (e) {
      throw e;
    }
  }

  @Post('signin')
  async signIn(@Body() createUserDto: CreateUserDto) {
    const result = await lastValueFrom(this.userService.signIn(createUserDto));
    console.log(`result: `, result);
    return result;
  }
}
