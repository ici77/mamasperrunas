package com.mp.backend.services;



import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

@Service
public class DogApiService {
    private final String API_URL = "https://api.thedogapi.com/v1/breeds";
    private final String API_KEY = "live_6IpVnEm2JnKGajVTUucJws58ErwUOSDQNKzwkMxNtJR0mhU1nlVuRdD5r4rypFoB";//apikey

    public String getDogBreeds() {
        RestTemplate restTemplate = new RestTemplate();
    
        // Configurar los headers con la API Key
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", API_KEY);
    
        HttpEntity<String> entity = new HttpEntity<>(headers);
    
        // Realizar la petición GET
        ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.GET, entity, String.class);
    
        // Imprimir la respuesta en consola
        System.out.println("Respuesta de la API: " + response.getBody());
    
        return response.getBody();
    }
    
}
