package com.utsem.app.citasbackend.service;

import com.utsem.app.citasbackend.dto.ServicioDTO;
import com.utsem.app.citasbackend.exceptions.ServicioDuplicadoException;
import com.utsem.app.citasbackend.model.Servicio;
import com.utsem.app.citasbackend.repository.ServicioRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ServiciosService {

    @PersistenceContext
    private EntityManager entityManager;

    private final ServicioRepository servicioRepository;

    @Autowired
    public ServiciosService(ServicioRepository servicioRepository) {
        this.servicioRepository = servicioRepository;
    }

    public List<Servicio> filtrar(ServicioDTO servicioDTO) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Servicio> query = cb.createQuery(Servicio.class);
        Root<Servicio> root = query.from(Servicio.class);

        Predicate predicate = cb.conjunction();

        if (servicioDTO.getNombreServicio() != null && !servicioDTO.getNombreServicio().isEmpty()) {
            predicate = cb.and(predicate, cb.like(root.get("nombreServicio"), "%" + servicioDTO.getNombreServicio() + "%"));
        }

        if (servicioDTO.getcolor() != null && !servicioDTO.getcolor().isEmpty()) {
            predicate = cb.and(predicate, cb.equal(root.get("color"), servicioDTO.getcolor()));
        }

        if (servicioDTO.getDuracion() != null && servicioDTO.getDuracion() > 0) {
            predicate = cb.and(predicate, cb.equal(root.get("duracion"), servicioDTO.getDuracion()));
        }

        query.where(predicate);

        return entityManager.createQuery(query).getResultList();
    }

    public Servicio saveServicioo(Servicio servicio) {
        return servicioRepository.save(servicio);
    }

    public Servicio saveServicio(Servicio servicio) {
        if (servicioRepository.existsByNombreServicio(servicio.getNombreServicio())) {
            throw new ServicioDuplicadoException(
                    "Ya existe un servicio con el nombre: " + servicio.getNombreServicio()
            );
        }

        if (servicioRepository.existsBycolor(servicio.getcolor())) {
            throw new ServicioDuplicadoException(
                    "Ya existe un servicio con el mismo color "
            );
        }

        return servicioRepository.save(servicio);
    }

    public void deleteServicio(UUID uuid) {
        servicioRepository.findByServicioUuid(uuid).ifPresent(servicioRepository::delete);
    }

    public Optional<Servicio> updateServicio(UUID uuid, Servicio servicioActualizado) {
        if (servicioRepository.existsByNombreServicioAndServicioUuidNot(servicioActualizado.getNombreServicio(),uuid)) {
            throw new ServicioDuplicadoException(
                    "Ya existe otro servicio con el nombre: " + servicioActualizado.getNombreServicio()
            );
        }

        if (servicioRepository.existsByColorAndServicioUuidNot(servicioActualizado.getcolor(),uuid)) {
            throw new ServicioDuplicadoException(
                    "Ya existe otro servicio con el mismo color "
            );
        }

        return servicioRepository.findByServicioUuid(uuid)
                .map(servicioExistente -> {
                    servicioExistente.setNombreServicio(servicioActualizado.getNombreServicio());
                    servicioExistente.setDuracion(servicioActualizado.getDuracion());
                    servicioExistente.setcolor(servicioActualizado.getcolor());
                    return servicioRepository.save(servicioExistente);
                });
    }


}
