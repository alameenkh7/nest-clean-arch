import { Resolver, Query, Args, ObjectType, Field } from '@nestjs/graphql'
import { PaginationInput, PaginationInfo, createPaginationInfo } from './pagination.resolver'
import { YourEntity } from './types'

// Generic type for pagination result
@ObjectType('PaginatedResult')
export class PaginatedResult<T> {
  @Field(() => [YourEntity], { name: 'items' })
  items: T[]

  @Field(() => PaginationInfo, { name: 'pageInfo' })
  pageInfo: PaginationInfo
}

@Resolver(() => PaginatedResult)
export class GenericResolver {
  @Query(() => PaginatedResult, { name: 'getPaginatedItems' })
  async getPaginatedItems(
    @Args('pagination', { nullable: true, type: () => PaginationInput }) pagination?: PaginationInput
  ): Promise<PaginatedResult<YourEntity>> {
    const { limit = 10, page = 0 } = pagination || {};
    const offset = page * limit;

    // Placeholder implementation - replace with actual data fetching logic
    const items: YourEntity[] = [
      { 
        id: '1', 
        name: 'Sample Item 1',
        description: 'First sample item description',
        status: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '2', 
        name: 'Sample Item 2',
        description: 'Second sample item description',
        status: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    const totalCount = 100; // Simulated total count

    const pageInfo = createPaginationInfo(
      totalCount, 
      limit, 
      page
    );

    return { 
      items, 
      pageInfo 
    };
  }
}
