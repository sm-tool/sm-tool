export enum ErrorLevel {
  CRITICAL = 'CRITICAL', // Throws 500 page
  ERROR = 'ERROR', // In case of compleate component error
  WARNING = 'WARNING', // Just a warning
  SILENT = 'SILENT', // Consol log
}

export class AppError extends Error {
  constructor(
    message: string,
    public level: ErrorLevel,
    public metadata?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
