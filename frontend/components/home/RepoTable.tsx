import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Repository, RepositoryTableProps } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const organisations = [
  {
    name: "aptos-labs",
    shortName: "AptosLabs",
    chipStyle: "bg-slate-400 text-white",
    address: "0xf9424969a5cfeb4639c4c75c2cd0ca62620ec624f4f210e15ad8f1e4fe5253a1",
  },
  {
    name: "worldcoin",
    shortName: "Worldcoin",
    chipStyle: " text-black",
    address: "0xf9424969a5cfeb4639c4c75c2cd0ca62620ec624f4f28d76c4881a1e567d753f",
  },
  {
    name: "nwakaku",
    shortName: "Nwakaku",
    chipStyle: "bg-[#6EE7B7] text-black",
    address: "0xd869b1399d8b19dba8c5aa4ae63a64233e17aac473c410e15ad8f1e4fe5253a1",
  },
];

const RepoTable: React.FC<RepositoryTableProps> = ({ onRepoSelect }) => {
  const [repos, setRepos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const rewards  = [] as any;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 10;

  const fetchRepos = async () => {
    const allRepos: Repository[] = [];
    for (const org of organisations) {
      const res = await axios.get(`https://api.github.com/users/${org.name}/repos`);
      const orgRepos = res.data.map((repo: Repository) => ({
        ...repo,
        organisation: org.name,
        orgData: org, // Include all org data
      }));
      allRepos.push(...orgRepos);
    }
    return allRepos;
  };

  // console.log(setItemsPerPage(8), set)

  const { data, error, isLoading } = useQuery({
    queryKey: ["repos"],
    queryFn: fetchRepos,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setRepos(data);
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

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRandomBounty = () => {
    const bounties = ["$100", "$200", "$300", "$500", "$1000"];
    return bounties[Math.floor(Math.random() * bounties.length)];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <p className="text--lg text-blue-500">Loading Repositories....</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <p className="text--lg text-blue-500">An Error occurred Fetching Repositories....</p>
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
              {/* <TableHead className="text-white font-semibold">No </TableHead> */}
              <TableHead className="text-white font-semibold">Organisation </TableHead>
              <TableHead className="w-[200px] text-white font-semibold">Repo Name</TableHead>
              <TableHead className="text-center text-white font-semibold">Total Bounty </TableHead>
              <TableHead className="text-center text-white font-semibold">Actions</TableHead>
              <TableHead className="text-center text-white font-semibold">Description </TableHead>
              <TableHead className="text-white text-center font-semibold">Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRepos.map((repo, index) => {
              const org = repo.orgData;
              return (
                <TableRow className="border-b-slate-700" key={index}>
                  {/* <TableCell className="text-left">#{repo.id}</TableCell> */}
                  <TableCell className="flex space-x-2 items-center">
                    <Badge className={`${org?.chipStyle} p-2 flex space-x-2 w-fit rounded-sm`}>
                      <Avatar>
                        <AvatarImage src={repo.owner.avatar_url} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </Badge>
                    <div className="flex flex-col">
                      <p className=" font-semibold text-lg">{org?.shortName}</p>
                      <small>#{repo.id}</small>
                    </div>
                  </TableCell>
                  <TableCell className="underline cursor-pointer">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold">
                      {repo.name}
                    </a>
                  </TableCell>
                  <TableCell className="text-center">
                    <p className="font-semibold text-lg text-[#6EE7B7]">
                      {repo.reward !== "0" ? `${repo.reward} Apto` : `${getRandomBounty()}+`}
                    </p>
                  </TableCell>
                  <TableCell className="text-center underline cursor-pointer">
                    <Button variant="ghost" onClick={() => onRepoSelect(repo)} className="text-red-500">
                      View Issues
                    </Button>
                  </TableCell>
                  <TableCell className="text-center max-w-[400px] text-wrap">{repo.description}</TableCell>
                  <TableCell className="text-center">{org?.address ? truncateAddress(org.address) : "N/A"}</TableCell>
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
