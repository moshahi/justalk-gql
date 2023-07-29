import {
  Injectable,
  ExecutionContext,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
  handleRequest(err: any, user, info: any) {
    if (err || info) {
      throw new HttpException('توکن نامعتبر است', 400);
    }

    if (!user) throw new UnauthorizedException('شمار وارد نشده اید');

    return user;
  }
}
