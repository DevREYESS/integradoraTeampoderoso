import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class Login {
  // 1. **CAMBIO DE NOMBRE:** Usa 'loginForm' para claridad
  loginForm: FormGroup; 
  
  private readonly USER_CORRECTO = 'admin';
  private readonly PASS_CORRECTA = '123456';

  constructor(private formBuilder: FormBuilder, private router: Router) {
    // 2. **CORRECCIÓN CLAVE:** Agrega Validators.required a ambos campos
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
    });
  }

  acceder() {
    // 3. **CAMBIO DE NOMBRE:** Usar el nombre de variable correcto
    if (this.loginForm.invalid) { 
      alert('Por favor, ingresa usuario y contraseña.');
      return;
    }

    // Obtenemos los valores. El método .value ya nos da las cadenas.
    const { usuario, contrasena } = this.loginForm.value;

    // Lógica de Validación (debería funcionar correctamente ahora)
    if (usuario === this.USER_CORRECTO && contrasena === this.PASS_CORRECTA) {
      console.log('Inicio de sesión exitoso.');
      this.router.navigate(['/admin']); 
    } else {
      alert('Usuario o contraseña incorrectos. Inténtalo de nuevo.');
      this.loginForm.controls['contrasena'].reset();
    }
  }
}
