"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/hooks";

interface NotificationProps {
  onClose: () => void;
}

export function Notification({ onClose }: NotificationProps) {
  const { message } = useAppSelector((state) => state.budgetReducer);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <Alert
      variant="destructive"
      className="relative animate-in fade-in slide-in-from-top-2">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="pr-8">{message}</AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute cursor-pointer right-2 top-2 h-6 w-6"
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}>
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}

export default Notification;
