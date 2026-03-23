// lib/whatsapp-client.ts
import { Client, LocalAuth } from "whatsapp-web.js";
import * as qrcode from "qrcode-terminal";

class WhatsAppService {
  private client: Client;
  private isReady = false;
  private qrGenerated = false;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"], // necesario en algunos entornos
      },
    });

    this.client.on("qr", (qr) => {
      this.qrGenerated = true;
      console.log("\n📱 ESCANEA ESTE CÓDIGO QR CON WHATSAPP:\n");
      qrcode.generate(qr, { small: true });
      console.log("\n");
    });

    this.client.on("ready", () => {
      this.isReady = true;
      console.log("✅ Cliente de WhatsApp listo");
    });

    this.client.on("authenticated", () => {
      console.log("🔐 Autenticación exitosa");
    });

    this.client.on("auth_failure", (msg) => {
      console.error("❌ Error de autenticación:", msg);
    });

    this.client.on("disconnected", (reason) => {
      console.log("⚠️ Cliente desconectado:", reason);
      this.isReady = false;
      // Opcional: reconectar
      this.client.initialize();
    });

    this.client.initialize();
  }

  async sendMessage(phone: string, message: string): Promise<boolean> {
    if (!this.isReady) {
      throw new Error(
        "Cliente de WhatsApp no listo. Espera a que se establezca la conexión.",
      );
    }

    try {
      // Formato internacional sin '+' y con código de país
      const cleanPhone = phone.replace(/\D/g, "");
      const chatId = cleanPhone.includes("@c.us")
        ? cleanPhone
        : `${cleanPhone}@c.us`;

      const response = await this.client.sendMessage(chatId, message);
      console.log(`✅ Mensaje enviado a ${phone}:`, response.id);
      return true;
    } catch (error) {
      console.error(`❌ Error enviando a ${phone}:`, error);
      return false;
    }
  }

  getStatus() {
    return {
      ready: this.isReady,
      qrGenerated: this.qrGenerated,
    };
  }
  // En src/lib/whatsapp-client.ts, dentro de la clase WhatsAppService
  get status() {
    return {
      ready: this.isReady,
      qrGenerated: this.qrGenerated,
    };
  }
}
export const whatsappClient = new WhatsAppService();
// Singleton para usar en toda la app
export const whatsapp = new WhatsAppService();
