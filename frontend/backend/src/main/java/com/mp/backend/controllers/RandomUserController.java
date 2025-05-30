package com.mp.backend.controllers;

import com.mp.backend.models.Usuario;
import com.mp.backend.services.AuthService;
import com.mp.backend.models.external.RandomUserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Random;

/**
 * 📌 **Controlador RandomUserController**
 *
 * Este controlador obtiene usuarios aleatorios desde una API externa (`randomuser.me`)
 * y los registra en la base de datos con nombres y apellidos españoles generados aleatoriamente.
 *
 * 🔹 **Endpoint Disponible:**
 * - `GET /api/populate-users` → Pobla la base de datos con usuarios ficticios.
 *
 * 🔹 **Fuentes de Datos:**
 * - API de `randomuser.me` para obtener imágenes y datos adicionales.
 * - Listas predefinidas de nombres y apellidos españoles para personalizar los datos.
 */
@RestController
public class RandomUserController {

    @Autowired
    private AuthService authService;

    private final Random random = new Random();

    /** Lista de nombres españoles sin tildes. */
    private final List<String> nombresEspanoles = List.of(
        "Maria", "Jose", "Antonio", "Lucia", "Francisco", "Ana", "Isabel", "Juan",
        "Miguel", "Manuel", "Carmen", "Rafael", "Jorge", "Pedro", "Santiago"
    );

    /** Lista de apellidos españoles sin tildes. */
    private final List<String> apellidosEspanoles = List.of(
        "Garcia", "Martinez", "Rodriguez", "Lopez", "Hernandez", "Gonzalez", "Perez",
        "Sanchez", "Ramirez", "Torres", "Flores", "Cruz", "Reyes", "Morales"
    );

    /**
     * 📌 **Endpoint: Poblar la base de datos con usuarios aleatorios**
     *
     * 🔹 **Método:** `GET /api/populate-users`
     *
     * - Obtiene datos desde `https://randomuser.me/api/?results=10`.
     * - Genera nombres y apellidos en español de forma aleatoria.
     * - Registra los usuarios en la base de datos con `AuthService`.
     *
     * @return Mensaje de éxito o error en formato `String`.
     */
    @GetMapping("/api/populate-users")
    public String populateUsers() {
        try {
            String apiUrl = "https://randomuser.me/api/?results=10";
            RestTemplate restTemplate = new RestTemplate();
            RandomUserResponse response = restTemplate.getForObject(apiUrl, RandomUserResponse.class);

            if (response != null && response.getResults() != null) {
                response.getResults().forEach(randomUser -> {
                    Usuario usuario = new Usuario();

                    // Generar nombre completo aleatorio
                    String nombreCompleto = getNombreEspanolAleatorio() + " " + getApellidoEspanolAleatorio();
                    usuario.setNombre(nombreCompleto);

                    // Generar correo basado en el nombre
                    usuario.setEmail(nombreCompleto.replaceAll(" ", "").toLowerCase() + "@gmail.com");

                    // Contraseña predeterminada
                    usuario.setPassword("123456");

                    // Verificar si la imagen de perfil no es nula
                    if (randomUser.getPicture() != null && randomUser.getPicture().getLarge() != null) {
                        usuario.setFotoPerfil(randomUser.getPicture().getLarge());
                    } else {
                        usuario.setFotoPerfil("default-avatar.jpg");  // Imagen por defecto si es nula
                    }

                    // Registrar el usuario usando el AuthService (encripta la contraseña)
                    authService.registerUser(usuario);
                });

                return "Usuarios con nombres y apellidos españoles generados correctamente.";
            } else {
                return "Error: No se recibieron datos de la API.";
            }
        } catch (Exception e) {
            e.printStackTrace();  // Imprimir detalles del error en la consola
            return "Error: " + e.getMessage();
        }
    }

    /**
     * 📌 **Genera un nombre español aleatorio.**
     *
     * @return Nombre seleccionado aleatoriamente de la lista `nombresEspanoles`.
     */
    private String getNombreEspanolAleatorio() {
        return nombresEspanoles.get(random.nextInt(nombresEspanoles.size()));
    }

    /**
     * 📌 **Genera un apellido español aleatorio.**
     *
     * @return Apellido seleccionado aleatoriamente de la lista `apellidosEspanoles`.
     */
    private String getApellidoEspanolAleatorio() {
        return apellidosEspanoles.get(random.nextInt(apellidosEspanoles.size()));
    }
}
 