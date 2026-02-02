import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActiveProducts, useUpdateProductStock, Product } from "@/hooks/useProducts";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { ShoppingCart, Plus, Minus, Trash2, Loader2, Search, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CartItem {
  product: Product;
  quantity: number;
}

const paymentMethods = [
  "PIX",
  "Cartão Crédito",
  "Cartão Débito",
  "Dinheiro",
];

interface PDVDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PDVDialog({ open, onOpenChange }: PDVDialogProps) {
  const { data: products, isLoading: isLoadingProducts } = useActiveProducts();
  const createTransaction = useCreateTransaction();
  const updateStock = useUpdateProductStock();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error("Estoque insuficiente!");
        return;
      }
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      if (product.stock < 1) {
        toast.error("Produto sem estoque!");
        return;
      }
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.product.id === productId) {
            const newQuantity = item.quantity + delta;
            if (newQuantity > item.product.stock) {
              toast.error("Estoque insuficiente!");
              return item;
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Carrinho vazio!");
      return;
    }

    setIsProcessing(true);

    try {
      // Create transactions and update stock for each item
      for (const item of cart) {
        // Create transaction
        await createTransaction.mutateAsync({
          description: `${item.product.name}${item.quantity > 1 ? ` (x${item.quantity})` : ""}`,
          category: "pdv",
          amount: Number(item.product.price) * item.quantity,
          type: "entrada",
          status: "completed",
          payment_method: paymentMethod,
        });

        // Update stock
        await updateStock.mutateAsync({
          id: item.product.id,
          quantity: -item.quantity,
        });
      }

      toast.success(`Venda de R$ ${cartTotal.toFixed(2)} realizada com sucesso!`);
      setCart([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Ponto de Venda (PDV)
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 flex-1 overflow-hidden">
          {/* Products List */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2 pr-2">
              {isLoadingProducts ? (
                <div className="col-span-2 flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredProducts?.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum produto encontrado</p>
                </div>
              ) : (
                filteredProducts?.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all hover:border-primary/50",
                      "bg-secondary/50 border-border",
                      product.stock === 0 && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={product.stock === 0}
                  >
                    <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-primary font-bold">
                        R$ {Number(product.price).toFixed(2)}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          product.stock <= (product.min_stock || 5)
                            ? "border-warning text-warning"
                            : "border-border"
                        )}
                      >
                        {product.stock} un
                      </Badge>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Cart */}
          <div className="w-80 flex flex-col border-l border-border pl-4">
            <h3 className="font-semibold mb-3">Carrinho</h3>
            
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Carrinho vazio</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        R$ {Number(item.product.price).toFixed(2)} cada
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.product.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.product.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-destructive"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Payment */}
            <div className="border-t border-border pt-4 space-y-3">
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  R$ {cartTotal.toFixed(2)}
                </span>
              </div>

              <Button
                className="w-full bg-gradient-primary hover:opacity-90"
                size="lg"
                onClick={handleCheckout}
                disabled={cart.length === 0 || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Finalizar Venda
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
