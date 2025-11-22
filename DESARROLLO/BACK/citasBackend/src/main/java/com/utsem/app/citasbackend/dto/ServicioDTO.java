package com.utsem.app.citasbackend.dto;

public class ServicioDTO {
    private String servicioUuid;
    private String nombreServicio;
    private Integer duracion;
    private String color;

    public String getServicioUuid() {
        return servicioUuid;
    }

    public void setServicioUuid(String servicioUuid) {
        this.servicioUuid = servicioUuid;
    }

    public String getNombreServicio() {
        return nombreServicio;
    }

    public void setNombreServicio(String nombreServicio) {
        this.nombreServicio = nombreServicio;
    }

    public Integer getDuracion() { return duracion; }

    public void setDuracion(Integer duracion) {
        this.duracion = duracion;
    }

    public String getcolor() {
        return color;
    }

    public void setcolor(String color) {
        this.color = color;
    }
}
