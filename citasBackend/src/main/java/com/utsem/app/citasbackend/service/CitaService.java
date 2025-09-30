package com.utsem.app.citasbackend.service;

import com.utsem.app.citasbackend.dto.CitaDTO;
import com.utsem.app.citasbackend.model.Cita;
import com.utsem.app.citasbackend.repository.CitaRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Service;

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

        query.where(predicate);

        return entityManager.createQuery(query).getResultList();
    }

    public Cita crearCita(CitaDTO citaDTO) {
        Cita cita = new Cita();
        cita.setTelefono(citaDTO.getTelefono());
        cita.setEstatus(citaDTO.getEstatus());
        cita.setNombrePaciente(citaDTO.getNombrePaciente());
        cita.setHorario(citaDTO.getHorario());
        cita.setServicio(citaDTO.getServicio());
        cita.setUuid(UUID.randomUUID());

        return citaRepository.save(cita);
    }
}
