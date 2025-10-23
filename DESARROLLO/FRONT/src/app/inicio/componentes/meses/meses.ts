import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-meses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meses.html',
  styleUrls: ['./meses.css']
})
export class Meses {
  @Input() months: { nombre: string, numero: number }[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() monthSelected = new EventEmitter<number>();

  selectMonth(month: { nombre: string, numero: number }) {
    this.monthSelected.emit(month.numero);
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}
