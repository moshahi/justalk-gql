import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PassportModule, PassportModule, JwtModule],
  providers: [
    AuthResolver,
    AuthService,
    PrismaService,
    UsersService,
    JwtStrategy,
  ],
})
export class AuthModule {}
