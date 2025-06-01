// 📌 Comprobamos que el script está cargado correctamente en la consola del navegador.
console.log("✅ Script cargado correctamente");

/**
 * 📌 Evento `DOMContentLoaded`
 *
 * - Se ejecuta cuando el DOM de la página ha sido completamente cargado.
 * - Busca el botón con el ID `btn-unete`.
 * - Si el botón existe, agrega un evento de clic para cambiar su color y mostrar una alerta.
 */
document.addEventListener("DOMContentLoaded", function () {
    const botonUnete = document.querySelector("#btn-unete"); // Selecciona el botón "Únete Ahora"

    if (botonUnete) {
        /**
         * 📌 Evento `click` en `#btn-unete`
         *
         * - Cuando el usuario hace clic en el botón:
         *   1️⃣ Cambia el color de fondo del botón a `#ff5733` (color llamativo).
         *   2️⃣ Muestra una alerta de confirmación.
         */
        botonUnete.addEventListener("click", function () {
            botonUnete.style.backgroundColor = "#ff5733"; // Cambia el color de fondo
            alert("¡Gracias por unirte a Mamás Perrunas!");
        });
    }
});
