# Clean Architecture NestJS Project

Welcome to the **Clean Architecture NestJS Project**! This repository demonstrates how to build scalable and maintainable applications using **NestJS** with a clean architecture approach. The project is modular, extensible, and adheres to best practices for separation of concerns.

## Project Structure

The application is structured around three main layers:

```
core
├── entities          # Defines the business models and logic
├── entity-gateway    # Interfaces for interacting with data persistence and external systems
└── usecases          # Application-specific business rules (commands and queries)

infrastructure
├── InMemoryStorage   # Example implementation of entity gateways using in-memory storage
└── other integrations

presentation
├── graphql           # GraphQL resolvers and DTOs for interacting with the application
```

### Folder Descriptions

1. **Core**:
   - `entities`: Defines the fundamental business models, e.g., `Tag`.
   - `entity-gateway`: Declares interfaces for interacting with persistence (e.g., `TagLoader`, `TagPersistor`).
   - `usecases`: Contains the business rules (e.g., `addTag`, `updateTag`).

2. **Infrastructure**:
   - Implements the gateways defined in `core/entity-gateway` (e.g., in-memory storage).

3. **Presentation**:
   - GraphQL API layer for interacting with the system. Contains resolvers and DTOs.

## Installation

### Prerequisites

- Node.js (v16 or higher recommended)
- Yarn (or npm, though Yarn is preferred)

### Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Start the development server:

   ```bash
   yarn start:dev
   ```

## Core Concepts

### Entity Example: Tag

```typescript
export interface Tag {
  id: string;
  name: string;
  description: string;
  foreground: string;
  background: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Entity Gateway Example: TagLoader & TagPersistor

```typescript
export interface TagPersistor {
  persist: (tag: Tag) => Promise<void>;
  deleteById: (id: string) => Promise<void>;
}

export interface TagLoader {
  loadById: (id: string) => Promise<Tag | null>;
  loadByName: (name: string) => Promise<Tag | null>;
  loadAll: () => Promise<Tag[]>;
}
```

### Use Case Example: Add Tag

```typescript
export const makeUC =
  ({ tagPersistor, tagLoader }: Deps) =>
  async ({ name, description, foreground, background }: Input): Promise<Output> => {
    const tag = await tagLoader.loadByName(name);
    if (tag) throw new Error('Tag already exists');
    // Validation and persistence logic
  };
```

## Infrastructure Example

This project provides an in-memory storage implementation:

```typescript
export const factory: FactoryProvider = {
  provide: PersistenceS,
  useFactory: (conf: Configuration, logger: Logger): InMemoryPersistence => {
    const save = () => { /* persist data to file */ };

    return {
      tagPersistor: {
        persist: async (tag: Tag) => { /* persist logic */ },
        deleteById: async (id: string) => { /* delete logic */ },
      },
      tagLoader: {
        loadById: async (id: string) => { /* load logic */ },
        loadAll: async () => { /* load all logic */ },
      },
    };
  },
  inject: [ConfigS, LoggerS],
};
```

## GraphQL Example

The GraphQL layer acts as the presentation layer for the system. Example:

```typescript
@Resolver(() => Tag)
export class TagResolver {
  constructor(
    @Inject(PersistenceS) private readonly mem: InMemoryPersistence,
    @Inject(CoreS) private readonly core: UseCases
  ) {}

  @Mutation(() => TagOutput)
  async addTag(@Args('data') tag: CreateTagInput): Promise<TagOutput> {
    const { id } = await this.core.commands.addTag(tag);
    return { id };
  }

  @Query(() => [Tag])
  async allTags() {
    return this.mem.tagLoader.loadAll();
  }
}
```

## Running Tests

Tests are written to ensure the correctness of business logic and infrastructure components.

1. Run tests:

   ```bash
   yarn test
   ```

2. For continuous testing:

   ```bash
   yarn test:watch
   ```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License.

---

We hope this project serves as a great example for building NestJS applications with clean architecture principles. Happy coding!
