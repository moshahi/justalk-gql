import {
  Injectable,
  NotFoundException,
  BadGatewayException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(body: LoginDto, req: Request) {
    try {
      const user = await this.userService.findOne(body.email);
      if (!user) {
        return new BadRequestException('کاربری با این ایمیل موجود نمیباشد');
      }
      const isMatch = await bcrypt.compare(body.password, user.password);
      if (!isMatch) {
        return new BadRequestException('ایمیل یا رمز عبور اشتباه است');
      }
      const { password, refToken, ...userResult } = user;
      const token = await this.generateToken(userResult, body.rememberMe);
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          refToken: token.refresh_token,
        },
      });
      await req.res.cookie('refToken', token.refresh_token, { httpOnly: true });
      return {
        access_token: token.access_token,
        user: userResult,
      };
    } catch (error) {
      console.log(error);
      return new BadGatewayException('مشکلی از سمت سرور پیش آمده است');
    }
  }

  async register(body: RegisterDto, req: Request) {
    try {
      const existUser = await this.userService.findOne(body.email);
      if (existUser) {
        return new BadRequestException('کاربر موجود میباشد');
      }
      const hashPassword = await bcrypt.hash(body.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: body.email,
          password: hashPassword,
          avatarColor: body.avatarColor,
          username: body.username,
        },
      });
      const loginBody = {
        email: user.email,
        password: body.password,
        rememberMe: body.rememberMe,
      };

      return await this.login(loginBody, req);
    } catch (error) {
      console.log(error);
      return new BadGatewayException('مشکلی از سمت سرور پیش آمده است');
    }
  }

  async refreshToken(req: Request, reqUser) {
    try {
      if (!req.cookies.refToken)
        return new UnauthorizedException('رفرش توکن موجود نیست');
      const user = await this.prisma.user.findUnique({
        where: { id: reqUser.id },
      });
      const verifyToken = await this.jwtService.verifyAsync(
        req.cookies.refToken,
      );
      if (user.refToken !== req.cookies.refToken || !verifyToken)
        return new UnauthorizedException('رفرش توکن معتبر نیست');
      const token = await this.generateToken(reqUser, false);
      return {
        access_token: token,
        user: reqUser,
      };
    } catch (error) {
      console.log(error);
      return new BadGatewayException('مشکلی از سمت سرور پیش آمده است');
    }
  }
  async generateToken(payload: User, rememberMe: boolean) {
    try {
      if (rememberMe) {
        const access_token = await this.jwtService.sign(payload, {
          secret: process.env.ACC_TOKEN_SECRET,
          expiresIn: '1d',
        });
        const refresh_token = await this.jwtService.sign(payload, {
          expiresIn: '30d',
          secret: process.env.REF_TOKEN_SECRET,
        });
        return {
          access_token,
          refresh_token,
        };
      }
      const refresh_token = await this.jwtService.sign(payload, {
        expiresIn: '1d',
        secret: process.env.REF_TOKEN_SECRET,
      });
      const access_token = await this.jwtService.sign(payload, {
        secret: process.env.ACC_TOKEN_SECRET,
        expiresIn: '1d',
      });
      return {
        refresh_token,
        access_token,
      };
    } catch (error) {
      console.log(error);
      return {
        access_token: null,
        refresh_token: null,
      };
    }
  }
}
