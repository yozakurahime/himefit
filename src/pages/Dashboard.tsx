import { Users, DollarSign, TrendingUp, Dumbbell, Clock, UserCheck } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { AccessLog } from "@/components/dashboard/AccessLog";
import { RadioWidget } from "@/components/dashboard/RadioWidget";
import { TopStudents } from "@/components/dashboard/TopStudents";
import { WhatsAppPreview } from "@/components/dashboard/WhatsAppPreview";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo de volta! Aqui está o resumo da sua academia.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Alunos Ativos"
          value="1,247"
          subtitle="48 novos este mês"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Faturamento Hoje"
          value="R$ 4.580"
          subtitle="Meta: R$ 5.000"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Check-ins Hoje"
          value="342"
          subtitle="Média: 320/dia"
          icon={UserCheck}
          trend={{ value: 6.8, isPositive: true }}
          variant="accent"
        />
        <StatCard
          title="Taxa de Retenção"
          value="94.2%"
          subtitle="+2.1% vs. mês anterior"
          icon={TrendingUp}
          trend={{ value: 2.1, isPositive: true }}
          variant="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Access Log */}
        <div className="lg:col-span-1">
          <AccessLog />
        </div>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WhatsApp Preview */}
        <div className="lg:col-span-1">
          <WhatsAppPreview />
        </div>

        {/* Top Students */}
        <div className="lg:col-span-1">
          <TopStudents />
        </div>

        {/* Radio Widget */}
        <div className="lg:col-span-1">
          <RadioWidget />
        </div>
      </div>
    </div>
  );
}
