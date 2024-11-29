import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type GroupDiscussionRequestBody = {
  topic: string;
  userId: number;
  content: string;
};

export async function POST(request: Request) {
  try {
    const body: GroupDiscussionRequestBody = await request.json();

    const { topic, userId, content } = body;

    if (!topic || !userId || !content) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const groupDiscussion = await prisma.groupDiscussion.create({
      data: {
        userId,
        topic,
        content,
        isEncrypted: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Group discussion created successfully!',
      data: {
        id: groupDiscussion.id,
        topic: groupDiscussion.topic,
        userId: groupDiscussion.userId,
        content: groupDiscussion.content,
        createdAt: groupDiscussion.createdAt.toISOString(),
        updatedAt: groupDiscussion.updatedAt.toISOString(),
        isEncrypted: groupDiscussion.isEncrypted,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating group discussion:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('userId');
    if (!userId) {
      return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
    }

    const userIdInt = parseInt(userId, 10);
    if (isNaN(userIdInt)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }

    const groupDiscussions = await prisma.groupDiscussion.findMany({
      where: { userId: userIdInt },
      select: {
        id: true,
        topic: true,
        userId: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        isEncrypted: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Group discussions fetched successfully!',
      data: groupDiscussions,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching group discussions:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}