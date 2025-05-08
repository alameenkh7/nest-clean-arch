import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit?: number = 10

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  page?: number = 0

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number = 0
}

@ObjectType()
export class PaginationInfo {
  @Field(() => Int)
  totalElements: number

  @Field(() => Int)
  totalPages: number

  @Field(() => Int)
  currentPage: number

  @Field(() => Int)
  pageSize: number

  @Field(() => Boolean)
  hasNextPage: boolean

  @Field(() => Boolean)
  hasPreviousPage: boolean
}

// Utility function to create pagination info
export function createPaginationInfo(
  totalElements: number, 
  pageSize: number, 
  currentPage: number
): PaginationInfo {
  const totalPages = Math.ceil(totalElements / pageSize)
  
  return {
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    hasNextPage: currentPage < totalPages - 1,
    hasPreviousPage: currentPage > 0
  }
}
