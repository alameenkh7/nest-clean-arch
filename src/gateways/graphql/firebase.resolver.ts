import { Resolver, Query, Mutation, Args, InputType, Field, Int } from '@nestjs/graphql';
import { FirebaseService } from '../../modules/firebase/core/firebase.service';
import { YourEntity, YourEntityPaginatedResult } from './types';
import { PaginationInput } from './pagination.resolver';

@InputType()
export class CreateEntityInput {
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

@Resolver(() => YourEntity)
export class FirebaseResolver {
  constructor(private firebaseService: FirebaseService<YourEntity>) {}

  @Query(() => YourEntityPaginatedResult, { 
    name: 'getPaginatedItems',
    description: 'Get paginated items from a specific Firebase collection' 
  })
  async getPaginatedItems(
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number
  ): Promise<YourEntityPaginatedResult> {
    // Use default pagination if not provided
    const defaultLimit = 10;
    const defaultPage = 1;
    const safeLimit = limit || defaultLimit;
    const safePage = page || defaultPage;

    // Fetch items
    const { items, total } = await this.firebaseService.findWithPagination({ page: safePage, limit: safeLimit });

    return {
      items,
      total,
      page: safePage,
      limit: safeLimit
    };
  }

  @Query(() => YourEntity, { 
    name: 'getItemById',
    nullable: true,
    description: 'Get a specific item by ID from a Firebase collection' 
  })
  async getItemById(
    @Args('id', { 
      type: () => String,
      description: 'Unique identifier of the item' 
    }) 
    id: string
  ): Promise<YourEntity | null> {
    return this.firebaseService.findById(id);
  }

  @Mutation(() => YourEntity, {
    name: 'createItem',
    description: 'Create a new item in a specific Firebase collection'
  })
  async createItem(
    @Args('data', { 
      type: () => CreateEntityInput,
      description: 'Data for the new item' 
    }) data: CreateEntityInput
  ): Promise<YourEntity> {
    // Add createdAt timestamp if not provided
    const itemToCreate = {
      ...data,
      status: data.status ?? undefined,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };

    // Create the item and get its ID
    return this.firebaseService.create(itemToCreate);
  }
}
