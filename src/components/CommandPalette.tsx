import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  Trophy,
  Fingerprint,
  Radio,
  Settings,
  UserPlus,
  DollarSign,
  Search,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pages = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Alunos", icon: Users, path: "/alunos" },
  { name: "Financeiro", icon: CreditCard, path: "/financeiro" },
  { name: "Central IA", icon: MessageSquare, path: "/whatsapp" },
  { name: "HimeQuest", icon: Trophy, path: "/gamificacao" },
  { name: "Controle de Acesso", icon: Fingerprint, path: "/acesso" },
  { name: "Rádio Oxigênio", icon: Radio, path: "/midia" },
  { name: "Configurações", icon: Settings, path: "/configuracoes" },
];

const quickActions = [
  { name: "Cadastrar novo aluno", icon: UserPlus, action: "new-student" },
  { name: "Registrar pagamento", icon: DollarSign, action: "new-payment" },
  { name: "Buscar aluno por nome", icon: Search, action: "search-student" },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case "new-student":
        navigate("/alunos?action=new");
        break;
      case "new-payment":
        navigate("/financeiro?action=payment");
        break;
      case "search-student":
        navigate("/alunos?focus=search");
        break;
    }
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar alunos, comandos, páginas..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        
        <CommandGroup heading="Ações Rápidas">
          {quickActions.map((action) => (
            <CommandItem
              key={action.action}
              onSelect={() => handleAction(action.action)}
              className="flex items-center gap-3 py-3"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <action.icon className="w-4 h-4 text-primary" />
              </div>
              <span>{action.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navegação">
          {pages.map((page) => (
            <CommandItem
              key={page.path}
              onSelect={() => handleSelect(page.path)}
              className="flex items-center gap-3 py-3"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary">
                <page.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <span>{page.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
