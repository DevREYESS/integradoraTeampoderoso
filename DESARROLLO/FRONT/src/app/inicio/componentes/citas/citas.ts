import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Services } from '../../services/services';
import { Editarcita } from '../editarcita/editarcita';
import { Router } from '@angular/router';

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

  constructor(private consultaService: Services, private cd: ChangeDetectorRef, private router:Router) {}

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
            fin: this.formatearHora(item.horaFin) ?? '00:00',
            fecha: this.formatearFecha(item.fechaCita),
            telefono: item.telefono ?? '',
            estatus: estatusInfo.text,
            estatusClass: estatusInfo.class,
            uuid: item.citaUuid,
            nombreServicio: item.nombreServicio,
            colorServicio: item.colorServicio
          };
        });

        this.citas = [...this.citasOriginal];
        this.citas.forEach(cita => {
          cita.iniciales = this.getInitials(cita.nombre);
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


// Variables para modales
showConfirmationModal = false;
showResultModal = false;
resultMessage = '';
selectedCita: any = null;

// Abrir modal de confirmación
abrirConfirmacion(cita: any) {
  this.selectedCita = cita;
  this.showConfirmationModal = true;
}

// Confirmar cancelación
confirmarCancelarCita() {
  if (!this.selectedCita) return;

  // Cerramos el modal de confirmación antes de llamar al servicio
  this.showConfirmationModal = false;

  const citaParaAPI = {
    telefono: this.selectedCita.telefono,
    estatus: 'C',
    nombrePaciente: this.selectedCita.nombre,
    horaInicio: this.convertirAHora24(this.selectedCita.inicio),
    horaFin: this.convertirAHora24(this.selectedCita.fin),
    fechaCita: this.convertirFechaISO(this.selectedCita.fecha)
  };

  this.consultaService.updateCita(citaParaAPI, this.selectedCita.uuid).subscribe({
    next: (res) => {
      const index = this.citas.findIndex(c => c.uuid === this.selectedCita.uuid);
      if (index !== -1) this.citas[index].estatus = 'C';

      this.resultMessage = 'Cita cancelada correctamente';
      this.showResultModal = true;

      this.selectedCita = null;
      this.obtenerCitas(); // Refresca la lista
    },
    error: (err) => {
      console.error('Error al cancelar la cita', err);
      this.resultMessage = 'No se pudo cancelar la cita';
      this.showResultModal = true;
      this.selectedCita = null;
    }
  });
}

  eliminarCita(cita: any) {
    if (!cita || !cita.uuid) return;

    const confirmar = confirm(`¿Deseas cancelar la cita de ${cita.nombre} el ${cita.fecha}?`);
    if (!confirmar) return;

    // Mapear al formato que espera la API
    const citaParaAPI = {
      telefono: cita.telefono,
      estatus: 'C', // cancelada
      nombrePaciente: cita.nombre,
      horaInicio: this.convertirAHora24(cita.inicio), // método de la clase
      horaFin: this.convertirAHora24(cita.fin),
      fechaCita: this.convertirFechaISO(cita.fecha)
    };

    this.consultaService.updateCita(citaParaAPI, cita.uuid).subscribe({
      next: (res) => {
        const index = this.citas.findIndex(c => c.uuid === cita.uuid);
        if (index !== -1) this.citas[index].estatus = 'C';
        alert('Cita cancelada correctamente');
         this.obtenerCitas();
      },
      error: (err) => {
        console.error('Error al cancelar la cita', err);
        alert('No se pudo cancelar la cita');
      }
    });
  }

  // Métodos auxiliares dentro de la clase
  private convertirAHora24(hora12: string): string {
    const [time, modifier] = hora12.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier.toLowerCase() === 'pm' && hours !== 12) hours += 12;
    if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:00`;
  }

private convertirFechaISO(fechaStr: string): string {
  const meses: any = {
    enero:1, febrero:2, marzo:3, abril:4, mayo:5, junio:6,
    julio:7, agosto:8, septiembre:9, octubre:10, noviembre:11, diciembre:12
  };
  const partes = fechaStr.split(' '); // ["29", "de", "octubre", "de", "2025"]
  const dia = partes[0];
  const mesTexto = partes[2];
  const año = partes[4]; // <- ahora toma "2025"
  const mes = meses[mesTexto.toLowerCase()];
  return `${año}-${mes.toString().padStart(2,'0')}-${dia.padStart(2,'0')}`;
}


 buscar() {
  const term = this.searchTerm.replace(/-/g, '').toLowerCase();

  if (this.filterBy === 'nombre') {
    this.citas = this.citasOriginal.filter(cita =>
      cita.nombre.toLowerCase().includes(term)
    );
  } else if (this.filterBy === 'numero') {
    this.citas = this.citasOriginal.filter(cita =>
      cita.telefono.replace(/\D/g, '').includes(term)
    );
  }
}


 onSearchInput(event?: any) {
  if (!this.searchTerm) {
    this.citas = [...this.citasOriginal];
    this.citas.forEach(cita => cita.iniciales = this.getInitials(cita.nombre));
    return;
  }

  if (this.filterBy === 'numero' && event) {
    let value = event.target.value;

    value = value.replace(/\D/g, '');

    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,4})/, '$1-$2-$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, '$1-$2');
    }

    event.target.value = value;
    this.searchTerm = value;
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

  agendar(){
    this.router.navigate(['/nuevacita'])
  }
}
