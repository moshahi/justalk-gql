import { BadGatewayException, Injectable } from '@nestjs/common';
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
}
