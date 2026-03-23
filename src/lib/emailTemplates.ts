// src/lib/emailTemplates.ts
export function beckAlertTemplate(
  userName: string,
  score: number,
  level: string,
  date: Date,
) {
  const formattedDate = date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
        .header { background-color: #4f46e5; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 20px; }
        .score { font-size: 24px; font-weight: bold; color: #4f46e5; }
        .level { font-size: 20px; font-weight: bold; }
        .level.moderado { color: #f59e0b; }
        .level.severo { color: #ef4444; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Alerta de Salud Mental - EchoMind</h2>
        </div>
        <div class="content">
          <p>Hola,</p>
          <p>El usuario <strong>${userName}</strong> ha completado el test de Beck y el resultado indica un nivel <strong class="level ${level}">${level}</strong>.</p>
          <p>Puntuación obtenida: <span class="score">${score}</span></p>
          <p>Fecha del test: ${formattedDate}</p>
          <p>Este resultado puede requerir atención. Por favor, contacta a la persona si lo consideras necesario.</p>
          <p>Gracias por ser parte de la red de apoyo de EchoMind.</p>
        </div>
        <div class="footer">
          <p>Este es un mensaje automático, por favor no responder.</p>
          <p>&copy; ${new Date().getFullYear()} EchoMind</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
