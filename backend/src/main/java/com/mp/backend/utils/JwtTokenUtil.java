package com.mp.backend.utils;

import com.mp.backend.models.Usuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 📌 **Utilidad para manejo de Tokens JWT (`JwtTokenUtil`)**
 *
 * Esta clase se encarga de generar, extraer y validar tokens JWT utilizados en la autenticación de usuarios.
 * 
 * 🔹 **Funciones Principales:**
 * - Generar un token JWT con información del usuario.
 * - Extraer el email de un token JWT.
 * - Verificar si un token ha expirado.
 */
@Component
public class JwtTokenUtil {

    /** Clave secreta para firmar los tokens JWT (mínimo 32 caracteres). */
    private final String secretKey = "mamasperrunasSecretKeymamasperrunasSecretKey";  

    /** Clave generada a partir de la clave secreta para firmar el token. */
    private final SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

    /** Tiempo de expiración del token: 24 horas (en milisegundos). */
    private final long expirationTime = 1000 * 60 * 60 * 24;  

    /**
     * 📌 **Genera un token JWT usando los datos del usuario.**
     *
     * - Se incluyen en el token datos clave como el ID, email, rol, nombre y foto de perfil del usuario.
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
        claims.put("nombre", usuario.getNombre());  // Agregamos el nombre al token
        claims.put("foto_perfil", usuario.getFotoPerfil());  // Agregamos la foto de perfil

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(usuario.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key)  // Usando la clave segura
                .compact();
    }

    /**
     * 📌 **Extrae el email de un token JWT.**
     *
     * - Se usa para identificar al usuario autenticado a partir del token.
     *
     * @param token Token JWT del cual se extraerá el email.
     * @return `String` con el email del usuario.
     */
    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
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
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date());
    }
}
