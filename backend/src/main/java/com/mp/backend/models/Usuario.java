package com.mp.backend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Set;

import com.mp.backend.models.forum.Post;

import java.util.Collection;
import java.util.Collections;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@JsonIgnoreProperties({
    
    "descripcion", 
    "rol", 
    "postsFavoritos", 
    "authorities", 
    "username", 
    "accountNonExpired", 
    "accountNonLocked", 
    "credentialsNonExpired", 
    "enabled"
})

/**
 * 📌 Entidad Usuario
 */
@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Debe proporcionar un email válido")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "foto_perfil")
    private String fotoPerfil;

    @Column(nullable = false, length = 50)
    private String rol = "USER";

    @Column(length = 500)
    private String descripcion;

    // Constructores

    public Usuario() {
        this.rol = "USER";
    }

    public Usuario(String nombre, String email, String fotoPerfil) {
        this.nombre = nombre;
        this.email = email;
        this.fotoPerfil = fotoPerfil;
        this.rol = "USER";
    }

    // Getters y setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", email='" + email + '\'' +
                ", rol='" + rol + '\'' +
                ", fotoPerfil='" + fotoPerfil + '\'' +
                '}';
    }

    // 🔒 Implementación de UserDetails

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList(); // o puedes mapear roles aquí si los usas
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
    @Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Usuario usuario = (Usuario) o;
    return email.equals(usuario.email); // Usamos email como identificador único
}

@Override
public int hashCode() {
    return email.hashCode();
}


    @ManyToMany(mappedBy = "usuariosQueLoGuardaron")
private Set<Post> postsFavoritos = new java.util.HashSet<>();

}
