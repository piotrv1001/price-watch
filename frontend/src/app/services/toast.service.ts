import { TranslateService } from '@ngx-translate/core';
import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";
import { ErrorUtil } from "../utils/error/error.util";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private messageService: MessageService,
    private translateService: TranslateService
  ) {}

  handleError(error: any): void {
    const message = ErrorUtil.getErrorMessage(error);
    const msgTr = this.translateService.instant(`error.${message}`);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: msgTr
    });
  }

  infoMessage(summary: string, detail: string, translate = true, life?: number): void {
    const summaryTr = translate ? this.translateService.instant(summary) : summary;
    const detailTr = translate ? this.translateService.instant(detail) : detail;
    this.messageService.add({
      severity: 'info',
      summary: summaryTr,
      detail: detailTr,
      life
    });
  }

  successMessage(summary: string, detail: string, translate = true, life?: number): void {
    const summaryTr = translate ? this.translateService.instant(summary) : summary;
    const detailTr = translate ? this.translateService.instant(detail) : detail;
    this.messageService.add({
      severity: 'success',
      summary: summaryTr,
      detail: detailTr,
      life
    });
  }

  warnMessage(summary: string, detail: string, translate = true, life?: number): void {
    const summaryTr = translate ? this.translateService.instant(summary) : summary;
    const detailTr = translate ? this.translateService.instant(detail) : detail;
    this.messageService.add({
      severity: 'warn',
      summary: summaryTr,
      detail: detailTr,
      life
    });
  }

  errorMessage(message: string, translate = true, life?: number): void {
    const msg = translate ? this.translateService.instant(message) : message;
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: msg,
      life
    });
  }

  clear(): void {
    this.messageService.clear();
  }
}
