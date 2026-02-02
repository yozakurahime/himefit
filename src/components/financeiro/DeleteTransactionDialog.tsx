import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteTransaction, Transaction } from "@/hooks/useTransactions";
import { Loader2 } from "lucide-react";

interface DeleteTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

export function DeleteTransactionDialog({
  open,
  onOpenChange,
  transaction,
}: DeleteTransactionDialogProps) {
  const deleteTransaction = useDeleteTransaction();

  const handleDelete = async () => {
    if (!transaction) return;
    await deleteTransaction.mutateAsync(transaction.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Transação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a transação "{transaction?.description}"? 
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteTransaction.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteTransaction.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteTransaction.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
