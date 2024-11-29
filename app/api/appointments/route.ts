import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from "@/lib/email-service";

type AppointmentRequestBody = {
  userId: number;
  doctorId: number;
  appointmentDate: string;
};

export async function POST(request: Request) {
  try {
    const body: AppointmentRequestBody = await request.json();

    const userId = parseInt(body.userId as any, 10);
    const doctorId = parseInt(body.doctorId as any, 10);
    const appointmentDate = new Date(body.appointmentDate).toISOString();

    if (isNaN(userId) || isNaN(doctorId)) {
      return NextResponse.json({ success: false, message: 'Invalid user or doctor ID' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ where: { id: userId } });
    const doctor = await prisma.user.findFirst({ where: { id: doctorId, role: 'doctor' } });

    if (!user || !doctor) {
      return NextResponse.json({ success: false, message: 'User or Doctor not found' }, { status: 404 });
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: new Date(appointmentDate),
      },
    });

    if (existingAppointment) {
      return NextResponse.json({ success: false, message: 'Appointment slot not available' }, { status: 409 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        doctorId,
        appointmentDate: new Date(appointmentDate),
      },
    });

    await sendEmail({
      to: user.email,
      template: {
        subject: "Appointment Confirmation",
        html: `<h1>Your appointment is confirmed for ${appointmentDate}</h1>`,
        text: `Your appointment is confirmed for ${appointmentDate}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully!',
      data: {
        id: appointment.id,
        status: appointment.status,
        userId: appointment.userId,
        doctorId: appointment.doctorId,
        createdAt: appointment.createdAt.toISOString(),
        updatedAt: appointment.updatedAt.toISOString(),
        appointmentDate: appointment.appointmentDate.toISOString(),
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error booking appointment:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}