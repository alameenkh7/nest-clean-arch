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

import { Inject } from '@nestjs/common'
import { CoreS } from '../../tokens'
import { FirebaseService } from '../../services/firebase.service'
import { UseCases } from '../../core/usecases'
import { PaginationInput } from './pagination.resolver'

@InputType()
export class CreateTagInput {
  @Field()
  name: string

  @Field()
  description: string

  @Field()
  foreground: string

  @Field()
  background: string
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

  @Field()
  foreground: string

  @Field()
  background: string


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

@Resolver(() => Tag)
export class TagResolver {
  constructor(
    @Inject(CoreS) private readonly core: UseCases,
    private readonly firebaseService: FirebaseService
  ) {}

  @Mutation(() => TagOutput)
  async addTag(@Args('data') tag: CreateTagInput): Promise<TagOutput> {
    const { id } = await this.core.commands.addTag(tag)
    return { id }
  }

  @Mutation(() => TagOutput)
  async updateTag(@Args('data') tag: UpdateTagInput): Promise<TagOutput> {
    const { id } = await this.core.commands.updateTag(tag)
    return { id }
  }

  @Mutation(() => Boolean)
  async deleteTag(@Args('id') tagId: string) {
    await this.core.commands.deleteTag({ tagId })
    return true
  }

  

  @Query(() => PaginatedTags)
  async allTags(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput
  ): Promise<PaginatedTags> {
    const defaultLimit = 10;
    const defaultPage = 0;

    const limit = pagination?.limit ?? defaultLimit;
    const page = pagination?.page ?? defaultPage;
    const offset = page * limit;

    // Load all tags
    const allTags = await this.core.tagLoader.loadAll();
    
    // Paginate tags
    const paginatedTags = allTags.slice(offset, offset + limit);
    const totalCount = allTags.length;

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: paginatedTags,
      totalElements: totalCount,
      totalPages,
      currentPage: page,
      pageSize: limit,
      hasNextPage: page < totalPages - 1,
      hasPreviousPage: page > 0
    };
  }

  @Query(() => Tag, { nullable: true })
  async tagById(@Args('id') id: string): Promise<Tag | null> {
    const allTags = await this.core.tagLoader.loadAll();
    console.log('Available tag IDs:', allTags.map(tag => tag.id));
    return this.core.tagLoader.loadById(id);
  }

  @Query(() => Tag, { nullable: true })
  async tagByNameHint(@Args('nameHint') nameHint: string) {
    return this.core.tagLoader.loadByName(nameHint)
  }
}
