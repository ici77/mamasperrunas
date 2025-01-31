package com.mp.backend.service;

import com.amazonaws.auth.AWS4Signer;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.DefaultRequest;
import com.amazonaws.http.HttpMethodName;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mp.backend.config.AmazonProperties;
import org.apache.http.HttpResponse;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class AmazonApiService {

    private static final Logger logger = LoggerFactory.getLogger(AmazonApiService.class);

    private final AmazonProperties amazonProperties;

    private static final String ENDPOINT = "webservices.amazon.es";
    private static final String REGION = "eu-west-1";
    private static final String SERVICE_NAME = "ProductAdvertisingAPI";

    public AmazonApiService(AmazonProperties amazonProperties) {
        this.amazonProperties = amazonProperties;
    }

    // Endpoint REST para búsqueda de productos
    @GetMapping("/search")
    public String searchProducts(@RequestParam String keyword) {
        logger.info("Iniciando búsqueda de productos con keyword: {}", keyword);

        if (keyword == null || keyword.trim().isEmpty()) {
            return "El parámetro 'keyword' no puede estar vacío.";
        }

        try {
            // Crear el payload de la solicitud
            String payload = createPayload(keyword);
            logger.debug("Payload creado: {}", payload);

            // Configurar la solicitud DefaultRequest
            DefaultRequest<Void> request = new DefaultRequest<>(SERVICE_NAME);
            request.setHttpMethod(HttpMethodName.POST);
            request.setEndpoint(new URI("https://" + ENDPOINT + "/paapi5/searchitems"));
            request.setContent(new ByteArrayInputStream(payload.getBytes(StandardCharsets.UTF_8)));

            // Añadir encabezados
            request.addHeader("Content-Type", "application/json");

            // Credenciales AWS
            AWSCredentials awsCredentials = new BasicAWSCredentials(
                    amazonProperties.getAccessKey(),
                    amazonProperties.getSecretKey()
            );

            // Firmar la solicitud
            AWS4Signer signer = new AWS4Signer();
            signer.setServiceName(SERVICE_NAME);
            signer.setRegionName(REGION);
            signer.sign(request, awsCredentials);
            logger.debug("Solicitud firmada correctamente.");

            // Convertir DefaultRequest a HttpPost
            HttpPost httpPost = new HttpPost(request.getEndpoint());
            for (Map.Entry<String, String> header : request.getHeaders().entrySet()) {
                httpPost.addHeader(header.getKey(), header.getValue());
            }
            httpPost.setEntity(new StringEntity(payload));
            logger.info("Solicitud preparada para enviarse al endpoint: {}", request.getEndpoint());

            // Configurar cliente HTTP con tiempo de espera
            RequestConfig requestConfig = RequestConfig.custom()
                    .setSocketTimeout(5000)
                    .setConnectTimeout(5000)
                    .build();

            try (CloseableHttpClient httpClient = HttpClients.custom()
                    .setDefaultRequestConfig(requestConfig)
                    .build()) {

                // Ejecutar la solicitud HTTP
                HttpResponse response = httpClient.execute(httpPost);
                int statusCode = response.getStatusLine().getStatusCode();
                logger.info("Respuesta recibida con código de estado: {}", statusCode);

                // Validar el estado de la respuesta
                String responseBody = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
                if (statusCode == 200) {
                    logger.info("Respuesta exitosa recibida de Amazon.");
                    return responseBody;
                } else {
                    logger.error("Error en la respuesta de Amazon: {}", responseBody);
                    return "Error: " + statusCode + ", " + responseBody;
                }
            }
        } catch (Exception e) {
            logger.error("Error al realizar la solicitud a la API de Amazon", e);
            return "Error al realizar la solicitud a la API de Amazon: " + e.getMessage();
        }
    }

    private String createPayload(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new IllegalArgumentException("Keyword no puede estar vacío");
        }

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("Keywords", keyword);
            payload.put("PartnerTag", amazonProperties.getAssociateTag());
            payload.put("PartnerType", "Associates");
            payload.put("SearchIndex", "All"); // Cambié de "Books" a "All"
            payload.put("Resources", List.of(
                    "Images.Primary.Medium",
                    "ItemInfo.Title",
                    "Offers.Listings.Price"
            ));

            return new ObjectMapper().writeValueAsString(payload);
        } catch (Exception e) {
            logger.error("Error al crear el payload", e);
            throw new RuntimeException("Error al crear el payload: " + e.getMessage());
        }
    }
}
