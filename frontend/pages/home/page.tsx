import React, { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { StatsCard } from "@/components/home/StatsCard";
import RepoTable from "@/components/home/RepoTable";
import IssueStat from "@/components/home/IssueStat";
import IssuesTable from "@/components/home/IssuesTable";
import { Repository } from "@/types";
import GitHubAuthComponent from "@/components/home/LoginDrawer";
import MergedPRsTable from "@/components/home/MergedPRsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Initialize Octokit
const octokit = new Octokit({
  auth: "", // Make sure to set this in your environment variables
});

function Home() {
  const { connected, account } = useWallet();
  const [selectedRepo, setSelectedRepo] = useState<(Repository & { orgData?: any }) | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [mergedPRs, setMergedPRs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchAllIssues = async (repo: Repository & { orgData?: any }) => {
    console.log(repo);
    if (!repo || !repo.organisation || !repo.name) {
      setError("Invalid repository information.");
      return;
    }

    try {
      setError(null);
      setSelectedRepo(repo);

      const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
        owner: repo.organisation,
        repo: repo.name,
        state: "open",
        per_page: 50,
      });

      const filteredIssues = issues.filter((issue: any) => !issue.pull_request);

      console.log({ filteredIssues });
      setIssues(filteredIssues);
    } catch (error) {
      console.error("Error fetching issues:", error);
      setIssues([]);
    }
  };

  const checkForMergedPRs = async (repo: Repository & { orgData?: any }) => {
    if (!repo || !repo.organisation || !repo.name) {
      setError("Invalid repository information.");
      return;
    }

    try {
      setError(null);

      const { data: prs } = await octokit.pulls.list({
        owner: repo.organisation,
        repo: repo.name,
        state: "closed",
        sort: "updated",
        direction: "desc",
        per_page: 50,
      });

      const prMap = new Map();

      prs.forEach((pr) => {
        if (pr.merged_at && pr.body) {
          const matches = pr.body.match(/fixes\s+#(\d+)/gi);
          if (matches) {
            matches.forEach((match) => {
              const issueNumber = match.match(/\d+/)?.[0];
              const prWithFixes = {
                ...pr,
                fixesReference: `${issueNumber}`,
              };
              if (!prMap.has(issueNumber) || new Date(pr.merged_at!) > new Date(prMap.get(issueNumber).merged_at)) {
                prMap.set(issueNumber, prWithFixes);
              }
            });
          }
        }
      });

      const mergedPRsWithKeywords = Array.from(prMap.values())
        .sort((a, b) => new Date(b.merged_at!).getTime() - new Date(a.merged_at!).getTime())
        .slice(0, 50);

      console.log({ mergedPRsWithKeywords });
      setMergedPRs(mergedPRsWithKeywords);

      mergedPRsWithKeywords.forEach((pr) => {
        console.log(
          `PR #${pr.number} (${pr.fixesReference}) created by ${pr.user?.login || "unknown"} was merged at ${pr.merged_at}`,
        );
      });
    } catch (error) {
      console.error("Error fetching merged PRs:", error);
    }
  };

  useEffect(() => {
    if (selectedRepo) {
      checkForMergedPRs(selectedRepo);
    }
  }, [selectedRepo]);

  useEffect(() => {
    if (connected && account) {
      const userAddress = account.address;
      const userData = localStorage.getItem(userAddress);
      if (userData) {
        console.log(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [connected, account]);

  return (
    <div className="bg-[#111128] text-white ">
      <Header />
      <div className="md:px-8">
        {connected ? (
          <div className="flex  justify-center flex-col">
            {isAuthenticated ? (
              <div className="py-4 ">
                {selectedRepo ? (
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <Button size="sm" onClick={() => setSelectedRepo(null)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Go Back to Repositories
                    </Button>
                    <IssueStat />
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-end flex-wrap gap-4">
                      <div>
                        <h2 className="text-3xl font-bold">Home Of Bounties</h2>
                      </div>
                      <StatsCard />
                    </div>
                  </div>
                )}

                <div className="py-8">
                  {error && <div className="text-red-500 mb-4">{error}</div>}
                  {selectedRepo ? (
                    // console.log(selectedRepo.orgData),
                    <>
                      <Tabs defaultValue="feature" className="w-full">
                        <TabsList className="w-full bg-slate-700 text-white">
                          <TabsTrigger
                            value="feature"
                            className="w-1/2   data-[state=active]:text-white data-[state=active]:bg-[#4F46E5]"
                          >
                            Issues from {selectedRepo.name}
                          </TabsTrigger>
                          <TabsTrigger
                            value="potential"
                            className="w-1/2  data-[state=active]:text-white data-[state=active]:bg-[#4F46E5]"
                          >
                            Recently Merged
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="feature" className="py-4">
                          <IssuesTable
                            issues={issues}
                            onAllocatedReward={(issueId: number) => {
                              setSelectedIssueId(issueId);
                            }}
                            repoId={selectedRepo.id}
                            orgData={selectedRepo.orgData}
                          />
                        </TabsContent>
                        <TabsContent value="potential" className="py-4">
                          <div>
                            <MergedPRsTable mergedPRs={mergedPRs} orgData={selectedRepo.orgData} />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </>
                  ) : (
                    <RepoTable onRepoSelect={(repo) => fetchAllIssues(repo)} />
                  )}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col gap-10 pt-6">
                  <p>Connect your Github</p>
                  <GitHubAuthComponent />
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div>
            <div className="py-4 ">
              {selectedRepo ? (
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <Button size="sm" onClick={() => setSelectedRepo(null)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back to Repositories
                  </Button>
                  <IssueStat />
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-end flex-wrap gap-4">
                    <div>
                      <h2 className="text-3xl font-bold">Home Of Bounties</h2>
                    </div>
                    <StatsCard />
                  </div>
                </div>
              )}

              <div className="py-8">
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {selectedRepo ? (
                  <>
                    <Tabs defaultValue="feature" className="w-full">
                      <TabsList className="w-full bg-slate-700 text-white">
                        <TabsTrigger
                          value="feature"
                          className="w-1/2   data-[state=active]:text-white data-[state=active]:bg-[#4F46E5]"
                        >
                          Issues from {selectedRepo.name}
                        </TabsTrigger>
                        <TabsTrigger
                          value="potential"
                          className="w-1/2  data-[state=active]:text-white data-[state=active]:bg-[#4F46E5]"
                        >
                          Recently Merged
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="feature" className="py-4">
                        <IssuesTable
                          issues={issues}
                          onAllocatedReward={(issueId: number) => {
                            setSelectedIssueId(issueId);
                          }}
                          repoId={selectedRepo.id}
                          orgData={selectedRepo.orgData}
                        />
                      </TabsContent>
                      <TabsContent value="potential" className="py-4">
                        <div className="mt-4">
                          <MergedPRsTable mergedPRs={mergedPRs} orgData={selectedRepo.orgData} />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </>
                ) : (
                  <RepoTable onRepoSelect={(repo) => fetchAllIssues(repo)} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
