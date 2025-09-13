export class ErrorHandler {
  static logError(error: Error, context: string): void {
    console.error(`[${context}] Error:`, error);
    // In production, you might want to send this to a logging service
  }

  static handleNavigationError(error: Error): void {
    this.logError(error, 'Navigation');
    // Could show a user-friendly error message
  }

  static handleProcessingError(error: Error): void {
    this.logError(error, 'Processing');
    // Could reset processing state and show error to user
  }
}