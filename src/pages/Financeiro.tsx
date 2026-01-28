import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ShoppingCart,
  Plus,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

const monthlyData = [
  { name: "Jan", mensalidades: 45000, pdv: 8000 },
  { name: "Fev", mensalidades: 48000, pdv: 9500 },
  { name: "Mar", mensalidades: 52000, pdv: 11000 },
  { name: "Abr", mensalidades: 49000, pdv: 10500 },
  { name: "Mai", mensalidades: 55000, pdv: 12000 },
  { name: "Jun", mensalidades: 58000, pdv: 13500 },
];

const categoryData = [
  { name: "Mensalidades", value: 58000, color: "hsl(var(--primary))" },
  { name: "Suplementos", value: 8500, color: "hsl(var(--accent))" },
  { name: "Vestuário", value: 3200, color: "hsl(var(--success))" },
  { name: "Acessórios", value: 1800, color: "hsl(var(--warning))" },
];

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: "entrada" | "saida";
  date: string;
  status: "completed" | "pending" | "cancelled";
}

const transactions: Transaction[] = [
  {
    id: "1",
    description: "Mensalidade - Lucas Mendes",
    category: "Mensalidade",
    amount: 189,
    type: "entrada",
    date: "Hoje, 14:30",
    status: "completed",
  },
  {
    id: "2",
    description: "Whey Protein 900g",
    category: "PDV",
    amount: 129.9,
    type: "entrada",
    date: "Hoje, 11:45",
    status: "completed",
  },
  {
    id: "3",
    description: "Manutenção Equipamentos",
    category: "Despesa",
    amount: 850,
    type: "saida",
    date: "Hoje, 09:00",
    status: "completed",
  },
  {
    id: "4",
    description: "Mensalidade - Juliana Ferreira",
    category: "Mensalidade",
    amount: 99,
    type: "entrada",
    date: "Ontem, 16:20",
    status: "completed",
  },
  {
    id: "5",
    description: "Creatina 300g",
    category: "PDV",
    amount: 89.9,
    type: "entrada",
    date: "Ontem, 14:10",
    status: "pending",
  },
  {
    id: "6",
    description: "Energia Elétrica",
    category: "Despesa",
    amount: 2450,
    type: "saida",
    date: "Ontem, 10:00",
    status: "completed",
  },
];

const statusStyles = {
  completed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusLabels = {
  completed: "Concluído",
  pending: "Pendente",
  cancelled: "Cancelado",
};

export default function Financeiro() {
  const [period, setPeriod] = useState("month");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o fluxo de caixa e vendas da academia
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-border">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold mt-1">R$ 71.500</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">+12.5%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Despesas</p>
                <p className="text-2xl font-bold mt-1">R$ 23.400</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDownRight className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-destructive">+5.2%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10">
                <TrendingDown className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mensalidades</p>
                <p className="text-2xl font-bold mt-1">R$ 58.000</p>
                <p className="text-xs text-muted-foreground mt-2">324 pagamentos</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vendas PDV</p>
                <p className="text-2xl font-bold mt-1">R$ 13.500</p>
                <p className="text-xs text-muted-foreground mt-2">156 transações</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/10">
                <ShoppingCart className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Faturamento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]}
                  />
                  <Bar dataKey="mensalidades" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Mensalidades" />
                  <Bar dataKey="pdv" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="PDV" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    R$ {category.value.toLocaleString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Transações Recentes</CardTitle>
            <Button variant="ghost" size="sm">
              Ver todas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-border">
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-border">
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", statusStyles[transaction.status])}>
                      {statusLabels[transaction.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "font-semibold",
                        transaction.type === "entrada" ? "text-success" : "text-destructive"
                      )}
                    >
                      {transaction.type === "entrada" ? "+" : "-"} R${" "}
                      {transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
