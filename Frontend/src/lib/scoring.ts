// Quantitative scoring utilities for hybrid startup analysis

export type Dict = Record<string, any>;

// --- Category 1: Founding Team ---
export function calculateTeamScore(team: Dict): number {
  const scores: Record<string, number> = {};
  let experienceScore = (Number(team?.relevant_experience_years ?? 0) / 10);
  for (const outcome of (team?.prior_startup_outcomes ?? []) as string[]) {
    if (outcome === 'exit') experienceScore += 2.5;
    else if (outcome === 'profitable') experienceScore += 1.5;
  }
  scores.experience = Math.min(experienceScore, 10);

  let commitmentScore = (Number(team?.founder_investment_percentage ?? 0) / 5) * 5;
  if (Number(team?.esop_pool_percentage ?? 0) > 15) commitmentScore += 2;
  scores.commitment = Math.min(commitmentScore, 10);

  const rolesCovered = Array.isArray(team?.key_roles_covered) ? team.key_roles_covered.length : 0;
  scores.completeness = Math.min(rolesCovered * 2.5, 10);

  const vals = Object.values(scores);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

// --- Category 2: Market ---
export function calculateMarketScore(market: Dict): number {
  const scores: Record<string, number> = {};
  const som = Number(market?.som_usd_millions ?? 0);
  if (som < 5) scores.size = 2;
  else if (som < 20) scores.size = 5;
  else if (som < 100) scores.size = 8;
  else scores.size = 10;

  const cagr = Number(market?.market_cagr_percentage ?? 0);
  if (cagr < 5) scores.growth = 2;
  else if (cagr < 15) scores.growth = 6;
  else scores.growth = 10;

  scores.competition = Math.max(10 - Number(market?.funded_competitors ?? 0) * 1.5, 0);

  const moatMap: Record<string, number> = { none: 2, brand: 5, ip: 7, network_effects: 9 };
  scores.moat = moatMap[String(market?.moat_strength ?? 'none')] ?? 2;

  const vals = Object.values(scores);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

// --- Category 3: Product & Technology ---
export function calculateProductScore(product: Dict): number {
  const scores: Record<string, number> = {};
  scores.problem_fit = String(product?.problem_solution_fit) === 'painkiller' ? 9 : 5;
  const stageMap: Record<string, number> = { idea: 2, mvp: 5, scaling: 8 };
  scores.stage = stageMap[String(product?.product_stage ?? 'idea')] ?? 2;
  const techMap: Record<string, number> = { standard_tech: 4, unique_data: 8, proprietary_ai: 9 };
  scores.tech_defensibility = techMap[String(product?.tech_defensibility ?? 'standard_tech')] ?? 4;
  scores.adoption = 10 - Number(product?.adoption_barrier_score ?? 5);
  const vals = Object.values(scores);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

// --- Category 4: Business Model & Unit Economics ---
export function calculateEconomicsScore(economics: Dict): number {
  const scores: Record<string, number> = {};
  const ltvCac = Number(economics?.ltv_to_cac_ratio ?? 0);
  if (ltvCac < 1) scores.ltv_cac = 0;
  else if (ltvCac < 2) scores.ltv_cac = 4;
  else if (ltvCac < 3) scores.ltv_cac = 7;
  else scores.ltv_cac = 10;

  const margin = Number(economics?.gross_margin_percentage ?? 0);
  if (margin < 20) scores.margin = 2;
  else if (margin < 50) scores.margin = 5;
  else if (margin < 80) scores.margin = 8;
  else scores.margin = 10;

  const payback = Number(economics?.cac_payback_months ?? 24);
  if (payback > 18) scores.payback = 2;
  else if (payback > 12) scores.payback = 5;
  else if (payback > 6) scores.payback = 8;
  else scores.payback = 10;

  const runway = Number(economics?.runway_months ?? 0);
  if (runway < 6) scores.runway = 1;
  else if (runway < 12) scores.runway = 4;
  else if (runway < 18) scores.runway = 7;
  else scores.runway = 10;

  const vals = Object.values(scores);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

// --- Category 5: Traction & Metrics ---
export function calculateTractionScore(traction: Dict): number {
  const scores: Record<string, number> = {};
  const growth = Number(traction?.mom_growth_rate_percentage ?? 0);
  if (growth < 5) scores.growth = 2;
  else if (growth < 10) scores.growth = 5;
  else if (growth < 20) scores.growth = 8;
  else scores.growth = 10;

  const nrr = Number(traction?.net_revenue_retention ?? 0);
  if (nrr < 80) scores.retention = 2;
  else if (nrr < 100) scores.retention = 6;
  else scores.retention = 10;

  scores.validation = traction?.has_marquee_partner ? 9 : 4;

  const vals = Object.values(scores);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

// --- Category 6: Financials ---
export function calculateFinancialsScore(financials: Dict): number {
  const scores: Record<string, number> = {};
  scores.realism = Number(financials?.projection_realism_score ?? 5);

  const timeline = Number(financials?.profitability_timeline_years ?? 5);
  if (timeline > 5) scores.timeline = 2;
  else if (timeline > 3) scores.timeline = 5;
  else if (timeline > 1) scores.timeline = 8;
  else scores.timeline = 10;

  const debtRatio = Number(financials?.debt_to_equity_ratio ?? 0.5);
  scores.health = Math.max(10 - (debtRatio * 10), 0);

  const vals = Object.values(scores);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

// --- Category 7: Risks ---
export function calculateRiskScore(risks: Array<{ likelihood: number; impact: number }>): number {
  if (!risks || risks.length === 0) return 10;
  const raw = risks.map(r => Number(r.likelihood) * Number(r.impact));
  const avg = raw.reduce((a, b) => a + b, 0) / raw.length; // 1..25
  const inverted = 10 - ((avg - 1) / 24) * 10;
  return Math.max(inverted, 0);
}

// --- Category 8: Growth Potential ---
export function calculateGrowthPotentialScore(growth: Dict): number {
  const scores: Record<string, number> = {};
  const scalabilityMap: Record<string, number> = { low: 3, medium: 6, high: 9 };
  scores.scalability = scalabilityMap[String(growth?.scalability_type ?? 'low')] ?? 3;

  const paths = Number(growth?.expansion_paths ?? 0);
  if (paths === 1) scores.expansion = 4;
  else if (paths === 2) scores.expansion = 7;
  else if (paths >= 3) scores.expansion = 9;
  else scores.expansion = 1;

  const acquirers = Number(growth?.potential_acquirers ?? 0);
  if (acquirers <= 2) scores.exit_path = 3;
  else if (acquirers <= 5) scores.exit_path = 6;
  else scores.exit_path = 9;

  const vals = Object.values(scores);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

export type CategoryScores = {
  team: number;
  market: number;
  product: number;
  economics: number;
  traction: number;
  financials: number;
  risk: number;
  growth_potential: number;
};

export function computeAllCategoryScores(structured: Dict): CategoryScores {
  return {
    team: calculateTeamScore(structured?.team ?? {}),
    market: calculateMarketScore(structured?.market ?? {}),
    product: calculateProductScore(structured?.product ?? {}),
    economics: calculateEconomicsScore(structured?.economics ?? {}),
    traction: calculateTractionScore(structured?.traction ?? {}),
    financials: calculateFinancialsScore(structured?.financials ?? {}),
    risk: calculateRiskScore(structured?.risks ?? []),
    growth_potential: calculateGrowthPotentialScore(structured?.growth ?? {}),
  };
}

export type InvestorWeights = {
  team: number;
  market: number;
  product: number;
  economics: number;
  traction: number;
  financials: number;
  risk: number;
  growth_potential: number;
};

export const DEFAULT_WEIGHTS: InvestorWeights = {
  team: 0.3,
  market: 0.15,
  product: 0.1,
  economics: 0.15,
  traction: 0.15,
  financials: 0.05,
  risk: 0.05,
  growth_potential: 0.05,
};

export function computeFinalWeightedScore(scores: CategoryScores, weights: InvestorWeights): number {
  const entries = Object.entries(scores) as Array<[keyof CategoryScores, number]>;
  let sum = 0;
  for (const [k, v] of entries) {
    const w = (weights as any)[k] ?? 0;
    sum += v * w;
  }
  return Number(sum.toFixed(2));
}


