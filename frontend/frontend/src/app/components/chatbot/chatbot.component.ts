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
  showWelcomeMessage = true;
  usuarioNombre: string = '';
  saludoMostrado = false;
  messages: { sender: 'bot' | 'user', text: string }[] = [];

  ngOnInit(): void {
    setTimeout(() => {
      this.showWelcomeMessage = false;
    }, 1000);
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;
    this.messages.push({ sender: 'user', text: this.userMessage });

    if (!this.usuarioNombre) {
      this.usuarioNombre = this.userMessage;
      this.messages.push({ sender: 'bot', text: `¡Encantado/a de conocerte, ${this.usuarioNombre}! 😊` });
      this.messages.push({ sender: 'bot', text: `¿Sobre qué quieres saber más? Usa los botones o escribe tu pregunta.` });
      this.saludoMostrado = true;
    } else {
      const respuesta = this.getBotReply(this.userMessage.toLowerCase());
      this.messages.push({ sender: 'bot', text: respuesta });
    }

    this.userMessage = '';
  }

  respuestaDirecta(opcion: string) {
    const respuesta = this.getBotReply(opcion.toLowerCase());
    this.messages.push({ sender: 'user', text: opcion });
    this.messages.push({ sender: 'bot', text: respuesta });
  }

  getBotReply(msg: string): string {
    if (msg.includes('evento')) {
      return `📅 Puedes ver los eventos en la sección "Eventos" del menú principal.
✅ Para apuntarte, entra en el evento y pulsa "Apuntarme".
❌ Para cancelar tu inscripción, ve a tu perfil > eventos inscritos.
💶 Si el evento es de pago, el precio aparece indicado. Se paga en el lugar del evento.
⭐ Los eventos destacados aparecen al principio, con una estrella.`;
    }

    if (msg.includes('post')) {
      return `📰 Puedes crear un post desde el botón "Nuevo post".
❤️ Da like pulsando el corazón.
⭐ Marca favoritos pulsando la estrella.
🚩 Reporta contenido con el icono de bandera.`;
    }

    if (msg.includes('perfil')) {
      return `👤 En tu perfil puedes:
- Cambiar tu nombre
- Subir foto de perfil
- Editar tus gustos
- Ver tus posts, likes y eventos`;
    }

    if (msg.includes('registro')) {
      return `📝 Para registrarte, haz clic en "Registrarse" arriba a la derecha.
Si ya tienes cuenta, accede con tu email y contraseña.`;
    }

    if (msg.includes('ayuda')) {
      return `❓ Estoy aquí para ayudarte. Puedes preguntarme sobre:
- Eventos
- Posts
- Perfil
- Registro
O escríbeme lo que necesites 😉`;
    }

    return 'Lo siento, aún no entiendo esa pregunta. ¡Estoy aprendiendo!';
  }
}
