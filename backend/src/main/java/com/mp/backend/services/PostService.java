package com.mp.backend.services;

import com.mp.backend.models.Usuario;
import com.mp.backend.models.forum.Post;
import com.mp.backend.repositories.PostRepository;
import com.mp.backend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 📌 Servicio para la gestión de posts en el foro.
 */
@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * 📌 Obtiene todos los posts sin paginación.
     *
     * @return Lista de todos los posts.
     */
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    /**
     * 📌 Obtiene un post por su ID.
     *
     * @param id ID del post a buscar.
     * @return Optional con el post encontrado o vacío si no existe.
     */
    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    /**
     * 📌 Crea un nuevo post.
     *
     * @param post Objeto post con los datos.
     * @return Post creado.
     */
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    /**
 * 📌 Elimina un post si el usuario es el autor.
 *
 * @param postId ID del post a eliminar.
 * @param userId ID del usuario que intenta eliminar el post.
 * @return `true` si se eliminó correctamente, `false` si no tiene permisos.
 */
public boolean deletePost(Long postId, Long userId) {
    Optional<Post> optionalPost = postRepository.findById(postId);

    if (optionalPost.isPresent()) {
        Post post = optionalPost.get();

        // Verifica si el usuario es el autor del post
        if (!post.getUser().getId().equals(userId)) {
            return false; // Usuario no autorizado
        }

        postRepository.deleteById(postId);
        return true;
    }

    return false; // Post no encontrado
}


    /**
     * 📌 Obtiene posts paginados por categoría.
     *
     * @param category Nombre de la categoría.
     * @param page Número de página.
     * @param size Cantidad de posts por página.
     * @return Página de posts de la categoría seleccionada.
     */
    public Page<Post> getPaginatedPosts(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findByCategory_Name(category, pageable);
    }

    /**
     * 📌 Obtiene los 4 posts más votados en una categoría.
     *
     * @param category Nombre de la categoría.
     * @return Lista de los 4 posts con más "Me gusta".
     */
    public List<Post> getTopPostsByCategory(String category) {
        List<Post> allPosts = postRepository.findByCategory_Name(category);
        return allPosts.stream()
                .sorted((p1, p2) -> Integer.compare(p2.getUpvotes(), p1.getUpvotes())) // Ordenar por upvotes
                .limit(4)
                .collect(Collectors.toList());
    }
    

    /**
     * 📌 Permite que un usuario vote un post con "Me gusta".
     *
     * @param postId ID del post a votar.
     */
    public void upvotePost(Long postId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.setUpvotes(post.getUpvotes() + 1);
            postRepository.save(post);
        }
    }

    /**
     * 📌 Permite que un usuario vote un post con "No me gusta".
     *
     * @param postId ID del post a votar.
     */
    public void downvotePost(Long postId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.setDownvotes(post.getDownvotes() + 1);
            postRepository.save(post);
        }
    }

    /**
     * 📌 Permite que un usuario guarde un post en favoritos.
     *
     * @param postId ID del post.
     * @param userId ID del usuario que lo guarda en favoritos.
     */
    public void addToFavorites(Long postId, Long userId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        Optional<Usuario> optionalUser = usuarioRepository.findById(userId);

        if (optionalPost.isPresent() && optionalUser.isPresent()) {
            Post post = optionalPost.get();
            post.setFavorites(post.getFavorites() + 1);
            postRepository.save(post);
        }
    }

    /**
     * 📌 Permite que un usuario denuncie un post.
     *
     * @param postId ID del post a denunciar.
     * @param userId ID del usuario que realiza la denuncia.
     * @return `true` si la denuncia se registró, `false` si ya lo había denunciado antes.
     */
    public boolean reportPost(Long postId, Long userId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        Optional<Usuario> optionalUser = usuarioRepository.findById(userId);

        if (optionalPost.isPresent() && optionalUser.isPresent()) {
            Post post = optionalPost.get();
            Usuario user = optionalUser.get();

            // Si el usuario ya denunció este post, no permite denunciar de nuevo.
            if (post.getReportedByUsers().contains(user)) {
                return false;
            }

            post.getReportedByUsers().add(user);
            post.setReports(post.getReports() + 1);
            postRepository.save(post);
            return true;
        }
        return false;
    }

    /**
     * 📌 Agrega imágenes a un post (máximo 3).
     *
     * @param postId ID del post.
     * @param images Lista de URLs de imágenes.
     */
    public void addImagesToPost(Long postId, List<String> images) {
        Optional<Post> optionalPost = postRepository.findById(postId);

        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();

            // Validación: Solo permite hasta 3 imágenes.
            if (post.getImageUrls().size() + images.size() > 3) {
                throw new IllegalArgumentException("Un post no puede tener más de 3 imágenes.");
            }

            post.getImageUrls().addAll(images);
            postRepository.save(post);
        }
    }

    /**
     * 📌 Agrega etiquetas a un post.
     *
     * @param postId ID del post.
     * @param tags Lista de etiquetas.
     */
    public void addTagsToPost(Long postId, Set<String> tags) {
        Optional<Post> optionalPost = postRepository.findById(postId);

        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.getTags().addAll(tags);
            postRepository.save(post);
        }
    }
}
