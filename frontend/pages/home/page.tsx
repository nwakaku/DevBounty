"use client";

import { AccountInfo } from "@/components/AccountInfo";
import { Header } from "@/components/Header";
import { MessageBoard } from "@/components/MessageBoard";
import { NetworkInfo } from "@/components/NetworkInfo";
import { TransferAPT } from "@/components/TransferAPT";
import { WalletDetails } from "@/components/WalletDetails";
// import { StatsCard } from "@/components/home/StatsCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gem } from "lucide-react";

// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import axios from "axios";
import { StatsCard } from "@/components/home/StatsCard";
import RepoTable from "@/components/home/RepoTable";
import IssueStat from "@/components/home/IssueStat";
import { Repository } from "@/types";
import IssuesTable from "@/components/home/IssuesTable";

const organisations = ["nwakaku", "aptos-labs", "worldcoin"];

function Home() {
  const { connected } = useWallet();
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [repoId, setRepoId] = useState<number | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);

  const fetchAllIssues = async (repo: Repository) => {
    try {
      setSelectedRepo(repo.name);
      setRepoId(repo.id);
      const response = await axios.get(`https://api.github.com/repos/${repo.organisation}/${repo.name}/issues`);
      const issueData = response.data;
      console.log({ issueData });

      localStorage.setItem("issueNumber", issueData.length);
      setIssues(issueData);
    } catch (error) {
      setIssues([]);
    }
  };

  return (
    <>
      <Header />
      <div className="md:px-8">
        {connected ? (
          <div className="flex items-center justify-center flex-col">
            <Card>
              <CardContent className="flex flex-col gap-10 pt-6">
                <WalletDetails />
                <NetworkInfo />
                <AccountInfo />
                <TransferAPT />
                <MessageBoard />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="py-4 px-2">
            {selectedRepo ? (
              <div className="flex justify-between items-center flex-wrap gap-4">
                <Button size="sm" onClick={() => setSelectedRepo("")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back to Repositories
                </Button>
                <IssueStat />
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <StatsCard />
                  <Button size="sm">
                    <Gem className="mr-2 h-4 w-4" />
                    View Attestation
                  </Button>
                </div>
              </div>
            )}

            <div className="py-8">
              {selectedRepo ? (
                <IssuesTable
                  issues={issues}
                  onAllocatedReward={(issueId: number) => {
                    setSelectedIssueId(issueId);
                  }}
                  repoId={repoId}
                />
              ) : (
                <RepoTable onRepoSelect={(repo) => fetchAllIssues(repo)} />
              )}
            </div>
          </div>
          // <CardHeader>
          //   <CardTitle>To get started Connect a wallet</CardTitle>
          // </CardHeader>
        )}
      </div>
    </>
  );
}

export default Home;
