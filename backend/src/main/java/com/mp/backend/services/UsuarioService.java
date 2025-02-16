package com.mp.backend.services;

import com.mp.backend.models.Usuario;
import com.mp.backend.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Optional;

/**
 * 📌 **Servicio UsuarioService**
 *
 * Este servicio maneja las operaciones relacionadas con la gestión de usuarios, 
 * incluyendo el registro y la consulta de usuarios.
 *
 * 🔹 **Funciones Principales:**
 * - Registrar un usuario validando que el email no esté duplicado.
 * - Listar todos los usuarios registrados en la base de datos.
 */
@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    /**
     * 🔹 **Constructor del servicio**
     *
     * @param usuarioRepository Repositorio para manejar la persistencia de usuarios.
     */
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * 📌 **Registrar un nuevo usuario**
     *
     * - Verifica que el email no esté registrado previamente.
     * - Si el usuario no proporciona una foto de perfil, se le asigna una por defecto.
     * - Guarda el usuario en la base de datos utilizando `UsuarioRepository`.
     *
     * @param usuario Objeto `Usuario` con los datos de registro.
     * @return `Usuario` registrado en la base de datos.
     * @throws DataIntegrityViolationException Si el email ya está registrado.
     */
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

    /**
     * 📌 **Listar todos los usuarios**
     *
     * - Recupera y devuelve la lista completa de usuarios almacenados en la base de datos.
     *
     * @return `List<Usuario>` con todos los usuarios registrados.
     */
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }
}
