import { Mutation, Resolver, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Auth } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guard/gql-auth.guard';
import { GetCurrentUser } from 'src/common/get-current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Auth)
  register(@Args('body') body: RegisterDto, @Context('req') req: Request) {
    return this.authService.register(body, req);
  }

  @Mutation(() => Auth)
  login(@Args('body') body: LoginDto, @Context('req') req: Request) {
    return this.authService.login(body, req);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Auth)
  refreshToken(@Context('req') req: Request, @GetCurrentUser() user) {
    return this.authService.refreshToken(req, user);
  }
}
