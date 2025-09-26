import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Inicio } from './inicio';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    StepperModule,
    ButtonModule ,
    ToastModule,
    
    
    
  
  ],
  providers:[MessageService]
  
})
export class InicioModule { }
