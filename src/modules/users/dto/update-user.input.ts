import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => Int)
  id: number;
}
