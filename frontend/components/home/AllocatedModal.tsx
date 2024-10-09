import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

interface AllocatedModalProps {
  issueNo: number;
  onSubmit: (amount: number) => Promise<void>;
}

export default function AllocatedModal({ issueNo, onSubmit }: AllocatedModalProps) {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    if (!amount) return;

    const amountNumber = parseFloat(amount);
    await onSubmit(amountNumber);
    setIsOpen(false);
    setAmount("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" onClick={() => setIsOpen(true)}>
          Allocate
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Allocate Reward for issue #{issueNo}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <small>
            Hello Pool Manager,
            <br /> how much would you like to allocate to this issue?
          </small>
          <div className="py-4 md:px-4 flex justify-center items-center">
            <div className="flex flex-col items-center justify-between gap-4 w-full">
              <Input
                placeholder="Enter Reward"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
              />
              <div className="py-2">
                <Button size="lg" className="w-full" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
