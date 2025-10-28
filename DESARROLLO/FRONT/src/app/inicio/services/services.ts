import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Services {
   private apiUrl = 'http://localhost:8010/citas/sCita';
   private apiUrlGuardar = 'http://localhost:8010/citas/saveCita';
   private apiUrlBase: string = 'http://localhost:8010';

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
    return this.http.post<any[]>(this.apiUrl, { telefono: telefono })
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
  return this.http.post<any>(this.apiUrlGuardar, cita, {
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
    return throwError(() => new Error(errorMessage));
  }

  private handleErrorLogin(error: HttpErrorResponse): Observable<never> {
    console.error('Error HTTP capturado:', error);
    return throwError(() => error);
  }

 getCitas(): Observable<any[]> {
  return this.http.post<any>(this.apiUrl, {})
    .pipe(
      map(response => Array.isArray(response) ? response : [response]),
      catchError(this.handleError)
    );
}


}
