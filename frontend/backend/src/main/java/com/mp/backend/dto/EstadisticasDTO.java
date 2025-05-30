package com.mp.backend.dto;

public class EstadisticasDTO {
    private int totalPosts;
    private int totalLikes;
    private int totalEventos;

    // Getter y Setter para totalPosts
    public int getTotalPosts() {
        return totalPosts;
    }

    public void setTotalPosts(int totalPosts) {
        this.totalPosts = totalPosts;
    }

    // Getter y Setter para totalLikes
    public int getTotalLikes() {
        return totalLikes;
    }

    public void setTotalLikes(int totalLikes) {
        this.totalLikes = totalLikes;
    }

    // Getter y Setter para totalEventos
    public int getTotalEventos() {
        return totalEventos;
    }

    public void setTotalEventos(int totalEventos) {
        this.totalEventos = totalEventos;
    }
}
