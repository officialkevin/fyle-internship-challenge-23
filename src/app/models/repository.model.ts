export interface Repository {
    id: number;
    name: string;
    html_url: string;
    stargazers_count: number;
    topics: string[]; 
    description: string;
    // Add other repository properties as needed

  }
  
  export interface ApiResponse {
    repositories: Repository[];
    nextPageUrl: string | null;
  }
  