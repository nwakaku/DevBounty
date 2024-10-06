import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
// import { Repository, RepositoryTableProps } from "@/types";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Repository, RepositoryTableProps } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const organisations = [
  { name: "aptos-labs", shortName: "AptosLabs", chipStyle: "bg-red-500 text-white" },
  { name: "worldcoin", shortName: "Worldcoin", chipStyle: "bg-lime-200 text-black" },
  { name: "nwakaku", shortName: "Nwakaku", chipStyle: "bg-[#6EE7B7] text-black" },
];

const RepoTable: React.FC<RepositoryTableProps> = ({ onRepoSelect }) => {
  const [repos, setRepos] = useState<any[]>([]);
  const [repoIds, setRepoIds] = useState<bigint[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // assume searchTerm is a state variable
  const [rewards, setRewards] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const fetchRepos = async () => {
    const allRepos: Repository[] = [];
    for (const org of organisations) {
      const res = await axios.get(`https://api.github.com/users/${org.name}/repos`);
      const orgRepo = res.data.map((repo: Repository) => ({ ...repo, organisation: org.name }));
        allRepos.push(...orgRepo);
        console.log(orgRepo);
    }
    return allRepos;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["repos"],
    queryFn: fetchRepos,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setRepos(data);
      setRepoIds(data.map((repo) => BigInt(repo.id)));
      localStorage.setItem("repoCount", data.length.toString());
    }
  }, [data]);

  const sortedRepos = useMemo(() => {
    if (!repos || !rewards) return [];
    return repos
      .map((repo, index) => ({
        ...repo,
        reward: rewards && rewards[index] !== undefined ? rewards[index].toString() : "0",
      }))
      .sort((a, b) => parseFloat(b.reward) - parseFloat(a.reward));
  }, [repos, rewards]);

  const filteredRepos = useMemo(() => {
    if (!sortedRepos) return [];
    return searchTerm
      ? sortedRepos.filter(
          (repo) =>
            repo.organisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase())),
        )
      : sortedRepos;
  }, [sortedRepos, searchTerm]);

  const paginatedRepos = useMemo(() => {
    if (!filteredRepos) return [];
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRepos.slice(startIndex, endIndex);
  }, [filteredRepos, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentPage > Math.ceil(filteredRepos.length / itemsPerPage)) {
      setCurrentPage(Math.ceil(filteredRepos.length / itemsPerPage));
    }
  }, [filteredRepos, currentPage, itemsPerPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <p className="text--lg text-blue-500">Loading Reposistories....</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <p className="text--lg text-blue-500">An Error occured Fetching Reposistories....</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full md:w-1/2 pb-6">
        <Input
          type="text"
          placeholder="Search by name, org or description"
          className="max-w-xl text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        <Table>
          <TableHeader className="bg-slate-700">
            <TableRow className="rounded-t-2xl">
              <TableHead className="text-white font-semibold">Organisation </TableHead>
              <TableHead className="w-[200px] text-white font-semibold">Repo Name</TableHead>
              <TableHead className="text-right text-white font-semibold">Total Rewards </TableHead>
              <TableHead className="text-center text-white font-semibold">Actions</TableHead>
              <TableHead className="text-center text-white font-semibold">Description </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRepos.map((repo, index) => {
              const org = organisations.find((x) => x.name === repo.organisation);
              return (
                <TableRow key={repo.id}>
                  <TableCell className="">
                    <Badge className={`${org?.chipStyle} flex space-x-2 w-fit`}>
                      <Avatar>
                        <AvatarImage src={repo.owner.avatar_url} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <p>{org?.shortName}</p>
                    </Badge>
                  </TableCell>
                  <TableCell className="underline cursor-pointer">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold">
                      {repo.name}
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    {repo.reward !== "0" ? `${repo.reward} ETH` : "Loading..."}
                  </TableCell>
                  <TableCell className="text-center underline cursor-pointer">
                    <Button variant="ghost" onClick={() => onRepoSelect(repo)} className="text-red-500">
                      View Issues
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">{repo.description}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end items-center py-4 gap-4">
        <Button variant="ghost" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>
          Previous
        </Button>
        <span className="mx-2">{currentPage + 1}</span>
        <Button
          variant="ghost"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage >= Math.ceil(filteredRepos.length / itemsPerPage) - 1}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default RepoTable;
