package com.utsem.app.citasbackend.service;

import com.utsem.app.citasbackend.dto.CitaDTO;
import com.utsem.app.citasbackend.model.Cita;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CitaService {

    @PersistenceContext
    private EntityManager entityManager;

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
}
