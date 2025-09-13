export type GetUserWorkspacesRequest = {};

export interface GetUserWorkspacesResponse {
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

// ----------------------------------------------------------------------

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  is_default?: boolean;
}

export interface CreateWorkspaceResponse {
  id: number;
  name: string;
  description: string;
  user_id: number;
  is_default: boolean;
  status: number;
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------------

export interface DeleteWorkspaceRequest {
  id: number;
}

export interface DeleteWorkspaceResponse {}
