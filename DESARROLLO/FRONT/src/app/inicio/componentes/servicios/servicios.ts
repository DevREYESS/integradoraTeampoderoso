import {ChangeDetectorRef, Component, OnInit, OnDestroy} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from '@angular/forms';
import {Servicio} from '../../admin/admin';
import {Services} from '../../services/services';
import {EditarServicio} from '../editar-servicio/editar-servicio';
import iziToast from 'izitoast';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-servicios',
  imports: [
    NgForOf,
    NgIf,
    EditarServicio,
    FormsModule
  ],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class Servicios implements OnInit, OnDestroy {

  showEditarServicioModal = false;
  servicioAEditar: Servicio | null = null;
  modoModal: 'editar' | 'nuevo' = 'editar';

  totalPages: number = 1;
  pageSize: number = 15;
  currentPage: number = 1;
  servicios: any[] = [];

  servicioAEliminar: Servicio | null = null;
  showDeleteModal: boolean = false;

  // Filtros
  filtros = {
    nombreServicio: '',
    duracion: null as number | null,
    color: ''
  };

  coloresDisponibles: string[] = [];
  private filtrosSubject = new Subject<void>();

  constructor(private cd: ChangeDetectorRef, private consultaService: Services) {
  }

  ngOnInit() {
    this.cargarServicios();
    this.cargarColoresDisponibles();

    // Debounce para los filtros (espera 500ms después de que el usuario deje de escribir)
    this.filtrosSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.aplicarFiltrosAlServicio();
    });
  }

  ngOnDestroy() {
    this.filtrosSubject.complete();
  }

  cargarServicios() {
    this.consultaService.servicios({}).subscribe({
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

  cargarColoresDisponibles() {
  this.consultaService.servicios({}).subscribe({
    next: (response: Servicio[]) => {
      this.coloresDisponibles = [...new Set(
        response
          .map((s: Servicio) => s.color)
          .filter((c): c is string => !!c)
      )];
      this.cd.detectChanges();
    },
    error: (error) => {
      console.error('Error al cargar colores:', error);
    }
  });
}

  aplicarFiltros() {
    console.log('aplicar filtros');
    this.filtrosSubject.next();
  }

  aplicarFiltrosAlServicio() {
    // Construir objeto de filtros solo con valores no vacíos
    const filtrosAplicados: any = {};

    if (this.filtros.nombreServicio && this.filtros.nombreServicio.trim() !== '') {
      filtrosAplicados.nombreServicio = this.filtros.nombreServicio.trim();
    }

    if (this.filtros.duracion !== null && this.filtros.duracion !== undefined) {
      filtrosAplicados.duracion = this.filtros.duracion;
    }

    if (this.filtros.color && this.filtros.color !== '') {
      filtrosAplicados.color = this.filtros.color;
    }

    console.log('filtros aplicados => ', filtrosAplicados)

    this.consultaService.servicios(filtrosAplicados).subscribe({
      next: (response) => {
        this.servicios = response;
        this.currentPage = 1; // Resetear a la primera página
        this.calcularTotalPaginas();
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error al filtrar servicios:', error);
        this.servicios = [];
        this.cd.detectChanges();
      }
    });
  }

  limpiarFiltros() {
    this.filtros = {
      nombreServicio: '',
      duracion: null,
      color: ''
    };
    this.aplicarFiltrosAlServicio();
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
        iziToast.success({
          title: '¡Listo!',
          message: 'Servicio eliminado correctamente',
          position: 'topCenter',
          timeout: 3000,
          progressBar: true
        });

        this.showDeleteModal = false;
        this.servicioAEliminar = null;
        
        // Recargar con los filtros actuales
        this.aplicarFiltrosAlServicio();
        this.cargarColoresDisponibles(); // Actualizar colores disponibles
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
    
    // Recargar con los filtros actuales
    this.aplicarFiltrosAlServicio();
    this.cargarColoresDisponibles(); // Actualizar colores disponibles
  }

  manejarServicioActualizado(servicio: Servicio) {
    if (!servicio.servicioUuid) return;
    this.consultaService.updateServicio(servicio.servicioUuid, servicio).subscribe({
      next: (data) => {
        iziToast.success({
          title: '¡Actualizado!',
          message: 'Servicio actualizado correctamente',
          position: 'topCenter',
          timeout: 3000,
          progressBar: true
        });
        this.cerrarEditarServicioModal();
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        iziToast.error({
          title: 'Error',
          message: 'No se pudo actualizar el servicio',
          position: 'topCenter',
          timeout: 3000
        });
      }
    });
  }

  manejarServicioAgregado(servicio: Servicio) {
    this.consultaService.saveServicio(servicio).subscribe({
      next: (nuevo) => {
        iziToast.success({
          title: '¡Creado!',
          message: 'Servicio creado correctamente',
          position: 'topCenter',
          timeout: 3000,
          progressBar: true
        });
        this.cerrarEditarServicioModal();
      },
      error: (err) => {
        console.error('Error al crear servicio', err);
        iziToast.error({
          title: 'Error',
          message: 'No se pudo crear el servicio',
          position: 'topCenter',
          timeout: 3000
        });
      }
    });
  }
}