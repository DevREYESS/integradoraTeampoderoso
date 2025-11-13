package com.utsem.app.citasbackend.service;

import com.utsem.app.citasbackend.dto.HorarioDTO;
import com.utsem.app.citasbackend.model.Horario;
import com.utsem.app.citasbackend.repository.HorarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HorarioService {

    @Autowired
    private HorarioRepository horarioRepository;

    public List<HorarioDTO> buscarPorRangoFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        return horarioRepository.findByFechaBetweenOrderByFechaAsc(fechaInicio, fechaFin)
                .stream()
                .map(h -> new HorarioDTO(h.getFecha(), h.getDia(), h.getHoraInicio(), h.getHoraFin()))
                .collect(Collectors.toList());
    }

    public List<HorarioDTO> buscarPorMes(int año, int mes) {
        return horarioRepository.findByYearAndMonth(año, mes)
                .stream()
                .map(h -> new HorarioDTO(h.getFecha(), h.getDia(), h.getHoraInicio(), h.getHoraFin()))
                .collect(Collectors.toList());
    }

}
