import { Component, Input} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Icrypto } from '../../../models/cryptoCurrency';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [
    MatTableModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

  @Input()
  dataSource!: Icrypto[];

  displayedColumns: string[] = ['name', 'priceUsd', 'topExplorer'];

  showSpinner = true;

  ngAfterViewInit() {
    setTimeout(() => {
      this.showSpinner = false;
    }, 300)
  }
}



