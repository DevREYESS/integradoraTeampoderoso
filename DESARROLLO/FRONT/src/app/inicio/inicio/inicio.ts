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

  // Agregar el método getScheduleSlot que falta
  getScheduleSlot(schedules: any[], time: string): any | null {
    if (!schedules) return null;
    return schedules.find(schedule => schedule.time === time);
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

 // Agregar estas propiedades a la clase Inicio
private horarioDefault = {
  horaInicio: '08:00',
  horaFin: '18:20'
};

// Reemplazar las propiedades existentes relacionadas con datos estáticos
allDaysData: any[] = []; // ya existe, mantenerla vacía
weekData: any[] = [];   // ya existe
fixedTimes: string[] = []; // ya existe, se generará dinámicamente

 constructor (private formBuilder: FormBuilder,
  private router: Router,
  private messageService: MessageService,
  private consultaService: Services,
  private cdRef: ChangeDetectorRef,private renderer: Renderer2){
   this.formulario = this.formBuilder.group({
      nombre:  ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)  ]],
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

  // Cargar la semana actual con datos dinámicos
  this.loadCurrentWeek();

  this.consultaService.servicios(this.filtrosServicios).subscribe({
    next: (response) => {
      this.servicios = response;
    },
    error: (err) => {
      console.error('Ocurrió un error al consultar servicios => ', err.message);
    }
  });
}


filtrosServicios: any = {};
servicios: any[] = [];

servicioSeleccionado: number | null = null;

  // Modificar el método loadCurrentWeek para que sea dinámico
loadCurrentWeek(): void {
  const fechaInicio = this.getWeekStartDate();
  const fechaFin = this.getWeekEndDate(fechaInicio);

  this.consultarDatosSemana(fechaInicio, fechaFin);
}

// Nuevo método para obtener fecha de inicio de la semana actual
private getWeekStartDate(): Date {
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1); // Solo mostrar desde mañana

  // Si es domingo, comenzar desde mañana; si no, ir al domingo de esa semana
  const diaSemana = manana.getDay();
  const diasHastaDomingo = diaSemana === 0 ? 0 : 7 - diaSemana;

  const inicioSemana = new Date(manana);
  inicioSemana.setDate(manana.getDate() + diasHastaDomingo);

  return inicioSemana;
}

// Nuevo método para obtener fecha de fin de la semana
private getWeekEndDate(fechaInicio: Date): Date {
  const fechaFin = new Date(fechaInicio);
  fechaFin.setDate(fechaInicio.getDate() + 6);
  return fechaFin;
}

// Método principal para consultar los datos de la semana
private consultarDatosSemana(fechaInicio: Date, fechaFin: Date): void {
  const rangoFechas = {
    fechaInicio: this.formatDateForAPI(fechaInicio),
    fechaFin: this.formatDateForAPI(fechaFin)
  };

  // Consultar horarios especiales y citas agendadas en paralelo
  Promise.all([
    this.consultaService.horariosPorRango(rangoFechas).toPromise(),
    this.consultaService.citasPorRango(rangoFechas).toPromise()
  ]).then(([horarios, citasAgendadas]) => {
    this.generarDatosSemana(fechaInicio, fechaFin, horarios || [], citasAgendadas || []);
    this.cdRef.detectChanges();
  }).catch(error => {
    console.error('Error al consultar datos de la semana:', error);
    // En caso de error, generar con datos por defecto
    this.generarDatosSemana(fechaInicio, fechaFin, [], []);
  });
}

// Generar los datos de la semana con horarios y citas
private generarDatosSemana(fechaInicio: Date, fechaFin: Date, horarios: any[], citasAgendadas: any[]): void {
  this.weekData = [];
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  for (let i = 0; i < 7; i++) {
    const fechaActual = new Date(fechaInicio);
    fechaActual.setDate(fechaInicio.getDate() + i);

    const fechaString = this.formatDateForAPI(fechaActual);
    const horarioDelDia = horarios.find(h => h.fecha === fechaString);

    // Usar horario especial si existe, si no usar el por defecto
    const horaInicio = horarioDelDia ? horarioDelDia.horaInicio : this.horarioDefault.horaInicio;
    const horaFin = horarioDelDia ? horarioDelDia.horaFin : this.horarioDefault.horaFin;

    // Generar horarios disponibles para el día
    const horariosDelDia = this.generarHorariosDelDia(horaInicio, horaFin, fechaString, citasAgendadas);

    this.weekData.push({
      name: daysOfWeek[i],
      date: fechaString,
      schedules: horariosDelDia
    });
  }

  // Generar fixedTimes basado en el horario más amplio
  this.generarFixedTimes();

  // Actualizar estados de navegación
  this.updateNavigationStates();
}

// Generar los horarios de un día específico
private generarHorariosDelDia(horaInicio: string, horaFin: string, fecha: string, citasAgendadas: any[]): any[] {
  const horarios: any[] = [];

  // Verificar si es domingo (día no laborable por defecto)
  const fechaObj = new Date(fecha);
  if (fechaObj.getDay() === 6) {
    return []; // Domingo sin horarios (mostrará "No labora")
  }

  const [horaInicioH, horaInicioM] = horaInicio.split(':').map(Number);
  const [horaFinH, horaFinM] = horaFin.split(':').map(Number);

  const minutosInicio = horaInicioH * 60 + horaInicioM;
  const minutosFin = horaFinH * 60 + horaFinM;

  // Generar horarios en intervalos de 20 minutos
  for (let minutos = minutosInicio; minutos < minutosFin; minutos += 20) {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    const horaFormateada = `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

    // Verificar si hay cita agendada en este horario
    const citaEnEsteHorario = citasAgendadas.find(cita =>
      cita.fechaCita === fecha && cita.horaInicio === horaFormateada + ':00'
    );

    let status = 'Disponible';
    if (citaEnEsteHorario) {
      status = citaEnEsteHorario.estatus === 'A' ? 'Agendado' :
               citaEnEsteHorario.estatus === 'C' ? 'Disponible' : 'No disponible';
    }

    horarios.push({
      time: horaFormateada,
      status: status
    });
  }

  return horarios;
}

// Generar fixedTimes dinámicamente basado en todos los horarios
private generarFixedTimes(): void {
  const todasLasHoras = new Set<string>();

  this.weekData.forEach(day => {
    if (day.schedules && day.schedules.length > 0) {
      day.schedules.forEach((schedule: any) => {
        todasLasHoras.add(schedule.time);
      });
    }
  });

  // Si no hay horarios específicos, usar el rango por defecto
  if (todasLasHoras.size === 0) {
    const [horaInicioH, horaInicioM] = this.horarioDefault.horaInicio.split(':').map(Number);
    const [horaFinH, horaFinM] = this.horarioDefault.horaFin.split(':').map(Number);

    const minutosInicio = horaInicioH * 60 + horaInicioM;
    const minutosFin = horaFinH * 60 + horaFinM;

    for (let minutos = minutosInicio; minutos < minutosFin; minutos += 20) {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      todasLasHoras.add(`${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
    }
  }

  this.fixedTimes = Array.from(todasLasHoras).sort();
}

// Formatear fecha para la API
private formatDateForAPI(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Actualizar estados de navegación
private updateNavigationStates(): void {
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  // Verificar si es la primera semana (contiene mañana o días posteriores)
  const primerDiaSemana = new Date(this.weekData[0]?.date || '');
  this.isFirstWeek = primerDiaSemana <= manana;

  // Para verificar si es la última semana, puedes establecer un límite
  // Por ejemplo, 6 meses desde hoy
  const fechaLimite = new Date(hoy);
  fechaLimite.setMonth(hoy.getMonth() + 6);

  const ultimoDiaSemana = new Date(this.weekData[6]?.date || '');
  this.isLastWeek = ultimoDiaSemana >= fechaLimite;
}

// Modificar goToNextWeek para que consulte la siguiente semana
goToNextWeek(): void {
  if (!this.isLastWeek && this.weekData.length > 0) {
    const fechaActual = new Date(this.weekData[0].date);
    fechaActual.setDate(fechaActual.getDate() + 7);

    const fechaInicio = fechaActual;
    const fechaFin = this.getWeekEndDate(fechaInicio);

    this.consultarDatosSemana(fechaInicio, fechaFin);
  }
}

// Modificar goToPreviousWeek para que consulte la semana anterior
goToPreviousWeek(): void {
  if (!this.isFirstWeek && this.weekData.length > 0) {
    const fechaActual = new Date(this.weekData[0].date);
    fechaActual.setDate(fechaActual.getDate() - 7);

    const fechaInicio = fechaActual;
    const fechaFin = this.getWeekEndDate(fechaInicio);

    this.consultarDatosSemana(fechaInicio, fechaFin);
  }
}

isLarge(time: string, dayName: string): boolean {
  return (time === '9:00' || time === '9:20') && (dayName === 'Mié' || dayName === 'Jue');
}


currentWeekIndex: number = 0;
daysPerWeek: number = 7;

isFirstWeek: boolean = true;
isLastWeek: boolean = false;



  public weekData2: any[] = [];
  //public currentWeekIndex = 0;
  private daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];





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
soloLetras(event: KeyboardEvent) {
  const char = event.key;

  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  // Permitir teclas especiales como backspace, delete, arrows
  if (['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(char)) {
    return;
  }

  if (!regex.test(char)) {
    event.preventDefault();
  }
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
        horaInicio: res.horaInicio,
        horaFin: this.calcularHoraFin(res.horaInicio),
        nombreServicio: res.nombreServicio || '',
      };
      this.limpiarFormulario();
      this.showModal2 = true;
this.telefonoFormateado = " ";
      this.cdRef.detectChanges();
    },
    error: (err) => {
      this.isLoadingA = false;

      if (err.error && err.error.message) {
        this.errorMessage = err.error.message;
      } else {
        this.errorMessage = "Ocurrió un error al guardar la cita. Intenta de nuevo.";
      }
      this.limpiarFormulario();
      this.showErrorModal = true;
      this.showModal2 = false;

      this.cdRef.detectChanges();
    }
  });
 this.limpiarFormulario();
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
     const servicioCtrl = this.formulario.get('servicio');
    servicioCtrl?.removeValidators([Validators.required]);
    servicioCtrl?.updateValueAndValidity();
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
        const servicioCtrl = this.formulario.get('servicio');
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
  this.limpiarFormulario();
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
  this.formulario2.get('telefono')?.reset();
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
