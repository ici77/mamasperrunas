package com.mp.backend.models.external;

import java.util.List;

/**
 * 📌 **Clase RandomUserResponse**
 *
 * Representa la respuesta de una API externa que devuelve una lista de usuarios aleatorios.
 * 
 * 🔹 **Campos:**
 * - `results`: Lista de usuarios aleatorios (`RandomUser`).
 */
public class RandomUserResponse {

    /** Lista de usuarios aleatorios obtenidos de la API. */
    private List<RandomUser> results;

    /**
     * 📌 **Obtiene la lista de usuarios aleatorios.**
     * 
     * @return Lista de objetos `RandomUser`.
     */
    public List<RandomUser> getResults() {
        return results;
    }

    /**
     * 📌 **Establece la lista de usuarios aleatorios.**
     * 
     * @param results Lista de objetos `RandomUser` a asignar.
     */
    public void setResults(List<RandomUser> results) {
        this.results = results;
    }
}
