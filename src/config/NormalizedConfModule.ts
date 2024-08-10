import Joi from 'joi'
import { FactoryProvider, Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { directDeclarations, indirectDeclarations } from './configDeclaration'
import { ConfigS } from '../tokens'

/**
 * Change this file can break the entire project
 * config system be carefull, you need some advanced concept
 * on typescript and typescript type inference system and
 * type compination
 *
 */

type DirectDeclarationInference = {
  [p in keyof typeof directDeclarations]: ReturnType<
    (typeof directDeclarations)[p]['normalization']
  >
}

type IndirectDeclarationInference = {
  [p in keyof typeof indirectDeclarations]: ReturnType<
    (typeof indirectDeclarations)[p]
  >
}

export type Configuration = DirectDeclarationInference &
  IndirectDeclarationInference

const completeValidationSchema = Joi.object({
  ...Object.values(directDeclarations).reduce((acc, d) => {
    acc[d.env] = d.validator
    return acc
  }, {} as { [k: string]: Joi.AnySchema<any> }),
})

const configFactory: FactoryProvider = {
  provide: ConfigS,
  useFactory: (conf: ConfigService): Configuration => {
    const directValues = Object.keys(directDeclarations).reduce((acc, k) => {
      const key = k as keyof DirectDeclarationInference
      const val = directDeclarations[key].normalization(conf)

      return {
        ...acc,
        [key]: val,
      }
    }, {} as DirectDeclarationInference)

    const indirectValues = Object.keys(indirectDeclarations).reduce(
      (acc, k) => {
        const key = k as keyof IndirectDeclarationInference
        const val = indirectDeclarations[key](conf)
        return {
          ...acc,
          [key]: val,
        }
      },
      {} as IndirectDeclarationInference
    )

    return {
      ...directValues,
      ...indirectValues,
    }
  },
  inject: [ConfigService],
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: completeValidationSchema,
    }),
  ],
  providers: [configFactory],
  exports: [configFactory],
})
export class NormalizedConfModule {}
