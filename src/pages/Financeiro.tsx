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
  Pencil,
  Trash2,
  Search,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useTransactions,
  useTransactionStats,
  Transaction,
  TransactionCategory,
  TransactionType,
  TransactionStatus,
  TransactionFilters,
} from "@/hooks/useTransactions";
import { TransactionDialog } from "@/components/financeiro/TransactionDialog";
import { PDVDialog } from "@/components/financeiro/PDVDialog";
import { DeleteTransactionDialog } from "@/components/financeiro/DeleteTransactionDialog";
import { toast } from "sonner";

const categoryLabels: Record<TransactionCategory, string> = {
  mensalidade: "Mensalidade",
  pdv: "PDV",
  despesa: "Despesa",
  suplemento: "Suplemento",
  vestuario: "Vestuário",
  acessorio: "Acessório",
  manutencao: "Manutenção",
  salario: "Salário",
  aluguel: "Aluguel",
  energia: "Energia",
  agua: "Água",
  outro: "Outro",
};

const statusStyles: Record<TransactionStatus, string> = {
  completed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusLabels: Record<TransactionStatus, string> = {
  completed: "Concluído",
  pending: "Pendente",
  cancelled: "Cancelado",
};

const categoryColors: Record<string, string> = {
  mensalidade: "hsl(var(--primary))",
  pdv: "hsl(var(--accent))",
  suplemento: "hsl(var(--success))",
  vestuario: "hsl(var(--warning))",
  despesa: "hsl(var(--destructive))",
  outro: "hsl(var(--muted-foreground))",
};

export default function Financeiro() {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [pdvDialogOpen, setPdvDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Build filters
  const activeFilters: TransactionFilters = {
    ...(searchQuery && { search: searchQuery }),
    ...(typeFilter !== "all" && { type: typeFilter as TransactionType }),
    ...(categoryFilter !== "all" && { category: categoryFilter as TransactionCategory }),
    ...(statusFilter !== "all" && { status: statusFilter as TransactionStatus }),
  };

  const { data: transactions, isLoading } = useTransactions(activeFilters);
  const { data: stats, isLoading: isLoadingStats } = useTransactionStats();

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDialogOpen(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDeleteDialogOpen(true);
  };

  const handleNewTransaction = () => {
    setSelectedTransaction(null);
    setTransactionDialogOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchQuery || typeFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all";

  const exportToCSV = () => {
    if (!transactions || transactions.length === 0) {
      toast.error("Nenhuma transação para exportar");
      return;
    }

    const headers = ["Data", "Descrição", "Categoria", "Tipo", "Status", "Valor"];
    const rows = transactions.map((t) => [
      format(new Date(t.created_at), "dd/MM/yyyy HH:mm"),
      t.description,
      categoryLabels[t.category],
      t.type === "entrada" ? "Entrada" : "Saída",
      statusLabels[t.status],
      `R$ ${Number(t.amount).toFixed(2)}`,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transacoes_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    toast.success("Arquivo CSV exportado com sucesso!");
  };

  // Calculate category data for pie chart
  const categoryData = transactions
    ? Object.entries(
        transactions
          .filter((t) => t.type === "entrada" && t.status === "completed")
          .reduce((acc, t) => {
            const cat = t.category;
            acc[cat] = (acc[cat] || 0) + Number(t.amount);
            return acc;
          }, {} as Record<string, number>)
      )
        .map(([name, value]) => ({
          name: categoryLabels[name as TransactionCategory] || name,
          value,
          color: categoryColors[name] || categoryColors.outro,
        }))
        .filter((item) => item.value > 0)
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o fluxo de caixa e vendas da academia
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-border" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
            onClick={() => setPdvDialogOpen(true)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            PDV
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90" onClick={handleNewTransaction}>
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
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-28 mt-1" />
                ) : (
                  <p className="text-2xl font-bold mt-1">
                    R$ {(stats?.totalReceita || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">Entradas</span>
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
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-28 mt-1" />
                ) : (
                  <p className="text-2xl font-bold mt-1">
                    R$ {(stats?.totalDespesas || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDownRight className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-destructive">Saídas</span>
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
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-28 mt-1" />
                ) : (
                  <p className="text-2xl font-bold mt-1">
                    R$ {(stats?.mensalidades || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {stats?.mensalidadesCount || 0} pagamentos
                </p>
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
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-28 mt-1" />
                ) : (
                  <p className="text-2xl font-bold mt-1">
                    R$ {(stats?.pdv || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {stats?.pdvCount || 0} transações
                </p>
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
            <CardTitle className="text-lg font-semibold">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              {isLoadingStats ? (
                <Skeleton className="h-24 w-48" />
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Saldo Atual</p>
                  <p
                    className={cn(
                      "text-4xl font-bold",
                      (stats?.saldo || 0) >= 0 ? "text-success" : "text-destructive"
                    )}
                  >
                    R$ {(stats?.saldo || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    Receitas - Despesas
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <>
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
                        formatter={(value: number) => [
                          `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                          "",
                        ]}
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
                        R$ {category.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                Sem dados de receita
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 bg-secondary border-border">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 bg-secondary border-border">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">Todas Categorias</SelectItem>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-secondary border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">Todos Status</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Transações
              {transactions && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({transactions.length} resultados)
                </span>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : transactions && transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-border">
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border">
                        {categoryLabels[transaction.category]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(transaction.created_at), "dd/MM/yyyy HH:mm", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.payment_method || "-"}
                    </TableCell>
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
                        {Number(transaction.amount).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <span className="sr-only">Ações</span>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTransaction(transaction)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma transação encontrada</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleNewTransaction}
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar primeira transação
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <TransactionDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
        transaction={selectedTransaction}
      />
      <PDVDialog open={pdvDialogOpen} onOpenChange={setPdvDialogOpen} />
      <DeleteTransactionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        transaction={selectedTransaction}
      />
    </div>
  );
}
