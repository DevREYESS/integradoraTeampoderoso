import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {Servicio} from '../../admin/admin';
import {Services} from '../../services/services';
import {EditarServicio} from '../editar-servicio/editar-servicio';

@Component({
  selector: 'app-servicios',
  imports: [
    NgForOf,
    NgIf,
    EditarServicio
  ],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class Servicios implements OnInit{

  showEditarServicioModal = false;
  servicioAEditar: Servicio | null = null;
  modoModal: 'editar' | 'nuevo' = 'editar';

  totalPages: number = 1;
  pageSize: number = 15;      // 10 registros por página
  currentPage: number = 1;
  servicios: any[] = [];

  servicioAEliminar: Servicio | null = null;
  showDeleteModal: boolean = false;

  filtrosServicios: any = {};

  constructor(private cd: ChangeDetectorRef, private consultaService: Services) {
  }

  ngOnInit() {
    this.consultaService.servicios(this.filtrosServicios).subscribe({
      next: (response) => {
        this.servicios = response;
        this.calcularTotalPaginas();
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Ocurrió un error al consultar servicios =>', err.message);
      }
    });
  }


  abrirAgregarServicioModal() {
    this.servicioAEditar = null;
    this.modoModal = 'nuevo';
    this.showEditarServicioModal = true;
  }

  getPaginatedServicios() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.servicios.slice(startIndex, endIndex);
  }

  abrirModalEliminar(servicio: Servicio) {
    this.servicioAEliminar = servicio;
    this.showDeleteModal = true;
  }

  abrirEditarServicioModal(servicio: Servicio) {
    this.servicioAEditar = servicio;
    this.modoModal = 'editar';
    this.showEditarServicioModal = true;
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

  calcularTotalPaginas() {
    if (this.servicios && this.servicios.length > 0) {
      this.totalPages = Math.ceil(this.servicios.length / this.pageSize);
    } else {
      this.totalPages = 1;
    }
  }

  cancelarEliminacion() {
    this.showDeleteModal = false;
    this.servicioAEliminar = null;
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

  cerrarEditarServicioModal() {
    this.showEditarServicioModal = false;
    this.servicioAEditar = null;
    this.consultaService.servicios(this.filtrosServicios).subscribe({
      next: (response) => {
        this.servicios = response;
        this.calcularTotalPaginas();
        this.cd.detectChanges();
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

}
