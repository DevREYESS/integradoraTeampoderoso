import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation,HostListener, OnInit  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { StepperModule } from 'primeng/stepper';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-inicio',
  imports: [ReactiveFormsModule,CardModule,StepperModule,StepsModule,ButtonModule,CommonModule,FormsModule,ToastModule],
  standalone: true,
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
   providers: [MessageService],
  encapsulation: ViewEncapsulation.Emulated
})
export class Inicio implements OnInit {
  
  
  // Almacenar la fecha de inicio de la semana
  private currentWeekStart: Date = new Date();
 public hasNextWeek = true;
  formulario: FormGroup;
visiblehome= true;
regresarf= false;
mostrarcalendario=false;
mostrarcard1=true;
mostrarcard11 = true;
mostrarcard12 = false;
mostrarcard13 = false;

servicios = [
  { id: 1, nombre: 'Consulta general' },
  { id: 2, nombre: 'Limpieza dental' },
  { id: 3, nombre: 'Ortodoncia' },
];

servicioSeleccionado: number | null = null;

 constructor (private formBuilder: FormBuilder,private messageService: MessageService){
   this.formulario = this.formBuilder.group({
      nombre: ['', []],
      telefono: ['', []],
      serviciodes: ['', []],
      servicio: ['', []],

     
    });
 }


 private allMockData = [
    // Semana 1
    { "name": "Lun", "date": "25 Oct", "schedules": [
      { "time": "8:00", "status": "Disponible" },
      { "time": "8:20", "status": "Agendado" },
      { "time": "8:40", "status": "Disponible" },
      { "time": "9:00", "status": "Disponible" },
      { "time": "9:20", "status": "No disponible" }
    ]},
    { "name": "Mar", "date": "26 Oct", "schedules": [
      { "time": "8:00", "status": "Disponible" },
      { "time": "8:20", "status": "Agendado" },
      { "time": "8:40", "status": "Disponible" },
      { "time": "9:00", "status": "Disponible" },
      { "time": "9:20", "status": "Disponible" }
    ]},
    { "name": "Mié", "date": "27 Oct", "schedules": [
      { "time": "8:00", "status": "Disponible" },
      { "time": "8:20", "status": "Disponible" },
      { "time": "8:40", "status": "No disponible" },
      { "time": "9:00", "status": "No disponible" },
      { "time": "9:20", "status": "Disponible" }
    ]},
    { "name": "Jue", "date": "28 Oct", "schedules": [
      { "time": "8:00", "status": "Agendado" },
      { "time": "8:20", "status": "Disponible" },
      { "time": "8:40", "status": "Disponible" },
      { "time": "9:00", "status": "Disponible" },
      { "time": "9:20", "status": "Disponible" }
    ]},
    { "name": "Vie", "date": "29 Oct", "schedules": [
      { "time": "8:00", "status": "Agendado" },
      { "time": "8:20", "status": "Agendado" },
      { "time": "8:40", "status": "Disponible" },
      { "time": "9:00", "status": "Disponible" },
      { "time": "9:20", "status": "Disponible" }
    ]},
    { "name": "Sáb", "date": "30 Oct", "schedules": [
      { "time": "8:00", "status": "Disponible" },
      { "time": "8:20", "status": "Disponible" },
      { "time": "8:40", "status": "Agendado" },
      { "time": "9:00", "status": "Disponible" },
      { "time": "9:20", "status": "Disponible" }
    ]},
    { "name": "Dom", "date": "31 Oct", "schedules": [
      { "time": "8:00", "status": "Disponible" },
      { "time": "8:20", "status": "Disponible" },
      { "time": "8:40", "status": "Disponible" },
      { "time": "9:00", "status": "Disponible" },
      { "time": "9:20", "status": "Agendado" }
    ]},
    // Semana 2
    { "name": "Lun", "date": "01 Nov", "schedules": [
      { "time": "8:00", "status": "Agendado" },
      { "time": "8:20", "status": "Disponible" },
      { "time": "8:40", "status": "Disponible" },
      { "time": "9:00", "status": "Disponible" },
      { "time": "9:20", "status": "Disponible" }
    ]},
    { "name": "Mar", "date": "02 Nov", "schedules": [
      { "time": "8:00", "status": "Disponible" },
      { "time": "8:20", "status": "Disponible" },
      { "time": "8:40", "status": "No disponible" },
      { "time": "9:00", "status": "No disponible" },
      { "time": "9:20", "status": "Disponible" }
    ]},
    { "name": "Mié", "date": "03 Nov", "schedules": [
      { "time": "8:00", "status": "Disponible" },
      { "time": "8:20", "status": "Disponible" },
      { "time": "8:40", "status": "No disponible" },
      { "time": "9:00", "status": "No disponible" },
      { "time": "9:20", "status": "Disponible" }
    ]},
    { "name": "Jue", "date": "04 Nov", "schedules": [
      { "time": "8:00", "status": "Agendado" },
      { "time": "8:20", "status": "Disponible" },
      { "time": "8:40", "status": "Disponible" },
      { "time": "9:00", "status": "Disponible" },
      { "time": "9:20", "status": "Disponible" }
    ]},
    
    { "name": "Sáb", "date": "06 Nov", "schedules": [
      { "time": "8:00", "status": "Disponible" },
      { "time": "8:20", "status": "Disponible" },
      { "time": "8:40", "status": "Agendado" },
      { "time": "9:00", "status": "Disponible" },
      { "time": "9:20", "status": "Disponible" }
    ]},
    { "name": "Dom", "date": "07 Nov", "schedules": [
      { "time": "8:00", "status": "Disponible" },
      { "time": "8:20", "status": "Disponible" },
      { "time": "8:40", "status": "Disponible" },
      { "time": "9:00", "status": "Disponible" },
      { "time": "9:20", "status": "Agendado" }
    ]}, 
    { "name": "Lun", "date": "08 Nov", "schedules": [
      { "time": "8:00", "status": "Disponible" },
      { "time": "8:20", "status": "Disponible" },
      { "time": "8:40", "status": "Agendado" },
      { "time": "9:00", "status": "Disponible" },
      { "time": "9:20", "status": "Disponible" }
    ]},
    { "name": "Mar", "date": "09 Nov", "schedules": [
      { "time": "8:00", "status": "Disponible" },
      { "time": "8:20", "status": "Disponible" },
      { "time": "8:40", "status": "Disponible" },
      { "time": "9:00", "status": "Disponible" },
      { "time": "9:20", "status": "Agendado" },
       { "time": "10:00", "status": "Disponible" },
      { "time": "11:00", "status": "Disponible" },
    ]}
    // AÑADE MÁS SEMANAS AQUÍ SI LO NECESITAS
  ];
  
  public weekData: any[] = [];
  public currentWeekIndex = 0;
  private daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  ngOnInit(): void {
    this.loadWeekData();
  }

  loadWeekData(): void {
    const startIndex = this.currentWeekIndex * 7;
    const rawWeekData = this.allMockData.slice(startIndex, startIndex + 7);

    // ✨ Crea una plantilla de 7 días completa
    this.weekData = this.daysOfWeek.map((dayName, index) => {
      // Intenta encontrar el día correspondiente en los datos
      const dayData = rawWeekData.find(d => d.name === dayName);

      // Si se encuentra, usa sus datos, si no, usa un objeto vacío
      return dayData || {
        name: dayName,
        date: '', // Puedes dejar la fecha vacía o calcularla
        schedules: []
      };
    });
  }

  // Las funciones goToPreviousWeek y goToNextWeek son las mismas que en la respuesta anterior
  goToPreviousWeek(): void {
    if (this.currentWeekIndex > 0) {
      this.currentWeekIndex--;
      this.loadWeekData();
    }
  }

  goToNextWeek(): void {
    // Verificamos si hay una semana siguiente antes de cambiar el índice
    if ((this.currentWeekIndex + 1) * 7 < this.allMockData.length) {
      this.currentWeekIndex++;
      this.loadWeekData();
    }
  }

  get isFirstWeek(): boolean {
    return this.currentWeekIndex === 0;
  }

  get isLastWeek(): boolean {
    return (this.currentWeekIndex + 1) * 7 >= this.allMockData.length;
  }


 


  isShrunk = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isShrunk = window.scrollY > 50; // si bajas más de 50px, achica
  }

  // tus funciones de botones
  limpiarFormulario() {
    this.formulario.reset();
  }

  datos:any;
   agendo:any;
  guarda(dia:any,nombre:any) {
    console.log(this.formulario.value);
    this.datos = {
      "nombre": this.formulario.get('nombre')?.value,
      "telefono": this.formulario.get('telefono')?.value,
      "servicio": this.servicioSeleccionado,
      "diacita": dia,
      "cita": nombre
    }
  
this.showConfirmationModal = true;

    console.log(this.datos);
  }


  items = [
  'Paso 1', 'Paso 2', 'Paso 3', 'Paso 4'
];

activeIndex = 0;

next() {
  if (this.activeIndex < this.items.length - 1) {
    this.activeIndex++;
  }
  if(this.activeIndex ===3){
    this.mostrarcalendario=true;
    this.mostrarcard1 = false;
  }else if(this.activeIndex === 0){
    this.mostrarcard1 = true;
    this.mostrarcard11=true;
    this.mostrarcard12=false;
    this.mostrarcard13=false;
  }else if(this.activeIndex === 1){
    this.mostrarcard1 = true;
     this.mostrarcard11=false;
    this.mostrarcard12=true;
    this.mostrarcard13=false;
  }else if(this.activeIndex === 2){
    this.mostrarcard1 = true;
     this.mostrarcard11=false;
    this.mostrarcard12=false;
    this.mostrarcard13=true;
  }

}

prev() {
  if (this.activeIndex > 0) {
    this.activeIndex--;
  }
  if(this.activeIndex ===3 ){
  this.mostrarcalendario=true;
  }else if(this.activeIndex ===2 ){
  this.mostrarcalendario=false;
  this.mostrarcard1 = true;
  this.mostrarcard11 = false;
    this.mostrarcard12=false;
    this.mostrarcard13=true;
  }else if(this.activeIndex ===1 ){
  this.mostrarcalendario=false;
  this.mostrarcard1 = true;
    this.mostrarcard11=false;
    this.mostrarcard12=true;
    this.mostrarcard13=false;
  }else if(this.activeIndex ===0 ){
  this.mostrarcalendario=false;
  this.mostrarcard1 = true;
  this.mostrarcard11 = true;
  this.mostrarcard12=false;
    this.mostrarcard13=false;
  }
  

}
agendar() {
  this.visiblehome=false;
this.regresarf = true;
this.activeIndex=0;
 this.mostrarcard1 = true;
  this.mostrarcard11 = true;
  this.mostrarcard12=false;
    this.mostrarcard13=false;
    this.mostrarcalendario=false;
}

regresar(){
this.visiblehome =true;
this.regresarf = false;
}


 public showConfirmationModal: boolean = false; 
 

  // Función del botón "Regresar" y de la "X"
  regresar2() {
    this.showConfirmationModal = false; // ✨ Oculta el modal
    // Lógica adicional, como redirigir al inicio o recargar el calendario
    // this.router.navigate(['/']); 
  }

}
