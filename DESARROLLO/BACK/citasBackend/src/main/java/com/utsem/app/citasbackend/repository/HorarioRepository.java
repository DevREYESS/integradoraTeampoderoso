package com.utsem.app.citasbackend.repository;

import com.utsem.app.citasbackend.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {

    List<Horario> findByFechaBetweenOrderByFechaAsc(LocalDate fechaInicio, LocalDate fechaFin);

    @Query("SELECT h FROM Horario h WHERE YEAR(h.fecha) = :year AND MONTH(h.fecha) = :month ORDER BY h.fecha")
    List<Horario> findByYearAndMonth(@Param("year") int year, @Param("month") int month);

}
