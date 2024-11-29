import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { discussionId: string } }
) {
  try {
    const discussionId = parseInt(params.discussionId, 10);
    if (isNaN(discussionId)) {
      return NextResponse.json({ success: false, message: 'Invalid discussion ID' }, { status: 400 });
    }

    const groupDiscussion = await prisma.groupDiscussion.findFirst({
      where: { id: discussionId },
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

    if (!groupDiscussion) {
      return NextResponse.json({ success: false, message: 'Group discussion not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Group discussion details fetched successfully!',
      data: groupDiscussion,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching group discussion details:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}