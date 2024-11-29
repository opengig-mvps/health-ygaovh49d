import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from "@/lib/email-service";

type PaymentRequestBody = {
  amount: number;
  userId: number;
  appointmentId: number;
  paymentMethod: string;
};

export async function POST(request: Request) {
  try {
    const body: PaymentRequestBody = await request.json();

    const { amount, userId, appointmentId, paymentMethod } = body;

    if (!amount || !userId || !appointmentId || !paymentMethod) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, status: 'scheduled' },
    });

    if (!appointment) {
      return NextResponse.json({ success: false, message: 'Appointment not found or not scheduled' }, { status: 404 });
    }

    const payment = await prisma.payment.create({
      data: {
        amount,
        paymentStatus: 'Completed',
        userId,
        appointmentId,
        paymentDate: new Date(),
      },
    });

    await sendEmail({
      to: "user@example.com",
      template: {
        subject: "Payment Receipt",
        html: `<h1>Payment of $${amount} processed successfully!</h1>`,
        text: `Payment of $${amount} processed successfully!`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully!',
      data: {
        id: payment.id,
        amount: payment.amount,
        userId: payment.userId,
        paymentDate: payment.paymentDate,
        appointmentId: payment.appointmentId,
        paymentStatus: payment.paymentStatus,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', data: error }, { status: 500 });
  }
}