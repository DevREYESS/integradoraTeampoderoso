package com.utsem.app.citasbackend.repository;

import com.utsem.app.citasbackend.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {

    Optional<Cita> findByUuid(UUID uuid);

    List<Cita> findByFechaCitaAndHoraInicioAndHoraFin(LocalDate fechaCita,LocalTime horaInicio, LocalTime horaFin);

    @Query("SELECT c FROM Cita c WHERE c.fechaCita = :fecha AND c.horaInicio BETWEEN :horaInicio AND :horaFin AND c.recordatorioEnviado = false AND c.estatus = 'A' ")
    List<Cita> findCitasParaRecordatorio(@Param("fecha") LocalDate fecha,
                                         @Param("horaInicio") LocalTime horaInicio,
                                         @Param("horaFin") LocalTime horaFin);

    List<Cita> findByFechaCita(LocalDate fechaCita);
}
