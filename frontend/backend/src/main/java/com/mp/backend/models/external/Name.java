package com.mp.backend.models.external;

/**
 * 📌 **Clase Name**
 *
 * Representa un nombre estructurado con un primer nombre y un apellido.
 * Esta clase se utiliza en modelos externos para almacenar información de nombres.
 */
public class Name {

    /** Primer nombre de la persona. */
    private String first;

    /** Apellido de la persona. */
    private String last;

    /**
     * 📌 **Obtiene el primer nombre.**
     * 
     * @return El primer nombre de la persona.
     */
    public String getFirst() {
        return first;
    }

    /**
     * 📌 **Establece el primer nombre.**
     * 
     * @param first Primer nombre a establecer.
     */
    public void setFirst(String first) {
        this.first = first;
    }

    /**
     * 📌 **Obtiene el apellido.**
     * 
     * @return El apellido de la persona.
     */
    public String getLast() {
        return last;
    }

    /**
     * 📌 **Establece el apellido.**
     * 
     * @param last Apellido a establecer.
     */
    public void setLast(String last) {
        this.last = last;
    }
}
