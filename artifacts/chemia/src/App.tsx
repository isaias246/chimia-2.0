import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import PeriodicTable from "@/pages/periodic-table";
import MolecularMass from "@/pages/molecular-mass";
import CompoundBuilder from "@/pages/compound-builder";
import EquationBalancer from "@/pages/equation-balancer";
import AiTutor from "@/pages/ai-tutor";
import SavedFormulas from "@/pages/saved-formulas";
import Stoichiometry from "@/pages/stoichiometry";
import Login from "@/pages/login";
import Register from "@/pages/register";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/periodic-table" component={PeriodicTable} />
            <Route path="/molecular-mass" component={MolecularMass} />
            <Route path="/compound-builder" component={CompoundBuilder} />
            <Route path="/equation-balancer" component={EquationBalancer} />
            <Route path="/stoichiometry" component={Stoichiometry} />
            <Route path="/ai-tutor" component={AiTutor} />
            <Route path="/saved-formulas" component={SavedFormulas} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
