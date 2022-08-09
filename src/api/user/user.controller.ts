import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { USER } from '../../util/constants/swagger';
import { SendMessageDto } from './dto/send-message.dto';
import { TokensDto } from './dto/tokens.dto';
import { ValidateJwtDto } from './dto/validate-jwt.dto';
import { ResponseGeneric } from '../types/response-generic';
import { User } from './entities/user.entity';

@ApiTags(USER)
@Controller('api/user-service')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiCreatedResponse({ description: '회원 가입 API', type: User })
  @Post('signup')
  async signUp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseGeneric<User>> {
    try {
      const user = await this.userService.signUp(createUserDto);
      console.log('signup : ', user);

      return res.status(HttpStatus.CREATED).send(user);
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }

  @ApiOkResponse({ description: '회원 가입 API', type: User })
  @Get('me')
  // @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async me(
    @Res() res: Response,
    @Body() validateJwtDto: ValidateJwtDto,
  ): Promise<ResponseGeneric<User>> {
    try {
      const { user } = validateJwtDto;
      // const me = this.userService.me();
      return res.status(HttpStatus.OK).send('me');
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }

  @ApiOkResponse({
    description: 'jwt 유효성 확인 API',
    schema: { type: 'boolean', example: true },
  })
  @Post('jwt')
  // @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async jwt(
    @Res() res: Response,
    @Headers() header: any,
  ): Promise<ResponseGeneric<boolean>> {
    try {
      return res.status(HttpStatus.OK).send(true);
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }

  @ApiOkResponse({
    description: 'jwt 재발급 API',
    schema: { type: 'string', example: 'JWT ACCESS TOKEN' },
  })
  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseGeneric<string>> {
    const tokens = req.cookies['auth-cookie'];
    console.log('tokens : ', tokens);
    if (!tokens) {
      throw new NotFoundException('Auth Cookie Not Found');
    }

    try {
      const data = await this.userService.refresh(tokens);
      res.cookie(
        'auth-cookie',
        { userId: data.userId, refreshToken: data.refreshToken },
        { httpOnly: true, domain: process.env.COOKIE_DOMAIN },
      );

      return res.status(HttpStatus.OK).send(data.accessToken);
    } catch (e) {
      res.clearCookie('auth-cookie', {
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
      });

      return res.status(e.statusCode).send(e.message);
    }
  }

  @ApiOkResponse({
    description: '로그인 API',
    schema: { type: 'string', example: 'JWT ACCESS TOKEN' },
  })
  @Post('signin')
  async signIn(
    @Req() req: Request,
    @Res() res: Response,
    @Body() signInDto: SignInDto,
  ): Promise<ResponseGeneric<string>> {
    try {
      const { userId, accessToken, refreshToken }: TokensDto =
        await this.userService.signIn(signInDto);

      res.cookie(
        'auth-cookie',
        { userId, refreshToken },
        { httpOnly: true, domain: process.env.COOKIE_DOMAIN },
      );

      return res.status(HttpStatus.OK).send(accessToken);
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }

  @ApiOkResponse({ description: '로그아웃 API' })
  @Get('signout')
  async signOut(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseGeneric<string>> {
    const tokens = req.cookies['auth-cookie'];
    console.log(`cookie : `, tokens);
    if (!tokens) {
      throw new NotFoundException('Cookie Not Exist');
    }

    try {
      const result = await this.userService.signOut(tokens.userId);
      res.clearCookie('auth-cookie', {
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
      });

      return res.status(HttpStatus.OK).send(result);
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }

  @ApiOkResponse({ description: '텔레그램 메세지 전송 API', type: String })
  @Post('message')
  async sendMessage(
    @Res() res: Response,
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<ResponseGeneric<any>> {
    try {
      const result = await this.userService.sendMessage(sendMessageDto);

      return res.status(HttpStatus.OK).send(result);
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }

  @ApiOkResponse({
    description: '사용자 DB 삭제 API',
    schema: { type: 'string', example: '0' },
  })
  @Delete('db')
  async clearUserDB(@Res() res: Response): Promise<ResponseGeneric<any>> {
    try {
      const result = await this.userService.clearUserDB();

      return res.status(HttpStatus.OK).send(result.affected.toString());
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }
}
