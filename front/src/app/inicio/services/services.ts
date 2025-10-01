import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Services {
   private apiUrl = 'http://localhost/citas/sCita';

  constructor(private http: HttpClient) { }

  getCitaPorTelefono(telefono: string): Observable<any> {
    
    const params = {
      telefono: telefono 
    };

    return this.http.post<any[]>(this.apiUrl, { params: params })
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
