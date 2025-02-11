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


@RestController
public class RandomUserController {

    @Autowired
    private AuthService authService;

    private final Random random = new Random();

    // Listas de nombres y apellidos españoles (sin tildes)
    private final List<String> nombresEspanoles = List.of(
        "Maria", "Jose", "Antonio", "Lucia", "Francisco", "Ana", "Isabel", "Juan",
        "Miguel", "Manuel", "Carmen", "Rafael", "Jorge", "Pedro", "Santiago"
    );

    private final List<String> apellidosEspanoles = List.of(
        "Garcia", "Martinez", "Rodriguez", "Lopez", "Hernandez", "Gonzalez", "Perez",
        "Sanchez", "Ramirez", "Torres", "Flores", "Cruz", "Reyes", "Morales"
    );

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

    // Método para obtener un nombre aleatorio
    private String getNombreEspanolAleatorio() {
        return nombresEspanoles.get(random.nextInt(nombresEspanoles.size()));
    }

    // Método para obtener un apellido aleatorio
    private String getApellidoEspanolAleatorio() {
        return apellidosEspanoles.get(random.nextInt(apellidosEspanoles.size()));
    }
}
