package com.mp.backend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;

/**
 * 📌 **Entidad Usuario**
 * 
 * Representa a un usuario dentro del sistema. Cada usuario tiene un nombre, 
 * email, contraseña encriptada, foto de perfil y un rol determinado.
 * 
 * 🔹 **Anotaciones JPA**:
 * - `@Entity`: Define la clase como una entidad JPA.
 * - `@Table(name = "usuarios")`: Especifica la tabla en la base de datos.
 * 
 * 🔹 **Validaciones**:
 * - `@NotBlank`: El campo no puede estar vacío.
 * - `@Size`: Define restricciones de longitud en los campos.
 * - `@Email`: Valida que el email tenga un formato correcto.
 * 
 * 🔹 **Valores por defecto**:
 * - El rol por defecto es `"USER"`.
 */
@Entity
@Table(name = "usuarios")
public class Usuario {

    /** Identificador único del usuario (clave primaria). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nombre del usuario (obligatorio, entre 2 y 50 caracteres). */
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @Column(nullable = false)
    private String nombre;

    /** Correo electrónico del usuario (único y obligatorio). */
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Debe proporcionar un email válido")
    @Column(unique = true, nullable = false)
    private String email;

    
    /** Contraseña encriptada del usuario. */
@NotBlank(message = "La contraseña es obligatoria")
@Column(nullable = false, length = 255)  // 🔹 Permitir almacenamiento de contraseñas encriptadas
private String password;


    /** URL de la foto de perfil del usuario. */
    @Column(name = "foto_perfil")
    private String fotoPerfil;

    /** Rol del usuario (por defecto, "USER"). */
    @Column(nullable = false, length = 50)
    private String rol = "USER";  // 🔹 Asignamos el rol por defecto en la clase Java

    /**
     * 🔹 **Constructor vacío (obligatorio para JPA)**.
     * Se asigna automáticamente el rol `"USER"`.
     */
    public Usuario() {
        this.rol = "USER";
    }

    /**
     * 🔹 **Constructor sin contraseña** (Para evitar almacenar texto plano).
     * 
     * @param nombre Nombre del usuario.
     * @param email Email del usuario.
     * @param fotoPerfil URL de la foto de perfil.
     */
    public Usuario(String nombre, String email, String fotoPerfil) {
        this.nombre = nombre;
        this.email = email;
        this.fotoPerfil = fotoPerfil;
        this.rol = "USER";
    }

    // Getters y Setters

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

    /**
     * 🔐 **Setter para contraseña encriptada**
     * 
     * - Este método solo debe ser llamado desde `AuthService`.
     * 
     * @param password Contraseña encriptada.
     */
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

    /**
     * 📌 **Método `toString()`**
     * 
     * Devuelve una representación en cadena del objeto usuario.
     * 
     * @return String con los datos principales del usuario.
     */
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
}
