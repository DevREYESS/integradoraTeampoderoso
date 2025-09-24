import { Component, ViewEncapsulation,HostListener  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-inicio',
  imports: [ReactiveFormsModule,CardModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class Inicio {
  
  formulario: FormGroup;

 constructor (private formBuilder: FormBuilder,){
   this.formulario = this.formBuilder.group({
      numerocliente: ['', []],
      numerotramite: ['', []],
      negocio: ['', []],
      sistema: ['', []],
      canal: ['', []],
      codigosucursal: ['', []],
      referencia: ['', []],
      diasvigencia: ['', []],
     
    });
 }
  isShrunk = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isShrunk = window.scrollY > 50; // si bajas más de 50px, achica
  }

  // tus funciones de botones
  limpiarFormulario() {
    this.formulario.reset();
  }

  guarda() {
    console.log(this.formulario.value);
  }
}
