// Comprobamos que el script está cargado correctamente
console.log("✅ Script cargado correctamente");

// Función para cambiar el color del botón "Únete Ahora"
document.addEventListener("DOMContentLoaded", function () {
    const botonUnete = document.querySelector("#btn-unete");
    
    if (botonUnete) {
        botonUnete.addEventListener("click", function () {
            botonUnete.style.backgroundColor = "#ff5733"; // Cambia a un color llamativo
            alert("¡Gracias por unirte a Mamas Caninas!");
        });
    }
});
