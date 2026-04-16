export const sendInvoiceToTelegram = async (blob, caption) => {
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    console.warn("Telegram credentials missing in environment variables.");
    return;
  }

  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('photo', blob, 'invoice.png');
  formData.append('caption', caption);

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to send to Telegram');
  } catch (error) {
    console.error("Telegram Error:", error);
  }
};
