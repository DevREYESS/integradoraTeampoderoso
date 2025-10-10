package com.utsem.app.citasbackend.model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "servicios")
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long servicioId;

    @Column(nullable = false, unique = false, updatable = false, name = "servicio_uuid")
    private UUID servicioUuid;

    @Column(nullable = false, name = "nombre_servicio")
    private String nombreServicio;

    @Column(nullable = false)
    private String duracion;

    @Column(nullable = false)
    private String prioridad;

    public Long getServicioId() {
        return servicioId;
    }

    public void setServicioId(Long servicioId) {
        this.servicioId = servicioId;
    }

    public UUID getServicioUuid() {
        return servicioUuid;
    }

    public void setServicioUuid(UUID servicioUuid) {
        this.servicioUuid = servicioUuid;
    }

    public String getNombreServicio() {
        return nombreServicio;
    }

    public void setNombreServicio(String nombreServicio) {
        this.nombreServicio = nombreServicio;
    }

    public String getDuracion() {
        return duracion;
    }

    public void setDuracion(String duracion) {
        this.duracion = duracion;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }
}
