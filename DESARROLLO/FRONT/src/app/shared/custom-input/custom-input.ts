import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.html',
  styleUrls: ['./custom-input.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() icon: string = 'pi pi-user';
  @Input() type: string = 'text';
  @Input() control!: AbstractControl | null;
  @Input() soloLetras: boolean = false;
  @Input() soloNumeros: boolean = false;
  @Input() formatoTelefono: boolean = false;
  @Input() noEspacioInicial: boolean = false;

  value: any = '';
  disabled: boolean = false;

  // Mensajes de error personalizados
  errorMessages: { [key: string]: string } = {
    required: 'Este campo es requerido',
    minlength: 'Mínimo {requiredLength} caracteres',
    maxlength: 'Máximo {requiredLength} caracteres',
    email: 'Email inválido',
    pattern: 'Formato inválido',
    soloLetras: 'Solo se permiten letras',
    espacioInicial: 'No puede comenzar con espacios',
    min: 'Valor mínimo: {min}',
    max: 'Valor máximo: {max}'
  };

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: any): void {
    let value = event.target.value;
    
    // Formatear teléfono si está activado
    if (this.formatoTelefono) {
      value = this.formatearTelefono(value);
      event.target.value = value;
    }
    
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  validarInput(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    // Permitir teclas especiales siempre
    if (event.key === 'Backspace' || 
        event.key === 'Delete' || 
        event.key === 'Tab' || 
        event.key === 'ArrowLeft' || 
        event.key === 'ArrowRight' ||
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown' ||
        event.ctrlKey || 
        event.metaKey) {
      return;
    }

    // Si es formato teléfono, solo permitir números
    if (this.formatoTelefono) {
      const patronNumeros = /^[0-9]$/;
      const numerosActuales = input.value.replace(/\D/g, '');
      
      // Limitar a 10 dígitos
      if (numerosActuales.length >= 10 && patronNumeros.test(event.key)) {
        event.preventDefault();
        return;
      }
      
      if (!patronNumeros.test(event.key)) {
        event.preventDefault();
      }
      return;
    }

    // Validar solo letras
    if (this.soloLetras) {
      const patronLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]$/;
      
      if (this.noEspacioInicial && input.value.length === 0 && event.key === ' ') {
        event.preventDefault();
        return;
      }

      if (!patronLetras.test(event.key)) {
        event.preventDefault();
      }
      return;
    }

    // Validar solo números
    if (this.soloNumeros) {
      const patronNumeros = /^[0-9]$/;
      
      if (!patronNumeros.test(event.key)) {
        event.preventDefault();
      }
      return;
    }
  }

  formatearTelefono(value: string): string {
    // Remover todo excepto números
    const numeros = value.replace(/\D/g, '');
    
    // Limitar a 10 dígitos
    const numerosLimitados = numeros.substring(0, 10);
    
    // Aplicar formato 000-000-0000
    if (numerosLimitados.length <= 3) {
      return numerosLimitados;
    } else if (numerosLimitados.length <= 6) {
      return `${numerosLimitados.slice(0, 3)}-${numerosLimitados.slice(3)}`;
    } else {
      return `${numerosLimitados.slice(0, 3)}-${numerosLimitados.slice(3, 6)}-${numerosLimitados.slice(6)}`;
    }
  }

  // Obtener el primer error para mostrar
  getErrorMessage(): string | null {
  if (!this.control || !this.control.errors || !this.control.touched) {
    return null;
  }

  const errors = this.control.errors;
  const firstErrorKey = Object.keys(errors)[0];
  let message = this.errorMessages[firstErrorKey] || 'Error de validación';

  // Reemplazar valores dinámicos en el mensaje
  if (firstErrorKey === 'minlength') {
    message = message.replace('{requiredLength}', errors[firstErrorKey].requiredLength);
  } else if (firstErrorKey === 'maxlength') {
    message = message.replace('{requiredLength}', errors[firstErrorKey].requiredLength);
  } else if (firstErrorKey === 'min') {
    message = message.replace('{min}', errors[firstErrorKey].min);
  } else if (firstErrorKey === 'max') {
    message = message.replace('{max}', errors[firstErrorKey].max);
  }

  return message;
}

hasError(): boolean {
  return !!(this.control && this.control.invalid && this.control.touched);
}
}