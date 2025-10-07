package com.utsem.app.citasbackend.repository;

import com.utsem.app.citasbackend.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {

    Cita findByUuid(UUID uuid);

    List<Cita> findByTelefonoAndHorario(String telefono, String horario);

    List<Cita> findByServicio(String servicio);

}
