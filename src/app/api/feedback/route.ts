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

  const formData = await req.formData();
  const type = formData.get('type') as string | null;
  const path = formData.get('path') as string | null;
  const description = formData.get('description') as string | null;
  const image = formData.get('image') as File | null;

  if (!type || !description) {
    return NextResponse.json(
      { error: 'type and description are required' },
      { status: 400 }
    );
  }

  const typeEmoji: Record<string, string> = {
    'Visual Bug': '🎨',
    'Logic Bug': '🐛',
    Suggestion: '💡',
    Other: '📝',
  };

  const text = [
    `${typeEmoji[type] ?? '📝'} *New Feedback — ${type}*`,
    '',
    `📍 *Path:* \`${path || '/'}\``,
    '',
    `📋 *Description:*\n${description}`,
  ].join('\n');

  const baseUrl = `https://api.telegram.org/bot${token}`;

  if (image && image.size > 0) {
    const body = new FormData();
    body.append('chat_id', chatId);
    body.append('photo', image, image.name);
    body.append('caption', text.slice(0, 1024));
    body.append('parse_mode', 'Markdown');

    const response = await fetch(`${baseUrl}/sendPhoto`, {
      method: 'POST',
      body,
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Telegram API error: ${error}` },
        { status: 502 }
      );
    }
  } else {
    const response = await fetch(`${baseUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Telegram API error: ${error}` },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
