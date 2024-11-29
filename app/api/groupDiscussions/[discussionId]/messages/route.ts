import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from "@/lib/email-service";

type MessageRequestBody = {
  userId: number;
  content: string;
};

export async function POST(
  request: Request,
  { params }: { params: { discussionId: string } }
) {
  try {
    const discussionId = parseInt(params.discussionId, 10);
    if (isNaN(discussionId)) {
      return NextResponse.json({ success: false, message: 'Invalid discussion ID' }, { status: 400 });
    }

    const body: MessageRequestBody = await request.json();
    const { userId, content } = body;

    if (!userId || !content) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const groupDiscussion = await prisma.groupDiscussion.findFirst({
      where: { id: discussionId },
    });

    if (!groupDiscussion) {
      return NextResponse.json({ success: false, message: 'Group discussion not found' }, { status: 404 });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId: groupDiscussion.userId,
        content,
        isEncrypted: true,
      },
    });

    const notificationEmails = await prisma.user.findMany({
      where: {
        groupDiscussions: {
          some: {
            id: discussionId,
          },
        },
      },
      select: {
        email: true,
      },
    });

    await sendEmail({
      to: notificationEmails.map(user => user.email),
      template: {
        subject: "New message in group discussion",
        html: `<p>A new message has been posted in the discussion: ${content}</p>`,
        text: `A new message has been posted in the discussion: ${content}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Message posted successfully!',
      data: {
        id: newMessage.id,
        userId: newMessage.senderId,
        content: newMessage.content,
        createdAt: newMessage.createdAt.toISOString(),
        updatedAt: newMessage.updatedAt.toISOString(),
        isEncrypted: newMessage.isEncrypted,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error posting message:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}