package com.mp.backend.dto;

import com.mp.backend.models.forum.Post;
import com.mp.backend.models.Evento;

import java.util.List;

public class PerfilUsuarioDTO {

    private String nombre;
    private String email;
    private String fotoPerfil;
    private String gustos;

    private List<Post> postsCreados;
    private List<Post> postsLike;
    private List<Post> postsFavoritos;

    private List<Evento> eventosCreados;
    private List<Evento> eventosInscrito;

    private EstadisticasDTO estadisticas;

    // Getters y Setters

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public String getGustos() {
        return gustos;
    }

    public void setGustos(String gustos) {
        this.gustos = gustos;
    }

    public List<Post> getPostsCreados() {
        return postsCreados;
    }

    public void setPostsCreados(List<Post> postsCreados) {
        this.postsCreados = postsCreados;
    }

    public List<Post> getPostsLike() {
        return postsLike;
    }

    public void setPostsLike(List<Post> postsLike) {
        this.postsLike = postsLike;
    }

    public List<Post> getPostsFavoritos() {
        return postsFavoritos;
    }

    public void setPostsFavoritos(List<Post> postsFavoritos) {
        this.postsFavoritos = postsFavoritos;
    }

    public List<Evento> getEventosCreados() {
        return eventosCreados;
    }

    public void setEventosCreados(List<Evento> eventosCreados) {
        this.eventosCreados = eventosCreados;
    }

    public List<Evento> getEventosInscrito() {
        return eventosInscrito;
    }

    public void setEventosInscrito(List<Evento> eventosInscrito) {
        this.eventosInscrito = eventosInscrito;
    }

    public EstadisticasDTO getEstadisticas() {
        return estadisticas;
    }

    public void setEstadisticas(EstadisticasDTO estadisticas) {
        this.estadisticas = estadisticas;
    }
}
