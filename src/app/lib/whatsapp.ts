// src/lib/whatsapp.ts

export const formatPhoneForWhatsApp = (phone: string) => {
  let cleaned = phone
    .replace(/\s+/g, "")
    .replace(/[-()]/g, "")
    .replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+")) {
    cleaned = cleaned.slice(1);
  }

  return cleaned;
};

export const isValidPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
};

export const buildWhatsAppURL = (phone: string, message: string) => {
  const formatted = formatPhoneForWhatsApp(phone);

  return `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;
};
