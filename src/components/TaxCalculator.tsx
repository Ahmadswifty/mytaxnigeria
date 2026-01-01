import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Calculator, TrendingUp, TrendingDown } from "lucide-react";
import {
  calculatePIT,
  calculateCIT,
  formatNaira,
  type TaxResult,
  type CITResult,
} from "@/lib/taxCalculations";

type TaxType = "employee" | "self-employed" | "cac-business";

interface FormData {
  income: string;
  deductions: string;
}

export default function TaxCalculator() {
  const [taxType, setTaxType] = useState<TaxType>("employee");
  const [formData, setFormData] = useState<FormData>({
    income: "",
    deductions: "",
  });
  const [pitResult, setPitResult] = useState<TaxResult | null>(null);
  const [citResult, setCitResult] = useState<CITResult | null>(null);
  const [error, setError] = useState<string>("");

  // Reset results when tax type changes
  const handleTypeChange = (value: TaxType) => {
    setTaxType(value);
    setFormData({ income: "", deductions: "" });
    setPitResult(null);
    setCitResult(null);
    setError("");
  };

  // Handle input changes with validation
  const handleInputChange = (field: keyof FormData, value: string) => {
    // Allow empty or valid positive numbers only
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setError("");
    }
  };

  // Calculate tax based on type
  const handleCalculate = () => {
    const income = parseFloat(formData.income) || 0;
    const deductions = parseFloat(formData.deductions) || 0;

    if (income <= 0) {
      setError("Please enter a valid income amount");
      return;
    }

    if (deductions < 0) {
      setError("Deductions cannot be negative");
      return;
    }

    if (taxType === "cac-business") {
      const result = calculateCIT(income, deductions);
      setCitResult(result);
      setPitResult(null);
    } else {
      const result = calculatePIT(income, deductions);
      setPitResult(result);
      setCitResult(null);
    }
    setError("");
  };

  // Get labels based on tax type
  const getLabels = () => {
    switch (taxType) {
      case "employee":
        return {
          income: "Monthly Salary (₦)",
          deductions: "Allowances / Reliefs (₦)",
          deductionTooltip:
            "Enter tax-free allowances like housing, transport, or pension contributions",
        };
      case "self-employed":
        return {
          income: "Monthly Revenue (₦)",
          deductions: "Monthly Expenses (₦)",
          deductionTooltip:
            "Enter deductible business expenses like rent, utilities, supplies",
        };
      case "cac-business":
        return {
          income: "Annual Revenue (₦)",
          deductions: "Annual Expenses (₦)",
          deductionTooltip:
            "Enter all deductible business expenses for the year",
        };
    }
  };

  const labels = getLabels();

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 sm:space-y-6">
      {/* Tax Type Selector */}
      <div className="space-y-1.5 sm:space-y-2">
        <label className="text-sm font-medium text-foreground">
          Select Type
        </label>
        <Select value={taxType} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full bg-card border-border h-12 text-base">
            <SelectValue placeholder="Select tax type" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            <SelectItem value="employee" className="py-3">Employee / Salaried</SelectItem>
            <SelectItem value="self-employed" className="py-3">
              Self-employed / Informal Business
            </SelectItem>
            <SelectItem value="cac-business" className="py-3">CAC-registered Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Income Input */}
      <div className="space-y-1.5 sm:space-y-2">
        <label className="text-sm font-medium text-foreground">
          {labels.income}
        </label>
        <Input
          type="text"
          inputMode="decimal"
          placeholder="Enter amount"
          value={formData.income}
          onChange={(e) => handleInputChange("income", e.target.value)}
          className="bg-card border-border h-12 text-base"
        />
      </div>

      {/* Deductions Input */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <label className="text-sm font-medium text-foreground">
            {labels.deductions}
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help shrink-0" />
            </TooltipTrigger>
            <TooltipContent className="bg-card border-border max-w-[280px] z-50">
              <p className="text-sm">{labels.deductionTooltip}</p>
            </TooltipContent>
          </Tooltip>
          <span className="text-xs text-muted-foreground">(Optional)</span>
        </div>
        <Input
          type="text"
          inputMode="decimal"
          placeholder="0"
          value={formData.deductions}
          onChange={(e) => handleInputChange("deductions", e.target.value)}
          className="bg-card border-border h-12 text-base"
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-destructive text-sm font-medium">{error}</p>
      )}

      {/* Calculate Button */}
      <Button
        onClick={handleCalculate}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14 text-base sm:text-lg active:scale-[0.98] transition-transform"
      >
        <Calculator className="mr-2 h-5 w-5" />
        Calculate Tax
      </Button>

      {/* PIT Results (Employee / Self-employed) */}
      {pitResult && (
        <Card className="bg-card border-border overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-muted px-3 py-2.5 sm:px-4 sm:py-3 border-b border-border">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Tax Breakdown</h3>
            </div>
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {/* Taxable Income */}
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground text-sm">Taxable Income</span>
                <span className="font-semibold text-foreground text-base sm:text-lg">
                  {formatNaira(pitResult.taxableIncome)}
                </span>
              </div>

              {/* Monthly Tax */}
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TrendingDown className="h-4 w-4 text-destructive shrink-0" />
                  <span className="text-muted-foreground text-sm">Monthly Tax</span>
                </div>
                <span className="font-bold text-destructive text-lg sm:text-xl">
                  {formatNaira(pitResult.monthlyTax)}
                </span>
              </div>

              {/* Annual Tax */}
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TrendingDown className="h-4 w-4 text-destructive shrink-0" />
                  <span className="text-muted-foreground text-sm">Annual Tax</span>
                </div>
                <span className="font-bold text-destructive text-lg sm:text-xl">
                  {formatNaira(pitResult.annualTax)}
                </span>
              </div>

              <div className="border-t border-border" />

              {/* Net Income */}
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TrendingUp className="h-4 w-4 text-success shrink-0" />
                  <span className="text-muted-foreground text-sm">
                    Monthly Net
                  </span>
                </div>
                <span className="font-bold text-success text-lg sm:text-xl">
                  {formatNaira(pitResult.netIncome)}
                </span>
              </div>

              {/* Annual Net Income */}
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TrendingUp className="h-4 w-4 text-success shrink-0" />
                  <span className="text-muted-foreground text-sm">
                    Annual Net
                  </span>
                </div>
                <span className="font-bold text-success text-lg sm:text-xl">
                  {formatNaira(pitResult.netIncome * 12)}
                </span>
              </div>

              {/* Effective Rate */}
              <div className="bg-muted rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Effective Tax Rate
                  </span>
                  <span className="font-semibold text-foreground text-sm sm:text-base">
                    {pitResult.effectiveRate}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CIT Results (CAC Business) */}
      {citResult && (
        <Card className="bg-card border-border overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-muted px-3 py-2.5 sm:px-4 sm:py-3 border-b border-border">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">
                Company Income Tax
              </h3>
            </div>
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {/* Profit */}
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground text-sm">Taxable Profit</span>
                <span className="font-semibold text-foreground text-base sm:text-lg">
                  {formatNaira(citResult.profit)}
                </span>
              </div>

              {/* Annual Tax */}
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TrendingDown className="h-4 w-4 text-destructive shrink-0" />
                  <span className="text-muted-foreground text-sm">
                    Annual Company Tax
                  </span>
                </div>
                <span className="font-bold text-destructive text-lg sm:text-xl">
                  {formatNaira(citResult.annualTax)}
                </span>
              </div>

              <div className="border-t border-border" />

              {/* Net Profit */}
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TrendingUp className="h-4 w-4 text-success shrink-0" />
                  <span className="text-muted-foreground text-sm">
                    Net Profit After Tax
                  </span>
                </div>
                <span className="font-bold text-success text-lg sm:text-xl">
                  {formatNaira(citResult.netProfit)}
                </span>
              </div>

              {/* Effective Rate */}
              <div className="bg-muted rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Effective Tax Rate
                  </span>
                  <span className="font-semibold text-foreground text-sm sm:text-base">
                    {citResult.effectiveRate}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
