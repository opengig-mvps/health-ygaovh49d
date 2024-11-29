"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { LoaderCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import api from "@/lib/api";

type PaymentFormData = {
  amount: string;
  appointmentId: string;
  paymentMethod: string;
};

const PaymentPage: React.FC = () => {
  const { data: session } = useSession();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PaymentFormData>();
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const onSubmit = async (data: PaymentFormData) => {
    try {
      const payload = {
        amount: Number(data?.amount),
        userId: session?.user?.id,
        appointmentId: Number(data?.appointmentId),
        paymentMethod: paymentMethod,
      };

      const response = await api.post("/api/payments", payload);

      if (response?.data?.success) {
        toast.success("Payment processed successfully!");
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Payment for Shared Medical Appointment</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Input {...register("amount", { required: "Amount is required" })} placeholder="Enter amount" />
              {errors?.amount && (
                <p className="text-red-500 text-sm">{errors?.amount?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input {...register("appointmentId", { required: "Appointment ID is required" })} placeholder="Enter appointment ID" />
              {errors?.appointmentId && (
                <p className="text-red-500 text-sm">{errors?.appointmentId?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Select value={paymentMethod} onValueChange={(value: string) => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              {errors?.paymentMethod && (
                <p className="text-red-500 text-sm">{errors?.paymentMethod?.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                "Confirm Payment"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PaymentPage;