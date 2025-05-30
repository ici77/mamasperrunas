package com.mp.backend.services;

import com.mp.backend.models.Usuario;
import com.mp.backend.repositories.UsuarioRepository;
import com.mp.backend.utils.JwtTokenUtil;
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

    /**
     * 🔹 **Constructor del servicio**
     *
     * @param userRepository Repositorio de usuarios.
     * @param passwordEncoder Utilidad para encriptar y verificar contraseñas.
     * @param jwtTokenUtil Utilidad para manejar tokens JWT.
     */
    public AuthService(UsuarioRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenUtil jwtTokenUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
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

        System.out.println("🔐 Contraseña encriptada antes de guardar: " + usuario.getPassword());

        return userRepository.save(usuario);
    }

    /**
     * 📌 **Autenticar usuario con email y contraseña**
     *
     * - Busca el usuario por email en la base de datos.
     * - Compara la contraseña ingresada con la almacenada en la base de datos.
     * - Si la contraseña es correcta, genera un **token JWT**.
     *
     * @param email Email del usuario.
     * @param rawPassword Contraseña en texto plano ingresada.
     * @return `Optional<String>` con el token JWT si la autenticación es exitosa.
     */
    public Optional<String> authenticate(String email, String rawPassword) {
        return userRepository.findByEmail(email)
            .filter(user -> {
                // 🔍 LOGS DE DEPURACIÓN
                System.out.println("🔍 Buscando usuario con email: " + email);
                System.out.println("🗄 Usuario encontrado: " + user);
                System.out.println("🔐 Contraseña ingresada: " + rawPassword);
                System.out.println("🗄 Contraseña almacenada (encriptada): " + user.getPassword());

                boolean passwordMatch = passwordEncoder.matches(rawPassword, user.getPassword());

                System.out.println("✅ ¿Coincide la contraseña?: " + passwordMatch);

                return passwordMatch;
            })
            .map(jwtTokenUtil::generateToken); // ✅ Generar el token si la autenticación es exitosa
    }
}
