import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type AppointmentRequestBody = {
  appointmentDate: string;
};

export async function GET(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  try {
    const appointmentId = parseInt(params.appointmentId, 10);
    if (isNaN(appointmentId)) {
      return NextResponse.json({ success: false, message: 'Invalid appointment ID' }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: {
        id: true,
        status: true,
        userId: true,
        doctorId: true,
        createdAt: true,
        updatedAt: true,
        appointmentDate: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ success: false, message: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment details fetched successfully!',
      data: appointment,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching appointment details:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  try {
    const appointmentId = parseInt(params.appointmentId, 10);
    if (isNaN(appointmentId)) {
      return NextResponse.json({ success: false, message: 'Invalid appointment ID' }, { status: 400 });
    }

    const body: AppointmentRequestBody = await request.json();
    const appointmentDate = new Date(body.appointmentDate);

    const existingAppointment = await prisma.appointment.findFirst({
      where: { id: appointmentId },
    });

    if (!existingAppointment) {
      return NextResponse.json({ success: false, message: 'Appointment not found' }, { status: 404 });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        appointmentDate,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment updated successfully!',
      data: updatedAppointment,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  try {
    const appointmentId = parseInt(params.appointmentId, 10);
    if (isNaN(appointmentId)) {
      return NextResponse.json({ success: false, message: 'Invalid appointment ID' }, { status: 400 });
    }

    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json({ success: false, message: 'Appointment not found' }, { status: 404 });
    }

    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully!',
      data: {
        id: appointment.id,
        status: appointment.status,
        userId: appointment.userId,
        doctorId: appointment.doctorId,
        createdAt: appointment.createdAt.toISOString(),
        updatedAt: appointment.updatedAt.toISOString(),
        appointmentDate: appointment.appointmentDate.toISOString(),
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}