import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cita-agendada',
  imports: [],
  templateUrl: './cita-agendada.html',
  styleUrl: './cita-agendada.css'
})
export class CitaAgendada {
@Input() appointmentData: any = {}; 
  @Output() close = new EventEmitter<void>();

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  ubicacion = "De los Planetas SN, Colonia del Sol, 51400 Tejupilco de Hidalgo, Mexico.";
  especialista = "Dr. Irving Saúl Jaimes Macedo";

  get statusInfo(): { text: string, class: string } {
    const status = this.appointmentData.estatus || '';
    switch (status.toUpperCase()) {
      case 'A': return { text: 'Activa', class: 'success' };
      case 'C': return { text: 'Cancelada', class: 'error' };
      case 'F': return { text: 'Finalizada', class: 'finalized' }; 
      default: return { text: 'Pendiente', class: 'info' };
    }
  }

  get appointmentTime(): string {
    const time = this.appointmentData.horaInicio || '';
    return time.substring(0, 5); 
  }

  get appoendmentTime(): string {
    const time = this.appointmentData.horaFin || '';
    return time.substring(0, 5); 
  }

  get formattedDate(): string {
    if (!this.appointmentData.fechaCita) return '';
    const [year, month, day] = this.appointmentData.fechaCita.split('-');
    return `${day}-${month}-${year}`;
  }

  async descargarPDF() {
    if (!this.pdfContent || !this.pdfContent.nativeElement) {
      console.error('Elemento PDF no disponible');
      return;
    }

    // Import dinámico (evita error de tipos en TS)
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = (html2pdfModule as any).default || (html2pdfModule as any);

    const element = this.pdfContent.nativeElement;
    const options = {
      margin: 10,
      filename: 'detalle_cita.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, ignoreElements: (el: HTMLElement) => el.classList.contains('no-print') },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    (html2pdf() as any).from(element).set(options).save();
  }
}
