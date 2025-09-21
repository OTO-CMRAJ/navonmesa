import { User, Project } from './types';

export const DEMO_USER: User = {
  id: 'user-demo',
  name: 'Demo Startup',
  email: 'demo@demo.com',
  role: 'startup',
  avatarUrl: 'https://picsum.photos/seed/demo-user/100/100',
};

export const users: User[] = [
  DEMO_USER,
  {
    id: 'user-investor-1',
    name: 'Alice Investor',
    email: 'alice@invest.com',
    role: 'investor',
    avatarUrl: 'https://picsum.photos/seed/alice/100/100',
  },
  {
    id: 'user-investor-2',
    name: 'Bob Capital',
    email: 'bob@capital.com',
    role: 'investor',
    avatarUrl: 'https://picsum.photos/seed/bob/100/100',
  },
  {
    id: 'user-startup-2',
    name: 'InnovateX',
    email: 'contact@innovatex.com',
    role: 'startup',
    avatarUrl: 'https://picsum.photos/seed/innovatex/100/100',
  },
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    startupId: 'user-demo',
    name: 'Navonmeṣa AI',
    description: 'A revolutionary new platform for personal AI assistants, designed to be privacy-first and fully customizable.',
    investmentDetails: [
      { year: 2024, investment: 500000, profit: 0, loss: 200000, moneyBurn: 40000, stockAvailable: 10, ebita: -200000 },
      { year: 2025, investment: 1000000, profit: 250000, loss: 0, moneyBurn: 60000, stockAvailable: 5, ebita: 200000 },
    ],
    status: 'published',
    createdAt: '2023-10-26T10:00:00Z',
    updatedAt: '2023-11-01T14:30:00Z',
    interestedInvestors: ['user-investor-1'],
    pitchDeckSummary: 'Navonmesa aims to disrupt the personal AI assistant market by prioritizing user privacy and open-source customization. The pitch deck highlights a strong technical team, a clear go-to-market strategy targeting tech-savvy consumers, and a subscription-based revenue model. Key risks include competition from established players and the need for significant marketing spend to build brand awareness.',
  },
  {
    id: 'proj-2',
    startupId: 'user-demo',
    name: 'EcoHarvest',
    description: 'Sustainable vertical farming solutions for urban environments. Our technology reduces water usage by 95% and eliminates the need for pesticides.',
    investmentDetails: [],
    status: 'draft',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    interestedInvestors: [],
  },
  {
    id: 'proj-3',
    startupId: 'user-startup-2',
    name: 'ConnectSphere',
    description: 'A decentralized social media platform that gives users full control over their data and content monetization.',
    investmentDetails: [
      { year: 2024, investment: 750000, profit: 0, loss: 300000, moneyBurn: 50000, stockAvailable: 15, ebita: -300000 },
    ],
    status: 'published',
    createdAt: '2023-12-05T11:00:00Z',
    updatedAt: '2024-01-10T18:00:00Z',
    interestedInvestors: ['user-investor-1', 'user-investor-2'],
    pitchDeckSummary: 'ConnectSphere presents a compelling vision for a user-owned social network, leveraging blockchain for data integrity and transparent revenue sharing. The market opportunity is substantial, tapping into growing user dissatisfaction with current social media giants. The team has a strong background in distributed systems. Financial projections appear aggressive and hinge on rapid user adoption.'
  },
  {
    id: 'proj-4',
    startupId: 'user-demo',
    name: 'QuantumLeap',
    description: 'Developing next-generation quantum computing algorithms for financial modeling.',
    investmentDetails: [],
    status: 'closed',
    createdAt: '2023-05-20T14:00:00Z',
    updatedAt: '2023-09-30T10:00:00Z',
    interestedInvestors: [],
  }
];
