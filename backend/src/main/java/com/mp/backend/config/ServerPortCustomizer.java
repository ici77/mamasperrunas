package com.mp.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.server.ConfigurableWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.stereotype.Component;

@Component
public class ServerPortCustomizer implements WebServerFactoryCustomizer<ConfigurableWebServerFactory> {

    @Value("${PORT:8080}") // Usa la variable de entorno PORT, si no existe usa 8080
    private int port;

    @Override
    public void customize(ConfigurableWebServerFactory factory) {
        factory.setPort(port);
    }
}
