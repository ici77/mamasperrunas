package com.mp.backend.utils;

import com.mp.backend.models.Usuario;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Clase para manejo de Tokens JWT (generar, extraer email, validar).
 */
@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey secretKey;

    private final long expirationTime = 1000 * 60 * 60 * 24; // 24 horas

    /**
     * ✅ Inicializa la clave una vez leída del archivo de configuración.
     */
    @PostConstruct
    public void init() {
        try {
            if (secret.length() < 32) {
                throw new IllegalArgumentException("La clave secreta JWT debe tener al menos 32 caracteres.");
            }
            this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            System.err.println("❌ Error al inicializar JwtTokenUtil: " + e.getMessage());
        }
    }

    public String generateToken(Usuario usuario) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", usuario.getId());
        claims.put("email", usuario.getEmail());
        claims.put("rol", usuario.getRol());
        claims.put("nombre", usuario.getNombre());
        claims.put("foto_perfil", usuario.getFotoPerfil());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(usuario.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token, Usuario usuario) {
        String email = getEmailFromToken(token);
        return email != null && email.equals(usuario.getEmail()) && !isTokenExpired(token);
    }

    public String getEmailFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            System.err.println("❌ Error al extraer email del token: " + e.getMessage());
            return null;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            System.err.println("❌ Error al verificar expiración del token: " + e.getMessage());
            return true;
        }
    }
}
