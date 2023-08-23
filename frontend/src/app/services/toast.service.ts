import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";
import { ErrorUtil } from "../utils/error/error.util";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) {}

  handleError(error: any): void {
    const message = ErrorUtil.getErrorMessage(error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }

  infoMessage(summary: string, detail: string, life?: number): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life
    });
  }

  successMessage(summary: string, detail: string, life?: number): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life
    });
  }

  warnMessage(summary: string, detail: string, life?: number): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life
    });
  }

  errorMessage(message: string, life?: number): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life
    });
  }

  clear(): void {
    this.messageService.clear();
  }
}
