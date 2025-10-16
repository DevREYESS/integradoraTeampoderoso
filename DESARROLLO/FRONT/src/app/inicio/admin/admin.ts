import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, 
    NgClass],
  standalone: true,
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class Admin {


isShrunk = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isShrunk = window.scrollY > 50; 
  }
weekData: any[] = [
    {
        name: 'Lun',
        date: '2025-10-06',
        schedules: [
            { 
                time: '8:00', 
                status: 'Agendado', // El status sigue siendo útil para la lógica interna
                appointment: { 
                    nombrePaciente: 'Itzel Diego Sánchez', 
                    time: '8:00 - 8:20', 
                    status: 'confirmado' // Nuevo status para el color de la cita
                } 
            },
            { time: '8:20', status: 'Disponible' }, // Un slot vacío
            { time: '8:40', status: 'Disponible' },
            { time: '9:00', status: 'Disponible' },
            { time: '9:20', status: 'Disponible' },
        ]
    },
    // MARTES
    {
        name: 'Mar',
        date: '2025-10-07',
        schedules: [
            { time: '8:00', status: 'Disponible' },
            { time: '8:20', status: 'Disponible' },
            { 
                time: '8:40', 
                status: 'Agendado',
                appointment: { 
                    nombrePaciente: 'Sofía Salinas Mejía', 
                    time: '8:40 - 9:20', 
                    status: 'pendiente' // Otro status
                } 
            },
            { time: '9:00', status: 'Disponible' }, // Este se "oculta" por la cita de 8:40
            { time: '9:20', status: 'Disponible' },
        ]
    },
    // MIÉRCOLES (Mié)
    {
        name: 'Mié',
        date: '2025-10-08',
        schedules: [
            { time: '8:00', status: 'Disponible' },
            { time: '8:20', status: 'Disponible' },
            { time: '8:40', status: 'Disponible' },
            { time: '9:00', status: 'Disponible' },
            { time: '9:20', status: 'Disponible' },
        ]
    },
    // JUEVES (Jue)
    {
        name: 'Jue',
        date: '2025-10-09',
        schedules: [
            { time: '8:00', status: 'Disponible' },
            { time: '8:20', status: 'Disponible' },
            { time: '8:40', status: 'Disponible' },
            { time: '9:00', status: 'Disponible' },
            { time: '9:20', status: 'Disponible' },
        ]
    },
    // VIERNES (Vie)
    {
        name: 'Vie',
        date: '2025-10-10',
        schedules: [
            { 
                time: '8:00', 
                status: 'Agendado',
                appointment: { 
                    nombrePaciente: 'Rosa Neri Lopez', 
                    time: '8:00 - 8:40', 
                    status: 'cancelado' // Otro status
                } 
            },
            { time: '8:20', status: 'Disponible' }, // Este se "oculta" por la cita de 8:00
            { time: '8:40', status: 'Disponible' },
            { time: '9:00', status: 'Disponible' },
            { time: '9:20', status: 'Disponible' },
        ]
    },
    // SÁBADO (Sáb)
    {
        name: 'Sáb',
        date: '2025-10-11',
        schedules: [
            { time: '8:00', status: 'Disponible' },
            { time: '8:20', status: 'Disponible' },
            { time: '8:40', status: 'Disponible' },
            { 
                time: '9:00', 
                status: 'Agendado',
                appointment: { 
                    nombrePaciente: 'Celeste Bautista Romero', 
                    time: '9:00 - 9:20', 
                    status: 'confirmado' 
                } 
            },
            { time: '9:20', status: 'Disponible' }, // Este se "oculta" por la cita de 9:00
        ]
    },
    // DOMINGO (Dom)
    {
        name: 'Dom',
        date: '2025-10-12',
        schedules: [] // Día no laborable
    }
];

fixedTimes: string[] = ["8:00", "8:20", "8:40", "9:00", "9:20", "9:40"];


allDaysData: any[] = [
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
      { time: '10:20', status: 'Agendado',
                appointment: { 
                    nombrePaciente: 'Celeste Bautista Romero', 
                    time: '9:00 - 9:20', 
                    status: 'confirmado' 
                }  },
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


  

  
  getScheduleSlot(schedules: any[], time: string): any | null {
    if (!schedules) return null;
    return schedules.find(schedule => schedule.time === time);
  }

  isLarge(time: string, dayName: string): boolean {
    return (time === '9:00' || time === '9:20') && (dayName === 'Mié' || dayName === 'Jue');
  }


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

getAppointment(schedules: any[], time: string) {
  return schedules.find(s => s.time === time);
}
// ... (tus funciones existentes como getScheduleSlot, goToNextWeek, etc.)
}
