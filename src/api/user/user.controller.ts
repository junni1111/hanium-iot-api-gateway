import { UserService } from './user.service';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { lastValueFrom } from 'rxjs';
import { ResponseStatus } from '../device/interfaces/response-status';
import { Request, Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { USER } from '../../util/constants/swagger';

@ApiTags(USER)
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

  @ApiBearerAuth('access-token')
  @Post('jwt')
  async jwt(@Headers() header: any, @Res() res: Response) {
    const jwt = header['authorization']?.split(' ')[1];
    console.log(`header : `, header);

    try {
      if (!jwt) {
        throw new NotFoundException('JWT Not Found');
      }

      const result = await lastValueFrom(this.userService.jwt(jwt));
      console.log(`Get Result: `, result);

      return res.status(HttpStatus.OK).send(result);
    } catch (e) {
      /** Throw UnauthorizedException */
      throw e.response;
    }
  }

  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const tokens = req.cookies['auth-cookie'];
    if (!tokens) {
      throw new NotFoundException('Auth Cookie Not Found');
    }

    try {
      const result = await lastValueFrom(this.userService.refresh(tokens));
      console.log(result);
      tokens.accessToken = result;
      res.cookie('auth-cookie', { ...tokens });

      const response: ResponseStatus = {
        status: HttpStatus.OK,
        topic: 'refresh',
        message: 'success refresh access token',
      };
      return res.status(HttpStatus.OK).send(response);
    } catch (e) {
      Logger.error(e);
    }
  }

  @Post('signin')
  async signIn(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createUserDto: SignInDto,
  ) {
    try {
      const tokens = await lastValueFrom(
        this.userService.signIn(createUserDto),
      );
      /** Todo: Set JWT */
      res.cookie('auth-cookie', tokens, { httpOnly: true });
      return res.status(HttpStatus.OK).send(tokens);
    } catch (e) {
      throw new ForbiddenException('유효하지 않은 사용자 정보입니다');
    }
  }
}
