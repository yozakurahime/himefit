import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Badge } from "@/components/ui/badge";
import { Loader2, X } from "lucide-react";

const planSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  duration_months: z.coerce.number().min(1, "Duração mínima de 1 mês"),
  price: z.coerce.number().min(0, "Preço deve ser positivo"),
  modalities: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  active: z.boolean().default(true),
});

type PlanFormData = z.infer<typeof planSchema>;

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PlanFormData) => void;
  defaultValues?: Partial<PlanFormData>;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

const availableModalities = [
  "Musculação",
  "CrossFit",
  "Yoga",
  "Spinning",
  "Funcional",
  "Natação",
  "Cardio",
];

export function PlanDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading,
  mode = "create",
}: PlanDialogProps) {
  const [selectedModalities, setSelectedModalities] = useState<string[]>(
    defaultValues?.modalities || []
  );
  const [features, setFeatures] = useState<string[]>(
    defaultValues?.features || []
  );
  const [newFeature, setNewFeature] = useState("");

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      description: "",
      duration_months: 1,
      price: 0,
      modalities: [],
      features: [],
      active: true,
      ...defaultValues,
    },
  });

  const handleSubmit = (data: PlanFormData) => {
    onSubmit({ ...data, modalities: selectedModalities, features });
  };

  const toggleModality = (modality: string) => {
    setSelectedModalities((prev) =>
      prev.includes(modality)
        ? prev.filter((m) => m !== modality)
        : [...prev, modality]
    );
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(features.filter((f) => f !== feature));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Criar Novo Plano" : "Editar Plano"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Plano *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Mensal Premium"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição do plano..."
                      className="bg-secondary border-border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration_months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (meses) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        className="bg-secondary border-border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Modalidades Incluídas</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableModalities.map((modality) => (
                  <Button
                    key={modality}
                    type="button"
                    variant={
                      selectedModalities.includes(modality) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => toggleModality(modality)}
                    className={
                      selectedModalities.includes(modality) ? "bg-primary" : ""
                    }
                  >
                    {modality}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <FormLabel>Benefícios</FormLabel>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Ex: Avaliação física mensal"
                  className="bg-secondary border-border"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addFeature}>
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {features.map((feature) => (
                  <Badge
                    key={feature}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {feature}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeFeature(feature)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-primary hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {mode === "create" ? "Criar Plano" : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
