package com.utsem.app.citasbackend.advice;

import com.utsem.app.citasbackend.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CitaDuplicadaException.class)
    public ResponseEntity<Map<String, String>> handleCitaDuplicada(CitaDuplicadaException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Cita duplicada");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(FechaAnteriorException.class)
    public ResponseEntity<Map<String, String>> handleFechaAnterior(FechaAnteriorException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Fecha invalida");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(RegistroNoEncontrado.class)
    public ResponseEntity<Map<String, String>> handleCitaNoEncontrada(RegistroNoEncontrado ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Registro no encontrado");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(CamposRequeridos.class)
    public ResponseEntity<Map<String, String>> handleCamposRequeridos(CamposRequeridos ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Campo requerido");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(CancelarCitaException.class)
    public ResponseEntity<Map<String, String>> handleCancelarCita(CancelarCitaException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Falló al  cancelar la cita");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(ServicioDuplicadoException.class)
    public ResponseEntity<Map<String, String>> handleServicioDuplicado(ServicioDuplicadoException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Servicio duplicado");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(LimteCitasException.class)
    public ResponseEntity<Map<String, String>> handleLimiteCitas(LimteCitasException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Se alcanzo el limite de citas");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(EstatusInvalidoException.class)
    public ResponseEntity<Map<String, String>> handleEstatusInvalido(EstatusInvalidoException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Estatus invalido");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }
}
