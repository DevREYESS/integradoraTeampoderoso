import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Services {
    private apiUrlBase: string = 'http://localhost:8010'; //! Esta ruta sera cambiada una vez que suba al

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


}
