import { HttpErrorResponse } from "@angular/common/http";

export class ErrorUtil {
  static getErrorMessage(error: any): string {
    if(error instanceof HttpErrorResponse) {
      switch(error.status) {
        case 401: {
          return 'Invalid email or password';
        }
        case 403: {
          return 'You are not authorized to access this resource';
        }
        case 404: {
          return 'Resource not found';
        }
        case 500: {
          return 'Internal server error';
        }
        default: {
          return 'Un expected error occurred';
        }
      }
    }
    return 'Un expected error occurred';
  }
}
