import {
  Args,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { Inject } from '@nestjs/common';
import { CoreS, PersistenceS } from '../../tokens';
import { InMemoryPersistence } from '../../infrastructure/InMemoryStorage/inmemorystorage.service';
import { UseCases } from '../../core/usecases';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  address: string;

  @Field()  // Changed type to String to handle larger numbers
  contact: string;
}

@InputType()
export class UpdateUserInput extends CreateUserInput {
  @Field()
  id: string;
}

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  name: string;
}

@ObjectType()
class UserOutput {
  @Field()
  id: string;
}

@Resolver(() => User)
export class UserResolver {
  constructor(
      @Inject(PersistenceS) private readonly mem: InMemoryPersistence,
      @Inject(CoreS) private readonly core: UseCases
  ) {}
  @Mutation(() => UserOutput)
  async addUser(@Args('data') user: CreateUserInput): Promise<UserOutput> {
      // Convert the contact back to number for core.commands.addUser
      const userInput = { ...user, contact: Number(user.contact) };
      const { id } = await this.core.commands.addUser(userInput);
      return { id };
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') userId: string): Promise<boolean> {
      await this.core.commands.deleteUser({ userId });
      return true;
  }

  @Query(() => [User])
  async allUsers(): Promise<User[]> {
      return this.mem.userLoader.loadAll();
  }

  @Query(() => User, { nullable: true })
  async userById(@Args('id') id: string): Promise<User | null> {
      return this.mem.userLoader.loadById(id);
  }

  @Query(() => User, { nullable: true })
  async userByNameHint(@Args('nameHint') nameHint: string): Promise<User | null> {
      return this.mem.userLoader.loadByName(nameHint);
  }
}