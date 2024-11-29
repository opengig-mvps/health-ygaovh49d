"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { LoaderCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ElectronicHealthRecord {
  id: number;
  userId: number;
  doctorId: number;
  createdAt: string;
  updatedAt: string;
  recordData: {
    notes: string;
    condition: string;
    medications: string[];
  };
}

const ElectronicHealthRecordsPage: React.FC = () => {
  const [records, setRecords] = useState<ElectronicHealthRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const { userId } = useParams<{ userId: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ notes: string; condition: string; medications: string }>({
    defaultValues: {
      notes: "",
      condition: "",
      medications: "",
    },
  });

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/electronicHealthRecords/${userId}`);
        if (res?.data?.success) {
          setRecords(res?.data?.data);
        }
      } catch (error: any) {
        if (isAxiosError(error)) {
          console.error(error?.response?.data?.message);
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchRecords();
    }
  }, [session, userId]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        recordData: {
          notes: data?.notes,
          condition: data?.condition,
          medications: data?.medications?.split(",").map((med: string) => med?.trim()),
        },
      };

      const response = await api.patch(
        `/api/electronicHealthRecords/${records[0]?.id}`,
        payload
      );

      if (response?.data?.success) {
        toast.success("Electronic health record updated successfully!");
        setRecords([response?.data?.data]);
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
      <h2 className="text-2xl font-bold mb-6">Electronic Health Records</h2>
      {loading ? (
        <LoaderCircleIcon className="animate-spin w-8 h-8 mx-auto" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Patient Health Record</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {records?.map((record) => (
              <div key={record?.id}>
                <p>
                  <strong>Condition:</strong> {record?.recordData?.condition}
                </p>
                <p>
                  <strong>Notes:</strong> {record?.recordData?.notes}
                </p>
                <p>
                  <strong>Medications:</strong>{" "}
                  {record?.recordData?.medications?.join(", ")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Update Health Record</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Input
                {...register("condition", { required: "Condition is required" })}
                placeholder="Enter condition"
              />
              {errors?.condition && (
                <p className="text-red-500 text-sm">{errors?.condition?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                {...register("notes", { required: "Notes are required" })}
                placeholder="Enter notes"
              />
              {errors?.notes && (
                <p className="text-red-500 text-sm">{errors?.notes?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="medications">Medications</Label>
              <Input
                {...register("medications", {
                  required: "Medications are required",
                })}
                placeholder="Enter medications (comma separated)"
              />
              {errors?.medications && (
                <p className="text-red-500 text-sm">
                  {errors?.medications?.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Record"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ElectronicHealthRecordsPage;