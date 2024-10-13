import { Wallet, GitGraph } from "lucide-react";

export function StatsCard() {
  const repoCount = localStorage.getItem("repoCount");
  return (
    <div className="flex items-center gap-4">
      <div className="p-4 shadow-sm rounded-md border border-gray-600 space-y-2 bg-[#111128]">
        <h2 className="text-md md:text-lg text-white">Available Funds</h2>
        <div className="flex justify-between items-center">
          <h1 className="md:text-2xl text-white font-bold md:font-medium">9600 APTOs</h1>
          {/* <Wallet className="h-10 w-10 text-[#6EE7B7] font-bold" /> */}
        </div>
        <p className="text-sm text-slate-400">Total rewards of all repositories</p>
      </div>
      <div className="p-4 shadow-sm rounded-md border border-gray-600 space-y-2 bg-[#111128]">
        <h2 className="text-md md:text-lg text-white">Repositories</h2>
        <div className="flex justify-between items-center">
          <h1 className="md:text-2xl text-white font-bold md:font-medium">{repoCount}</h1>
          <GitGraph className="h-6 w-6 text-[#4F46E5] font-bold" />
        </div>
        <p className="text-sm text-slate-400">Total number of repositories</p>
      </div>
    </div>
  );
}
