package com.utsem.app.citasbackend.repository;

import com.utsem.app.citasbackend.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {

    Cita findByUuid(UUID uuid);

    List<Cita> findByFechaCitaAndHoraInicioAndHoraFin(LocalDate fechaCita,LocalTime horaInicio, LocalTime horaFin);

    List<Cita> findByServicio(String servicio);

}
