package com.utsem.app.citasbackend.service;

import com.utsem.app.citasbackend.dto.CitaDTO;
import com.utsem.app.citasbackend.dto.CitaResponseDTO;
import com.utsem.app.citasbackend.exceptions.CitaDuplicadaException;
import com.utsem.app.citasbackend.model.Cita;
import com.utsem.app.citasbackend.repository.CitaRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class CitaService {

    private final CitaRepository citaRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public CitaService(CitaRepository citaRepository) {
        this.citaRepository = citaRepository;
    }

    public List<Cita> findCita(CitaDTO citaDTO) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Cita> query = cb.createQuery(Cita.class);
        Root<Cita> root = query.from(Cita.class);

        Predicate predicate = cb.conjunction();

        if (citaDTO.getTelefono() != null && !citaDTO.getTelefono().isEmpty()) {
            predicate = cb.and(predicate, cb.like(root.get("telefono"), "%" + citaDTO.getTelefono() + "%"));
        }

        if (citaDTO.getEstatus() != null && !citaDTO.getEstatus().isEmpty()) {
            predicate = cb.and(predicate, cb.like(root.get("estatus"), "%" + citaDTO.getEstatus() + "%"));
        }

        if (citaDTO.getNombrePaciente() != null && !citaDTO.getNombrePaciente().isEmpty()) {
            predicate = cb.and(predicate, cb.like(root.get("nombrePaciente"), "%" + citaDTO.getNombrePaciente() + "%"));
        }

        query.where(predicate);

        return entityManager.createQuery(query).getResultList();
    }

    public CitaResponseDTO crearCita(CitaDTO citaDTO) {
        LocalDate fechaCita = citaDTO.getFechaCita();
        LocalTime inicioNueva = citaDTO.getHoraInicio();
        LocalTime finNueva = citaDTO.getHoraFin();

        List<Cita> citasExistentes = citaRepository.findByFechaCitaAndHoraInicioAndHoraFin(fechaCita, inicioNueva, finNueva);

        for (Cita cita : citasExistentes) {
            LocalTime inicioExistente = cita.getHoraInicio();
            LocalTime finExistente = cita.getHoraFin();

            boolean seSolapa = inicioNueva.isBefore(finExistente) && finNueva.isAfter(inicioExistente);
            if (seSolapa) {
                throw new CitaDuplicadaException("Ya existe una cita que se solapa con este horario ");
            }
        }

        Cita cita = new Cita();
        cita.setTelefono(citaDTO.getTelefono());
        cita.setEstatus(citaDTO.getEstatus());
        cita.setNombrePaciente(citaDTO.getNombrePaciente());
        cita.setHoraInicio(citaDTO.getHoraInicio());
        cita.setHoraFin(citaDTO.getHoraFin());
        cita.setFechaCita(citaDTO.getFechaCita());
        cita.setServicio(citaDTO.getServicio());
        cita.setUuid(UUID.randomUUID());

        Cita nueva = citaRepository.save(cita);

        return new CitaResponseDTO(
                "Cita registrada correctamente",
                nueva.getNombrePaciente(),
                nueva.getFechaCita(),
                nueva.getHoraInicio()
        );

    }
}
