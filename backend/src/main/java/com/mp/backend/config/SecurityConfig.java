package com.mp.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * 📌 **Configuración de Seguridad (`SecurityConfig`)**
 *
 * - Define el filtro de seguridad para la aplicación.
 * - Configura rutas públicas y protegidas.
 * - Habilita la encriptación de contraseñas con `BCryptPasswordEncoder`.
 * - Habilita CORS para permitir peticiones desde el frontend (Angular).
 */
@Configuration
public class SecurityConfig {

    /**
     * 📌 **Filtro de seguridad**
     *
     * - Habilita CORS para permitir peticiones desde el frontend.
     * - Desactiva CSRF (para permitir peticiones desde Angular sin tokens CSRF).
     * - Permite acceso público a `/api/usuarios/registro`, `/api/usuarios/login` y `/api/posts/**`.
     * - Protege las rutas que requieren autenticación.
     *
     * @param http Configuración de seguridad de Spring.
     * @return `SecurityFilterChain`
     */
    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ CORS Configurado
        .csrf(csrf -> csrf.disable()) // ❌ Deshabilitamos CSRF para evitar bloqueos
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/usuarios/registro", "/api/usuarios/login").permitAll() // ✅ Login y registro accesibles
            .requestMatchers("/api/posts/**").permitAll() // ✅ Permitir acceso público a los posts
            .anyRequest().authenticated() // 🔒 Bloquear el resto sin autenticación
        )
        .logout(logout -> logout.permitAll());  // ✅ Permitir logout

    return http.build();
}


    /**
     * 📌 **Bean para encriptar contraseñas**
     *
     * - Utiliza BCrypt para encriptar contraseñas antes de almacenarlas.
     * - Se usa en `AuthService` para encriptar y verificar contraseñas.
     *
     * @return `PasswordEncoder`
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 📌 **Configuración CORS**
     *
     * - Permite peticiones desde el frontend Angular (`http://localhost:4200`).
     * - Habilita métodos `GET`, `POST`, `PUT`, `DELETE`, y `OPTIONS`.
     * - Permite enviar `Authorization` y `Content-Type` en los headers.
     * - Habilita `Allow-Credentials` para manejar autenticación con cookies o sesiones.
     *
     * @return `CorsConfigurationSource`
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200")); // ✅ Ajustar si el frontend está en otro puerto o dominio
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true); // ✅ Permitir credenciales en la autenticación

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
