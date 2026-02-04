import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Alunos from "./pages/Alunos";
import Planos from "./pages/Planos";
import Financeiro from "./pages/Financeiro";
import Gamificacao from "./pages/Gamificacao";
import RadioOxigenio from "./pages/RadioOxigenio";
import WhatsAppIA from "./pages/WhatsAppIA";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/alunos"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Alunos />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/planos"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Planos />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/financeiro"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Financeiro />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/gamificacao"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Gamificacao />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/midia"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <RadioOxigenio />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/whatsapp"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <WhatsAppIA />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
