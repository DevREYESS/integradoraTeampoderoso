package com.utsem.app.citasbackend.controller;

import com.utsem.app.citasbackend.dto.ServicioDTO;
import com.utsem.app.citasbackend.model.Servicio;
import com.utsem.app.citasbackend.service.ServiciosService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/servicios")
public class ServicioController {

    private final ServiciosService serviciosService;

    public ServicioController(ServiciosService serviciosService) {
        this.serviciosService = serviciosService;
    }

    @PostMapping("/filtrar")
    public List<Servicio> filtrar(@RequestBody ServicioDTO servicioDTO) {
        return serviciosService.filtrar(servicioDTO);
    }
}
