import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {Services} from '../services/services';
import Swal from 'sweetalert2';
import 'sweetalert2/themes/bulma.css'

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class Login {
  loginForm: FormGroup;

  private readonly USER_CORRECTO = 'admin';
  private readonly PASS_CORRECTA = '123456';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: Services
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  acceder() {
    if (this.loginForm.invalid) {
      this.mostrarAlertaError('error','Campos vacios','Por favor, ingresa usuario y contraseña.')
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login({username, password}).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.mostrarAlertaError('error', 'Error al iniciar sesión', error.error.mensaje)
        this.loginForm.controls['password'].reset();
      }
    })
  }

  regresar(){
      localStorage.removeItem('token');
  this.router.navigate(['']);
  }
  mostrarAlertaError(icon: any, title: string, message: string) {
    Swal.fire({
      title: title,
      text: message,
      icon: icon,
      confirmButtonText: 'Aceptar',
    })
  }
}
