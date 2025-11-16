package com.utsem.app.citasbackend.service;

import com.utsem.app.citasbackend.model.Cita;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class WhatsAppService {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppService.class);

    @Value("${whatsapp.api.url}")
    private String apiUrl;

    @Value("${whatsapp.api.phone-number-id}")
    private String phoneNumberId;

    @Value("${whatsapp.api.access-token}")
    private String accessToken;

    @Value("${whatsapp.api.template.confirmacion}")
    private String platillaConfirmacionCita;

    @Value("${whatsapp.api.template.actualizacion}")
    private String plantillaActualizacionCita;

    @Value("${whatsapp.api.template.cancelacion}")
    private String platillaCancelacionCita;

    @Value("${whatsapp.api.template.recordatorio}")
    private String platillaRecordatorioCita;

    @Value("${whatsapp.api.template-language}")
    private String templateLanguage;

    private final RestTemplate restTemplate;

    // Formateadores de fecha y hora
    private static final DateTimeFormatter FECHA_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter HORA_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    public WhatsAppService() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(10000);
        requestFactory.setReadTimeout(10000);
        this.restTemplate = new RestTemplate(requestFactory);
    }

    /**
     * Envía confirmación de cita por WhatsApp
     */
    public void enviarConfirmacionCita(Cita cita,String tipoMensaje) {
        try {
            String numeroFormateado = formatearNumero(cita.getTelefono());
            enviarMensaje(numeroFormateado, cita, tipoMensaje);
            log.info("WhatsApp enviado exitosamente a {} para cita {}",
                    numeroFormateado, cita.getUuid());
        } catch (Exception e) {
            log.error("Error al enviar WhatsApp a {} para cita {}: {}",
                    cita.getTelefono(), cita.getUuid(), e.getMessage());
        }
    }

    /**
     * Envía mensaje de cancelación por WhatsApp
     */
    public void enviarCancelacionCita(Cita cita) {
        try {
            String numeroFormateado = formatearNumero(cita.getTelefono());
            enviarMensaje(numeroFormateado, cita, "cancelacion" );
            log.info("Notificación de cancelación enviada a {}", numeroFormateado);
        } catch (Exception e) {
            log.error("Error al enviar notificación de cancelación a {}: {}",
                    cita.getTelefono(), e.getMessage());
        }
    }

    public void enviarRecordatorioCita(Cita cita) {
        try {
            String numeroFormateado = formatearNumero(cita.getTelefono());
            enviarMensaje(numeroFormateado, cita, "recordatorio" );
            log.info("Notificación de cancelación enviada a {}", numeroFormateado);
        } catch (Exception e) {
            log.error("Error al enviar notificación de cancelación a {}: {}",
                    cita.getTelefono(), e.getMessage());
        }
    }

    /**
     * Envía el mensaje a través de la API de WhatsApp
     */
    private void enviarMensaje(String numeroDestino, Cita cita, String tipoMensaje) {
        String url = String.format("%s/%s/messages", apiUrl, phoneNumberId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        Map<String, Object> body = construirCuerpoMensaje(numeroDestino, cita, tipoMensaje);

        log.debug("Enviando mensaje a WhatsApp: {}", body);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            log.info("Respuesta de WhatsApp API [{}]: {}",
                    response.getStatusCode(), response.getBody());
        } catch (Exception e) {
            log.error("Error en llamada a API de WhatsApp: ", e);
            throw e;
        }
    }

    /**
     * Construye el cuerpo del mensaje con la plantilla y parámetros
     */
    private Map<String, Object> construirCuerpoMensaje(String numeroDestino, Cita cita, String tipoMensaje) {
        Map<String, Object> body = new HashMap<>();
        body.put("messaging_product", "whatsapp");
        body.put("to", numeroDestino);
        body.put("type", "template");

        Map<String, Object> template = new HashMap<>();
        if (tipoMensaje.equalsIgnoreCase("confirmacion")) {
            template.put("name", platillaConfirmacionCita);
        } else if (tipoMensaje.equalsIgnoreCase("actualizacion")) {
            template.put("name", plantillaActualizacionCita);
        } else if (tipoMensaje.equalsIgnoreCase("cancelacion")) {
            template.put("name", platillaCancelacionCita);
        } else if (tipoMensaje.equalsIgnoreCase("recordatorio")) {
            template.put("name", platillaRecordatorioCita);
        }

        Map<String, String> language = new HashMap<>();
        language.put("code", templateLanguage);
        template.put("language", language);

        // Agregar componentes con parámetros
        List<Map<String, Object>> components = new ArrayList<>();

        // Componente BODY con parámetros
        Map<String, Object> bodyComponent = new HashMap<>();
        bodyComponent.put("type", "body");

        List<Map<String, String>> parameters = new ArrayList<>();

        // Parámetro 1: Nombre del paciente
        parameters.add(crearParametro(cita.getNombrePaciente()));

        // Opcional para la plantilla de recordatorio
        if (!tipoMensaje.equalsIgnoreCase("recordatorio")) {
            // Parámetro 2: Fecha formateada
            String fechaFormateada = cita.getFechaCita().format(FECHA_FORMATTER);
            parameters.add(crearParametro(fechaFormateada));
        }

        // Parámetro 3: Hora formateada
        String horaFormateada = cita.getHoraInicio().format(HORA_FORMATTER);
        parameters.add(crearParametro(horaFormateada));

        // Parámetro 4: Nombre del servicio
        String nombreServicio = cita.getServicio() != null ?
                cita.getServicio().getNombreServicio() : "Consulta";
        parameters.add(crearParametro(nombreServicio));

        bodyComponent.put("parameters", parameters);
        components.add(bodyComponent);

        template.put("components", components);
        body.put("template", template);

        return body;
    }

    /**
     * Crea un parámetro de texto para la plantilla
     */
    private Map<String, String> crearParametro(String valor) {
        Map<String, String> parametro = new HashMap<>();
        parametro.put("type", "text");
        parametro.put("text", valor);
        return parametro;
    }

    /**
     * Formatea el número de teléfono al formato requerido por WhatsApp
     * Ejemplo: 7291562213 -> 527291562213
     */
    private String formatearNumero(String numero) {
        if (numero == null || numero.isEmpty()) {
            throw new IllegalArgumentException("El número de teléfono no puede estar vacío");
        }

        // Remover espacios, guiones, paréntesis, etc.
        String limpio = numero.replaceAll("[^0-9]", "");

        // Si ya tiene código de país (52), retornar
        if (limpio.startsWith("52") && limpio.length() == 12) {
            return limpio;
        }

        // Si es número de 10 dígitos (México), agregar código 52
        if (limpio.length() == 10) {
            return "52" + limpio;
        }

        // Si no cumple ningún formato esperado, lanzar excepción
        throw new IllegalArgumentException(
                "Número de teléfono inválido: " + numero +
                        ". Debe ser de 10 dígitos o incluir código de país 52"
        );
    }
}