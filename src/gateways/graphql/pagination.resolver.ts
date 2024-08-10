import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'

@InputType()
export class Pagination {
  @Field(() => Int)
  limit: number
  @Field(() => Int)
  offset: number
}

@ObjectType()
export class PaginationInfo {
  @Field(() => Int)
  totalElements: number
}
