package com.utsem.app.citasbackend.service;

import com.utsem.app.citasbackend.dto.CitaDTO;
import com.utsem.app.citasbackend.dto.CitaResponseDTO;
import com.utsem.app.citasbackend.exceptions.*;
import com.utsem.app.citasbackend.model.Cita;
import com.utsem.app.citasbackend.model.Servicio;
import com.utsem.app.citasbackend.repository.CitaRepository;
import com.utsem.app.citasbackend.repository.ServicioRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class CitaService {

    private final CitaRepository citaRepository;
    private final ServicioRepository servicioRepository;
    private final WhatsAppService whatsAppService;

    @PersistenceContext
    private EntityManager entityManager;

    public CitaService(
            CitaRepository citaRepository,
            ServicioRepository servicioRepository,
            WhatsAppService whatsAppService
    ) {
        this.citaRepository = citaRepository;
        this.servicioRepository = servicioRepository;
        this.whatsAppService = whatsAppService;
    }

    public List<CitaResponseDTO> findCita(CitaDTO citaDTO) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<CitaResponseDTO> query = cb.createQuery(CitaResponseDTO.class);
        Root<Cita> root = query.from(Cita.class);

        // JOIN con Servicio
        Join<Cita, Servicio> servicioJoin = root.join("servicio", JoinType.LEFT);

        // Proyección al DTO - el orden debe coincidir con el constructor
        query.select(cb.construct(
                CitaResponseDTO.class,
                cb.literal("Búsqueda exitosa"),
                root.get("telefono"),
                root.get("estatus"),
                root.get("nombrePaciente"),
                root.get("fechaCita"),
                root.get("horaInicio"),
                root.get("horaFin"),
                servicioJoin.get("nombreServicio"),
                servicioJoin.get("servicioId"),
                servicioJoin.get("color"),
                root.get("uuid")
        ));

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
            predicate = cb.and(predicate, cb.equal(root.get("horaInicio"), citaDTO.getHoraInicio()));
        }

        // Filtro por servicioId
        if (citaDTO.getServicioId() != null) {
            predicate = cb.and(predicate, cb.equal(servicioJoin.get("id"), citaDTO.getServicioId()));
        }

        // Manejo de fechas
        if (citaDTO.getFechaInicio() != null && citaDTO.getFechaFin() != null) {
            predicate = cb.and(predicate,
                    cb.between(root.get("fechaCita"), citaDTO.getFechaInicio(), citaDTO.getFechaFin())
            );
        } else if (citaDTO.getFechaCita() != null) {
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
                predicate = cb.and(predicate, cb.equal(root.get("fechaCita"), citaDTO.getFechaCita()));
            }
        }

        query.where(predicate);
        query.orderBy(cb.asc(root.get("fechaCita")));

        return entityManager.createQuery(query).getResultList();
    }
    public CitaResponseDTO crearCita(CitaDTO citaDTO) {
        validarFechaCita(citaDTO.getFechaCita());
        validarLimiteCitasPorDia(citaDTO.getTelefono(), citaDTO.getFechaCita());
        validarSolapamiento(citaDTO, null);

        Cita nuevaCita = crearEntidadCita(citaDTO);
        Cita citaGuardada = citaRepository.save(nuevaCita);

        // Enviar confirmación por WhatsApp
        try {
            whatsAppService.enviarConfirmacionCita(citaGuardada, "confirmacion");
        } catch (Exception e) {
            // Log pero no fallar - la cita ya está guardada
            System.err.println("Advertencia: Cita creada pero WhatsApp falló: " + e.getMessage());
        }

        return construirRespuesta(citaGuardada, "Cita registrada correctamente");
    }

    public CitaResponseDTO actualizarCita(CitaDTO citaDTO, String uuid) {
        Cita citaExistente = citaRepository.findByUuid(UUID.fromString(uuid))
                .orElseThrow(() -> new RegistroNoEncontrado("Cita no encontrada"));

        Servicio servicio = servicioRepository.findById(citaDTO.getServicioId())
                .orElseThrow(() -> new RegistroNoEncontrado("El servicio con ID " + citaDTO.getServicioId() + " no existe"));

        if ((citaExistente.getEstatus().equalsIgnoreCase("f") ||
                citaExistente.getEstatus().equalsIgnoreCase("c"))
                && citaDTO.getEstatus().equalsIgnoreCase("a")
        ) {
            throw new EstatusInvalidoException("No se puede activar una cita finalizada o cancelada. ");
        }

        validarFechaCita(citaDTO.getFechaCita());
        validarSolapamiento(citaDTO, UUID.fromString(uuid));

        citaExistente.setFechaCita(citaDTO.getFechaCita());
        citaExistente.setHoraInicio(citaDTO.getHoraInicio());
        citaExistente.setHoraFin(citaDTO.getHoraFin());
        citaExistente.setNombrePaciente(citaDTO.getNombrePaciente());
        citaExistente.setTelefono(citaDTO.getTelefono());
        citaExistente.setEstatus(citaDTO.getEstatus());
        citaExistente.setServicio(servicio);

        Cita citaActualizada = citaRepository.save(citaExistente);

        // Enviar notificación de actualización
        try {
            whatsAppService.enviarConfirmacionCita(citaActualizada, "actualizacion");
        } catch (Exception e) {
            System.err.println("Advertencia: Cita actualizada pero WhatsApp falló: " + e.getMessage());
        }

        return construirRespuesta(citaActualizada, "Cita actualizada correctamente");
    }


    private void validarFechaCita(LocalDate fechaCita) {
        LocalDate fechaMinima = LocalDate.now().plusDays(1);
        if (fechaCita.isBefore(LocalDate.now())) {
            throw new FechaAnteriorException("No se puede registrar una cita en una fecha anterior a la actual.");
        } else if (fechaCita.isBefore(fechaMinima)) {
            throw new FechaAnteriorException("La cita debe agendarse con al menos un día de anticipación");
        }
    }

    private void validarSolapamiento(CitaDTO citaDTO, UUID uuid) {
        LocalDate fechaCita = citaDTO.getFechaCita();
        LocalTime inicioNueva = citaDTO.getHoraInicio();
        LocalTime finNueva = citaDTO.getHoraFin();

        List<Cita> citasDelDia = citaRepository.findByFechaCita(fechaCita);

        if (citasDelDia.isEmpty()) {
            return;
        }

        for (Cita citaExistente : citasDelDia) {
            // Si es la misma cita (actualización), ignorar
            if (uuid != null && citaExistente.getUuid().equals(uuid)) {
                continue;
            }

            // Solo validar citas activas (estatus 'A')
            if (!"A".equals(citaExistente.getEstatus())) {
                continue;
            }

            LocalTime inicioExistente = citaExistente.getHoraInicio();
            LocalTime finExistente = citaExistente.getHoraFin();

            boolean seSolapa = inicioNueva.isBefore(finExistente) && finNueva.isAfter(inicioExistente);

            if (seSolapa) {
                throw new CitaDuplicadaException(
                        String.format("Ya existe una cita que se solapa con este horario. " +
                                        "Cita existente: %s - %s",
                                inicioExistente, finExistente)
                );
            }
        }
    }

    private void validarLimiteCitasPorDia(String telefono, LocalDate fechaCita) {
        // Contar citas del mismo teléfono en ese día
        long cantidadCitas = citaRepository.countByTelefonoAndFechaCita(
                telefono,
                fechaCita
        );

        if (cantidadCitas >= 4) {
            throw new LimteCitasException(
                    String.format("Ya se alcanzó el límite de 4 citas por día para el número de teléfono %s ", telefono)
            );
        }
    }

    private Cita crearEntidadCita(CitaDTO dto) {

        if (dto.getServicioId() == null) {
            throw new CamposRequeridos("El ID del servicio es requerido");
        }


        Servicio servicio = servicioRepository.findById(dto.getServicioId())
                .orElseThrow(() -> new RegistroNoEncontrado("El servicio con ID " + dto.getServicioId() + " no existe"));

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

    private CitaResponseDTO construirRespuesta(Cita cita, String mensaje) {
        return new CitaResponseDTO(
                mensaje,
                cita.getTelefono(),
                cita.getEstatus(),
                cita.getNombrePaciente(),
                cita.getFechaCita(),
                cita.getHoraInicio(),
                cita.getHoraFin(),
                cita.getServicio().getNombreServicio(),
                cita.getServicio().getServicioId(),
                cita.getServicio().getcolor(),
                cita.getUuid()
        );
    }

    public CitaResponseDTO cancelarCita(String uuid) {
        Cita citaExistente = citaRepository.findByUuid(UUID.fromString(uuid))
                .orElseThrow(() -> new RegistroNoEncontrado("Cita no encontrada"));

        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime citaDateTime = citaExistente.getFechaCita().atTime(citaExistente.getHoraInicio());

        if (citaExistente.getFechaCita().isBefore(LocalDate.now())) {
            throw new CancelarCitaException("No se puede cancelar una cita en una fecha anterior a la actual");
        }

        if (citaDateTime.isBefore(ahora.plusHours(24))) {
            throw new CancelarCitaException("No se puede cancelar con menos de 24 horas de anticipación");
        }

        // Enviar notificación de cancelación antes de eliminar
        try {
            whatsAppService.enviarCancelacionCita(citaExistente);
        } catch (Exception e) {
            System.err.println("Advertencia: Cita cancelada pero WhatsApp falló: " + e.getMessage());
        }

        // Eliminar la cita de la base de datos
        citaRepository.delete(citaExistente);

        return construirRespuesta(citaExistente, "Cita cancelada");
    }

}
