package com.mp.backend.utils;

import com.mp.backend.models.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 📌 **Utilidad para manejo de Tokens JWT (`JwtTokenUtil`)**
 *
 * Esta clase se encarga de generar, extraer y validar tokens JWT utilizados en la autenticación de usuarios.
 *
 * 🔹 **Funciones Principales:**
 * ✅ Generar un token JWT con información del usuario.
 * ✅ Extraer el email de un token JWT.
 * ✅ Verificar si un token ha expirado.
 */
@Component
public class JwtTokenUtil {

    /** 🔐 Clave secreta segura (se obtiene desde `application.properties`). */
    @Value("${jwt.secret}")
    private String secretKey;

    /** ⏳ Tiempo de expiración del token: 24 horas (en milisegundos). */
    private final long expirationTime = 1000 * 60 * 60 * 24;  

    /**
     * 📌 **Genera un token JWT usando los datos del usuario.**
     *
     * - Incluye ID, email, rol, nombre y foto de perfil del usuario.
     * - El token tiene una duración de 24 horas.
     *
     * @param usuario Objeto `Usuario` con los datos a incluir en el token.
     * @return `String` con el token JWT generado.
     */
    public String generateToken(Usuario usuario) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", usuario.getId());
        claims.put("email", usuario.getEmail());
        claims.put("rol", usuario.getRol());
        claims.put("nombre", usuario.getNombre());
        claims.put("foto_perfil", usuario.getFotoPerfil());

        // Crear la clave segura con HMAC SHA256
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(usuario.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS256)  // Firmar con SHA256
                .compact();
    }
    /**
 * 📌 Valida un token JWT comparando su email con el del usuario y verificando si ha expirado.
 *
 * @param token   Token JWT a validar.
 * @param usuario Usuario autenticado esperado.
 * @return `true` si el token es válido, `false` si no.
 */
public boolean validateToken(String token, Usuario usuario) {
    String email = getEmailFromToken(token);
    return email != null && email.equals(usuario.getEmail()) && !isTokenExpired(token);
}



    /**
     * 📌 **Extrae el email de un token JWT.**
     *
     * - Se usa para identificar al usuario autenticado a partir del token.
     *
     * @param token Token JWT del cual se extraerá el email.
     * @return `String` con el email del usuario o `null` si el token es inválido.
     */
    public String getEmailFromToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            System.err.println("⚠️ Error al extraer email del token: " + e.getMessage());
            return null;
        }
    }

    /**
     * 📌 **Verifica si un token JWT ha expirado.**
     *
     * - Extrae la fecha de expiración del token y la compara con la fecha actual.
     *
     * @param token Token JWT a validar.
     * @return `boolean` `true` si el token ha expirado, `false` si aún es válido.
     */
    public boolean isTokenExpired(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            System.err.println("⚠️ Error al verificar expiración del token: " + e.getMessage());
            return true;
        }
    }
}
