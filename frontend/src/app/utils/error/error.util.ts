import { HttpErrorResponse } from "@angular/common/http";

export class ErrorUtil {
  static getErrorMessage(error: any): string {
    if(error instanceof HttpErrorResponse) {
      switch(error.status) {
        case 401: {
          return 'invalidUsernameOrPassword';
        }
        case 403: {
          return 'notAuthorized';
        }
        case 404: {
          return 'notFound';
        }
        case 500: {
          return 'serverError';
        }
        default: {
          return 'unexpectedError';
        }
      }
    }
    return 'unexpectedError';
  }
}
