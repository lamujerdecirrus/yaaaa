import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import MainScreen from "./pages/MainScreen";
import TerminalSelector from "./pages/TerminalSelector";
import LoginScreen from "./pages/LoginScreen";
import TASScreen from "./pages/TASScreen";
import NuevaCita from "./pages/NuevaCita";
import TarifaScreen from "./pages/TarifaScreen";
import ConfirmacionCita from "./pages/ConfirmacionCita";
import ArmadoFull from "./pages/ArmadoFull";
import ArmadoFullResults from "./pages/ArmadoFullResults";
import AgregarContenedor from "./pages/AgregarContenedor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainScreen />} />
            <Route path="/terminal-selector" element={<TerminalSelector />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/tas" element={<TASScreen />} />
            <Route path="/nueva-cita" element={<NuevaCita />} />
            <Route path="/tarifa" element={<TarifaScreen />} />
            <Route path="/confirmacion-cita" element={<ConfirmacionCita />} />
            <Route path="/armado-full" element={<ArmadoFull />} />
            <Route path="/armado-full-results" element={<ArmadoFullResults />} />
            <Route path="/agregar-contenedor" element={<AgregarContenedor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
