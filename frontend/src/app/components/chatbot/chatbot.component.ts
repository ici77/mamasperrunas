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
    if (msg.includes('registr')) return 'Para registrarte, ve al botón "Registrarse" en la esquina superior derecha.';
    if (msg.includes('apuntar')) return 'Haz clic en "Apuntarme" dentro de un evento para unirte.';
    return 'Lo siento, aún no entiendo esa pregunta. ¡Estoy aprendiendo!';
  }
}
