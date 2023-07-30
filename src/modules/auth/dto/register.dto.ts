import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterDto {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  avatarColor: string;

  @Field()
  password: string;

  @Field()
  rememberMe: boolean;
}
