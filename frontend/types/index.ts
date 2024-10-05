export interface Repository {
  id: number;
  name: string;
  html_url: string;
  description: string;
  organisation: string;
}

export interface RepositoryTableProps {
  onRepoSelect: (repo: Repository) => void;
}
