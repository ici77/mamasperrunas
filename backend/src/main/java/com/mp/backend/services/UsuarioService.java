package com.mp.backend.services;

import com.mp.backend.models.Usuario;
import com.mp.backend.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario registrarUsuario(Usuario usuario) {
        // Verificar si el email ya está en uso
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(usuario.getEmail());
        if (usuarioExistente.isPresent()) {
            throw new DataIntegrityViolationException("El email ya está registrado.");
        }

        // Asignar imagen de perfil predeterminada si no se proporcionó una
        if (usuario.getFotoPerfil() == null || usuario.getFotoPerfil().trim().isEmpty()) {
            usuario.setFotoPerfil("/assets/images/avatar.png");  // URL de imagen por defecto
        }

        // Guardar el usuario si no hay duplicados
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }
}
