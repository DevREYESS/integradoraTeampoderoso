package com.utsem.app.citasbackend.repository;

import com.utsem.app.citasbackend.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ServicioRepository extends JpaRepository <Servicio, Long>{
    Optional<Servicio> findByServicioUuid(UUID servicioUuid);

    boolean existsByNombreServicio(String nombreServicio);
    boolean existsBycolor(String color);
    boolean existsByNombreServicioAndServicioUuidNot(String nombreServicio, UUID servicioUuid);
    boolean existsByColorAndServicioUuidNot(String color, UUID servicioUuid);

}
