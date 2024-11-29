import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const doctorId = parseInt(params.userId, 10);
    if (isNaN(doctorId)) {
      return NextResponse.json({ success: false, message: 'Invalid doctor ID' }, { status: 400 });
    }

    const records = await prisma.electronicHealthRecord.findMany({
      where: { doctorId },
      select: {
        id: true,
        userId: true,
        doctorId: true,
        createdAt: true,
        updatedAt: true,
        recordData: true,
      },
    });

    if (!records || records.length === 0) {
      return NextResponse.json({ success: false, message: 'No records found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Electronic health records fetched successfully!',
      data: records,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching electronic health records:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}