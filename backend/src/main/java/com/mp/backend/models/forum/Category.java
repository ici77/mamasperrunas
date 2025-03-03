package com.mp.backend.models.forum;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Representa una categoría del foro.
 */
@Entity
@Getter
@Setter
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String description;
}
