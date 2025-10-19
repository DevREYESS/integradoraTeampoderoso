package com.utsem.app.citasbackend.advice;

import com.utsem.app.citasbackend.exceptions.CitaDuplicadaException;
import com.utsem.app.citasbackend.exceptions.CitaNoEncontrada;
import com.utsem.app.citasbackend.exceptions.FechaAnteriorException;
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

    @ExceptionHandler(CitaNoEncontrada.class)
    public ResponseEntity<Map<String, String>> handleCitaNoEncontrada(CitaNoEncontrada ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Cita no encontrada");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }
}
