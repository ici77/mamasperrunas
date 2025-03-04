package com.mp.backend.controllers;

import com.mp.backend.models.forum.Reply;
import com.mp.backend.services.ReplyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 📌 API REST para gestionar las respuestas en el foro.
 */
@RestController
@RequestMapping("/api/replies")
@CrossOrigin(origins = "*") // Permitir peticiones desde Angular
@Tag(name = "Respuestas", description = "Operaciones relacionadas con las respuestas a los posts")
public class ReplyController {

    @Autowired
    private ReplyService replyService;

    /**
     * 📌 Obtiene todas las respuestas de un post con paginación.
     *
     * @param postId ID del post.
     * @param page Número de página.
     * @param size Cantidad de respuestas por página.
     * @return Página de respuestas.
     */
    @Operation(summary = "Obtiene respuestas paginadas de un post", description = "Devuelve una página de respuestas asociadas a un post específico.")
    @ApiResponse(responseCode = "200", description = "Respuestas obtenidas correctamente")
    @GetMapping("/post/{postId}/paginated")
    public ResponseEntity<Page<Reply>> getRepliesByPost(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Reply> replies = replyService.getRepliesByPost(postId, page, size);

        if (replies.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(replies);
    }

    /**
     * 📌 Crea una nueva respuesta.
     *
     * @param reply Objeto Reply con los datos.
     * @return Respuesta creada.
     */
    @Operation(summary = "Crea una nueva respuesta", description = "Permite a un usuario registrado responder a un post.")
    @ApiResponse(responseCode = "201", description = "Respuesta creada exitosamente")
    @PostMapping
    public ResponseEntity<Reply> createReply(@RequestBody Reply reply) {
        Reply savedReply = replyService.createReply(reply);
        return ResponseEntity.status(201).body(savedReply);
    }

    /**
     /**
 * 📌 Elimina una respuesta si el usuario es el autor.
 *
 * @param replyId ID de la respuesta.
 * @param userId ID del usuario que intenta eliminarla.
 * @return `200 OK` si se elimina, `403 Forbidden` si no tiene permisos.
 */
@Operation(summary = "Eliminar una respuesta", description = "Permite eliminar una respuesta solo si el usuario es el autor.")
@ApiResponse(responseCode = "200", description = "Respuesta eliminada correctamente")
@ApiResponse(responseCode = "403", description = "No tienes permisos para eliminar esta respuesta")
@DeleteMapping("/{replyId}/{userId}")
public ResponseEntity<String> deleteReply(@PathVariable Long replyId, @PathVariable Long userId) {
    boolean deleted = replyService.deleteReply(replyId, userId);

    if (!deleted) {
        return ResponseEntity.status(403).body("⚠️ No tienes permisos para eliminar esta respuesta.");
    }

    return ResponseEntity.ok("✅ Respuesta eliminada correctamente.");
}


    /**
     * 📌 Permite que un usuario vote una respuesta con "Me gusta".
     *
     * @param replyId ID de la respuesta a votar.
     */
    @Operation(summary = "Votar una respuesta con 'Me gusta'", description = "Aumenta el contador de 'Me gusta' en la respuesta especificada.")
    @ApiResponse(responseCode = "200", description = "Voto registrado")
    @ApiResponse(responseCode = "404", description = "Respuesta no encontrada")
    @PostMapping("/{replyId}/upvote")
    public ResponseEntity<String> upvoteReply(@PathVariable Long replyId) {
        replyService.upvoteReply(replyId);
        return ResponseEntity.ok("✅ Respuesta votada con 'Me gusta'.");
    }

    /**
     * 📌 Permite que un usuario vote una respuesta con "No me gusta".
     *
     * @param replyId ID de la respuesta a votar.
     */
    @Operation(summary = "Votar una respuesta con 'No me gusta'", description = "Aumenta el contador de 'No me gusta' en la respuesta especificada.")
    @ApiResponse(responseCode = "200", description = "Voto registrado")
    @ApiResponse(responseCode = "404", description = "Respuesta no encontrada")
    @PostMapping("/{replyId}/downvote")
    public ResponseEntity<String> downvoteReply(@PathVariable Long replyId) {
        replyService.downvoteReply(replyId);
        return ResponseEntity.ok("✅ Respuesta votada con 'No me gusta'.");
    }

    /**
     * 📌 Permite que un usuario denuncie una respuesta.
     *
     * @param replyId ID de la respuesta a denunciar.
     * @param userId ID del usuario que realiza la denuncia.
     * @return Mensaje de éxito o error si ya fue denunciada por este usuario.
     */
    @Operation(summary = "Denunciar una respuesta", description = "Permite que un usuario registrado denuncie una respuesta.")
    @ApiResponse(responseCode = "200", description = "Denuncia registrada")
    @ApiResponse(responseCode = "409", description = "El usuario ya denunció esta respuesta")
    @PostMapping("/{replyId}/report/{userId}")
    public ResponseEntity<String> reportReply(@PathVariable Long replyId, @PathVariable Long userId) {
        boolean success = replyService.reportReply(replyId, userId);

        if (success) {
            return ResponseEntity.ok("✅ Respuesta denunciada con éxito.");
        } else {
            return ResponseEntity.status(409).body("⚠️ Ya has denunciado esta respuesta.");
        }
    }

    /**
     * 📌 Obtiene las respuestas más votadas de un post.
     *
     * @param postId ID del post.
     * @return Lista de respuestas ordenadas por "Me gusta".
     */
    @Operation(summary = "Obtener respuestas destacadas", description = "Devuelve las respuestas más votadas de un post.")
    @ApiResponse(responseCode = "200", description = "Respuestas destacadas obtenidas correctamente")
    @GetMapping("/post/{postId}/top")
    public ResponseEntity<List<Reply>> getTopRepliesByPost(@PathVariable Long postId) {
        List<Reply> topReplies = replyService.getTopRepliesByPost(postId);
        return ResponseEntity.ok(topReplies);
    }
}
