/**
 * Nigerian Tax Calculations for 2026
 * 
 * Implements:
 * - Personal Income Tax (PIT) for employees and self-employed
 * - Company Income Tax (CIT) for CAC-registered businesses
 */

// PIT Progressive Monthly Tax Brackets (2026 Nigerian Tax Law)
const PIT_BRACKETS = [
  { min: 0, max: 300000, rate: 0.07 },
  { min: 300001, max: 600000, rate: 0.11 },
  { min: 600001, max: 1100000, rate: 0.15 },
  { min: 1100001, max: 1600000, rate: 0.19 },
  { min: 1600001, max: 3200000, rate: 0.21 },
  { min: 3200001, max: 3900000, rate: 0.24 },
  { min: 3900001, max: 6000000, rate: 0.27 },
  { min: 6000001, max: Infinity, rate: 0.30 },
];

// CIT thresholds
const CIT_THRESHOLD = 25000000; // ₦25 million
const CIT_RATE_LOWER = 0.20; // 20% on first ₦25M
const CIT_RATE_HIGHER = 0.30; // 30% on profit above ₦25M

export interface TaxResult {
  taxableIncome: number;
  monthlyTax: number;
  annualTax: number;
  netIncome: number;
  effectiveRate: number;
}

export interface CITResult {
  profit: number;
  annualTax: number;
  netProfit: number;
  effectiveRate: number;
}

/**
 * Calculates Progressive Personal Income Tax (PIT)
 * @param monthlyIncome - Monthly taxable income in Naira
 * @returns Monthly tax amount
 */
export function calculateMonthlyPIT(monthlyIncome: number): number {
  if (monthlyIncome <= 0) return 0;
  
  let tax = 0;
  let remainingIncome = monthlyIncome;
  
  for (const bracket of PIT_BRACKETS) {
    if (remainingIncome <= 0) break;
    
    const bracketSize = bracket.max - bracket.min + 1;
    const taxableInBracket = Math.min(remainingIncome, bracketSize);
    
    // For first bracket, start from 0
    if (bracket.min === 0) {
      const actualTaxable = Math.min(monthlyIncome, bracket.max);
      tax += actualTaxable * bracket.rate;
      remainingIncome -= actualTaxable;
    } else if (monthlyIncome > bracket.min - 1) {
      const incomeInThisBracket = Math.min(
        monthlyIncome - bracket.min + 1,
        bracket.max - bracket.min + 1
      );
      if (incomeInThisBracket > 0) {
        tax += incomeInThisBracket * bracket.rate;
      }
      remainingIncome -= taxableInBracket;
    }
  }
  
  // Recalculate using simpler progressive method
  tax = 0;
  for (const bracket of PIT_BRACKETS) {
    if (monthlyIncome <= bracket.min) break;
    
    const lowerBound = bracket.min === 0 ? 0 : bracket.min;
    const upperBound = Math.min(monthlyIncome, bracket.max);
    const taxableAmount = Math.max(0, upperBound - lowerBound);
    
    tax += taxableAmount * bracket.rate;
  }
  
  return Math.round(tax * 100) / 100;
}

/**
 * Calculates tax for Employee or Self-employed individuals
 * @param monthlyIncome - Monthly salary or revenue
 * @param allowancesOrExpenses - Monthly allowances (employee) or expenses (self-employed)
 */
export function calculatePIT(
  monthlyIncome: number,
  allowancesOrExpenses: number = 0
): TaxResult {
  const taxableIncome = Math.max(0, monthlyIncome - allowancesOrExpenses);
  const monthlyTax = calculateMonthlyPIT(taxableIncome);
  const annualTax = monthlyTax * 12;
  const netIncome = taxableIncome - monthlyTax;
  const effectiveRate = taxableIncome > 0 ? (monthlyTax / taxableIncome) * 100 : 0;
  
  return {
    taxableIncome,
    monthlyTax,
    annualTax,
    netIncome,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
  };
}

/**
 * Calculates Company Income Tax (CIT) for CAC-registered businesses
 * @param annualRevenue - Annual revenue in Naira
 * @param annualExpenses - Annual expenses in Naira
 */
export function calculateCIT(
  annualRevenue: number,
  annualExpenses: number = 0
): CITResult {
  const profit = Math.max(0, annualRevenue - annualExpenses);
  
  let annualTax = 0;
  
  if (profit <= CIT_THRESHOLD) {
    // 20% on entire profit
    annualTax = profit * CIT_RATE_LOWER;
  } else {
    // 20% on first ₦25M + 30% on excess
    annualTax = CIT_THRESHOLD * CIT_RATE_LOWER + 
                (profit - CIT_THRESHOLD) * CIT_RATE_HIGHER;
  }
  
  const netProfit = profit - annualTax;
  const effectiveRate = profit > 0 ? (annualTax / profit) * 100 : 0;
  
  return {
    profit,
    annualTax: Math.round(annualTax * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
  };
}

/**
 * Formats a number as Nigerian Naira currency
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
