import { GitGraph, Wallet } from "lucide-react";
import React from "react";

export default function IssueStat() {
  const numIssue = localStorage.getItem("issueNumber");
  return (
    <div className="flex items-center gap-4">
      <div className="p-4 shadow-sm rounded-md border space-y-2 ">
        <h2 className="text-md md:text-lg text-slate-500">Unallocated Rewards</h2>
        <div className="flex justify-between items-center">
          <h1 className="md:text-2xl text-slate-500 font-bold md:font-medium">0.009 ETH</h1>
          <Wallet className="h-6 w-6 text-lime-200 font-bold" />
        </div>
        <p className="text-sm text-slate-400">Total rewards for all Issues</p>
      </div>
      <div className="p-4 shadow-sm rounded-md border space-y-2">
        <h2 className="text-md md:text-lg text-slate-500">Open Issues</h2>
        <div className="flex justify-between items-center">
          <h1 className="md:text-2xl text-slate-500 font-bold md:font-medium">{numIssue || "0"}</h1>
          <GitGraph className="h-6 w-6 text-blue-300 font-bold" />
        </div>
        <p className="text-sm text-slate-400">Total number of Issues</p>
      </div>
    </div>
  );
}
