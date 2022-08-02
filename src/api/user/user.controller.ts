import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { USER } from '../../util/constants/swagger';

@ApiTags(USER)
@Controller('api/user-service')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  async signUp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    console.log(`Call signup`);
    try {
      const { data } = await this.userService.signUp(createUserDto);
      console.log('signup : ', data);

      return res.send({
        statusCode: HttpStatus.CREATED,
        message: `success sign up`,
      });
    } catch (e) {
      throw new HttpException(
        {
          status: e.response.data.statusCode,
          message: e.response.data.message,
        },
        e.response.data.statusCode,
      );
    }
  }

  @ApiBearerAuth('access-token')
  @Post('jwt')
  async jwt(@Headers() header: any, @Res() res: Response) {
    const jwt = header['authorization']?.split(' ')[1];
    if (!jwt) {
      throw new NotFoundException('Jwt Not Found');
    }

    try {
      // const { data } = await this.userService.jwt(jwt);
      // console.log(`Get Result: `, data);

      return res.send({
        statusCode: HttpStatus.OK,
        message: 'Jwt Is Validate',
      });
    } catch (e) {
      throw new HttpException(
        {
          statusCode: e.response.data.statusCode,
          message: e.response.data.message,
        },
        e.response.data.statusCode,
      );
    }
  }

  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const tokens = req.cookies['auth-cookie'];
    console.log('tokens : ', tokens);
    if (!tokens) {
      throw new NotFoundException('Auth Cookie Not Found');
    }

    try {
      const { data } = await this.userService.refresh(tokens);
      res.cookie(
        'auth-cookie',
        { userId: data.userId, refreshToken: data.refreshToken },
        { httpOnly: true, domain: process.env.COOKIE_DOMAIN },
      );

      return res.send({
        statusCode: HttpStatus.OK,
        message: 'Jwt Is Refreshed',
        accessToken: data.accessToken,
      });
    } catch (e) {
      res.clearCookie('auth-cookie', {
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
      });

      throw new HttpException(
        {
          statusCode: e.response.data.statusCode,
          message: e.response.data.message,
        },
        e.response.data.statusCode,
      );
    }
  }

  @Post('signin')
  async signIn(
    @Req() req: Request,
    @Res() res: Response,
    @Body() signInDto: SignInDto,
  ) {
    try {
      const { data } = await this.userService.signIn(signInDto);

      res.cookie(
        'auth-cookie',
        { userId: data.userId, refreshToken: data.refreshToken },
        { httpOnly: true, domain: process.env.COOKIE_DOMAIN },
      );

      return res.send({
        statusCode: HttpStatus.OK,
        message: 'signin completed',
        accessToken: data.accessToken,
      });
    } catch (e) {
      throw new HttpException(
        {
          statusCode: e.response.data.statusCode,
          message: e.response.data.message,
        },
        e.response.data.statusCode,
      );
    }
  }

  @Get('signout')
  async signOut(@Req() req: Request, @Res() res: Response) {
    const tokens = req.cookies['auth-cookie'];
    console.log(`cookie : `, tokens);
    if (!tokens) {
      throw new NotFoundException('Cookie Not Exist');
    }

    try {
      const { data } = await this.userService.signOut(tokens.userId);
      res.clearCookie('auth-cookie', {
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
      });

      return res.send({
        statusCode: HttpStatus.OK,
        message: 'signout completed',
      });
    } catch (e) {
      throw e;
    }
  }

  @Delete('db')
  async clearUserDB(@Res() res: Response) {
    try {
      const { data } = await this.userService.clearUserDB();

      return res.send({
        statusCode: HttpStatus.OK,
        message: 'db clear completed',
      });
    } catch (e) {
      throw e;
    }
  }
}
