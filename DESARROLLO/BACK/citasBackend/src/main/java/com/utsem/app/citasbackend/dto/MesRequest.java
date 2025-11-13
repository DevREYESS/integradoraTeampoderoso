package com.utsem.app.citasbackend.dto;

public class MesRequest {
    private int año;
    private int mes;

    // Constructor por defecto
    public MesRequest() {}

    // Getters y setters
    public int getAño() {
        return año;
    }

    public void setAño(int año) {
        this.año = año;
    }

    public int getMes() {
        return mes;
    }

    public void setMes(int mes) {
        this.mes = mes;
    }
}