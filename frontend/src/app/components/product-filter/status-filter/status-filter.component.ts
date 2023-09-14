import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MultiSelectChangeEvent } from "primeng/multiselect";
import { ProductStatus } from "src/app/models/product/status";

export interface StatusItem {
  label: string;
  value: ProductStatus;
}

@Component({
  selector: 'app-status-filter',
  templateUrl: './status-filter.component.html',
  styleUrls: ['./status-filter.component.scss']
})
export class StatusFilterComponent  {
  @Input() statusList: StatusItem[] = [];
  @Input() selectedStatuses: ProductStatus[] = [];
  @Output() selectedStatusesChange: EventEmitter<ProductStatus[]> = new EventEmitter<ProductStatus[]>();

  handleStatusesChange(event: MultiSelectChangeEvent): void {
    this.selectedStatusesChange.emit(event.value);
  }
}
