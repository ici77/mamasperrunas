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
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))  // Configuración CORS
            .csrf(csrf -> csrf.disable())  // CSRF deshabilitado para API REST
            .authorizeHttpRequests(auth -> auth
                // Permitir acceso público a la raíz y archivos estáticos (uploads)
                .requestMatchers("/", "/index.html", "/favicon.ico").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                
                // Rutas públicas
                .requestMatchers("/api/usuarios/registro", "/api/usuarios/login").permitAll()
                .requestMatchers("/api/holamundo").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/eventos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/posts/category/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/replies/post/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**").permitAll()
                
                // Rutas que requieren autenticación
                .requestMatchers("/api/usuarios/cambiar-password").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/eventos/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/eventos/*/cancelar").authenticated()
                .requestMatchers("/api/posts/crear-con-imagen").authenticated()
                
                // Cualquier otra ruta requiere autenticación
                .anyRequest().authenticated()
            )
            .logout(logout -> logout.permitAll());

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

        // Usamos AllowedOriginPatterns para aceptar localhost y front Railway
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:4200",
            "https://mamasperrunas-production-3dae.up.railway.app",
             "https://*.up.railway.app"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
        config.setAllowCredentials(true);
        

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
