package com.utsem.app.citasbackend.service;

import com.utsem.app.citasbackend.dto.CitaDTO;
import com.utsem.app.citasbackend.dto.CitaResponseDTO;
import com.utsem.app.citasbackend.exceptions.CitaDuplicadaException;
import com.utsem.app.citasbackend.exceptions.FechaAnteriorException;
import com.utsem.app.citasbackend.model.Cita;
import com.utsem.app.citasbackend.model.Servicio;
import com.utsem.app.citasbackend.repository.CitaRepository;
import com.utsem.app.citasbackend.repository.ServicioRepository;
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
    private final ServicioRepository servicioRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public CitaService(
            CitaRepository citaRepository,
            ServicioRepository servicioRepository
    ) {
        this.citaRepository = citaRepository;
        this.servicioRepository = servicioRepository;
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

        if (citaDTO.getHoraInicio() != null) {
            predicate = cb.and(predicate, cb.equal(root.get("horaInicio"),citaDTO.getHoraInicio()));
        }

        if (citaDTO.getFechaCita() != null) {

            if (citaDTO.getSoloMes() != null && citaDTO.getSoloMes()) {

                predicate = cb.and(predicate, cb.equal(
                        cb.function("MONTH", Integer.class, root.get("fechaCita")),
                        citaDTO.getFechaCita().getMonthValue()
                ));

            } else if (citaDTO.getSoloDia() != null && citaDTO.getSoloDia()) {

                predicate = cb.and(predicate, cb.equal(
                        cb.function("DAY", Integer.class, root.get("fechaCita")),
                        citaDTO.getFechaCita().getDayOfMonth()
                ));

            } else {

                predicate = cb.and(predicate, cb.equal(root.get("fechaCita"),citaDTO.getFechaCita()));

            }

        }

        query.where(predicate);
        query.orderBy(cb.asc(root.get("fechaCita")));

        return entityManager.createQuery(query).getResultList();
    }

    public CitaResponseDTO crearCita(CitaDTO citaDTO) {
        validarFechaCita(citaDTO.getFechaCita());
        validarSolapamiento(citaDTO);

        Cita nuevaCita = crearEntidadCita(citaDTO);
        Cita citaGuardada = citaRepository.save(nuevaCita);

        return construirRespuesta(citaGuardada);
    }


    private void validarFechaCita(LocalDate fechaCita) {
        LocalDate fechaMinima = LocalDate.now().plusDays(1);
        if (fechaCita.isBefore(LocalDate.now())) {
            throw new FechaAnteriorException("No se puede registrar una cita en una fecha anterior a la actual.");
        } else if (fechaCita.isBefore(fechaMinima)) {
            throw new FechaAnteriorException("La cita debe agendarse con al menos un día de anticipación");
        }
    }

    private void validarSolapamiento(CitaDTO citaDTO) {
        LocalDate fechaCita = citaDTO.getFechaCita();
        LocalTime inicioNueva = citaDTO.getHoraInicio();
        LocalTime finNueva = citaDTO.getHoraFin();

        List<Cita> citasExistentes = citaRepository.findByFechaCitaAndHoraInicioAndHoraFin(
                fechaCita, inicioNueva, finNueva
        );

        for (Cita cita : citasExistentes) {
            boolean seSolapa = inicioNueva.isBefore(cita.getHoraFin()) && finNueva.isAfter(cita.getHoraInicio());
            if (seSolapa) {
                throw new CitaDuplicadaException("Ya existe una cita que se solapa con este horario.");
            }
        }
    }

    private Cita crearEntidadCita(CitaDTO dto) {

        if (dto.getServicioId() == null) {
            throw new IllegalArgumentException("El ID del servicio es requerido");
        }


        Servicio servicio = servicioRepository.findById(dto.getServicioId())
                .orElseThrow(() -> new IllegalArgumentException("El servicio con ID " + dto.getServicioId() + " no existe"));

        Cita cita = new Cita();
        cita.setTelefono(dto.getTelefono());
        cita.setEstatus(dto.getEstatus());
        cita.setNombrePaciente(dto.getNombrePaciente());
        cita.setHoraInicio(dto.getHoraInicio());
        cita.setHoraFin(dto.getHoraFin());
        cita.setFechaCita(dto.getFechaCita());
        cita.setServicio(servicio);
        cita.setUuid(UUID.randomUUID());
        return cita;
    }

    private CitaResponseDTO construirRespuesta(Cita cita) {
        return new CitaResponseDTO(
                "Cita registrada correctamente",
                cita.getNombrePaciente(),
                cita.getFechaCita(),
                cita.getHoraInicio(),
                cita.getServicio().getNombreServicio()
        );
    }

}
