import type { WorkspaceInfo } from 'src/types/api/workspace';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export const _workspacesMock: WorkspaceInfo[] = [
  {
    id: 1,
    name: 'Design Studio',
    description: 'Creative design workspace for UI/UX projects',
    user_id: 1,
    is_default: true,
    plan: 'Pro',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-1.webp`,
    status: 1,
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 2,
    name: 'Development Team',
    description: 'Full-stack development workspace',
    user_id: 1,
    is_default: false,
    plan: 'Enterprise',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-2.webp`,
    status: 1,
    created_at: '2024-01-10T10:30:00Z',
    updated_at: '2024-01-20T14:45:00Z',
  },
  {
    id: 3,
    name: 'Marketing Hub',
    description: 'Marketing and content creation workspace',
    user_id: 1,
    is_default: false,
    plan: 'Pro',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-3.webp`,
    status: 1,
    created_at: '2024-01-05T09:15:00Z',
    updated_at: '2024-01-18T11:20:00Z',
  },
  {
    id: 4,
    name: 'Research Lab',
    description: 'Data analysis and research workspace',
    user_id: 1,
    is_default: false,
    plan: 'Free',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-1.webp`,
    status: 1,
    created_at: '2024-01-01T12:00:00Z',
    updated_at: '2024-01-15T16:30:00Z',
  },
];
