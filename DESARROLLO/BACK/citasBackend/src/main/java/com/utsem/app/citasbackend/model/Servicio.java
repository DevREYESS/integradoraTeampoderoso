package com.utsem.app.citasbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "servicios")
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false, name = "servicio_id")
    private Long servicioId;

    @Column(nullable = false, unique = true, updatable = false, name = "servicio_uuid")
    private UUID servicioUuid;

    @Column(nullable = false, name = "nombre_servicio")
    private String nombreServicio;

    @Column(nullable = false)
    private int duracion;

    @Column(nullable = false)
    private String color;

    @OneToMany(mappedBy = "servicio", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Cita> citas;

    @PrePersist
    public void prePersist() {
        if (this.servicioUuid == null) {
            this.servicioUuid = UUID.randomUUID();
        }
    }

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

    public int getDuracion() {
        return duracion;
    }

    public void setDuracion(int duracion) {
        this.duracion = duracion;
    }

    public String getcolor() {
        return color;
    }

    public void setcolor(String color) {
        this.color = color;
    }

    public List<Cita> getCitas() { return citas; }
    public void setCitas(List<Cita> citas) { this.citas = citas; }
}
