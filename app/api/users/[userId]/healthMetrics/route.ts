import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type HealthMetricRequestBody = {
  goal: number;
  value: number;
  metricType: string;
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

    const healthMetrics = await prisma.healthMetric.findMany({
      where: { userId },
      select: {
        id: true,
        goal: true,
        value: true,
        createdAt: true,
        updatedAt: true,
        metricType: true,
        milestoneAchieved: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Health metrics fetched successfully!',
      data: healthMetrics,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching health metrics:', error);
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

    const body: HealthMetricRequestBody = await request.json();
    const { goal, value, metricType } = body;

    if (!goal || !value || !metricType) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const userExists = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const healthMetric = await prisma.healthMetric.create({
      data: {
        userId,
        goal,
        value,
        metricType,
        milestoneAchieved: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Health metric created successfully!',
      data: {
        id: healthMetric.id,
        goal: healthMetric.goal,
        value: healthMetric.value,
        createdAt: healthMetric.createdAt.toISOString(),
        updatedAt: healthMetric.updatedAt.toISOString(),
        metricType: healthMetric.metricType,
        milestoneAchieved: healthMetric.milestoneAchieved,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating health metric:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}