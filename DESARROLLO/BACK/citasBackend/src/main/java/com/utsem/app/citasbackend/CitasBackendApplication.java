package com.utsem.app.citasbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CitasBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(CitasBackendApplication.class, args);
    }

}
