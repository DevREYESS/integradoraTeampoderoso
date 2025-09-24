import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio',
  imports: [ReactiveFormsModule],
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


  // tus funciones de botones
  limpiarFormulario() {
    this.formulario.reset();
  }

  guarda() {
    console.log(this.formulario.value);
  }
}
