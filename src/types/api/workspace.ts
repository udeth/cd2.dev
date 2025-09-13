export type UserWorkspacesRequest = {};

// ----------------------------------------------------------------------

export interface UserWorkspacesResponse {
  workspaces?: WorkspaceInfo[];
}

export interface WorkspaceInfo {
  id: number;
  name: string;
  description: string;
  user_id: number;
  is_default: boolean;
  plan: string;
  logo: string;
  status: number;
  created_at: string;
  updated_at: string;
}
