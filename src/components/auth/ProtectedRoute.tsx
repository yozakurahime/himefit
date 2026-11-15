interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Login desativado: todas as páginas ficam acessíveis diretamente.
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}
