import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class Auth {
  @Field(() => String)
  access_token: string;

  @Field(() => User)
  user: User;
}
