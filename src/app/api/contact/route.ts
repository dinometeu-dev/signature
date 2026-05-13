import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json(
      { error: 'Telegram credentials are not configured' },
      { status: 500 }
    );
  }

  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'name, email, and message are required' },
      { status: 400 }
    );
  }

  const text = [
    '📬 *New contact message*',
    '',
    `👤 *Name:* ${name}`,
    `📧 *Email:* ${email}`,
    '',
    `💬 *Message:*\n${message}`,
  ].join('\n');

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json(
      { error: `Telegram API error: ${error}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
