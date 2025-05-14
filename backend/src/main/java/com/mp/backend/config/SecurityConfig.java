package com.mp.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ CORS configurado
            .csrf(csrf -> csrf.disable()) // ❌ CSRF deshabilitado
            .authorizeHttpRequests(auth -> auth
    // Usuarios
    .requestMatchers("/api/usuarios/registro", "/api/usuarios/login").permitAll()

    // Eventos
    .requestMatchers(HttpMethod.GET, "/api/eventos/**").permitAll()
    .requestMatchers(HttpMethod.POST, "/api/eventos").authenticated()

    // Posts y categorías (foro)
    .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/posts/category/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/replies/post/**").permitAll()

    // Swagger (documentación)
    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**").permitAll()

    // Resto requiere autenticación
    .anyRequest().authenticated()
)

        // ✅ Permitir autenticación y autorización para el endpoint de autenticación
        .formLogin(form -> form
            .loginProcessingUrl("/api/login")
            .permitAll()
        )
            


            .logout(logout -> logout.permitAll()); // ✅ Permitir logout

        // ✅ Agregar el filtro JWT ANTES del filtro por defecto de Spring
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
