export function csvFileFilter(
  req: any,
  file: {
    mimetype: string
  },
  callback: (error: Error | null, acceptFile: boolean) => void
): void {
  if (file.mimetype !== 'text/csv') {
    return callback(new Error('Only CSV are allowed'), false)
  }

  callback(null, true)
}
