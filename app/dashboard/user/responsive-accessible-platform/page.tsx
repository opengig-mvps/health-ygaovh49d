"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LoaderCircleIcon } from "lucide-react";

const ResponsiveAccessiblePlatform: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000); // Mock loading duration
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Responsive & Accessible Platform</h2>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter your name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" required />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="agreement" />
          <Label htmlFor="agreement">I agree to the terms and conditions</Label>
        </div>
        <Button type="submit" onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleButtonClick(e)} className="w-full">
          {loading ? (
            <LoaderCircleIcon className="animate-spin w-4 h-4" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ResponsiveAccessiblePlatform;