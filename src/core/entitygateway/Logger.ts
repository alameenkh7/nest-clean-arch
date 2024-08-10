export interface Logger {
  debug: (message: any, context?: any) => any
  verbose: (message: any, context?: any) => any
  log: (message: any, context?: any) => any
  warn: (message: any, context?: any) => any
  error: (message: any, context?: string, additionalComment?: string) => any
  critical: (message: any, context?: any) => any
  emergency: (message: any, context?: any) => any
}
