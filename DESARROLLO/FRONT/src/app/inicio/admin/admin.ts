import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Citas } from '../componentes/citas/citas';
import { Services } from '../services/services';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, Citas, NgClass],
  standalone: true,
  templateUrl: './admin.html',
 styleUrls: ['./admin.css'],
  providers: [Services],
  encapsulation: ViewEncapsulation.Emulated
})
export class Admin {

  constructor(private consultaService: Services, private cd: ChangeDetectorRef) {}

  isShrunk = false;
  isCollapsed = false;
   

toggleSidebar() {
  this.isCollapsed = !this.isCollapsed;
}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isShrunk = window.scrollY > 50;
  }

  weekData: any[] = [];
  allDaysData: any[] = []; 
  fixedTimes: string[] = ["8:00", "8:20", "8:40", "9:00", "9:20", "9:40", "10:00", "10:20", "10:40"];
  
  currentWeekIndex: number = 0;
  daysPerWeek: number = 7;

  isFirstWeek: boolean = true;
  isLastWeek: boolean = false;

  showCitasModal = false;

  ngOnInit() {
    this.cargarCitas();
  }

  abrirCitasModal() { this.showCitasModal = true; }
  cerrarCitasModal() { this.showCitasModal = false; }

cargarCitas() {
  this.consultaService.getCitas().subscribe({
    next: (data: any) => {
      if (!Array.isArray(data)) {
        console.error('El servicio no devolvió un array de citas');
        return;
      }

      // Encontrar fecha mínima y máxima de las citas (creadas como locales)
      let minDate = new Date(Math.min(...data.map(c => {
        const [y, m, d] = c.fechaCita.split('-').map(Number);
        return new Date(y, m - 1, d).getTime();
      })));

      let maxDate = new Date(Math.max(...data.map(c => {
        const [y, m, d] = c.fechaCita.split('-').map(Number);
        return new Date(y, m - 1, d).getTime();
      })));

      // Ajustar a medianoche para evitar desfasajes de hora
      minDate.setHours(0, 0, 0, 0);
      maxDate.setHours(0, 0, 0, 0);

      // Generar todos los días entre minDate y maxDate
      const allDays: any[] = [];
      const current = new Date(minDate);
      while (current <= maxDate) {
        const dateStr = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
        allDays.push({
          name: this.getShortDayName(current.getDay()),
          date: dateStr,
          schedules: []
        });
        current.setDate(current.getDate() + 1);
      }

      // Asignar citas a los días correspondientes (fecha local)
      data.forEach((cita: any) => {
        const [y, m, d] = cita.fechaCita.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        dateObj.setHours(0, 0, 0, 0);

        const dateStr = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
        const day = allDays.find(d => d.date === dateStr);
        if (day) {
          const horaInicio = cita.horaInicio || '8:00';
          const duracionMin = this.calcularDuracionMinutos(cita.horaInicio, cita.horaFin);
          const [h, m] = horaInicio.split(':').map(Number);
          const startMinutes = h * 60 + m;

          // Dividir la cita en intervalos de 20 min
          for (let i = 0; i < duracionMin; i += 20) {
            const totalMinutes = startMinutes + i;
            const horaSlot = `${Math.floor(totalMinutes / 60)}:${(totalMinutes % 60).toString().padStart(2, '0')}`;
            day.schedules.push({
              time: horaSlot,
              status: 'Agendado',
              appointment: {
                nombrePaciente: cita.nombrePaciente || 'Sin nombre',
                time: `${horaInicio} - ${cita.horaFin}`,
                status: cita.estatus
              }
            });
          }
        }
      });

      // Rellenar horarios vacíos con "Disponible"
      const fixedTimes = this.fixedTimes;
      allDays.forEach(day => {
        fixedTimes.forEach(time => {
          if (!day.schedules.find((s: any) => s.time === time)) {
            day.schedules.push({
              time,
              status: 'Disponible'
            });
          }
        });
        // Ordenar los horarios
        day.schedules.sort((a: any, b: any) => a.time.localeCompare(b.time));
      });

      this.allDaysData = allDays;
      this.loadCurrentWeek();
      this.cd.detectChanges();
    },
    error: (err) => console.error('Error al obtener citas:', err)
  });
}




  calcularDuracionMinutos(horaInicio: string, horaFin: string): number {
    if (!horaInicio || !horaFin) return 20;
    const [hiH, hiM] = horaInicio.split(':').map(Number);
    const [hfH, hfM] = horaFin.split(':').map(Number);
    return (hfH * 60 + hfM) - (hiH * 60 + hiM);
  }

  getShortDayName(dayIndex: number) {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[dayIndex];
  }

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

  getScheduleSlot(schedules: any[], time: string): any | null {
    if (!schedules) return null;
    return schedules.find(schedule => schedule.time === time);
  }

  generateWeekDays(startDate: Date, numDays: number = 30) {
  const days: any[] = [];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  for (let i = 0; i < numDays; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);

    days.push({
      name: dayNames[d.getDay()],
      date: d.toISOString().split('T')[0],
      schedules: [] // se rellenará con las citas si existen
    });
  }

  return days;
}

}
