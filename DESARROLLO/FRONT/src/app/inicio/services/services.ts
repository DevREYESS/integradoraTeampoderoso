import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
export interface Servicio {
  servicioId?: number; // opcional porque al crear aún no existe
  servicioUuid?: string;
  nombreServicio: string;
  duracion: number; // debe ser número, tu backend usa "int"

}

@Injectable({
  providedIn: 'root'
})
export class Services {
    //private apiUrlBase: string = 'http://localhost:8010'; //! Ruta para local
    private apiUrlBase: string = 'http://vps-5464962-x.dattaweb.com:8080'; //! Ruta para producción

  constructor(private http: HttpClient) { }

  login(credencials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrlBase}/auth/login`, credencials, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(response => response),
      catchError(this.handleErrorLogin)
    );
  }

  getCitaPorTelefono(telefono: string): Observable<any> {
    return this.http.post<any[]>(`${this.apiUrlBase}/citas/sCita`, { telefono: telefono })
      .pipe(
        map(response => {
          if (response && response.length > 0) {
            return response[0];
          }
          return null;
        }),
        catchError(this.handleError)
      );
  }
guardarcita(cita: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrlBase}/citas/saveCita`, cita, {
    headers: { 'Content-Type': 'application/json' }
  }).pipe(
    map(response => response),
    catchError(this.handleError)
  );
}

updateCita(cita: any, uuid:any): Observable<any> {
  return this.http.put<any>(`${this.apiUrlBase}/citas/uCita/${uuid}`, cita, {
    headers: { 'Content-Type': 'application/json' }
  }).pipe(
    map(response => response),
    catchError(this.handleError)
  );
}



servicios(filtros: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrlBase}/servicios/filtrar`, filtros, {
    headers: { 'Content-Type': 'application/json' }
  }).pipe(
    map(response => response),
    catchError(this.handleError),
    catchError(this.handleErrorLogin)
  );
}

  citasPorRango(rango: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrlBase}/citas/sCita`, rango, {
      headers: {'Content-Type': 'application/json' }
    }).pipe(
      map(response => response),
      catchError(this.handleErrorLogin)
    );
  }


horariosPorRango(rango: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrlBase}/horarios/rango`, rango, {
    headers: {'Content-Type': 'application/json' }
  }).pipe(
    map(response => response),
    catchError(this.handleErrorLogin)
  );
}


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de red: ${error.error.message}`;
    } else {
      errorMessage = `Error ${error.status}: ${error.error.message || error.statusText}`;
    }

    console.error(errorMessage);
    return throwError(() => error);
  }

  private handleErrorLogin(error: HttpErrorResponse): Observable<never> {
    console.error('Error HTTP capturado:', error);
    return throwError(() => error);
  }

 getCitas(): Observable<any[]> {
  return this.http.post<any>(`${this.apiUrlBase}/citas/sCita`, {})
    .pipe(
      map(response => Array.isArray(response) ? response : [response]),
      catchError(this.handleError)
    );
}

  saveServicio(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(`${this.apiUrlBase}/servicios/saveService`, servicio)
      .pipe(
        catchError(err => {
          console.error('Error al guardar el servicio', err);
          return throwError(() => err);
        })
      );
  }

  updateServicio(uuid: string, servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrlBase}/servicios/updateService/${uuid}`, servicio)
      .pipe(
        catchError(err => {
          console.error('Error al actualizar el servicio', err);
          return throwError(() => err);
        })
      );
  }

  deleteServicio(uuid: string): Observable<any> {
    return this.http.delete(`${this.apiUrlBase}/servicios/deleteService/${uuid}`)
      .pipe(
        catchError(err => {
          console.error('Error al eliminar el servicio', err);
          return throwError(() => err);
        })
      );
  }

  horariosPorMes(año: number, mes: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrlBase}/horarios/mes`,
      { año, mes },
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      map(response => response),
      catchError(this.handleErrorLogin)
    );
  }

}
