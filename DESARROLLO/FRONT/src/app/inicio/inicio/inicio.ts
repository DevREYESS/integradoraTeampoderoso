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
import { CitaAgendada } from '../componentes/cita-agendada/cita-agendada';
import { TooltipModule } from 'primeng/tooltip';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';

registerLocaleData(localeEsMX, 'es-MX');

@Component({
  selector: 'app-inicio',
  imports: [ReactiveFormsModule,CardModule,StepperModule,StepsModule,ButtonModule,TooltipModule,CommonModule,FormsModule,CitaAgendada,ToastModule,ConsultaModal,Meses,HttpClientModule],
  standalone: true,
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
   providers: [MessageService,Services , { provide: LOCALE_ID, useValue: 'es-MX' }],
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
showModal2 = false;
appointmentData: any = null;


visiblehome= true;
visiblehome2 = false;
 currentMonth: number = new Date().getMonth();
currentYear: number = new Date().getFullYear();
regresarf= false;
mostrarcalendario=false;
mostrarcard1=true;
mostrarcard11 = true;
mostrarcard12 = false;
mostrarcard13 = false;

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
   
    this.filterByMonth(this.currentMonth, this.currentYear);
 }


 
  ngOnInit(): void {
    this.generateMonths();
    const fechaActual = new Date();
const fechaSeisMeses = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 6, 0);

this.generateDaysData(fechaActual, fechaSeisMeses);
     this.loadCurrentWeek();

     this.consultaService.servicios(this.filtrosServicios).subscribe({
       next: (response) => {
         this.servicios = response;
       },
       error: (err) => {
         console.error('Ocurrio un error al consultar servicios => ',err.message);
       }
     })
  } 
  

filtrosServicios: any = {};
servicios: any[] = [];
 
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
    "10:00", "10:20", "10:40", "11:00", "11:20", "11:40", "12:00", "12:20", "12:40", "13:40", "14:00", "14:20", "14:40"
    , "15:00", "15:20", "15:40", "16:00", "16:20", "16:40", "17:00"
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


  public weekData2: any[] = [];
  //public currentWeekIndex = 0;
  private daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  allDaysData: any[] = [];



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

cerrarModal() {
  this.showModal2 = false;
}


showErrorModal: boolean = false;
errorMessage: string = "";


showConfirmModal: boolean = false;
fechaSeleccionada: string = '';
horaSeleccionada: string = '';

abrirConfirmacion(fecha: string, hora: string) {
  this.fechaSeleccionada = fecha;
  this.horaSeleccionada = hora;
  this.showConfirmModal = true;
}

cancelarAgendar() {
  this.showConfirmModal = false;
}

confirmarAgendar() {
  this.showConfirmModal = false;
  this.guarda(this.fechaSeleccionada, this.horaSeleccionada);
}
isLoadingA: boolean = false;

guarda(fecha: string, horaInicio: string) {
  this.isLoadingA = true; 

  const horaFin = this.calcularHoraFin(horaInicio);

  const datos = {
    estatus: "A",
    horaInicio: this.formatoHora(horaInicio),
    horaFin: this.formatoHora(horaFin),
    fechaCita: fecha,
    nombrePaciente: this.formulario.get('nombre')?.value || "",
    servicioId: this.formulario.get('servicio')?.value || "",
    telefono: this.formulario.get('telefono')?.value || ""
  };

  console.log("Datos a enviar:", datos);

  this.consultaService.guardarcita(datos).subscribe({
    next: (res) => {
      this.isLoadingA = false; 

      this.appointmentData = {
        estatus: "A",
        nombrePaciente: res.nombrePaciente,
        fechaCita: res.fechaCita,
        horaInicio: res.horaIncio, 
        horaFin: this.calcularHoraFin(res.horaIncio),
        nombreServicio: res.nombreServicio || '',
      };

      this.showModal2 = true;
      this.limpiarFormulario();
      this.cdRef.detectChanges();
    },
    error: (err) => {
      this.isLoadingA = false; 

      if (err.error && err.error.message) {
        this.errorMessage = err.error.message;
      } else {
        this.errorMessage = "Ocurrió un error al guardar la cita. Intenta de nuevo.";
      }

      this.showErrorModal = true; 
      this.showModal2 = false;
      this.limpiarFormulario();
      this.cdRef.detectChanges();
    }
  });

  this.visiblehome2 = false;
  this.visiblehome = true;
  this.regresarf = false;
}


cerrarErrorModal() {
  this.showErrorModal = false;
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
        const servicioCtrl = this.formulario.get('servicio');
    servicioCtrl?.setValidators([Validators.required]);
    servicioCtrl?.updateValueAndValidity();
  }

}

prev() {
  if (this.activeIndex > 0) {
    this.activeIndex--;
  }
 const telefono = this.formulario.get('telefono')?.value;
this.telefonoFormateado = this.formatVisualPhone(telefono || '');

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
     const servicioCtrl = this.formulario.get('servicio');
    servicioCtrl?.clearValidators();
    servicioCtrl?.updateValueAndValidity();
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

 closemodalmeses() {
    this.showModal = false;
    this.consultaResult = false; 
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
months: { nombre: string; numero: number }[] = [];


generateMonths(): void {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const now = new Date();
  const currentMonth = now.getMonth(); 
  const result: { nombre: string; numero: number }[] = [];

  for (let i = 0; i < 6; i++) {
    const nextMonthIndex = (currentMonth + i) % 12;
    result.push({
      nombre: meses[nextMonthIndex],
      numero: nextMonthIndex
    });
  }

  this.months = result;
}

  openMonthModal() {
    this.showMonthModal = true;
  }

  closeMonthModal() {
    this.showMonthModal = false;
  }

 showModal = false;
currentAno: number = new Date().getFullYear();

monthsNames: string[] = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

selectedMonthName: string = 'MES';

onMonthSelected(mesNumero: number) {
  this.currentMonth = mesNumero;
  this.selectedMonthName = this.monthsNames[mesNumero]; 
  this.showModal = false;

  const now = new Date();
  let targetYear = now.getFullYear();

  if (mesNumero < now.getMonth()) {
    targetYear += 1;
  }

  this.currentAno = targetYear;

  const start = new Date(targetYear, mesNumero, 1);
  const end = new Date(targetYear, mesNumero + 1, 0);
  
  this.generateDaysData(start, end);
  this.currentWeekIndex = 0;
  this.loadCurrentWeek();
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
  const horarios = this.fixedTimes;
  const estados = ['Disponible', 'Agendado', 'No disponible'];

  const result = [];

  // Ajustar startDate para que inicie en domingo de la semana
  const firstDayOffset = startDate.getDay(); // 0=Dom, 1=Lun, ...
  const firstDayOfWeek = new Date(startDate);
  firstDayOfWeek.setDate(startDate.getDate() - firstDayOffset); // retrocede hasta el domingo

  let currentDate = new Date(firstDayOfWeek);

  while (currentDate <= endDate) {
    const dayName = diasSemana[currentDate.getDay()];
const dateStr = `${currentDate.getFullYear()}-${('0'+(currentDate.getMonth()+1)).slice(-2)}-${('0'+currentDate.getDate()).slice(-2)}`;


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
}



validarpaso2() {
  const telefonoControl = this.formulario.get('telefono');

  telefonoControl?.markAsTouched();

  if (this.formulario.invalid) {
    return;
  }

  this.next();
}
validarpaso1() {
  const nombreControl = this.formulario.get('nombre');

  nombreControl?.markAsTouched();

  if (nombreControl?.invalid) {
    return;
  }

  this.next();
}
validarPaso3() {
  const control = this.formulario.get('servicio');
  control?.markAsTouched();

  if (control?.invalid) {
    return;
  }

  this.next(); 
}


telefonoFormateado: string = '';

onTelefonoInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const soloNumeros = input.value.replace(/\D/g, '').substring(0, 10);
  this.telefonoFormateado = this.formatVisualPhone(soloNumeros);

  this.formulario.get('telefono')?.setValue(soloNumeros, { emitEvent: true });

  this.formulario.get('telefono')?.markAsTouched();
  this.formulario.get('telefono')?.markAsDirty();
}



formatVisualPhone(value: string): string {
  if (value.length > 6) {
    return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
  } else if (value.length > 3) {
    return `${value.slice(0, 3)}-${value.slice(3, 6)}`;
  }
  return value;
}

soloNumeros(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  // Solo permite números (0–9)
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}


}
