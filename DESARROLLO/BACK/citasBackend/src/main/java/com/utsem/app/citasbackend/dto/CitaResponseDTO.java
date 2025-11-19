package com.utsem.app.citasbackend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class CitaResponseDTO {

    private String mensaje;
    private String telefono;
    private String estatus;
    private String nombrePaciente;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private LocalDate fechaCita;
    private String nombreServicio;
    private Long servicioId;

    public CitaResponseDTO(String mensaje, String telefono, String estatus, String nombrePaciente, LocalDate fechaCita, LocalTime horaInicio, LocalTime horaFin, String nombreServicio, Long servicioId) {
        this.mensaje = mensaje;
        this.telefono = telefono;
        this.estatus = estatus;
        this.nombrePaciente = nombrePaciente;
        this.fechaCita = fechaCita;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.nombreServicio = nombreServicio;
        this.servicioId = servicioId;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getTelefono() { return telefono; }

    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getEstatus() { return estatus; }

    public void setEstatus(String estatus) { this.estatus = estatus; }

    public String getNombrePaciente() {
        return nombrePaciente;
    }

    public void setNombrePaciente(String nombrePaciente) {
        this.nombrePaciente = nombrePaciente;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() { return horaFin; }

    public void setHoraFin(LocalTime horaFin) { this.horaFin = horaFin; }

    public LocalDate getFechaCita() {
        return fechaCita;
    }

    public void setFechaCita(LocalDate fechaCita) {
        this.fechaCita = fechaCita;
    }

    public String getNombreServicio() {
        return nombreServicio;
    }

    public void setNombreServicio(String nombreServicio) {
        this.nombreServicio = nombreServicio;
    }

    public Long getServicioId() {
        return servicioId;
    }

    public void setServicioId(Long servicioId) {
        this.servicioId = servicioId;
    }
}
