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


@Component({
  selector: 'app-inicio',
  imports: [ReactiveFormsModule,CardModule,StepperModule,StepsModule,ButtonModule,CommonModule,FormsModule,ToastModule,ConsultaModal,HttpClientModule],
  standalone: true,
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
   providers: [MessageService,Services ],
  encapsulation: ViewEncapsulation.Emulated
})
export class Inicio implements OnInit {
  
  
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

 constructor (private formBuilder: FormBuilder,private messageService: MessageService, private consultaService: Services,private cdRef: ChangeDetectorRef,private renderer: Renderer2 ){
   this.formulario = this.formBuilder.group({
      nombre: ['', []],
      telefono: ['', []],
      serviciodes: ['', []],
      servicio: ['', []],
      

     
    });
     this.formulario2 = this.formBuilder.group({
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
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

    this.weekData = this.daysOfWeek.map((dayName, index) => {
      const dayData = rawWeekData.find(d => d.name === dayName);

      return dayData || {
        name: dayName,
        date: '', 
        schedules: []
      };
    });
  }

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
  fechaCita: this.formatoFecha(fecha),
  nombrePaciente: this.formulario.get('nombre')?.value,
  servicioId: "1",
  telefono: this.formulario.get('telefono')?.value
};

      this.visiblehome2 = true;

  console.log("Datos a enviar:", datos);
this.consultaService.guardarcita(datos).subscribe({
  next: (res) => {
    this.showConfirmationModal = true; 
    this.cdRef.detectChanges(); 
    console.log("Cita guardada:", res);
    this.limpiarFormulario();
  },
  error: (err) => {
    this.showConfirmationModal = false; 
    this.cdRef.detectChanges(); 
    console.error("Error al guardar la cita:", err);
    alert("No se pudo guardar la cita. Por favor intenta de nuevo.");
  }
});
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
formatoFecha(fecha: string): string {
  const meses: any = {
    Ene: "01", Feb: "02", Mar: "03", Abr: "04", May: "05", Jun: "06",
    Jul: "07", Ago: "08", Sep: "09", Oct: "10", Nov: "11", Dic: "12"
  };

  const [dia, mes] = fecha.split(' ');
  return `2025-${meses[mes]}-${dia.padStart(2, '0')}`;
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

}
