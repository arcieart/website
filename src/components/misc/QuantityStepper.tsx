import { useState } from "react";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

type QuantityStepperProps = {
  quantity: number;
  increment: () => void;
  decrement: () => void;
};

export const QuantityStepper = ({
  quantity,
  increment,
  decrement,
}: QuantityStepperProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex items-center border rounded-full w-fit">
      <Button
        variant="ghost"
        type="button"
        size="icon"
        className="h-8 w-8 rounded-l-full hover:bg-transparent"
        disabled={isMounted && quantity <= 1}
        onClick={() => quantity > 1 && decrement()}
      >
        <Minus className="w-4 h-4" />
      </Button>
      <span className="w-8 text-center text-sm">{quantity}</span>
      <Button
        variant="ghost"
        type="button"
        size="icon"
        className="h-8 w-8 rounded-r-full hover:bg-transparent"
        onClick={() => increment()}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};
