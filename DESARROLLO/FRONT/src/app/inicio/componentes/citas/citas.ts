import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Services } from '../../services/services';
import { Editarcita } from '../editarcita/editarcita';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, Editarcita],
  providers: [Services],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas {
  @Output() close = new EventEmitter<void>();

  citas: any[] = [];
  citasOriginal: any[] = [];
  coloresIniciales = ['bg-blue', 'bg-yellow', 'bg-pink', 'bg-green', 'bg-purple', 'bg-orange'];
  searchTerm: string = '';
  filterBy: 'nombre' | 'numero' = 'numero';
  loading: boolean = true;

  constructor(private consultaService: Services, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.generarHoras(); // Inicializa horas
    this.obtenerCitas();
  }

  closeModal(): void {
    this.close.emit();
  }

  getEstatusInfo(estatus: string) {
    switch (estatus) {
      case 'A': return { text: 'Activa', class: 'active-text' };     
      case 'C': return { text: 'Cancelada', class: 'error-text' };   
      case 'F': return { text: 'Finalizada', class: 'finished-text' }; 
      default:  return { text: 'Desconocido', class: 'unknown-text' }; 
    }
  }

  obtenerCitas(): void {
    this.loading = true;
    this.citas = []; 
    this.cd.detectChanges(); 

    this.consultaService.getCitas().subscribe({
      next: (data: any) => {
        if (!Array.isArray(data)) {
          console.error('Error: la respuesta del servicio no es un array', data);
          this.loading = false;
          return;
        }

        this.citasOriginal = data.map((item: any) => {
          const estatusInfo = this.getEstatusInfo(item.estatus);
          const horaInicioFormateada = this.formatearHora(item.horaInicio);
          const [hora24] = item.horaInicio.split(':'); // solo la hora en 24h

          return {
            id: item.id?.toString() ?? '',
            nombre: item.nombrePaciente ?? 'Sin nombre',
            duracion: this.calcularDuracion(item.horaInicio, item.horaFin),
            inicio: horaInicioFormateada,
            horaFiltrado: hora24,
            fin: this.formatearHora(item.horaFin),
            fecha: this.formatearFecha(item.fechaCita),
            telefono: item.telefono ?? '',
            estatus: estatusInfo.text,
            estatusClass: estatusInfo.class,
            uuid: item.uuid
          };
        });

        this.citas = [...this.citasOriginal];
        this.citas.forEach(cita => {
          cita.iniciales = this.getInitials(cita.nombre);
          const index = Math.floor(Math.random() * this.coloresIniciales.length);
          cita.colorIniciales = this.coloresIniciales[index];
        });

        this.loading = false;
        this.cd.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al obtener citas:', err);
        this.loading = false;
        this.cd.detectChanges(); 
      }
    });
  }

  formatearHora(hora: string): string {
    if (!hora) return '';
    const [h, m] = hora.split(':');
    const horas = parseInt(h, 10);
    const ampm = horas >= 12 ? 'pm' : 'am';
    const hora12 = horas % 12 || 12;
    return `${hora12}:${m} ${ampm}`;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const [year, month, day] = fecha.split('-').map(Number);
    const fechaObj = new Date(year, month - 1, day); 
    const opciones: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return fechaObj.toLocaleDateString('es-MX', opciones);
  }

  calcularDuracion(horaInicio: string, horaFin: string): string {
    if (!horaInicio || !horaFin) return '';
    const [hiH, hiM] = horaInicio.split(':').map(Number);
    const [hfH, hfM] = horaFin.split(':').map(Number);
    const inicio = hiH * 60 + hiM; 
    const fin = hfH * 60 + hfM;
    const duracion = fin - inicio;
    return duracion > 0 ? `${duracion} min` : '';
  }

  getInitials(nombre: string): string {
    if (!nombre) return '';
    const palabras = nombre.split(' ').filter(p => p.length > 0);
    if (palabras.length === 1) return palabras[0].charAt(0).toUpperCase();
    return (palabras[0].charAt(0) + palabras[1].charAt(0)).toUpperCase();
  }

  agregarComentario(cita: any): void {
    console.log(`Abriendo campo para comentario para: ${cita.nombre}`);
  }

  editarCitaSeleccionada: any = null; 
  showEditarModal: boolean = false;   

  editarCita(cita: any) {
    this.editarCitaSeleccionada = { ...cita }; 
    this.showEditarModal = true;               
  }

  cerrarEditarModal() {
    this.showEditarModal = false;
    this.editarCitaSeleccionada = null;
  }

  actualizarCitaLista(citaActualizada: any) {
    this.obtenerCitas();
  }

  eliminarCita(cita: any): void {
    console.log(`Eliminando cita de: ${cita.nombre}`);
  }

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
      this.citas = [...this.citasOriginal];
      this.citas.forEach(cita => cita.iniciales = this.getInitials(cita.nombre));
    }
  }

  // ---------------------------
  // 🔸 FILTROS COMBINADOS
  // ---------------------------
  mostrarFiltroMes = false;
  mostrarFiltroDia = false;
  mostrarFiltroHora = false;

  meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  dias = Array.from({ length: 31 }, (_, i) => i + 1);
  horas: string[] = [];

  mesSeleccionado: string = '';
  diaSeleccionado: number | null = null;
  horaSeleccionada: string = '';

  abrirFiltroMes() { this.mostrarFiltroMes = true; }
  cerrarFiltroMes() { this.mostrarFiltroMes = false; }
  abrirFiltroDia() { this.mostrarFiltroDia = true; }
  cerrarFiltroDia() { this.mostrarFiltroDia = false; }
  abrirFiltroHora() { this.mostrarFiltroHora = true; }
  cerrarFiltroHora() { this.mostrarFiltroHora = false; }

  seleccionarMes(mes: string) {
    this.mesSeleccionado = mes;
    this.mostrarFiltroMes = false;
    this.aplicarFiltrosCombinados();
  }

  seleccionarDia(dia: number) {
    this.diaSeleccionado = dia;
    this.mostrarFiltroDia = false;
    this.aplicarFiltrosCombinados();
  }

  seleccionarHora(hora: string) {
    this.horaSeleccionada = hora;
    this.mostrarFiltroHora = false;
    this.aplicarFiltrosCombinados();
  }

  generarHoras() {
    const horasArray: string[] = [];
    for (let h = 8; h <= 18; h++) {
      for (let m = 0; m < 60; m += 20) {
        const hora12 = h % 12 || 12;
        const ampm = h < 12 ? 'am' : 'pm';
        const minStr = m.toString().padStart(2, '0');
        horasArray.push(`${hora12}:${minStr} ${ampm}`);
      }
    }
    this.horas = horasArray;
  }

  convertirHoraA24h(hora: string): string {
    const [hMin, ampm] = hora.split(' ');
    const [hStr] = hMin.split(':');
    let horaNum = parseInt(hStr, 10);
    if (ampm.toLowerCase() === 'pm' && horaNum < 12) horaNum += 12;
    if (ampm.toLowerCase() === 'am' && horaNum === 12) horaNum = 0;
    return horaNum.toString();
  }

  aplicarFiltrosCombinados() {
    this.citas = this.citasOriginal.filter(cita => {
      const coincideMes = this.mesSeleccionado
        ? cita.fecha.toLowerCase().includes(this.mesSeleccionado.toLowerCase())
        : true;

      const coincideDia = this.diaSeleccionado
        ? cita.fecha.startsWith(this.diaSeleccionado.toString().padStart(2, '0')) ||
          cita.fecha.includes(` ${this.diaSeleccionado} `)
        : true;

      const coincideHora = this.horaSeleccionada
        ? cita.horaFiltrado === this.convertirHoraA24h(this.horaSeleccionada)
        : true;

      return coincideMes && coincideDia && coincideHora;
    });
  }

  limpiarFiltros() {
    this.mesSeleccionado = '';
    this.diaSeleccionado = null;
    this.horaSeleccionada = '';

    this.mostrarFiltroMes = false;
    this.mostrarFiltroDia = false;
    this.mostrarFiltroHora = false;

    this.citas = [...this.citasOriginal];
    this.citas.forEach(cita => {
      cita.iniciales = this.getInitials(cita.nombre);
    });
  }
}
