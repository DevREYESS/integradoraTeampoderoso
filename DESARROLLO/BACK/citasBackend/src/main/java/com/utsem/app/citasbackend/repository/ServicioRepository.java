package com.utsem.app.citasbackend.repository;

import com.utsem.app.citasbackend.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ServicioRepository extends JpaRepository <Servicio, Long>{
    Optional<Servicio> findByServicioUuid(UUID servicioUuid);
}
