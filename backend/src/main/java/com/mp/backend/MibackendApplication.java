package com.mp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@EntityScan("com.backend.model")

@SpringBootApplication
@EnableConfigurationProperties
public class MibackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(MibackendApplication.class, args);
    }
}

