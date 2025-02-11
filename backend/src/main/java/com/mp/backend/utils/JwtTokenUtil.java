package com.mp.backend.utils;

import com.mp.backend.models.Usuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenUtil {

    private final String secretKey = "mamasperrunasSecretKeymamasperrunasSecretKey";  // Longitud mínima de 32 caracteres
    private final SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
    private final long expirationTime = 1000 * 60 * 60 * 24;  // Expira en 1 día (24 horas)

    /**
     * Genera un token JWT usando los datos del usuario.
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
     * Extrae el email del token JWT.
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
     * Verifica si el token ha expirado.
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
