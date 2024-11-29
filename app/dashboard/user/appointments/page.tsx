"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-picker";
import api from "@/lib/api";
import { LoaderCircleIcon, Calendar } from "lucide-react";

const AppointmentsPage: React.FC = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(
    undefined
  );

  const bookAppointment = async () => {
    if (!appointmentDate) return;

    try {
      setLoading(true);
      const payload = {
        userId: session?.user?.id,
        doctorId: 2,
        appointmentDate: appointmentDate?.toISOString(),
      };

      const response = await api.post("/api/appointments", payload);

      if (response?.data?.success) {
        toast.success("Appointment booked successfully!");
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Failed to book appointment");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Book a Shared Medical Appointment</h2>
      <Card>
        <CardHeader>
          <CardTitle>Select an Appointment Slot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <h3 className="text-lg font-medium">Pick a Date and Time</h3>
            </div>
            <DateTimePicker
              date={appointmentDate}
              setDate={setAppointmentDate}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={bookAppointment}
            disabled={loading || !appointmentDate}
          >
            {loading ? (
              <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              "Book Appointment"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppointmentsPage;