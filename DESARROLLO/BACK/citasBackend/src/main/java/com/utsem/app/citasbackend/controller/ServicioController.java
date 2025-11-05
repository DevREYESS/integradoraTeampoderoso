package com.utsem.app.citasbackend.controller;

import com.utsem.app.citasbackend.dto.ResponseDTO;
import com.utsem.app.citasbackend.dto.ServicioDTO;
import com.utsem.app.citasbackend.model.Servicio;
import com.utsem.app.citasbackend.repository.ServicioRepository;
import com.utsem.app.citasbackend.service.ServiciosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/servicios")
public class ServicioController {

    private final ServiciosService serviciosService;
    private final ServicioRepository servicioRepository;

    public ServicioController(ServiciosService serviciosService, ServicioRepository servicioRepository) {
        this.serviciosService = serviciosService;
        this.servicioRepository = servicioRepository;
    }


    @PostMapping("/filtrar")
    public List<Servicio> filtrar(@RequestBody ServicioDTO servicioDTO) {
        return serviciosService.filtrar(servicioDTO);
    }

    @PostMapping("/saveService")
    public ResponseEntity<Servicio> crear(@RequestBody Servicio servicio) {
        return ResponseEntity.ok(serviciosService.saveServicio(servicio));
    }

    @PutMapping("/updateService/{uuid}")
    public ResponseEntity<Servicio> actualizar(@PathVariable UUID uuid, @RequestBody Servicio servicio) {
        return serviciosService.updateServicio(uuid, servicio)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/deleteService/{uuid}")
    public ResponseEntity<ResponseDTO> eliminar(@PathVariable UUID uuid) {
        try {
            Optional<Servicio> servicio = servicioRepository.findByServicioUuid(uuid);
            if (servicio.isPresent()) {
                serviciosService.deleteServicio(uuid);
                return ResponseEntity.ok(new ResponseDTO("Servicio eliminado correctamente", true));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO("No se encontró el servicio con el UUID proporcionado", false));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO("Error al eliminar el servicio: " + e.getMessage(), false));
        }
    }


}
