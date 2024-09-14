import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { SortingDirection } from '../../core/entitygateway'

registerEnumType(SortingDirection, { name: 'SortingDirection' })

@ObjectType()
export class HasId {
  @Field()
  id: string
  name:string
}
