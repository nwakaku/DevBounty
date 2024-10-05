import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

interface AllocatedModalProps {
  onClick: () => void;
}

export default function AllocatedModal({ OpenModalButton, issueId }: { OpenModalButton: any; issueId: number }) {
  return (
    <Dialog>
      {OpenModalButton}
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Allocate Reward for issue #{issueId}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="py-12 md:px-4 flex justify-center items-center">
            <div className="flex flex-col items-center justify-between gap-8 w-full">
              <Input placeholder="Enter Reward" />
              <div className="py-2">
                <Button size="sm" className="w-full">
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

export const OpenModalButton = ({ onClick }: AllocatedModalProps) => {
  return (
    <DialogTrigger asChild onClick={onClick}>
      <Button size="sm" variant="ghost">
        Allocate
      </Button>
    </DialogTrigger>
  );
};
