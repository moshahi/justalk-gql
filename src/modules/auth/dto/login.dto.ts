import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginDto {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  rememberMe: boolean;
}
