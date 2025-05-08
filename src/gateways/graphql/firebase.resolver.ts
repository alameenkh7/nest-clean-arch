import { Resolver, Query, Mutation, Args, InputType, Field, Int } from '@nestjs/graphql';
import { FirebaseService } from '../../services/firebase.service';
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
  constructor(private firebaseService: FirebaseService) {}

  @Query(() => YourEntityPaginatedResult, { 
    name: 'getPaginatedItems',
    description: 'Get paginated items from a specific Firebase collection' 
  })
  async getPaginatedItems(
    @Args('collection', { 
      type: () => String, 
      defaultValue: 'items',
      description: 'Name of the Firebase collection to query' 
    }) collection: string,
    @Args('pagination', { 
      type: () => PaginationInput, 
      nullable: true,
      description: 'Pagination options' 
    }) 
    pagination?: PaginationInput
  ): Promise<YourEntityPaginatedResult> {
    // Use default pagination if not provided
    const limit = pagination?.limit || 10;
    const page = pagination?.page || 0;
    const offset = page * limit;

    // Fetch items
    const items = await this.firebaseService.findAll(collection, { 
      limit, 
      offset 
    });

    // Fetch total count
    const collectionRef = this.firebaseService.getCollectionRef(collection);
    const snapshot = await collectionRef.count().get();
    const total = snapshot.data().count;

    return {
      items,
      total,
      page,
      limit
    };
  }

  @Query(() => YourEntity, { 
    name: 'getItemById',
    nullable: true,
    description: 'Get a specific item by ID from a Firebase collection' 
  })
  async getItemById(
    @Args('collection', { 
      type: () => String, 
      defaultValue: 'items',
      description: 'Name of the Firebase collection to query' 
    }) collection: string,
    @Args('id', { 
      type: () => String,
      description: 'Unique identifier of the item' 
    }) 
    id: string
  ): Promise<YourEntity | null> {
    return this.firebaseService.findById(collection, id);
  }

  @Mutation(() => YourEntity, {
    name: 'createItem',
    description: 'Create a new item in a specific Firebase collection'
  })
  async createItem(
    @Args('collection', { 
      type: () => String, 
      defaultValue: 'items',
      description: 'Name of the Firebase collection to add item to' 
    }) collection: string,
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
    const id = await this.firebaseService.create(collection, itemToCreate);

    // Return the created item with its ID
    return {
      id,
      ...itemToCreate
    };
  }
}
