package com.utsem.app.citasbackend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class HorarioDTO {

    private LocalDate fecha;
    private int dia;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    public HorarioDTO(LocalDate fecha, int dia, LocalTime horaInicio, LocalTime horaFin) {
        this.fecha = fecha;
        this.dia = dia;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public int getDia() {
        return dia;
    }

    public void setDia(int dia) {
        this.dia = dia;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }
}
