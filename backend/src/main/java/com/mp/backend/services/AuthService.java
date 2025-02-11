package com.mp.backend.services;

import com.mp.backend.models.Usuario;
import com.mp.backend.repositories.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UsuarioRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registra un nuevo usuario en la base de datos con la contraseña encriptada.
     */
    public Usuario registerUser(Usuario usuario) {
        // Encriptar la contraseña antes de guardar el usuario
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return userRepository.save(usuario);
    }

    /**
     * Verifica si las credenciales del usuario (email y contraseña) son válidas.
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
