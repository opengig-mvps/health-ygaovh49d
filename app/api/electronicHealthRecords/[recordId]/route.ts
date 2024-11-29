import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type RecordRequestBody = {
  recordData: {
    notes: string;
    condition: string;
    medications: string[];
  };
};

export async function PATCH(
  request: Request,
  { params }: { params: { recordId: string } }
) {
  try {
    const recordId = parseInt(params.recordId, 10);
    if (isNaN(recordId)) {
      return NextResponse.json({ success: false, message: 'Invalid record ID' }, { status: 400 });
    }

    const body: RecordRequestBody = await request.json();
    const { recordData } = body;

    const existingRecord = await prisma.electronicHealthRecord.findFirst({
      where: { id: recordId },
    });

    if (!existingRecord) {
      return NextResponse.json({ success: false, message: 'Record not found' }, { status: 404 });
    }

    const updatedRecord = await prisma.electronicHealthRecord.update({
      where: { id: recordId },
      data: {
        recordData: recordData as any,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Electronic health record updated successfully!',
      data: updatedRecord,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}