import {
  BadGatewayException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findMe(req: Request) {
    return req.user;
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      const { password, ...result } = user;
      return result;
    } catch (error) {
      console.log(error);
      return new BadGatewayException('مشکلی از سمت سرور پیش آمده است');
    }
  }

  async findOne(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findByUsername(username: string) {
    try {
      const findUser = await this.prisma.user.findUnique({
        where: { username },
      });
      if (!findUser)
        return new NotFoundException('کاربری با این یوزرنیم پیدا نشد');

      const { password, refToken, ...user } = findUser;
      return user;
    } catch (error) {
      console.log(error);
      return new BadGatewayException('مشکلی از سمت سرور پیش آمده است');
    }
  }
}
