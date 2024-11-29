"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircleIcon } from "lucide-react";

interface Metric {
  id: number;
  metricType: string;
  value: number;
  goal: number;
  milestoneAchieved: boolean;
}

interface Message {
  id: number;
  content: string;
  isEncrypted: boolean;
}

const HealthDashboard: React.FC = () => {
  const { data: session } = useSession();
  const [healthMetrics, setHealthMetrics] = useState<Metric[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMetric, setNewMetric] = useState({
    goal: "",
    value: "",
    metricType: "",
  });
  const [newMessage, setNewMessage] = useState({
    content: "",
    receiverId: "",
  });
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(false);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [loadingCreateMetric, setLoadingCreateMetric] = useState<boolean>(false);
  const [loadingSendMessage, setLoadingSendMessage] = useState<boolean>(false);

  useEffect(() => {
    if (!session) return;

    const fetchHealthMetrics = async () => {
      try {
        setLoadingMetrics(true);
        const res = await api.get(`/api/users/${session?.user?.id}/healthMetrics`);
        setHealthMetrics(res.data?.data || []);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error(error.response?.data?.message ?? "Failed to fetch health metrics");
        }
      } finally {
        setLoadingMetrics(false);
      }
    };

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await api.get(`/api/users/${session?.user?.id}/messages`);
        setMessages(res.data?.data || []);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error(error.response?.data?.message ?? "Failed to fetch messages");
        }
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchHealthMetrics();
    fetchMessages();
  }, [session]);

  const createHealthMetric = async () => {
    try {
      setLoadingCreateMetric(true);
      const payload = {
        goal: Number(newMetric.goal),
        value: Number(newMetric.value),
        metricType: newMetric.metricType,
      };
      const res = await api.post(`/api/users/${session?.user?.id}/healthMetrics`, payload);
      if (res.data?.success) {
        toast.success("Health metric created successfully!");
        setHealthMetrics([...healthMetrics, res.data?.data]);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to create health metric");
      } else {
        console.error(error);
      }
    } finally {
      setLoadingCreateMetric(false);
    }
  };

  const sendMessage = async () => {
    try {
      setLoadingSendMessage(true);
      const payload = {
        content: newMessage.content,
        receiverId: Number(newMessage.receiverId),
      };
      const res = await api.post(`/api/users/${session?.user?.id}/messages`, payload);
      if (res.data?.success) {
        toast.success("Message sent successfully!");
        setMessages([...messages, res.data?.data]);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to send message");
      } else {
        console.error(error);
      }
    } finally {
      setLoadingSendMessage(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Health Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Health Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingMetrics ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              healthMetrics?.map((metric: Metric) => (
                <div key={metric?.id} className="p-4 border rounded-lg">
                  <p>Type: {metric?.metricType}</p>
                  <p>Value: {metric?.value}</p>
                  <p>Goal: {metric?.goal}</p>
                  <p>Milestone Achieved: {metric?.milestoneAchieved ? "Yes" : "No"}</p>
                </div>
              ))
            )}
            <div className="space-y-2">
              <Label>New Health Metric</Label>
              <Input
                placeholder="Metric Type"
                value={newMetric?.metricType}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewMetric({ ...newMetric, metricType: e.target.value })
                }
              />
              <Input
                placeholder="Goal"
                value={newMetric?.goal}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewMetric({ ...newMetric, goal: e.target.value })
                }
              />
              <Input
                placeholder="Value"
                value={newMetric?.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewMetric({ ...newMetric, value: e.target.value })
                }
              />
              <Button
                onClick={createHealthMetric}
                disabled={loadingCreateMetric}
                className="w-full mt-4"
              >
                {loadingCreateMetric ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : (
                  "Add Metric"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingMessages ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              messages?.map((message: Message) => (
                <div key={message?.id} className="p-4 border rounded-lg">
                  <p>Content: {message?.content}</p>
                  <p>Encrypted: {message?.isEncrypted ? "Yes" : "No"}</p>
                </div>
              ))
            )}
            <div className="space-y-2">
              <Label>New Message</Label>
              <Textarea
                placeholder="Message Content"
                value={newMessage?.content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNewMessage({ ...newMessage, content: e.target.value })
                }
              />
              <Input
                placeholder="Receiver ID"
                value={newMessage?.receiverId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewMessage({ ...newMessage, receiverId: e.target.value })
                }
              />
              <Button
                onClick={sendMessage}
                disabled={loadingSendMessage}
                className="w-full mt-4"
              >
                {loadingSendMessage ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthDashboard;