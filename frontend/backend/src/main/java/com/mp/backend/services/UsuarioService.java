package com.mp.backend.services;

import com.mp.backend.models.Usuario;
import com.mp.backend.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

/**
 * 📌 **Servicio UsuarioService**
 *
 * Este servicio maneja las operaciones relacionadas con la gestión de usuarios, 
 * incluyendo el registro, cambio de contraseña y consulta de usuarios.
 */
@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 🔹 **Constructor del servicio**
     */
    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 📌 **Registrar un nuevo usuario**
     */
    public Usuario registrarUsuario(Usuario usuario) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(usuario.getEmail());
        if (usuarioExistente.isPresent()) {
            throw new DataIntegrityViolationException("El email ya está registrado.");
        }

        if (usuario.getFotoPerfil() == null || usuario.getFotoPerfil().trim().isEmpty()) {
            usuario.setFotoPerfil("/assets/images/avatar.png");
        }

        return usuarioRepository.save(usuario);
    }

    /**
     * 📌 **Cambiar contraseña del usuario autenticado**
     */
    public boolean cambiarPassword(String email, String actual, String nueva) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        if (usuario == null) return false;

        if (!passwordEncoder.matches(actual, usuario.getPassword())) return false;

        usuario.setPassword(passwordEncoder.encode(nueva));
        usuarioRepository.save(usuario);
        return true;
    }

    /**
     * 📌 **Listar todos los usuarios**
     */
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }
}
