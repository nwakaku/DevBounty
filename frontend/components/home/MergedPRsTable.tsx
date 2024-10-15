import React, { useEffect, useState, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS, NETWORK } from "@/constants";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const aptos = new Aptos(new AptosConfig({ network: NETWORK as Network }));

interface MergedPR {
  id: number;
  number: number;
  html_url: string;
  title: string;
  user: {
    login: string;
  };
  merged_at: string;
  fixesReference: number;
}

interface MergedPRsTableProps {
  mergedPRs: MergedPR[];
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

export default function MergedPRsTable({ mergedPRs, orgData }: MergedPRsTableProps) {
  const { signAndSubmitTransaction, connected, account } = useWallet();
  const [rewardInfo, setRewardInfo] = useState<{ [key: number]: RewardInfo | null }>({});
  const [isUser, setIsUser] = useState<string | undefined>();

  const fetchRewardInfo = useCallback(async () => {
    if (!orgData?.address) return;

    const rewardInfoPromises = mergedPRs.map(async (pr) => {
      try {
        const result = await aptos.view({
          payload: {
            function: `${MODULE_ADDRESS}::reward_distribution::get_reward_info`,
            functionArguments: [orgData.address, pr.fixesReference],
          },
        });
        const [amount, unlockTime] = result as [number, number];
        return [pr.fixesReference, { amount: amount / 1e8, unlockTime }];
      } catch (error) {
        console.error(`Error fetching reward info for PR ${pr.number}:`, error);
        return [pr.fixesReference, null];
      }
    });

    const results = await Promise.all(rewardInfoPromises);
    setRewardInfo(Object.fromEntries(results));
  }, [mergedPRs, orgData]);

  useEffect(() => {
    fetchRewardInfo();
  }, [fetchRewardInfo]);

  useEffect(() => {
    if (connected && account) {
      const userAddress = account.address;
      const userData = localStorage.getItem(userAddress);
      if (userData) {
        try {
          const userDataObj = JSON.parse(userData);
          const screenName = userDataObj.reloadUserInfo?.screenName;
          setIsUser(screenName);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, [connected, account]);

  const handleClaimReward = async (prId: number, fixesReference: number) => {
    try {
      const payload = createTransactionPayload("claim_reward", [orgData.address, fixesReference.toString()]);
      const response = await signAndSubmitTransaction(payload);
      console.log("Transaction submitted:", response.hash);

      await aptos.waitForTransaction({ transactionHash: response.hash });

      console.log("Transaction confirmed");
      await fetchRewardInfo();
    } catch (error) {
      console.error("Error claiming reward:", error);
    }
  };

  const renderClaimButton = (pr: MergedPR) => {
    const info = rewardInfo[pr.fixesReference];
    if (!info) return <p>Closed</p>;

    const now = Math.floor(Date.now() / 1000);
    const isClaimable = now >= info.unlockTime;
    return (
      <Button
        onClick={() => handleClaimReward(pr.id, pr.fixesReference)}
        disabled={!isClaimable}
        className={isClaimable ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"}
      >
        {isClaimable ? `Claim ${info.amount.toFixed(2)} APT` : "Locked"}
      </Button>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white font-semibold">Title</TableHead>
            <TableHead className="text-white font-semibold">Author</TableHead>
            <TableHead className="text-white font-semibold">Merged At</TableHead>
            <TableHead className="text-center text-white font-semibold">Issue Fixed</TableHead>
            <TableHead className="text-center text-white font-semibold">Reward</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mergedPRs.map((pr) => (
            <TableRow key={pr.id}>
              <TableCell>
                <a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="underline font-mono">
                  {pr.title}
                </a>
              </TableCell>
              <TableCell>{pr.user.login}</TableCell>
              <TableCell>{new Date(pr.merged_at).toLocaleString()}</TableCell>
              <TableCell className="text-center">#{pr.fixesReference}</TableCell>
              <TableCell className="text-center">
                {isUser === pr.user.login ? renderClaimButton(pr) : "Closed"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
