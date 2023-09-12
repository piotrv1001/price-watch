import { Component, OnInit } from "@angular/core";
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

  ngOnInit(): void {
    this.getStatusList();
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
