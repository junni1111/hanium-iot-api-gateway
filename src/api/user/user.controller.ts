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
  UseGuards,
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
import { RolesGuard } from './guards/roles.guard';
import { UserRoles } from './enums/user-role';
import { AuthGuard } from './guards/auth.guard';
import { TokensDto } from './dto/tokens.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { ValidateJwtDto } from './dto/validate-jwt.dto';

@ApiTags(USER)
@Controller('api/user-service')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  @ApiCreatedResponse({ description: 'Sign up result example' })
  async signUp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      const user = await this.userService.signUp(createUserDto);
      console.log('signup : ', user);

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

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async me(@Body() validateJwtDto: ValidateJwtDto) {
    try {
      const { user } = validateJwtDto;
      // const me = this.userService.me();
    } catch (e) {}
  }

  @Post('jwt')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async jwt(@Headers() header: any) {
    try {
      return true;
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
  @ApiOkResponse({ description: 'Login API', type: TokensDto })
  async signIn(
    @Req() req: Request,
    @Res() res: Response,
    @Body() signInDto: SignInDto,
  ) {
    try {
      const { accessToken, refreshToken, user }: TokensDto =
        await this.userService.signIn(signInDto);

      res.cookie(
        'auth-cookie',
        { userId: user.id, refreshToken },
        { httpOnly: true, domain: process.env.COOKIE_DOMAIN },
      );

      return res.status(HttpStatus.CREATED).send(accessToken);

      const response = {
        statusCode: HttpStatus.OK,
        message: 'signin completed',
        payload: accessToken,
      };

      return res.send(response);
    } catch (e) {
      console.log(`API Gateway Exception: `, e);
      throw new HttpException(
        // {
        //   statusCode: e.response.data.statusCode,
        //   message: e.response.data.message,
        // },
        // e.response.data.statusCode,
        {
          statusCode: e,
          message: e,
        },
        e,
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

  @Post('message')
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    try {
      const { data } = await this.userService.sendMessage(sendMessageDto);

      return data;
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
        data,
      });
    } catch (e) {
      throw e;
    }
  }
}
