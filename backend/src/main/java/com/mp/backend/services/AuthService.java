package com.mp.backend.services;

import com.mp.backend.models.Usuario;
import com.mp.backend.repositories.UsuarioRepository;
import com.mp.backend.utils.JwtTokenUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * 📌 **Servicio de Autenticación (`AuthService`)**
 *
 * Maneja el registro y autenticación de usuarios en la aplicación.
 * ✅ Registrar un usuario con contraseña segura (`registerUser`).
 * ✅ Autenticar un usuario verificando email y contraseña (`authenticate`).
 * ✅ Generar un token JWT tras autenticación (`generateToken`).
 */
@Service
public class AuthService {

    private final UsuarioRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil; // 🔥 Se agrega JwtTokenUtil para generar tokens JWT
    private final AuthenticationManager authenticationManager;

    /**
     * 🔹 **Constructor del servicio**
     *
     * @param userRepository Repositorio de usuarios.
     * @param passwordEncoder Utilidad para encriptar y verificar contraseñas.
     * @param jwtTokenUtil Utilidad para manejar tokens JWT.
     * @param authenticationManager Manejador de autenticación de Spring Security.
     */
    public AuthService(
        UsuarioRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtTokenUtil jwtTokenUtil,
        AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
        this.authenticationManager = authenticationManager;
    }

    /**
     * 📌 **Registrar un nuevo usuario con contraseña encriptada**
     *
     * - Verifica si el email ya está registrado.
     * - Encripta la contraseña antes de guardarla.
     * - Guarda el usuario en la base de datos.
     *
     * @param usuario Datos del usuario a registrar.
     * @return Usuario guardado en la base de datos.
     * @throws RuntimeException Si el email ya está registrado.
     */
    public Usuario registerUser(Usuario usuario) {
        if (userRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado.");
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        // 💡 Log para verificar que la contraseña fue cifrada correctamente
        System.out.println("🔐 Contraseña encriptada antes de guardar: " + usuario.getPassword());

        return userRepository.save(usuario);
    }

    /**
     * 📌 **Autenticar usuario con email y contraseña**
     *
     * - Usa `AuthenticationManager` de Spring para validar credenciales.
     * - Si la autenticación es exitosa, genera un token JWT.
     *
     * @param email Email del usuario.
     * @param rawPassword Contraseña en texto plano ingresada.
     * @return `Optional<String>` con el token JWT si la autenticación es exitosa.
     */
    public Optional<String> authenticate(String email, String rawPassword) {
        try {
            // 🔐 Autenticamos usando Spring Security
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, rawPassword)
            );

            // 📄 Si pasa la autenticación, buscamos el usuario y generamos token
            Usuario usuario = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            return Optional.of(jwtTokenUtil.generateToken(usuario));

        } catch (Exception e) {
            // ⚠️ Fallo de autenticación (credenciales inválidas)
            System.err.println("❌ Error de autenticación: " + e.getMessage());
            return Optional.empty();
        }
    }
}
