package com.mp.backend.models.forum;

import com.mp.backend.models.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
    name = "post_dislikes",
    uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "post_id"})}
)
@Getter
@Setter
public class PostDislike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Usuario que dio "no me gusta" */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Usuario user;

    /** Post al que dio "no me gusta" */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
}
