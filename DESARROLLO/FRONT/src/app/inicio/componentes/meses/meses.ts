import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-meses',
  imports: [CommonModule],
  templateUrl: './meses.html',
  styleUrl: './meses.css'
})
export class Meses {
 @Input() show = false;
  @Input() months: string[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() monthSelected = new EventEmitter<string>();

  selectMonth(month: string) {
    this.monthSelected.emit(month);
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}
