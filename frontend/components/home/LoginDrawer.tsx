import * as React from "react";
import { Button } from "@/components/ui/button";
import { UserRoundCheck, UsersRound } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function LoginDrawer({ openDrawerButton }: any) {
  return (
    <Dialog>
      {openDrawerButton}
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Register/Login as</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="py-12 md:px-4 flex justify-center items-center">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="w-full h-48 shadow-sm  py-6 px-2 cursor-pointer border border-lime-300 rounded-md">
                <div className="space-y-4">
                  <h2 className="text-slate-300 text-lg text-center font-medium">Pool Manager</h2>
                  <div className="flex justify-center items-center">
                    <div className="rounded-full h-12 w-12 bg-lime-300 flex justify-center items-center">
                      <UsersRound />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 text-center">
                    Create and manage grant pools for your Github organisation
                  </p>
                </div>
              </div>

              <div className="w-full h-48 shadow-sm  py-6 px-2 cursor-pointer border border-lime-300 rounded-md">
                <div className="space-y-4">
                  <h2 className="text-slate-300 text-lg text-center font-medium">Contributor</h2>
                  <div className="flex justify-center items-center">
                    <div className="rounded-full h-12 w-12 bg-purple-300 flex justify-center items-center">
                      <UserRoundCheck />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 text-center">Register as contributor and start developing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const OpenDrawerButton = () => {
  return (
    <DialogTrigger asChild>
      <Button size="sm">Login</Button>
    </DialogTrigger>
  );
};
