package com.utsem.app.citasbackend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class CitaResponseDTO {

    private String mensaje;
    private String nombrePaciente;
    private LocalTime horaIncio;
    private LocalDate fechaCita;

    public CitaResponseDTO(String mensaje, String nombrePaciente, LocalDate fechaCita, LocalTime horaIncio) {
        this.mensaje = mensaje;
        this.nombrePaciente = nombrePaciente;
        this.fechaCita = fechaCita;
        this.horaIncio = horaIncio;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getNombrePaciente() {
        return nombrePaciente;
    }

    public void setNombrePaciente(String nombrePaciente) {
        this.nombrePaciente = nombrePaciente;
    }

    public LocalTime getHoraIncio() {
        return horaIncio;
    }

    public void setHoraIncio(LocalTime horaIncio) {
        this.horaIncio = horaIncio;
    }

    public LocalDate getFechaCita() {
        return fechaCita;
    }

    public void setFechaCita(LocalDate fechaCita) {
        this.fechaCita = fechaCita;
    }
}
