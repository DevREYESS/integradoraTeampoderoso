package com.utsem.app.citasbackend.dto;

import java.util.List;

public class LoginResponse {
    private String mensaje;
    private List<String> roles;

    public LoginResponse(String mensaje, List<String> roles) {
        this.mensaje = mensaje;
        this.roles = roles;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}