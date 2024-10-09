import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, UserRoundCheck, UsersRound } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const provider = new GithubAuthProvider();

export default function GitHubAuthComponent() {
  const [user, setUser] = useState<any>();
  const [error, setError] = useState<any>();
  const { account } = useWallet();
  const [open, setOpen] = useState(false);

  const handleGitHubLogin = async () => {
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      setUser(result.user);
      setError(null);

      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", token || "");
    } catch (error) {
      console.log(error);
      setUser(null);
      setError("Failed to login with GitHub");
    }
  };

  const handleRoleSelection = (role: string) => {
    const userAddr = account?.address ?? "";
    const updatedUser = { ...user, role, userAddr };
    setUser(updatedUser);

    if (userAddr) {
      localStorage.setItem(userAddr, JSON.stringify(updatedUser));
    } else {
      console.warn("User address is undefined. Unable to save to localStorage.");
    }

    console.log(updatedUser);
    window.location.reload();

    // Close the modal
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Github /> Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-slate-200">
        <DialogHeader>
          <DialogTitle>{user ? "Select Your Role" : "GitHub Login"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!user ? (
            <div className="flex justify-center">
              <Button onClick={handleGitHubLogin}>
                <Github className="mr-2" /> Login with GitHub
              </Button>
            </div>
          ) : (
            <div className="py-12 md:px-4 flex justify-center items-center">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div
                  className="w-full h-48 shadow-sm py-2 px-2 cursor-pointer border border-[#111128] rounded-md"
                  onClick={() => handleRoleSelection("poolManager")}
                >
                  <div className="space-y-2">
                    <h2 className="text-[#111128] text-lg text-center font-semibold">Pool Manager</h2>
                    <div className="flex justify-center items-center">
                      <div className="rounded-full h-24 w-24 bg-lime-300 flex justify-center items-center">
                        <UsersRound size={30} />
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 text-center">
                      Create and manage grant pools for your Github organisation
                    </p>
                  </div>
                </div>

                <div
                  className="w-full h-48 shadow-sm py-2 px-2 cursor-pointer border border-[#111128] rounded-md"
                  onClick={() => handleRoleSelection("contributor")}
                >
                  <div className="space-y-2">
                    <h2 className="text-[#111128] text-lg text-center font-semibold">Contributor</h2>
                    <div className="flex justify-center items-center">
                      <div className="rounded-full h-24 w-24 bg-purple-300 flex justify-center items-center">
                        <UserRoundCheck size={30} />
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 text-center">Register as contributor and start developing</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
