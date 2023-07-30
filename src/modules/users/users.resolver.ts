import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Request } from 'express';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/gql-auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  findMe(@Req() req: Request) {
    return this.usersService.findMe(req);
  }

  @Query(() => User)
  findByUsername(@Args('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Query(() => User, { name: 'email' })
  findOneByEmail(@Args('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }
}
