import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';

export const GetCurrentUser = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const gql = GqlExecutionContext.create(context).getContext();
    const user = gql.req.user;
    return !user ? null : user;
  },
);
