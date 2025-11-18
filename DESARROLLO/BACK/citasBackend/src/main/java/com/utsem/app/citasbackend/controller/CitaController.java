package com.utsem.app.citasbackend.controller;

import com.utsem.app.citasbackend.dto.CitaDTO;
import com.utsem.app.citasbackend.dto.CitaResponseDTO;
import com.utsem.app.citasbackend.model.Cita;
import com.utsem.app.citasbackend.service.CitaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/citas")
public class CitaController {

    private final CitaService citaService;

    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    @PostMapping("/sCita")
    public List<CitaResponseDTO> consultarCita(@RequestBody CitaDTO citaDTO) {
        return citaService.findCita(citaDTO);
    }

    @PostMapping("/saveCita")
    public CitaResponseDTO crearCita(@RequestBody CitaDTO citaDTO) {
        return citaService.crearCita(citaDTO);
    }

    @PutMapping("/uCita/{uuid}")
    public CitaResponseDTO actualizarCita(@RequestBody CitaDTO citaDTO, @PathVariable String uuid) {
        return citaService.actualizarCita(citaDTO, uuid);
    }

    @DeleteMapping("/{uuid}")
    public CitaResponseDTO cancelarCita(@PathVariable String uuid) {
        return citaService.cancelarCita(uuid);
    }
}
