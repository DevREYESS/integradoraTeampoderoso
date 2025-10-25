import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { Services } from '../../services/services';

@Component({
  selector: 'app-editarcita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  providers: [Services],
  templateUrl: './editarcita.html',
  styleUrl: './editarcita.css'
})
export class Editarcita implements OnInit {
  @Input() cita: any; 
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<any>(); 

  loading: boolean = false;
  formCita!: FormGroup;


  constructor(private consultaService: Services) {}

  ngOnInit() {
    this.formCita = new FormGroup({
      nombre: new FormControl(this.cita?.nombre || '', Validators.required),
      telefono: new FormControl(this.cita?.telefono || '', Validators.required),
      horaInicio: new FormControl(this.convertirHora(this.cita?.inicio) || '', Validators.required),
      horaFin: new FormControl(this.convertirHora(this.cita?.fin) || '', Validators.required),
      fechaCita: new FormControl(this.parseFechaTexto(this.cita?.fecha) || '', Validators.required)
      // quitamos fechaCita de aquí
    });

  }

  convertirHora(hora: string): string {
    if (!hora) return '';
    const [time, meridiem] = hora.split(' ');
    if (!meridiem) return hora;
    let [h, m] = time.split(':').map(Number);
    if (meridiem.toLowerCase() === 'pm' && h < 12) h += 12;
    if (meridiem.toLowerCase() === 'am' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  parseFechaTexto(fechaTexto: string): string {
  if (!fechaTexto) return '';
  
  // Separar día, mes y año
  const meses: any = {
    enero: '01', febrero: '02', marzo: '03', abril: '04',
    mayo: '05', junio: '06', julio: '07', agosto: '08',
    septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
  };

  const regex = /(\d{1,2}) de (\w+) de (\d{4})/;
  const match = fechaTexto.toLowerCase().match(regex);
  if (!match) return '';

  const dia = match[1].padStart(2, '0');
  const mes = meses[match[2]];
  const anio = match[3];

  return `${anio}-${mes}-${dia}`; // YYYY-MM-DD
}


  guardarCambios() {
    if (!this.formCita.valid) return;

    this.loading = true;

    const datosActualizados = {
      nombrePaciente: this.formCita.value.nombre,
      telefono: this.formCita.value.telefono,
      horaInicio: this.formCita.value.horaInicio,
      horaFin: this.formCita.value.horaFin,
      fechaCita: this.formCita.value.fechaCita, // <-- tomamos el valor directo del input
      estatus: 'A'
    };

    this.consultaService.updateCita(datosActualizados, this.cita.uuid).subscribe({
      next: (resp) => {
        this.loading = false;
        this.updated.emit();
        this.closeModal();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al actualizar cita:', err);
      }
    });
  }

  closeModal() {
    this.close.emit();
  }
}

