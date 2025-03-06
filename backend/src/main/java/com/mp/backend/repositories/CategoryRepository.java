package com.mp.backend.repositories;

import com.mp.backend.models.forum.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 📌 **Repositorio para la entidad Category.**
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
