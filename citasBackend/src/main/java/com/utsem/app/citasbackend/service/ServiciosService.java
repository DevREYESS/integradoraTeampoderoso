package com.utsem.app.citasbackend.service;

import com.utsem.app.citasbackend.dto.ServicioDTO;
import com.utsem.app.citasbackend.model.Servicio;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiciosService {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Servicio> filtrar(ServicioDTO servicioDTO) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Servicio> query = cb.createQuery(Servicio.class);
        Root<Servicio> root = query.from(Servicio.class);

        Predicate predicate = cb.conjunction();

        if (servicioDTO.getNombreServicio() != null && !servicioDTO.getNombreServicio().isEmpty()) {
            predicate = cb.and(predicate, cb.like(root.get("nombreServicio"), "%" + servicioDTO.getNombreServicio() + "%"));
        }

        query.where(predicate);

        return entityManager.createQuery(query).getResultList();
    }
}
