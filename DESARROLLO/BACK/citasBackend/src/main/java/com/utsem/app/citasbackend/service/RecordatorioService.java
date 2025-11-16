package com.utsem.app.citasbackend.service;

import com.utsem.app.citasbackend.model.Cita;
import com.utsem.app.citasbackend.repository.CitaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class RecordatorioService {

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private WhatsAppService whatsAppService;

    private static final Logger logger = LoggerFactory.getLogger(RecordatorioService.class);

    @Scheduled(fixedRate = 300000)
    public void enviarRecordatorios() {
        try {
            LocalDateTime ahora = LocalDateTime.now();

            LocalDate fechaManana = ahora.toLocalDate();
            LocalTime horaInicio = ahora.plusHours(1).toLocalTime();
            LocalTime horaFin = horaInicio.plusHours(2);

            //Si el rango pasa a otro dia, buscar tambien en el dia siguiente
            List<Cita> citas = new ArrayList<>();

            //Citas del dia actual
            citas.addAll(citaRepository.findCitasParaRecordatorio(fechaManana, horaInicio, LocalTime.of(23, 59)));

            //Si el rango pasa a otro dia buscar en el dia siguiente
            if (horaFin.isBefore(horaInicio)) {
                citas.addAll(citaRepository.findCitasParaRecordatorio(fechaManana.plusDays(1), LocalTime.of(0, 0), horaFin));
            } else {
                citas.addAll(citaRepository.findCitasParaRecordatorio(fechaManana, horaInicio, horaFin));
            }

            logger.info("Encontradas {} citas para recordatorio", citas.size());

            for (Cita cita : citas) {
                try {
                    whatsAppService.enviarRecordatorioCita(cita);

                    cita.setRecordatorioEnviado(true);
                    citaRepository.save(cita);

                    logger.info("Recordatorio enviado para cita ID: {} - Paciente: {}",
                            cita.getId(), cita.getNombrePaciente());
                } catch (Exception e) {
                    logger.error("Error al enviar recordatorio para cita ID: {} - Error: {}",
                            cita.getId(), e.getMessage());
                }
            }
        } catch (Exception e) {
            logger.error("Error en el proceso de envío de recordatorios: {}", e.getMessage());
        }
    }

}
