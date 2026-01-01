import logo from "@/assets/logo.png";
import TaxCalculator from "@/components/TaxCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - sticky on mobile */}
      <header className="w-full bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-3 py-3 sm:px-4 sm:py-4">
          <img
            src={logo}
            alt="MyTaxNigeria - Simple • Accurate"
            className="h-14 sm:h-16 md:h-20 object-contain"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-3 py-5 sm:px-4 sm:py-8">
        <div className="max-w-lg mx-auto">
          {/* Title Section */}
          <div className="text-center mb-5 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
              Nigerian Tax Calculator
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Calculate your 2026 taxes accurately
            </p>
          </div>

          {/* Tax Calculator */}
          <TaxCalculator />

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-6 sm:mt-8 px-2">
            This calculator provides estimates based on 2026 Nigerian tax laws.
            Consult a tax professional for personalized advice.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-card border-t border-border">
        <div className="max-w-lg mx-auto px-3 py-3 sm:px-4 sm:py-4 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © 2026 MyTaxNigeria. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
