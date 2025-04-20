import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ConversionFormComponent } from '../../components/ticketing/conversion-form/conversion-form.component';
@Component({
  selector: 'app-ticketing',
  imports: [ReactiveFormsModule, CommonModule, ConversionFormComponent],
  templateUrl: './ticketing.component.html',
  styleUrl: './ticketing.component.css',
})
export class TicketingComponent {}
