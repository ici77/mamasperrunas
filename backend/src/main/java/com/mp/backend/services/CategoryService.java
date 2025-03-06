package com.mp.backend.services;

import com.mp.backend.models.forum.Category;
import com.mp.backend.repositories.CategoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 📌 **Servicio para la gestión de categorías del foro.**
 */
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * 📌 **Obtiene todas las categorías registradas en la base de datos.**
     *
     * @return Lista de categorías.
     */
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
