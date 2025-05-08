import {
  Args,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql'

import { Inject, Injectable, Logger } from '@nestjs/common'
import { CoreS } from '../../tokens'
import { FirebaseService } from '../../modules/firebase/core/firebase.service'
import { UseCases } from '../../core/usecases'
import { PaginationInput } from './pagination.resolver'

@InputType()
export class CreateTagInput {
  @Field()
  name: string

  @Field()
  description: string

  @Field({ nullable: true })
  foreground?: string

  @Field({ nullable: true })
  background?: string
}

@InputType()
export class UpdateTagInput extends CreateTagInput {
  @Field()
  id: string
}

@ObjectType()
export class Tag {
  @Field()
  id: string

  @Field()
  name: string

  @Field()
  description: string

  @Field({ defaultValue: '#000000' })
  foreground: string = '#000000'

  @Field({ defaultValue: '#FFFFFF' })
  background: string = '#FFFFFF'


  @Field()
  createdAt: string

  @Field()
  updatedAt: string
}

@ObjectType()
class TagOutput {
  @Field()
  id: string
}

@ObjectType('PaginatedTags')
export class PaginatedTags {
  @Field(() => [Tag])
  items: Tag[]

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

@Injectable()
@Resolver(() => Tag)
export class TagResolver {
  private readonly logger = new Logger(TagResolver.name);
  constructor(
    @Inject(CoreS) private readonly core: UseCases,
    private readonly firebaseService: FirebaseService<Tag>
  ) {
    if (!firebaseService) {
      this.logger.error('FirebaseService not initialized');
      throw new Error('FirebaseService not initialized');
    }
  }

  @Mutation(() => TagOutput)
  async addTag(@Args('data') tag: CreateTagInput): Promise<TagOutput> {
    const newTag: Omit<Tag, 'id'> = {
      name: tag.name,
      description: tag.description,
      foreground: tag.foreground || '#000000',
      background: tag.background || '#FFFFFF',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const createdTag = await this.firebaseService.create(newTag);
      return { id: createdTag.id };
    } catch (error) {
      this.logger.error('Error adding tag', error);
      throw error;
    }
  }

  @Mutation(() => TagOutput)
  async updateTag(@Args('data') tag: UpdateTagInput): Promise<TagOutput> {
    try {
      const updatedTag = await this.firebaseService.update(tag.id, tag);
      return { id: updatedTag.id };
    } catch (error) {
      this.logger.error('Error updating tag', error);
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async deleteTag(@Args('id') tagId: string): Promise<boolean> {
    try {
      await this.firebaseService.delete(tagId);
      return true;
    } catch (error) {
      this.logger.error('Error deleting tag', error);
      return false;
    }
  }

  @Query(() => PaginatedTags)
  async allTags(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput
  ): Promise<PaginatedTags> {
    const { page = 1, limit = 10 } = pagination || {};

    try {
      const result = await this.firebaseService.findWithPagination({ page, limit });

      return {
        items: result.items,
        totalElements: result.total,
        totalPages: Math.ceil(result.total / limit),
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < Math.ceil(result.total / limit),
        hasPreviousPage: page > 1
      };
    } catch (error) {
      this.logger.error('Error fetching tags', error);
      throw error;
    }
  }

  @Query(() => Tag, { nullable: true })
  async tagById(@Args('id') id: string): Promise<Tag | null> {
    try {
      return await this.firebaseService.findById(id);
    } catch (error) {
      this.logger.error('Error fetching tag by ID', error);
      return null;
    }
  }

  @Query(() => [Tag])
  async tagByNameHint(@Args('nameHint') nameHint: string): Promise<Tag[]> {
    try {
      const result = await this.firebaseService.findWithPagination({ page: 1, limit: 1000 });
      const matchingTags = result.items.filter(tag => 
        tag.name.toLowerCase().includes(nameHint.toLowerCase())
      );
      return matchingTags;
    } catch (error) {
      this.logger.error('Error fetching tags by name hint', error);
      return [];
    }
  }
}
