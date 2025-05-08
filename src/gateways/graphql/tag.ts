import {
  Args,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql'

import { Inject } from '@nestjs/common'
import { CoreS, PersistenceS } from '../../tokens'
import { InMemoryPersistence } from '../../infrastructure/InMemoryStorage/inmemorystorage.service'
import { UseCases } from '../../core/usecases'

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
  user: string


  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}

@ObjectType()
class TagOutput {
  @Field()
  id: string
}

@Resolver(() => Tag)
export class TagResolver {
  constructor(
    @Inject(PersistenceS) private readonly mem: InMemoryPersistence,
    @Inject(CoreS) private readonly core: UseCases
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

};