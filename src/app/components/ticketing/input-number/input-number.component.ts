import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-number',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.css',
})
export class InputNumberComponent {
  @Input() InputformControl!: FormControl;
}
