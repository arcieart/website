"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

interface OrderConfirmationDialogProps {
  isOpen: boolean;
  orderId: string;
  customerName?: string;
  orderTotal?: string;
  onClose: (orderId: string) => void;
}

export default function OrderConfirmationDialog({
  isOpen,
  orderId,
  orderTotal,
  onClose,
}: OrderConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg mx-auto border-0 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-60" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl transform translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-2xl transform -translate-x-12 translate-y-12" />

        <div className="relative z-10">
          <DialogHeader className="text-center space-y-6 pb-2">
            {/* Success Icon with Animation */}
            <div
              className={`mx-auto transition-all duration-700 ease-out transform ${"scale-100 opacity-100 rotate-0"}`}
            >
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 border border-emerald-500/30 shadow-lg backdrop-blur-sm">
                  <CheckCircle className="h-10 w-10 text-emerald-600 drop-shadow-sm" />
                </div>
                {/* Subtle pulse animation */}
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-20" />
              </div>
            </div>

            {/* Title with Slide Animation */}
            <div
              className={`transition-all duration-500 delay-200 ease-out transform ${"translate-y-0 opacity-100"}`}
            >
              <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent leading-tight">
                <div className="flex items-center justify-center gap-2">
                  Order Confirmed!
                </div>
              </DialogTitle>
              <div className="flex items-center justify-center gap-1 mt-2 opacity-60">
                <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground tracking-wide">
                  Thank you for your purchase
                </span>
                <Sparkles className="h-3 w-3 text-primary animate-pulse delay-1000" />
              </div>
            </div>
          </DialogHeader>

          {/* Order Details Card */}
          <div
            className={`transition-all duration-500 delay-300 ease-out transform ${"translate-y-0 opacity-100"}`}
          >
            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-center gap-2 text-foreground/90">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Order ID
                  </p>
                  <p className="font-mono text-sm font-semibold">{orderId}</p>
                </div>
              </div>

              {orderTotal && (
                <div className="pt-3 border-t border-border/30">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Amount
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      {orderTotal}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Countdown and Action */}
          <div
            className={`space-y-4 pt-6 transition-all duration-500 delay-500 ease-out transform ${"translate-y-0 opacity-100"}`}
          >
            {/* Action Button */}
            <Button
              onClick={() => onClose(orderId)}
              variant="secondary"
              className="w-full"
              size="lg"
            >
              <span className="flex items-center gap-2">
                View Order Details
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
