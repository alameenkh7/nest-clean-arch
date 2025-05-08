/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ConfigService } from '@nestjs/config'
import Joi from 'joi'

/**
 * If you want to customize the project configuration you need to change
 * this file
 */

/**
 * Direct declaration keep values directly from envs. Here:
 * propertyName: Is the name that will be available in the rest of the application
 * env: The env where to find the value
 * validator: The validator for the env
 * normalization: A function that extract the validated env and should return with
 * the desired type
 */
export const directDeclarations = {
  port: {
    env: 'PORT',
    validator: Joi.number().port().default(5000),
    normalization: (conf: ConfigService) => conf.get<number>('PORT')!,
  },
  nodeEnv: {
    env: 'NODE_ENV',
    validator: Joi.string().valid('development', 'production', 'staging'),
    normalization: (conf: ConfigService) => conf.get<string>('NODE_ENV')!,
  },
  environment: {
    env: 'ENVIRONMENT',
    validator: Joi.string()
      .valid('development', 'production', 'staging')
      .required(),
    normalization: (conf: ConfigService) => conf.get<string>('ENVIRONMENT')!,
  },
  googleKeyFilePath: {
    env: 'GOOGLE_FILE_KEY',
    validator: Joi.string().default('/var/secrets/key.json'),
    normalization: (conf: ConfigService) =>
      conf.get<string>('GOOGLE_FILE_KEY')!,
  },
  awsAccessKey: {
    env: 'AWS_ACCESS_KEY',
    validator: Joi.string().default(''),
    normalization: (conf: ConfigService) =>
      conf.get<string>('AWS_ACCESS_KEY')!,
  },
  awsSecretKey: {
    env: 'AWS_SECRET_KEY',
    validator: Joi.string().default(''),
    normalization: (conf: ConfigService) =>
      conf.get<string>('AWS_SECRET_KEY')!,
  },
  appName: {
    env: 'APP_NAME',
    validator: Joi.string().required(),
    normalization: (conf: ConfigService) => conf.get<string>('APP_NAME')!,
  },
  appVersion: {
    env: 'APP_VERSION',
    validator: Joi.string().required(),
    normalization: (conf: ConfigService) => conf.get<string>('APP_VERSION')!,
  },
  inMemoryStorageFilePath: {
    env: 'INMEMORY_STORAGE_FILE_PATH',
    validator: Joi.string().default('./tmp/data.json'),
    normalization: (conf: ConfigService) =>
      conf.get<string>('INMEMORY_STORAGE_FILE_PATH')!,
  },
  appId: {
    env: 'AUTH_APP_ID',
    validator: Joi.string().default('project1'),
    normalization: (conf: ConfigService) => conf.get<string>('AUTH_APP_ID'),
  },
}

/**
 * Indirect configuration are derived from already validated direct configuration
 * for your confor on inside the app
 */
export const indirectDeclarations = {
  isProduction: (conf: ConfigService) =>
    conf.get<string>('ENVIRONMENT') === 'production',
  isStaging: (conf: ConfigService) =>
    conf.get<string>('ENVIRONMENT') === 'staging',
  isDevelopment: (conf: ConfigService) =>
    conf.get<string>('ENVIRONMENT') === 'development',
  
}
