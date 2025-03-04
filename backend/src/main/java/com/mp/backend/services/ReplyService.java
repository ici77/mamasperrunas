package com.mp.backend.services;

import com.mp.backend.models.Usuario;
import com.mp.backend.models.forum.Reply;
import com.mp.backend.repositories.ReplyRepository;
import com.mp.backend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import java.util.stream.Collectors;

/**
 * 📌 Servicio para la gestión de respuestas en el foro.
 */
@Service
public class ReplyService {

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * 📌 Obtiene todas las respuestas de un post con paginación.
     *
     * @param postId ID del post.
     * @param page Número de página.
     * @param size Cantidad de respuestas por página.
     * @return Página de respuestas del post.
     */
    public Page<Reply> getRepliesByPost(Long postId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return replyRepository.findByPostId(postId, pageable);
    }

    /**
     * 📌 Crea una nueva respuesta.
     *
     * @param reply Objeto Reply con los datos.
     * @return Respuesta creada.
     */
    public Reply createReply(Reply reply) {
        return replyRepository.save(reply);
    }

   /**
 * 📌 Elimina una respuesta si el usuario es el autor.
 *
 * @param replyId ID de la respuesta a eliminar.
 * @param userId ID del usuario que intenta eliminar la respuesta.
 * @return `true` si se eliminó correctamente, `false` si no tiene permisos.
 */
public boolean deleteReply(Long replyId, Long userId) {
    Optional<Reply> optionalReply = replyRepository.findById(replyId);

    if (optionalReply.isPresent()) {
        Reply reply = optionalReply.get();

        // Verifica si el usuario es el autor de la respuesta
        if (!reply.getUser().getId().equals(userId)) {
            return false; // Usuario no autorizado
        }

        replyRepository.deleteById(replyId);
        return true;
    }

    return false; // Respuesta no encontrada
}


    /**
     * 📌 Permite que un usuario vote una respuesta con "Me gusta".
     *
     * @param replyId ID de la respuesta a votar.
     */
    public void upvoteReply(Long replyId) {
        Optional<Reply> optionalReply = replyRepository.findById(replyId);
        if (optionalReply.isPresent()) {
            Reply reply = optionalReply.get();
            reply.setUpvotes(reply.getUpvotes() + 1);
            replyRepository.save(reply);
        }
    }

    /**
     * 📌 Permite que un usuario vote una respuesta con "No me gusta".
     *
     * @param replyId ID de la respuesta a votar.
     */
    public void downvoteReply(Long replyId) {
        Optional<Reply> optionalReply = replyRepository.findById(replyId);
        if (optionalReply.isPresent()) {
            Reply reply = optionalReply.get();
            reply.setDownvotes(reply.getDownvotes() + 1);
            replyRepository.save(reply);
        }
    }

    /**
     * 📌 Permite que un usuario denuncie una respuesta.
     *
     * @param replyId ID de la respuesta a denunciar.
     * @param userId ID del usuario que realiza la denuncia.
     * @return `true` si la denuncia se registró, `false` si ya fue denunciada por este usuario.
     */
    public boolean reportReply(Long replyId, Long userId) {
        Optional<Reply> optionalReply = replyRepository.findById(replyId);
        Optional<Usuario> optionalUser = usuarioRepository.findById(userId);

        if (optionalReply.isPresent() && optionalUser.isPresent()) {
            Reply reply = optionalReply.get();
            Usuario user = optionalUser.get();

            // Verificar si el usuario ya ha denunciado esta respuesta
            if (reply.getReportedByUsers().contains(user)) {
                return false;
            }

            reply.getReportedByUsers().add(user);
            reply.setReports(reply.getReports() + 1);
            replyRepository.save(reply);
            return true;
        }
        return false;
    }

    /**
     * 📌 Obtiene las respuestas más votadas de un post.
     *
     * @param postId ID del post.
     * @return Lista de respuestas ordenadas por "Me gusta".
     */
    public List<Reply> getTopRepliesByPost(Long postId) {
        List<Reply> allReplies = replyRepository.findByPostId(postId);
        return allReplies.stream()
                .sorted((r1, r2) -> Integer.compare(r2.getUpvotes(), r1.getUpvotes()))
                .limit(3) // Se muestran las 3 respuestas más votadas
                .collect(Collectors.toList());
    }
}
