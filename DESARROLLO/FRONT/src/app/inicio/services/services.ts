import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Services {
   private apiUrl = 'http://localhost/citas/sCita';
   private apiUrlGuardar = 'http://localhost/citas/saveCita';

  constructor(private http: HttpClient) { }

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
}
