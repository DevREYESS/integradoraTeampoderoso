import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Servicio {
  servicioId?: number;
  servicioUuid?: string;
  nombreServicio: string;
  duracion: number;
  prioridad: string;
  estatus?: string;
}

@Component({
  selector: 'app-editar-servicio',
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-servicio.html',
  styleUrl: './editar-servicio.css'
})
export class EditarServicio {
  @Input() servicioSeleccionado: Servicio | null = null;
  @Input() modo: 'editar' | 'nuevo' = 'editar'; // 👈 NUEVO
  @Output() close = new EventEmitter<void>();
  @Output() servicioActualizado = new EventEmitter<Servicio>();
  @Output() servicioAgregado = new EventEmitter<Servicio>(); // 👈 NUEVO

  servicioEditado: Servicio = {} as Servicio;
  
  opcionesEstatus: string[] = ['Alta', 'Media', 'Baja'];
  opcionesDuracion: number[] = [20, 40, 60, 80, 120, 140, 180];

  ngOnInit() {
    if (this.modo === 'editar' && this.servicioSeleccionado) {
      this.servicioEditado = { ...this.servicioSeleccionado };
      if (!this.servicioEditado.estatus) this.servicioEditado.estatus = 'Alta';
    } else if (this.modo === 'nuevo') {
      // 🆕 Si es modo nuevo, inicializa un objeto vacío
      this.servicioEditado = {
        nombreServicio: '',
        duracion: 20,
        prioridad: 'Media',
        estatus: 'Alta'
      };
    } else {
      this.cancelar();
    }
  }

  guardar() {
    if (this.modo === 'editar') {
      this.servicioActualizado.emit(this.servicioEditado);
    } else {
      this.servicioAgregado.emit(this.servicioEditado); // 👈 emitir al padre
    }
    this.close.emit();
  }

  cancelar() {
    this.close.emit();
  }

  get nombreServicioActual() {
    return this.servicioEditado.nombreServicio;
  }
}
