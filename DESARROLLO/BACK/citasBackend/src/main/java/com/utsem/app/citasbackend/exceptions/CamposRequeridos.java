package com.utsem.app.citasbackend.exceptions;

public class CamposRequeridos extends RuntimeException {
    public CamposRequeridos(String message) {
        super(message);
    }
}
