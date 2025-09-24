import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule
  ]
  
})
export class InicioModule { }
