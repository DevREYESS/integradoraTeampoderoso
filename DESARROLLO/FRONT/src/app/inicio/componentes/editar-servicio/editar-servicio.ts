import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { NgForm } from '@angular/forms';

export interface Servicio {
  servicioId?: number;
  servicioUuid?: string;
  nombreServicio: string;
  duracion: number;
  color?:string;
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


  opcionesDuracion: number[] = [20, 40, 60, 80, 120, 140, 180];

// Variables para controlar la alerta
alertaVisible = false;
alertaMensaje = '';

  ngOnInit() {
    if (this.modo === 'editar' && this.servicioSeleccionado) {
      this.servicioEditado = { ...this.servicioSeleccionado };

    } else if (this.modo === 'nuevo') {
      // 🆕 Si es modo nuevo, inicializa un objeto vacío
      this.servicioEditado = {
        nombreServicio: '',
        duracion: 20,
        color: '#ff00ff'
      };
    } else {
      this.cancelar();
    }
  }

  mostrarAlerta(mensaje: string) {
    this.alertaMensaje = mensaje;
    this.alertaVisible = true;

    setTimeout(() => {
      this.alertaVisible = false;
    }, 3000); // 3 segundos
  }

guardar(form: NgForm) {
  if (!form.valid) {
    form.control.markAllAsTouched();
    return;
  }

  if (this.modo === 'editar') {
    this.servicioActualizado.emit(this.servicioEditado);
    this.mostrarAlerta('Servicio actualizado correctamente'); // ✅ Aquí
  } else {
    this.servicioAgregado.emit(this.servicioEditado);
    this.mostrarAlerta('Servicio agregado correctamente'); // ✅ Aquí
  }

  // Cierra el modal después de 1.5s
  setTimeout(() => this.close.emit(), 1500);
}




  cancelar() {
    this.close.emit();
  }

  get nombreServicioActual() {
    return this.servicioEditado.nombreServicio;
  }
}
