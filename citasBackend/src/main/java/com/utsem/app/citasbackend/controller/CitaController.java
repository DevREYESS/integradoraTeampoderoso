package com.utsem.app.citasbackend.controller;

import com.utsem.app.citasbackend.dto.CitaDTO;
import com.utsem.app.citasbackend.model.Cita;
import com.utsem.app.citasbackend.service.CitaService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/citas")
public class CitaController {

    private final CitaService citaService;

    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    @PostMapping("sCita")
    public List<Cita> consultarCita(@RequestBody CitaDTO citaDTO) {
        return citaService.findCita(citaDTO);
    }

    @PostMapping("/saveCita")
    public Cita crearCita(@RequestBody CitaDTO citaDTO) {
        return citaService.crearCita(citaDTO);
    }
}
