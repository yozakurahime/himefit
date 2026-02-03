import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Alunos from "./pages/Alunos";
import Planos from "./pages/Planos";
import Financeiro from "./pages/Financeiro";
import Gamificacao from "./pages/Gamificacao";
import RadioOxigenio from "./pages/RadioOxigenio";
import WhatsAppIA from "./pages/WhatsAppIA";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alunos" element={<Alunos />} />
            <Route path="/planos" element={<Planos />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/gamificacao" element={<Gamificacao />} />
            <Route path="/midia" element={<RadioOxigenio />} />
            <Route path="/whatsapp" element={<WhatsAppIA />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
