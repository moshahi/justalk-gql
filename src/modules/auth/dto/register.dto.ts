import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterDto {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  rememberMe: boolean;
}
