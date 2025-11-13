package com.utsem.app.citasbackend.dto;

import java.time.LocalDate;

public class RangoFechasRequest {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    // Constructor por defecto
    public RangoFechasRequest() {}

    // Getters y setters
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
}