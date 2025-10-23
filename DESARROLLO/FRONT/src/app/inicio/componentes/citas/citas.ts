import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas {
  @Output() close = new EventEmitter<void>();

  // ... tu array de citas y funciones


  closeModal(): void {
    this.close.emit(); // notifica al padre que debe ocultar el modal
  }
   constructor() { }
citasOriginal: any[] = [
  { id: 'ID1', nombre: 'Itzel Diego Sanches', duracion: '20 min', inicio: '8:00 am', fin: '8:20 am', dia: 'Lunes', fecha: '06 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Finalizada', estatusClass: 'finished-text' },
  { id: 'ID2', nombre: 'Sofia Salinas Mejía', duracion: '20 min', inicio: '8:00', fin: '8:20', dia: 'Martes', fecha: '07 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Pendiente', estatusClass: 'pending-text' },
  { id: 'ID3', nombre: 'Celeste Bautista Romero', duracion: '20 min', inicio: '8:00', fin: '8:20', dia: 'Martes', fecha: '07 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Activa', estatusClass: 'active-text' },
  { id: 'ID4', nombre: 'Romina West', duracion: '20 min', inicio: '8:00', fin: '8:20', dia: 'Martes', fecha: '07 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Activa', estatusClass: 'active-text' },
  { id: 'ID5', nombre: 'Carlos Méndez', duracion: '20 min', inicio: '8:30', fin: '8:50', dia: 'Miércoles', fecha: '08 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Pendiente', estatusClass: 'pending-text' },
  { id: 'ID6', nombre: 'Ana Torres', duracion: '20 min', inicio: '9:00', fin: '9:20', dia: 'Miércoles', fecha: '08 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Activa', estatusClass: 'active-text' },
  { id: 'ID7', nombre: 'Luis Gómez', duracion: '20 min', inicio: '9:30', fin: '9:50', dia: 'Jueves', fecha: '09 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Finalizada', estatusClass: 'finished-text' },
  { id: 'ID8', nombre: 'Mariana Cruz', duracion: '20 min', inicio: '10:00', fin: '10:20', dia: 'Jueves', fecha: '09 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Pendiente', estatusClass: 'pending-text' },
  { id: 'ID9', nombre: 'Fernando López', duracion: '20 min', inicio: '10:30', fin: '10:50', dia: 'Viernes', fecha: '10 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Activa', estatusClass: 'active-text' },
  { id: 'ID10', nombre: 'Valeria Ríos', duracion: '20 min', inicio: '11:00', fin: '11:20', dia: 'Viernes', fecha: '10 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Finalizada', estatusClass: 'finished-text' },
  { id: 'ID11', nombre: 'Diego Herrera', duracion: '20 min', inicio: '11:30', fin: '11:50', dia: 'Lunes', fecha: '13 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Pendiente', estatusClass: 'pending-text' },
  { id: 'ID12', nombre: 'Lucía Martínez', duracion: '20 min', inicio: '12:00', fin: '12:20', dia: 'Lunes', fecha: '13 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Activa', estatusClass: 'active-text' },
  { id: 'ID13', nombre: 'José Ramírez', duracion: '20 min', inicio: '12:30', fin: '12:50', dia: 'Martes', fecha: '14 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Finalizada', estatusClass: 'finished-text' },
  { id: 'ID14', nombre: 'Camila Flores', duracion: '20 min', inicio: '13:00', fin: '13:20', dia: 'Martes', fecha: '14 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Pendiente', estatusClass: 'pending-text' },
  { id: 'ID15', nombre: 'Ricardo Núñez', duracion: '20 min', inicio: '13:30', fin: '13:50', dia: 'Miércoles', fecha: '15 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Activa', estatusClass: 'active-text' },
  { id: 'ID16', nombre: 'Sofía Valdez', duracion: '20 min', inicio: '14:00', fin: '14:20', dia: 'Miércoles', fecha: '15 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Finalizada', estatusClass: 'finished-text' },
  { id: 'ID17', nombre: 'Andrés Morales', duracion: '20 min', inicio: '14:30', fin: '14:50', dia: 'Jueves', fecha: '16 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Pendiente', estatusClass: 'pending-text' },
  { id: 'ID18', nombre: 'Isabel Vega', duracion: '20 min', inicio: '15:00', fin: '15:20', dia: 'Jueves', fecha: '16 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Activa', estatusClass: 'active-text' },
  { id: 'ID19', nombre: 'Mateo Herrera', duracion: '20 min', inicio: '15:30', fin: '15:50', dia: 'Viernes', fecha: '17 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Finalizada', estatusClass: 'finished-text' },
  { id: 'ID20', nombre: 'Paola Castillo', duracion: '20 min', inicio: '16:00', fin: '16:20', dia: 'Viernes', fecha: '17 de Octubre', tipoServicio: 'Marcaje mandibular', estatus: 'Pendiente', estatusClass: 'pending-text' }
];



// Array que se mostrará
citas: any[] = [];

coloresIniciales = ['bg-blue', 'bg-yellow', 'bg-pink', 'bg-green', 'bg-purple', 'bg-orange'];

ngOnInit(): void {
  // Copiamos los registros originales
  this.citas = [...this.citasOriginal];

  // Genera iniciales y color automático
  this.citas.forEach(cita => {
    cita.iniciales = this.getInitials(cita.nombre);

    // Asigna color aleatorio
    const index = Math.floor(Math.random() * this.coloresIniciales.length);
    cita.colorIniciales = this.coloresIniciales[index];
  });
}
searchName: string = '';
searchNumber: string = '';
filterBy: 'nombre' | 'numero' = 'numero'; 
// Array de objetos simple (tipo any) con los datos exactos de la imagen
 


 

  agregarComentario(cita: any): void {
    console.log(`Abriendo campo para comentario para: ${cita.nombre}`);
  }

  editarCita(cita: any): void {
    console.log(`Editando cita de: ${cita.nombre}`);
  }

  eliminarCita(cita: any): void {
    console.log(`Eliminando cita de: ${cita.nombre}`);
  }
  getInitials(nombre: string): string {
  if (!nombre) return '';
  const palabras = nombre.split(' ').filter(p => p.length > 0);
  if (palabras.length === 1) return palabras[0].charAt(0).toUpperCase();
  return (palabras[0].charAt(0) + palabras[1].charAt(0)).toUpperCase();
}

  searchTerm: string = ''; // reemplaza searchName y searchNumber

buscar() {
  if (this.filterBy === 'nombre') {
    this.citas = this.citasOriginal.filter(cita => 
      cita.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  } else {
    this.citas = this.citasOriginal.filter(cita => 
      cita.id.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
onSearchInput() {
  if (!this.searchTerm) {
    // Si borras el input, restaurar todas las citas
    this.citas = [...this.citasOriginal];
    // Recalcular iniciales
    this.citas.forEach(cita => cita.iniciales = this.getInitials(cita.nombre));
  }
}

}
