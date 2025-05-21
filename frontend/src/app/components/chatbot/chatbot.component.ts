import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  isChatOpen = false;
  userMessage = '';
  showWelcomeMessage = true; // ✅ ESTA LÍNEA ES LA QUE FALTABA
  messages: { sender: 'bot' | 'user', text: string }[] = [];

  ngOnInit(): void {
    setTimeout(() => {
      this.showWelcomeMessage = false;
    }, 5000);
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;
    this.messages.push({ sender: 'user', text: this.userMessage });
    const respuesta = this.getBotReply(this.userMessage.toLowerCase());
    this.messages.push({ sender: 'bot', text: respuesta });
    this.userMessage = '';
  }

  getBotReply(msg: string): string {
    if (msg.includes('evento')) return 'Puedes ver los eventos en la sección "Eventos" del menú principal.';
    if (msg.includes('evento')) return 'Puedes ver los eventos en la sección "Eventos" del menú principal.';
  if (msg.includes('registr')) return 'Para registrarte, ve al botón "Registrarse" en la esquina superior derecha.';
  if (msg.includes('apuntar')) return 'Haz clic en "Apuntarme" dentro de un evento para unirte.';
  if (msg.includes('perfil')) return 'Puedes acceder a tu perfil desde el menú superior derecho, junto a tu nombre.';
  if (msg.includes('contraseña') && msg.includes('cambiar')) return 'En tu perfil, pulsa en "Cambiar contraseña" y confirma con tu contraseña actual.';
  if (msg.includes('imagen') || msg.includes('foto')) return 'Desde tu perfil puedes pulsar "Cambiar imagen" para subir una nueva foto.';
  if (msg.includes('nombre')) return 'En tu perfil puedes modificar tu nombre y pulsar "Guardar".';
  if (msg.includes('post') || msg.includes('publicación')) return 'Tus publicaciones aparecen en la sección "Tus posts" dentro del perfil.';
  if (msg.includes('gustos') || msg.includes('intereses')) return 'Puedes escribir tus gustos en el perfil y se guardarán automáticamente.';
  if (msg.includes('olvidé') && msg.includes('contraseña')) return 'Si olvidaste tu contraseña, por ahora deberás crear una nueva cuenta.';
  
    if (msg.includes('apuntar')) return 'Haz clic en "Apuntarme" dentro de un evento para unirte.';
    return 'Lo siento, aún no entiendo esa pregunta. ¡Estoy aprendiendo!';
  }
}
