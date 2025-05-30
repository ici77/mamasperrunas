package com.mp.backend.controllers;

import com.mp.backend.models.forum.Category;
import com.mp.backend.services.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

/**
 * 📌 **Controlador para gestionar las categorías del foro.**
 */
@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*") // ✅ Permitir llamadas desde el frontend
@Tag(name = "Categorías", description = "Operaciones relacionadas con las categorías del foro")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * 📌 **Obtiene todas las categorías del foro.**
     *
     * @return Lista de categorías.
     */
    @Operation(summary = "Obtiene todas las categorías", description = "Devuelve una lista de todas las categorías disponibles en el foro.")
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
}
