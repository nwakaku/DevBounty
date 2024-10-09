import React, { useEffect, useState, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AllocatedModal from "./AllocatedModal";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS, NETWORK } from "@/constants";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const aptos = new Aptos(new AptosConfig({ network: NETWORK as Network }));

interface Issue {
  id: number;
  number: number;
  html_url: string;
  title: string;
  body: string;
  state: string;
}

interface IssuesTableProps {
  issues: Issue[];
  onAllocatedReward: (issueNumber: number) => void;
  repoId: number;
  orgData: { address: string };
}

interface RewardInfo {
  amount: number;
  unlockTime: number;
}

const createTransactionPayload = (functionName: string, args: any[]): InputTransactionData => ({
  data: {
    function: `${MODULE_ADDRESS}::reward_distribution::${functionName}`,
    functionArguments: args,
  },
});

export default function IssuesTable({ issues, onAllocatedReward, repoId, orgData }: IssuesTableProps) {
  const { signAndSubmitTransaction } = useWallet();
  const [rewardInfo, setRewardInfo] = useState<{ [key: number]: RewardInfo | null }>({});

  const fetchRewardInfo = useCallback(async () => {
    if (!orgData || !orgData.address) return;

    const rewardInfoPromises = issues.map(async (issue) => {
      try {
        const result = await aptos.view({
          payload: {
            function: `${MODULE_ADDRESS}::reward_distribution::get_reward_info`,
            functionArguments: [orgData.address, issue.number.toString()],
          },
        });
        const [amount, unlockTime] = result as [number, number];
        return [issue.number, { amount: amount / 1e8, unlockTime }];
      } catch (error) {
        console.error(`Error fetching reward info for issue ${issue.number}:`, error);
        return [issue.number, null];
      }
    });

    const results = await Promise.all(rewardInfoPromises);
    setRewardInfo(Object.fromEntries(results));
  }, [issues, orgData]);

  useEffect(() => {
    fetchRewardInfo();
  }, [fetchRewardInfo]);

  const handleAllocateReward = async (issueNumber: number, amount: number) => {
    const amountInCoins = amount * 1e8; // Convert to Octas (8 decimal places)
    const unlockTimeSecs = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now

    try {
      const payload = createTransactionPayload("add_locked_rewards", [
        issueNumber.toString(),
        amountInCoins.toString(),
        unlockTimeSecs.toString(),
      ]);

      const response = await signAndSubmitTransaction(payload);
      console.log("Transaction submitted:", response.hash);
      onAllocatedReward(issueNumber);
      await fetchRewardInfo(); // Refresh reward info after allocation
    } catch (error) {
      console.error("Error submitting transaction:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white font-semibold">No</TableHead>
            <TableHead className="text-white font-semibold">Title</TableHead>
            <TableHead className="text-white font-semibold">Status</TableHead>
            <TableHead className="text-white font-semibold">Org Address</TableHead>
            <TableHead className="text-center text-white font-semibold">Rewards</TableHead>
            <TableHead className="text-center text-white font-semibold">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell className="font-medium">
                <a href={issue.html_url} target="_blank" rel="noopener noreferrer" >
                  #{issue.number}
                </a>
              </TableCell>
              <TableCell>
                <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="underline font-mono">
                  {issue.title}
                </a>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    issue.state === "open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {issue.state}
                </span>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {orgData?.address ? `${orgData.address.slice(0, 6)}...${orgData.address.slice(-4)}` : "N/A"}
              </TableCell>
              <TableCell className="text-center">
                {rewardInfo[issue.number] ? (
                  <div>
                    <span className="font-semibold">{rewardInfo[issue.number]!.amount.toFixed(2)} APT</span>
                    <br />
                    <span className="text-xs text-gray-500">
                      Unlock: {new Date(rewardInfo[issue.number]!.unlockTime * 1000).toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <AllocatedModal
                    issueNo={issue.number}
                    onSubmit={(amount) => handleAllocateReward(issue.number, amount)}
                  />
                )}
              </TableCell>
              <TableCell className="max-w-xs text-center">
                <div className="truncate" title={issue.body}>
                  {issue.body}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
