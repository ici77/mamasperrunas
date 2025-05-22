package com.mp.backend.repositories;

import com.mp.backend.models.Evento;
import com.mp.backend.models.Usuario;
import com.mp.backend.models.UsuarioEvento;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);

   
}

