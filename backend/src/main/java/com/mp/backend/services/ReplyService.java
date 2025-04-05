package com.mp.backend.services;

import com.mp.backend.models.Usuario;
import com.mp.backend.models.forum.Post;
import com.mp.backend.models.forum.Reply;
import com.mp.backend.repositories.PostRepository;
import com.mp.backend.repositories.ReplyRepository;
import com.mp.backend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReplyService {

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PostRepository postRepository;

    /**
     * 📌 Obtiene todas las respuestas de un post con paginación.
     */
    public Page<Reply> getRepliesByPost(Long postId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return replyRepository.findByPostId(postId, pageable);
    }

    /**
     * 📌 Obtiene todas las respuestas de un post sin paginación.
     */
    public List<Reply> getRepliesByPostId(Long postId) {
        return replyRepository.findByPostId(postId);
    }

    /**
     * 📌 Crea una nueva respuesta.
     */
    public Reply createReply(Long postId, String content, Usuario usuario) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post no encontrado"));

        Reply reply = new Reply();
        reply.setPost(post);
        reply.setContent(content);
        reply.setUser(usuario);
        reply.setCreatedAt(LocalDateTime.now());

        return replyRepository.save(reply);
    }

    /**
     * 📌 Elimina una respuesta si el usuario es el autor.
     */
    public boolean deleteReply(Long replyId, Long userId) {
        Optional<Reply> optionalReply = replyRepository.findById(replyId);

        if (optionalReply.isPresent()) {
            Reply reply = optionalReply.get();

            if (!reply.getUser().getId().equals(userId)) {
                return false; // Usuario no autorizado
            }

            replyRepository.deleteById(replyId);
            return true;
        }

        return false; // Respuesta no encontrada
    }

    /**
     * 📌 Votar con "Me gusta"
     */
    public void upvoteReply(Long replyId) {
        replyRepository.findById(replyId).ifPresent(reply -> {
            reply.setUpvotes(reply.getUpvotes() + 1);
            replyRepository.save(reply);
        });
    }

    /**
     * 📌 Votar con "No me gusta"
     */
    public void downvoteReply(Long replyId) {
        replyRepository.findById(replyId).ifPresent(reply -> {
            reply.setDownvotes(reply.getDownvotes() + 1);
            replyRepository.save(reply);
        });
    }

    /**
     * 📌 Denunciar una respuesta
     */
    public boolean reportReply(Long replyId, Long userId) {
        Optional<Reply> optionalReply = replyRepository.findById(replyId);
        Optional<Usuario> optionalUser = usuarioRepository.findById(userId);

        if (optionalReply.isPresent() && optionalUser.isPresent()) {
            Reply reply = optionalReply.get();
            Usuario user = optionalUser.get();

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
     * 📌 Obtener las respuestas más votadas de un post.
     */
    public List<Reply> getTopRepliesByPost(Long postId) {
        List<Reply> allReplies = replyRepository.findByPostId(postId);
        return allReplies.stream()
                .sorted((r1, r2) -> Integer.compare(r2.getUpvotes(), r1.getUpvotes()))
                .limit(3)
                .collect(Collectors.toList());
    }
}
