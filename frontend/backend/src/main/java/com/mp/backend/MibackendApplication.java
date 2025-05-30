package com.mp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EntityScan("com.mp.backend.models")
@SpringBootApplication
@EnableConfigurationProperties
public class MibackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(MibackendApplication.class, args);
    }
}
