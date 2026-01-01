import logo from "@/assets/logo.png";
import TaxCalculator from "@/components/TaxCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4">
          <img
            src={logo}
            alt="MyTaxNigeria - Simple • Accurate"
            className="h-12 object-contain"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Nigerian Tax Calculator
            </h1>
            <p className="text-muted-foreground">
              Calculate your 2026 taxes accurately
            </p>
          </div>

          {/* Tax Calculator */}
          <TaxCalculator />

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-8 px-4">
            This calculator provides estimates based on 2026 Nigerian tax laws.
            Consult a tax professional for personalized advice.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-card border-t border-border mt-auto">
        <div className="max-w-md mx-auto px-4 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 MyTaxNigeria. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
