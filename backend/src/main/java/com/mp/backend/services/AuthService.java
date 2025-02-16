package com.mp.backend.services;

import com.mp.backend.models.Usuario;
import com.mp.backend.repositories.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * 📌 **Servicio de Autenticación (`AuthService`)**
 *
 * Este servicio maneja el registro y la autenticación de usuarios en la aplicación.
 * Se encarga de guardar nuevos usuarios con contraseñas encriptadas y verificar credenciales.
 *
 * 🔹 **Funciones Principales:**
 * - Registrar un usuario con contraseña segura (`registerUser`).
 * - Autenticar un usuario verificando su email y contraseña (`authenticate`).
 */
@Service
public class AuthService {

    private final UsuarioRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 🔹 **Constructor del servicio**
     *
     * @param userRepository Repositorio para acceder a los usuarios en la base de datos.
     * @param passwordEncoder Utilidad para encriptar y verificar contraseñas.
     */
    public AuthService(UsuarioRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 📌 **Registrar un nuevo usuario**
     *
     * - Encripta la contraseña del usuario antes de guardarlo en la base de datos.
     * - Guarda el usuario en la base de datos usando `UsuarioRepository`.
     *
     * @param usuario Objeto `Usuario` con los datos de registro.
     * @return `Usuario` guardado en la base de datos.
     */
    public Usuario registerUser(Usuario usuario) {
        // Encriptar la contraseña antes de guardar el usuario
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return userRepository.save(usuario);
    }

    /**
     * 📌 **Autenticar un usuario**
     *
     * - Busca un usuario en la base de datos por su email.
     * - Compara la contraseña ingresada con la almacenada en la base de datos.
     * - Si las credenciales son correctas, devuelve el usuario autenticado.
     *
     * @param email Email del usuario.
     * @param rawPassword Contraseña en texto plano ingresada por el usuario.
     * @return `Optional<Usuario>` con el usuario autenticado si las credenciales son válidas.
     */
    public Optional<Usuario> authenticate(String email, String rawPassword) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    boolean passwordMatch = passwordEncoder.matches(rawPassword, user.getPassword());
                    System.out.println("Comparación de contraseñas: " + passwordMatch);
                    System.out.println("Contraseña ingresada: " + rawPassword);
                    System.out.println("Contraseña almacenada: " + user.getPassword());
                    return passwordMatch ? user : null;
                })
                .filter(user -> user != null);
    }
}
