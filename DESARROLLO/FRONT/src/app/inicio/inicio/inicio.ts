import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation,HostListener, OnInit, ChangeDetectorRef, Renderer2  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { StepperModule } from 'primeng/stepper';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConsultaModal } from '../componentes/consulta-modal/consulta-modal';
import { Services } from '../services/services';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Meses } from '../componentes/meses/meses';


@Component({
  selector: 'app-inicio',
  imports: [ReactiveFormsModule,CardModule,StepperModule,StepsModule,ButtonModule,CommonModule,FormsModule,ToastModule,ConsultaModal,Meses,HttpClientModule],
  standalone: true,
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
   providers: [MessageService,Services ],
  encapsulation: ViewEncapsulation.Emulated
})
export class Inicio implements OnInit {
  
   irAAdmin() {
    this.router.navigate(['/login']); // 👈 redirige a la página del admin
  }
  // Almacenar la fecha de inicio de la semana
  private currentWeekStart: Date = new Date();
 public hasNextWeek = true;
  formulario: FormGroup;
  formulario2: FormGroup;

visiblehome= true;
visiblehome2 = false;

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

allDaysData2: any[] = [
  {
    name: 'Dom',
    date: '2025-10-12', // Mañana
    schedules: [] // Día no laborable (mostrará "No labora")
  },
  {
    name: 'Lun',
    date: '2025-10-13',
    schedules: [
      { time: '8:00', status: 'Disponible' },
      { time: '8:20', status: 'Disponible' },
      { time: '8:40', status: 'Disponible' },
      { time: '9:00', status: 'Disponible' },
      { time: '9:20', status: 'Disponible' },
      { time: '10:20', status: 'Agendado' },
      { time: '10:40', status: 'Disponible' },
    ]
  },
  {
    name: 'Mar',
    date: '2025-10-14',
    schedules: [
      { time: '8:00', status: 'Disponible' },
      { time: '8:20', status: 'Disponible' },
      { time: '8:40', status: 'Agendado' },
      { time: '9:00', status: 'Disponible' },
      { time: '9:20', status: 'Disponible' },
      { time: '9:40', status: 'Disponible' },
      { time: '10:00', status: 'Disponible' },
      { time: '10:20', status: 'Disponible' },
      { time: '10:40', status: 'No disponible' },
    ]
  },
  {
    name: 'Mié',
    date: '2025-10-15',
    schedules: [
      { time: '8:00', status: 'Disponible' },
      { time: '8:20', status: 'Disponible' },
      { time: '8:40', status: 'No disponible' },
      { time: '9:00', status: 'No disponible' }, 
      { time: '9:20', status: 'No disponible' }, 
      { time: '9:40', status: 'Disponible' },
      { time: '10:00', status: 'Disponible' },
      { time: '10:20', status: 'Agendado' },
      { time: '10:40', status: 'Disponible' },
    ]
  },
  {
    name: 'Jue',
    date: '2025-10-16',
    schedules: [
      { time: '8:00', status: 'Disponible' },
      { time: '8:20', status: 'Disponible' },
      { time: '8:40', status: 'Disponible' },
      { time: '9:00', status: 'No disponible' }, 
      { time: '9:20', status: 'No disponible' }, 
      { time: '9:40', status: 'Disponible' },
      { time: '10:00', status: 'Disponible' },
      { time: '10:20', status: 'Disponible' },
      { time: '10:40', status: 'Disponible' },
    ]
  },
  {
    name: 'Vie',
    date: '2025-10-17',
    schedules: [
      { time: '8:00', status: 'No disponible' },
      { time: '8:20', status: 'Agendado' },
      { time: '8:40', status: 'Disponible' },
      { time: '9:00', status: 'Disponible' },
      { time: '9:20', status: 'Disponible' },
      { time: '9:40', status: 'Disponible' },
      { time: '10:00', status: 'Disponible' },
      { time: '10:20', status: 'Disponible' },
      { time: '10:40', status: 'Disponible' },
    ]
  },
  {
    name: 'Sáb',
    date: '2025-10-18',
    schedules: [
      { time: '8:00', status: 'Disponible' },
      { time: '8:20', status: 'Disponible' },
      { time: '8:40', status: 'Disponible' },
      { time: '9:00', status: 'Disponible' },
      { time: '9:20', status: 'Disponible' },
      { time: '9:40', status: 'Disponible' },
      { time: '10:00', status: 'Disponible' },
      { time: '10:20', status: 'Disponible' },
      { time: '10:40', status: 'Disponible' },
    ]
  },
  {
    name: 'Dom',
    date: '2025-10-19', 
    schedules: [   { time: '8:00', status: 'Disponible' },
      { time: '8:20', status: 'Disponible' },
      { time: '8:40', status: 'Disponible' },
      { time: '9:00', status: 'Agendado' },
      { time: '9:20', status: 'Disponible' },
      { time: '9:40', status: 'Disponible' },
      { time: '10:00', status: 'Disponible' },
      { time: '10:20', status: 'Disponible' },
      { time: '10:40', status: 'Disponible' },] 
  },
  {
    name: 'Lun',
    date: '2025-10-20',
    schedules: [
      { time: '8:00', status: 'Disponible' },
      { time: '8:20', status: 'Disponible' },
      { time: '8:40', status: 'Disponible' },
      { time: '9:00', status: 'Disponible' },
      { time: '9:20', status: 'Disponible' },
      { time: '10:20', status: 'Agendado' },
      { time: '10:40', status: 'Disponible' },
    ]
  },
  {
    name: 'Mar',
    date: '2025-10-21',
    schedules: [
      { time: '8:00', status: 'Disponible' },
      { time: '8:20', status: 'Disponible' },
      { time: '8:40', status: 'Agendado' },
      { time: '9:00', status: 'Disponible' },
      { time: '9:20', status: 'Disponible' },
      { time: '9:40', status: 'Disponible' },
      { time: '10:00', status: 'Disponible' },
      { time: '10:20', status: 'Disponible' },
      { time: '10:40', status: 'No disponible' },
    ]
  },
  {
    name: 'Mié',
    date: '2025-10-22',
    schedules: [
      { time: '8:00', status: 'Disponible' },
      { time: '8:20', status: 'Disponible' },
      { time: '8:40', status: 'No disponible' },
      { time: '9:00', status: 'No disponible' },
      { time: '9:20', status: 'No disponible' },
      { time: '9:40', status: 'Disponible' },
      { time: '10:00', status: 'Disponible' },
      { time: '10:20', status: 'Agendado' },
      { time: '10:40', status: 'Disponible' },
    ]
  },
  {
    name: 'Jue',
    date: '2025-10-23',
    schedules: [
      { time: '8:00', status: 'Disponible' },
      { time: '8:20', status: 'Disponible' },
      { time: '8:40', status: 'Disponible' },
      { time: '9:00', status: 'No disponible' },
      { time: '9:20', status: 'No disponible' },
      { time: '9:40', status: 'Disponible' },
      { time: '10:00', status: 'Disponible' },
      { time: '10:20', status: 'Disponible' },
      { time: '10:40', status: 'Disponible' },
    ]
  },
  {
    name: 'Vie',
    date: '2025-10-24',
    schedules: [
      { time: '8:00', status: 'No disponible' },
      { time: '8:20', status: 'Agendado' },
      { time: '8:40', status: 'Disponible' },
      { time: '9:00', status: 'Disponible' },
      { time: '9:20', status: 'Disponible' },
      { time: '9:40', status: 'No disponible' },
      { time: '10:00', status: 'Disponible' },
      { time: '10:20', status: 'Disponible' },
      { time: '10:40', status: 'Disponible' },
    ]
  },
  {
    name: 'Sáb',
    date: '2025-10-25',
    schedules: [
      { time: '8:00', status: 'Disponible' },
      { time: '8:20', status: 'Disponible' },
      { time: '8:40', status: 'Disponible' },
      { time: '9:00', status: 'Disponible' },
      { time: '9:20', status: 'Disponible' },
      { time: '9:40', status: 'Disponible' },
      { time: '10:00', status: 'Disponible' },
      { time: '10:20', status: 'Disponible' },
      { time: '10:40', status: 'Disponible' },
    ]
  }
];


  fixedTimes: string[] = [
    "8:00", "8:20", "8:40", 
    "9:00", "9:20", "9:40", 
    "10:00", "10:20", "10:40", 
  ];

  
  getScheduleSlot(schedules: any[], time: string): any | null {
    if (!schedules) return null;
    return schedules.find(schedule => schedule.time === time);
  }

  isLarge(time: string, dayName: string): boolean {
    return (time === '9:00' || time === '9:20') && (dayName === 'Mié' || dayName === 'Jue');
  }

weekData: any[] = []; 

currentWeekIndex: number = 0; 
daysPerWeek: number = 7;

isFirstWeek: boolean = true;
isLastWeek: boolean = false;


loadCurrentWeek(): void {
  const startIndex = this.currentWeekIndex;
  const endIndex = this.currentWeekIndex + this.daysPerWeek;
  this.weekData = this.allDaysData.slice(startIndex, endIndex);
  this.isFirstWeek = (this.currentWeekIndex === 0);
  this.isLastWeek = (this.currentWeekIndex >= this.allDaysData.length - this.daysPerWeek);
}


goToNextWeek(): void {
  if (!this.isLastWeek) {
    this.currentWeekIndex += this.daysPerWeek;
    this.loadCurrentWeek();
  }
}

goToPreviousWeek(): void {
  if (!this.isFirstWeek) {
    this.currentWeekIndex -= this.daysPerWeek;
    this.loadCurrentWeek();
  }
}

 constructor (private formBuilder: FormBuilder,
  private router: Router,
  private messageService: MessageService, 
  private consultaService: Services,
  private cdRef: ChangeDetectorRef,private renderer: Renderer2){
   this.formulario = this.formBuilder.group({
      nombre: ['', []],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      serviciodes: ['', []],
      servicio: ['', []],
            
      descripcionCita: ['',[]]

     
    });
     this.formulario2 = this.formBuilder.group({
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    const currentYear = currentDate.getFullYear();
    this.filterByMonth(currentMonth, currentYear);
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
    
  ];
  
  public weekData2: any[] = [];
  //public currentWeekIndex = 0;
  private daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  allDaysData: any[] = [];

  ngOnInit(): void {
     this.generateDaysData(new Date('2025-10-12'), new Date('2025-12-31'));
    this.loadWeekData();
     this.loadCurrentWeek();
  }

  loadWeekData(): void {
    const startIndex = this.currentWeekIndex * 7;
    const rawWeekData = this.allMockData.slice(startIndex, startIndex + 7);

    this.weekData2 = this.daysOfWeek.map((dayName, index) => {
      const dayData = rawWeekData.find(d => d.name === dayName);

      return dayData || {
        name: dayName,
        date: '', 
        schedules: []
      };
    });
  }
/*
  goToPreviousWeek(): void {
    if (this.currentWeekIndex > 0) {
      this.currentWeekIndex--;
      this.loadWeekData();
    }
  }

  goToNextWeek(): void {
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
    */


 


  isShrunk = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isShrunk = window.scrollY > 50; 
  }

  limpiarFormulario() {
    this.formulario.reset();
  }

  datos:any;
   agendo:any;

 guarda(fecha: string, horaInicio: string) {
  const horaFin = this.calcularHoraFin(horaInicio); // calcula +20 min

const datos = {
  estatus: "A",
  horaInicio: this.formatoHora(horaInicio),
  horaFin: this.formatoHora(horaFin),
  fechaCita: fecha,
  nombrePaciente:this.formulario.get('nombre')?.value ? this.formulario.get('nombre')?.value : "" ,
  servicioId: "1",
  telefono: this.formulario.get('telefono')?.value ? this.formulario.get('telefono')?.value : "" 
};

      this.visiblehome2 = true;

  console.log("Datos a enviar:", datos);
this.consultaService.guardarcita(datos).subscribe({
  next: (res) => {
    this.showConfirmationModal = true; 
    console.log("Cita guardada:", res);
    this.limpiarFormulario();
    this.cdRef.detectChanges(); 
  },
  error: (err) => {
    this.showConfirmationModal = false; 
    this.cdRef.detectChanges(); 
    this.limpiarFormulario();
    console.error("Error al guardar la cita:", err);
    alert("No se pudo guardar la cita. Por favor intenta de nuevo.");
  }
  
});
    this.cdRef.detectChanges(); 
      this.visiblehome2 = false;
      this.visiblehome = true;
    this.regresarf = false
}

calcularHoraFin(horaInicio: string): string {
  const [horas, minutos] = horaInicio.split(':').map(Number);
  const fecha = new Date();
  fecha.setHours(horas);
  fecha.setMinutes(minutos + 20);
  const h = fecha.getHours().toString().padStart(2, '0'); 
  const m = fecha.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

formatoHora(hora: string): string {
  const [h, m] = hora.split(':');
  return `${h.padStart(2, '0')}:${m}`;
}


// Convierte "25 Oct" → "2025-10-25"


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
  this.visiblehome2=true;
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
this.visiblehome2=false;
this.regresarf = false;
this.limpiarFormulario();
}


 public showConfirmationModal: boolean = false; 
 public showConfirmationModal2: boolean = false; 
 
  regresar2() {
    this.showConfirmationModal = false; 
  }
 regresar3() {
    this.showConfirmationModal2 = false; 
    
    this.formulario2.get('telefono')?.setValue('');

  }


  public showConsultaModal: boolean = false;
  public consultaResult: Boolean = false;
  public isLoading: any = null;

   

  consultarCita() {
    if (this.formulario2.invalid) {
      this.formulario2.markAllAsTouched();
      return;
    }
    
     this.isLoading = true;
    this.consultaResult = false;
    this.showConsultaModal = false;

    this.consultaService.getCitaPorTelefono(this.telefonoLimpio)
      .subscribe({
        next: (response) => {
          this.isLoading = false; 

          if (response) {
            this.consultaResult = response;
            this.showConsultaModal = true; 
            this.cdRef.detectChanges(); 
             this.renderer.addClass(document.body, 'modal-open-scroll-blocker');
          } else {
            console.warn("No se encontró ninguna cita para ese número.");
              this.showConfirmationModal2 = true;
            this.cdRef.detectChanges(); 

          }
        },
        error: (err) => {
          this.isLoading = false;
          this.consultaResult = false;
            this.showConsultaModal = false;
          console.error("Falló la consulta de la cita:", err.message);
          this.cdRef.detectChanges(); 
        }
      });

  

  
  }

  closeConsultaModal() {
    this.showConsultaModal = false;
    this.consultaResult = false; 
    this.formulario2.get('telefono')?.setValue('');
    this.renderer.removeClass(document.body, 'modal-open-scroll-blocker');
  }


 telefonoLimpio: string = '';

formatTelefono(event: Event) {
  const input = event.target as HTMLInputElement;

  let numeros = input.value.replace(/\D/g, '').substring(0, 10);
  this.telefonoLimpio = numeros; 

  this.formulario2.get('telefono')?.setValue(numeros, { emitEvent: false });

  if (numeros.length > 6) {
    input.value = `${numeros.substring(0,3)}-${numeros.substring(3,6)}-${numeros.substring(6,10)}`;
  } else if (numeros.length > 3) {
    input.value = `${numeros.substring(0,3)}-${numeros.substring(3,6)}`;
  } else {
    input.value = numeros;
  }
}
formatTelefono2(event: Event) {
  const input = event.target as HTMLInputElement;

  let numeros = input.value.replace(/\D/g, '').substring(0, 10);
  this.telefonoLimpio = numeros; 

  this.formulario.get('telefono')?.setValue(numeros, { emitEvent: false });

  if (numeros.length > 6) {
    input.value = `${numeros.substring(0,3)}-${numeros.substring(3,6)}-${numeros.substring(6,10)}`;
  } else if (numeros.length > 3) {
    input.value = `${numeros.substring(0,3)}-${numeros.substring(3,6)}`;
  } else {
    input.value = numeros;
  }
}

noEspacioInicial(event: KeyboardEvent): void {
  const input = event.target as HTMLInputElement;
  const cursorPos = input.selectionStart || 0;
  if (event.key === ' ' && cursorPos === 0) {
    event.preventDefault();
  }
}




  selectedMonth = ''; // mes seleccionado (ej. 'Octubre 2025')

  
  filteredDays: any[] = []; // días filtrados según el mes elegido
showMonthModal = false;
  months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  openMonthModal() {
    this.showMonthModal = true;
  }

  closeMonthModal() {
    this.showMonthModal = false;
  }

 showModal = false;

onMonthSelected(month: string) {
  console.log('Mes elegido:', month);
  // aquí actualizas tu calendario principal
}

  /*selectMonth(monthIndex: number): void {
    const year = 2025; // puedes hacerlo dinámico si tu servicio trae varios años
    this.filterByMonth(monthIndex, year);
    const monthName = this.months[monthIndex];
    this.selectedMonth = `${monthName} ${year}`;
    this.closeMonthModal();
  }*/

  filterByMonth(monthIndex: number, year: number): void {
    const monthStr = (monthIndex + 1).toString().padStart(2, '0');
    this.filteredDays = this.allDaysData.filter(day =>
      day.date.startsWith(`${year}-${monthStr}`)
    );
  }

  /*months = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];*/




  generateDaysData(startDate: Date, endDate: Date): void {
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const horarios = [
    '8:00', '8:20', '8:40', '9:00', '9:20', '9:40', '10:00', '10:20', '10:40'
  ];
  const estados = ['Disponible', 'Agendado', 'No disponible'];

  const result = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayName = diasSemana[currentDate.getDay()];
    const dateStr = currentDate.toISOString().split('T')[0];

    // Simula que los domingos no se labora
    const schedules = dayName === 'Dom'
      ? []
      : horarios.map(h => ({
          time: h,
          status: estados[Math.floor(Math.random() * estados.length)]
        }));

    result.push({
      name: dayName,
      date: dateStr,
      schedules
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  this.allDaysData = result;
  console.log(this.allDaysData);
}
}
