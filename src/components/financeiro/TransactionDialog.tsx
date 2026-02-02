import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Transaction,
  TransactionInput,
  TransactionCategory,
  TransactionType,
  TransactionStatus,
  useCreateTransaction,
  useUpdateTransaction,
} from "@/hooks/useTransactions";
import { ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";

const categoryLabels: Record<TransactionCategory, string> = {
  mensalidade: "Mensalidade",
  pdv: "PDV / Venda",
  despesa: "Despesa Geral",
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

const statusLabels: Record<TransactionStatus, string> = {
  completed: "Concluído",
  pending: "Pendente",
  cancelled: "Cancelado",
};

const paymentMethods = [
  "PIX",
  "Cartão Crédito",
  "Cartão Débito",
  "Dinheiro",
  "Boleto",
  "Transferência",
];

const formSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória").max(200),
  category: z.enum([
    "mensalidade",
    "pdv",
    "despesa",
    "suplemento",
    "vestuario",
    "acessorio",
    "manutencao",
    "salario",
    "aluguel",
    "energia",
    "agua",
    "outro",
  ] as const),
  amount: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
  type: z.enum(["entrada", "saida"] as const),
  status: z.enum(["completed", "pending", "cancelled"] as const),
  payment_method: z.string().optional(),
  notes: z.string().max(500).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
}: TransactionDialogProps) {
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const isEditing = !!transaction;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      category: "outro",
      amount: 0,
      type: "entrada",
      status: "pending",
      payment_method: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (transaction) {
      form.reset({
        description: transaction.description,
        category: transaction.category,
        amount: Number(transaction.amount),
        type: transaction.type,
        status: transaction.status,
        payment_method: transaction.payment_method || "",
        notes: transaction.notes || "",
      });
    } else {
      form.reset({
        description: "",
        category: "outro",
        amount: 0,
        type: "entrada",
        status: "pending",
        payment_method: "",
        notes: "",
      });
    }
  }, [transaction, form]);

  const onSubmit = async (data: FormData) => {
    const transactionData: TransactionInput = {
      description: data.description,
      category: data.category,
      amount: data.amount,
      type: data.type,
      status: data.status,
      payment_method: data.payment_method || undefined,
      notes: data.notes || undefined,
    };

    if (isEditing && transaction) {
      await updateTransaction.mutateAsync({
        id: transaction.id,
        ...transactionData,
      });
    } else {
      await createTransaction.mutateAsync(transactionData);
    }

    onOpenChange(false);
    form.reset();
  };

  const isLoading = createTransaction.isPending || updateTransaction.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Transaction Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="entrada" id="entrada" />
                        <Label
                          htmlFor="entrada"
                          className="flex items-center gap-1 cursor-pointer"
                        >
                          <ArrowUpRight className="w-4 h-4 text-success" />
                          Entrada
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="saida" id="saida" />
                        <Label
                          htmlFor="saida"
                          className="flex items-center gap-1 cursor-pointer"
                        >
                          <ArrowDownRight className="w-4 h-4 text-destructive" />
                          Saída
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Mensalidade - João Silva"
                      className="bg-secondary border-border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount and Category Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0,00"
                        className="bg-secondary border-border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border">
                        {Object.entries(categoryLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Method and Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border">
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border">
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione observações..."
                      className="bg-secondary border-border resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-primary hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditing ? "Salvar Alterações" : "Criar Transação"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
