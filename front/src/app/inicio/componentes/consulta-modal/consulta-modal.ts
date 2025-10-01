import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-consulta-modal',
  imports: [],
  templateUrl: './consulta-modal.html',
  styleUrl: './consulta-modal.css'
})
export class ConsultaModal {

  @Input() appointmentData: any = {}; 
  @Output() close = new EventEmitter<void>();

  get statusInfo(): { text: string, class: string } {
    const status = this.appointmentData.estatus || '';
    switch (status.toUpperCase()) {
      case 'A':
        return { text: 'Activa', class: 'success' };
      case 'C':
        return { text: 'Cancelada', class: 'error' };
      case 'F':
        return { text: 'Finalizada', class: 'finalized' }; 
      default:
        return { text: 'Pendiente', class: 'info' };
    }
  }

  get appointmentTime(): string {
      const timePart = this.appointmentData.horario ? 
                       this.appointmentData.horario.split(' ')[1] : '';
      return timePart.substring(0, 5);
  }
}
