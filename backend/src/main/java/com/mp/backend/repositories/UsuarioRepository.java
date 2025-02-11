package com.mp.backend.repositories;

import com.mp.backend.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método para buscar por email
    Optional<Usuario> findByEmail(String email);
}
