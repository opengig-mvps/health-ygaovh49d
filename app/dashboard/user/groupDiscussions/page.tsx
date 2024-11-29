"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";

interface Discussion {
  id: number;
  topic: string;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEncrypted: boolean;
}

interface Message {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEncrypted: boolean;
}

const GroupDiscussionsPage: React.FC = () => {
  const { data: session } = useSession();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");
  const { discussionId } = useParams<{ discussionId: string }>();

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/groupDiscussions");
        setDiscussions(res?.data?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  const postMessage = async () => {
    if (!newMessage.trim()) {
      toast.error("Message content cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        userId: session?.user?.id,
        content: newMessage,
      };

      const response = await axios.post(
        `/api/groupDiscussions/${discussionId}/messages`,
        payload
      );

      if (response?.data?.success) {
        toast.success("Message posted successfully!");
        setNewMessage("");
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
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
      <h2 className="text-2xl font-bold mb-6">Group Discussions</h2>
      <div className="space-y-6">
        {discussions?.map((discussion: Discussion) => (
          <Card key={discussion?.id}>
            <CardHeader>
              <CardTitle>{discussion?.topic}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{discussion?.content}</p>
              <div className="mt-4">
                <Textarea
                  value={newMessage}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e?.target?.value)}
                  placeholder="Write a message..."
                />
                <Button
                  className="mt-2 w-full"
                  onClick={postMessage}
                  disabled={loading}
                >
                  {loading ? (
                    <LoaderCircleIcon className="animate-spin" />
                  ) : (
                    "Post Message"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GroupDiscussionsPage;