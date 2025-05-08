import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { YourEntity, YourEntityPaginatedResult } from './types';
import { FirebaseService } from '../../modules/firebase/core/firebase.service';

@Resolver(() => YourEntity)
export class YourEntityResolver {
  constructor(private readonly firebaseService: FirebaseService<YourEntity>) {}

  @Query(() => YourEntityPaginatedResult)
  async getPaginatedItems(
    @Args('page', { type: () => Number, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<YourEntityPaginatedResult> {
    const result = await this.firebaseService.findWithPagination({ page, limit });

    return {
      items: result.items,
      total: result.total,
      page,
      limit
    };
  }

  @Query(() => YourEntity, { nullable: true })
  async getItemById(
    @Args('id', { type: () => String }) id: string
  ): Promise<YourEntity | null> {
    return this.firebaseService.findById(id);
  }

  @Mutation(() => YourEntity)
  async createItem(
    @Args('name', { type: () => String }) name: string,
    @Args('description', { type: () => String, nullable: true }) description?: string,
    @Args('status', { type: () => Number, nullable: true }) status?: number
  ): Promise<YourEntity> {
    const newItem: Omit<YourEntity, 'id'> = {
      name,
      description,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await this.firebaseService.create(newItem);
  }

  @Mutation(() => YourEntity, { nullable: true })
  async updateItem(
    @Args('id', { type: () => String }) id: string,
    @Args('name', { type: () => String, nullable: true }) name?: string,
    @Args('description', { type: () => String, nullable: true }) description?: string,
    @Args('status', { type: () => Number, nullable: true }) status?: number
  ): Promise<YourEntity | null> {
    const updateData: Partial<YourEntity> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    return this.firebaseService.update(id, updateData);
  }

  @Mutation(() => Boolean)
  async deleteItem(
    @Args('id', { type: () => String }) id: string
  ): Promise<boolean> {
    try {
      await this.firebaseService.delete(id);
      return true;
    } catch {
      return false;
    }
  }
}
