import { Switch, Route } from "wouter";
import Dashboard from "./pages/dashboard";
import PeriodicTable from "./pages/periodic-table";
import CompoundLibrary from "./pages/compound-library";
import MolecularMass from "./pages/molecular-mass";
import CompoundBuilder from "./pages/compound-builder";
import EquationBalancer from "./pages/equation-balancer";
import Stoichiometry from "./pages/stoichiometry";
import SmartSolver from "./pages/smart-solver";
import AiTutor from "./pages/ai-tutor";
import SavedFormulas from "./pages/saved-formulas";
import Login from "./pages/login";
import Register from "./pages/register";
import { Layout } from "./components/layout";
import NotFound from "./pages/not-found";

export function AppRoutes() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/periodic-table" component={PeriodicTable} />
            <Route path="/compound-library" component={CompoundLibrary} />
            <Route path="/molecular-mass" component={MolecularMass} />
            <Route path="/compound-builder" component={CompoundBuilder} />
            <Route path="/equation-balancer" component={EquationBalancer} />
            <Route path="/stoichiometry" component={Stoichiometry} />
            <Route path="/smart-solver" component={SmartSolver} />
            <Route path="/ai-tutor" component={AiTutor} />
            <Route path="/saved-formulas" component={SavedFormulas} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}