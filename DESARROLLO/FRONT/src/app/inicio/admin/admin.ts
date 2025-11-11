import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Citas } from '../componentes/citas/citas';
import { Services } from '../services/services';
import { EditarServicio } from '../componentes/editar-servicio/editar-servicio';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
export interface Servicio {
  servicioId?: number; // opcional porque al crear aún no existe
  servicioUuid?: string;
  nombreServicio: string;
  duracion: number; // debe ser número, tu backend usa "int"
  prioridad: string;
  estatus?: string; // solo lo usa el front
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, Citas, NgClass,EditarServicio],
  standalone: true,
  templateUrl: './admin.html',
 styleUrls: ['./admin.css'],
  providers: [Services],
  encapsulation: ViewEncapsulation.Emulated
})
export class Admin {

  constructor(private consultaService: Services, private cd: ChangeDetectorRef,    private router: Router,) {}

  pageSize: number = 10;      // 10 registros por página
currentPage: number = 1;    // Página inicial
totalPages: number = 1;

  isShrunk = false;
  isCollapsed = false;
   
  filtrosServicios: any = {};
servicios: any[] = [];

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
   this.consultaService.servicios(this.filtrosServicios).subscribe({
  next: (response) => {
    this.servicios = response;
    this.calcularTotalPaginas();
    this.cd.detectChanges();
    console.log('Servicios cargados:', this.servicios);
  },
  error: (err) => {
    console.error('Ocurrió un error al consultar servicios =>', err.message);
  }
});

  }
calcularTotalPaginas() {
  if (this.servicios && this.servicios.length > 0) {
    this.totalPages = Math.ceil(this.servicios.length / this.pageSize);
  } else {
    this.totalPages = 1;
  }
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
      schedules: [] 
    });
  }

  return days;
}


selectedSection: string = 'inicio'; 

showSection(section: string) {
  this.selectedSection = section;
}


getPaginatedServicios() {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  return this.servicios.slice(startIndex, endIndex);
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
 }

showEditarServicioModal = false;
servicioAEditar: Servicio | null = null;
modoModal: 'editar' | 'nuevo' = 'editar';

// Abrir modal para editar
abrirEditarServicioModal(servicio: Servicio) {
  this.servicioAEditar = servicio;
  this.modoModal = 'editar';
  this.showEditarServicioModal = true;
}

abrirAgregarServicioModal() {
  this.servicioAEditar = null;
  this.modoModal = 'nuevo';
  this.showEditarServicioModal = true;
}


  cerrarEditarServicioModal() {
    this.showEditarServicioModal = false;
    this.servicioAEditar = null;
     this.consultaService.servicios(this.filtrosServicios).subscribe({
  next: (response) => {
    this.servicios = response;
    this.calcularTotalPaginas();
    this.cd.detectChanges();
    console.log('Servicios cargados:', this.servicios);
  },
  error: (err) => {
    console.error('Ocurrió un error al consultar servicios =>', err.message);
  }
});
  }

  manejarServicioActualizado(servicio: Servicio) {
  if (!servicio.servicioUuid) return;
  this.consultaService.updateServicio(servicio.servicioUuid, servicio).subscribe({
    next: (data) => {
      const index = this.servicios.findIndex(s => s.servicioUuid === data.servicioUuid);
      if (index !== -1) this.servicios[index] = data;
      this.cerrarEditarServicioModal();
    },
    error: (err) => console.error('Error al actualizar', err)
  });
}

manejarServicioAgregado(servicio: Servicio) {
  this.consultaService.saveServicio(servicio).subscribe({
    next: (nuevo) => {
      this.servicios.push(nuevo);
      this.cerrarEditarServicioModal();
    },
    error: (err) => console.error('Error al crear servicio', err)
  });
}

showDeleteModal = false;
servicioAEliminar: Servicio | null = null;

abrirModalEliminar(servicio: Servicio) {
  this.servicioAEliminar = servicio;
  this.showDeleteModal = true;
}


confirmarEliminarServicio() {
  if (!this.servicioAEliminar?.servicioUuid) return;

  this.consultaService.deleteServicio(this.servicioAEliminar.servicioUuid).subscribe({
    next: () => {
      console.log('🗑️ Servicio eliminado');
   
      this.showDeleteModal = false;
      this.servicioAEliminar = null;
      this.consultaService.servicios(this.filtrosServicios).subscribe({
  next: (response) => {
    this.servicios = response;
    this.calcularTotalPaginas();
    this.cd.detectChanges();
    console.log('Servicios cargados:', this.servicios);
  },
  error: (err) => {
    console.error('Ocurrió un error al consultar servicios =>', err.message);
  }
});
    },
    error: (err) => {
      console.error('❌ Error al eliminar servicio:', err);
      this.showDeleteModal = false;
    }
  });
}

cancelarEliminacion() {
  this.showDeleteModal = false;
  this.servicioAEliminar = null;
}


 logout() {
    Swal.fire({
      title: '¿Deseas cerrar sesión?',
      text: 'Tu sesión actual se cerrará.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        this.router.navigate(['/login']); // o donde tengas tu ruta de login
      }
    });
  }
}
