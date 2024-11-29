import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type HealthMetricRequestBody = {
  goal: number;
  value: number;
};

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string; metricId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    const metricId = parseInt(params.metricId, 10);

    if (isNaN(userId) || isNaN(metricId)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID or metric ID' }, { status: 400 });
    }

    const body: HealthMetricRequestBody = await request.json();
    const { goal, value } = body;

    const updatedHealthMetric = await prisma.healthMetric.updateMany({
      where: {
        id: metricId,
        userId: userId,
      },
      data: {
        goal: goal,
        value: value,
        updatedAt: new Date(),
      },
    });

    if (updatedHealthMetric.count === 0) {
      return NextResponse.json({ success: false, message: 'Health metric not found or not updated' }, { status: 404 });
    }

    const healthMetric = await prisma.healthMetric.findFirst({
      where: {
        id: metricId,
        userId: userId,
      },
    });

    if (!healthMetric) {
      return NextResponse.json({ success: false, message: 'Health metric not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Health metric updated successfully!',
      data: {
        id: healthMetric.id,
        goal: healthMetric.goal,
        value: healthMetric.value,
        createdAt: healthMetric.createdAt.toISOString(),
        updatedAt: healthMetric.updatedAt.toISOString(),
        metricType: healthMetric.metricType,
        milestoneAchieved: healthMetric.milestoneAchieved,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating health metric:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}