package com.mp.backend.models;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * 📌 Entidad `Evento`
 * 
 * Representa un evento disponible en la plataforma, que puede ser gratuito o de pago.
 * Cada evento tiene un título, una descripción, una fecha, un lugar y una imagen asociada.
 * 
 * 🔹 Esta entidad se corresponde con la tabla `eventos` en la base de datos.
 */
@Entity
@Table(name = "eventos")
public class Evento {

    /**
     * Identificador único del evento (clave primaria).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Título del evento (por ejemplo: "Charla sobre bienestar animal").
     */
    private String titulo;

    /**
     * Descripción detallada del evento.
     */
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    @Column(nullable = false)
private boolean destacado;

public boolean isDestacado() {
    return destacado;
}

public void setDestacado(boolean destacado) {
    this.destacado = destacado;
}

@ManyToOne(optional = false)
@JoinColumn(name = "usuario_id", nullable = false)
private Usuario usuario;

public Usuario getUsuario() {
    return usuario;
}

public void setUsuario(Usuario usuario) {
    this.usuario = usuario;
}



    /**
     * Fecha en que se realizará el evento.
     */
    private LocalDate fecha;

    /**
     * Lugar físico o virtual donde se celebrará el evento.
     */
    private String lugar;

    /**
     * Indica si el evento es de pago (`true`) o gratuito (`false`).
     */
    private boolean esDePago;

    /**
     * URL de la imagen representativa del evento (opcional).
     */
    private String imagenUrl;

    /**
 * Categoría o tipo de evento (ej: celebraciones, solidarios, quedadas, etc.).
 */
@Column(nullable = false, length = 50)
private String tipoEvento;


    /**
     * Constructor vacío requerido por JPA.
     */
    public Evento() {}

    // 🔽 Getters y Setters

    /**
     * Devuelve el ID del evento.
     * @return ID único
     */
    public Long getId() {
        return id;
    }

    /**
     * Establece el ID del evento.
     * @param id ID único
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Devuelve el título del evento.
     * @return título del evento
     */
    public String getTitulo() {
        return titulo;
    }

    /**
     * Establece el título del evento.
     * @param titulo texto del título
     */
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    public String getTipoEvento() {
    return tipoEvento;
}

public void setTipoEvento(String tipoEvento) {
    this.tipoEvento = tipoEvento;
}


    /**
     * Devuelve la descripción del evento.
     * @return descripción
     */
    public String getDescripcion() {
        return descripcion;
    }

    /**
     * Establece la descripción del evento.
     * @param descripcion texto de la descripción
     */
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    /**
     * Devuelve la fecha del evento.
     * @return fecha
     */
    public LocalDate getFecha() {
        return fecha;
    }

    /**
     * Establece la fecha del evento.
     * @param fecha fecha en formato LocalDate
     */
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    /**
     * Devuelve el lugar del evento.
     * @return lugar
     */
    public String getLugar() {
        return lugar;
    }

    /**
     * Establece el lugar del evento.
     * @param lugar dirección o nombre del lugar
     */
    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    /**
     * Indica si el evento es de pago.
     * @return `true` si es de pago, `false` si es gratuito
     */
    public boolean isEsDePago() {
        return esDePago;
    }

    /**
     * Define si el evento es de pago.
     * @param esDePago `true` si es de pago, `false` si no lo es
     */
    public void setEsDePago(boolean esDePago) {
        this.esDePago = esDePago;
    }

    /**
     * Devuelve la URL de la imagen del evento.
     * @return URL de imagen
     */
    public String getImagenUrl() {
        return imagenUrl;
    }

    /**
     * Establece la URL de la imagen del evento.
     * @param imagenUrl dirección web de la imagen
     */
    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }
    @Transient // No se guarda en la base de datos
private boolean yaInscrito;

public boolean isYaInscrito() {
    return yaInscrito;
}

public void setYaInscrito(boolean yaInscrito) {
    this.yaInscrito = yaInscrito;
}

}
