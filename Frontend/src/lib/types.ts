export type UserRole = 'startup' | 'investor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}

export interface Project {
  id: string;
  startupId: string;
  name: string;
  description: string;
  investmentDetails: {
    year: number;
    investment: number;
    profit: number;
    loss: number;
    moneyBurn: number;
    stockAvailable: number;
    ebita: number;
  }[];
  pitchDeckUrl?: string;
  checklistUrl?: string;
  pitchDeckSummary?: string;
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
  updatedAt: string;
  interestedInvestors: string[]; // array of user ids
}

export interface Investor {
  id: string;
  name: string;
  email: string;
  role: 'investor';
  avatarUrl: string;
  investedProjects: {
    projectId: string;
    amount: number;
  }[];
}

export interface Startup {
  id: string;
  name: string;
  email: string;
  role: 'startup';
  avatarUrl: string;
  projects: string[]; // array of project ids
}

// Analysis/weights types used by hybrid analysis UI
export type CategoryKey =
  | 'team'
  | 'market'
  | 'product'
  | 'economics'
  | 'traction'
  | 'financials'
  | 'risk'
  | 'growth_potential';

export type InvestorWeights = Record<CategoryKey, number>;
