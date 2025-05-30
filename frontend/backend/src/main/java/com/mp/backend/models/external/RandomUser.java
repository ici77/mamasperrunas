package com.mp.backend.models.external;

/**
 * 📌 **Clase RandomUser**
 *
 * Representa un usuario aleatorio con información básica, incluyendo nombre, email y foto de perfil.
 * 
 * 🔹 **Campos:**
 * - `name`: Contiene el primer nombre y apellido del usuario.
 * - `email`: Dirección de correo electrónico.
 * - `picture`: URL de la imagen de perfil del usuario.
 */
public class RandomUser {

    /** Nombre del usuario (incluye primer nombre y apellido). */
    private Name name;

    /** Correo electrónico del usuario. */
    private String email;

    /** Foto de perfil del usuario. */
    private Picture picture;

    /**
     * 📌 **Obtiene el nombre del usuario.**
     * 
     * @return Objeto `Name` con el nombre del usuario.
     */
    public Name getName() {
        return name;
    }

    /**
     * 📌 **Establece el nombre del usuario.**
     * 
     * @param name Objeto `Name` a asignar.
     */
    public void setName(Name name) {
        this.name = name;
    }

    /**
     * 📌 **Obtiene el correo electrónico del usuario.**
     * 
     * @return Email del usuario.
     */
    public String getEmail() {
        return email;
    }

    /**
     * 📌 **Establece el correo electrónico del usuario.**
     * 
     * @param email Email a asignar.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * 📌 **Obtiene la imagen de perfil del usuario.**
     * 
     * @return Objeto `Picture` con la URL de la foto de perfil.
     */
    public Picture getPicture() {
        return picture;
    }

    /**
     * 📌 **Establece la imagen de perfil del usuario.**
     * 
     * @param picture Objeto `Picture` con la URL de la foto de perfil.
     */
    public void setPicture(Picture picture) {
        this.picture = picture;
    }
}
