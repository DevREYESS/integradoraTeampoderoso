package com.utsem.app.citasbackend.controller;

import com.utsem.app.citasbackend.dto.HorarioDTO;
import com.utsem.app.citasbackend.dto.MesRequest;
import com.utsem.app.citasbackend.dto.RangoFechasRequest;
import com.utsem.app.citasbackend.service.HorarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/horarios")
public class HorariosController {

    @Autowired
    private HorarioService horarioService;

    @PostMapping("/rango")
    public ResponseEntity<List<HorarioDTO>> buscarPorRangoFechas (@RequestBody RangoFechasRequest request) {
        return ResponseEntity.ok(horarioService.buscarPorRangoFechas(request.getFechaInicio(), request.getFechaFin()));
    }

    @PostMapping("/mes")
    public ResponseEntity<List<HorarioDTO>> buscarPorMes(@RequestBody MesRequest request) {
        return ResponseEntity.ok(horarioService.buscarPorMes(request.getAño(), request.getMes()));
    }
}
