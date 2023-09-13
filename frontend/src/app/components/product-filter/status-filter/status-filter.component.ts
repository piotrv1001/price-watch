import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MultiSelectChangeEvent } from "primeng/multiselect";
import { ProductStatus } from "src/app/models/product/status";

interface StatusItem {
  label: string;
  value: ProductStatus;
}

@Component({
  selector: 'app-status-filter',
  templateUrl: './status-filter.component.html',
  styleUrls: ['./status-filter.component.scss']
})
export class StatusFilterComponent implements OnInit {
  statusList: StatusItem[] = [];
  selectedStatuses: ProductStatus[] = [];
  @Output() selectedStatusesChange: EventEmitter<ProductStatus[]> = new EventEmitter<ProductStatus[]>();

  ngOnInit(): void {
    this.getStatusList();
  }

  handleStatusesChange(event: MultiSelectChangeEvent): void {
    this.selectedStatusesChange.emit(event.value);
  }

  private getStatusList(): void {
    this.statusList = [
      { label: 'status.available', value: ProductStatus.AVAILABLE },
      { label: 'status.unavailable', value: ProductStatus.TEMP_UNAVAILABLE },
      { label: 'status.withdrawn', value: ProductStatus.UNAVAILABLE }
    ];
    this.selectedStatuses = this.statusList.map((status) => status.value);
  }
}
