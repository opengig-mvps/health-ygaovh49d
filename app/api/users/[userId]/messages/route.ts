import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type MessageRequestBody = {
  content: string;
  receiverId: number;
};

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      select: {
        id: true,
        content: true,
        senderId: true,
        receiverId: true,
        isEncrypted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Messages fetched successfully!',
      data: messages,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const body: MessageRequestBody = await request.json();
    const { content, receiverId } = body;

    if (!content || isNaN(receiverId)) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const encryptedContent = content; // Assuming encryption logic is not available

    const message = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId,
        content: encryptedContent,
        isEncrypted: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
      data: {
        id: message.id,
        content: content,
        senderId: message.senderId,
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt.toISOString(),
        receiverId: message.receiverId,
        isEncrypted: message.isEncrypted,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}