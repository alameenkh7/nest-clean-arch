import { Field, ObjectType, ID, Int } from '@nestjs/graphql'

@ObjectType('YourEntity')
export class YourEntity {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  status?: number;

  @Field({ nullable: true })
  createdAt?: string;

  @Field({ nullable: true })
  updatedAt?: string;
}

@ObjectType('YourEntityPaginatedResult')
export class YourEntityPaginatedResult {
  @Field(() => [YourEntity])
  items: YourEntity[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

@ObjectType('PaginatedResult')
export class PaginatedResultType<T> {
  @Field(() => [YourEntity])
  items: T[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}

export interface YourService {
  findAndCount(options: { 
    take: number; 
    skip: number; 
  }): Promise<[YourEntity[], number]>;
}
