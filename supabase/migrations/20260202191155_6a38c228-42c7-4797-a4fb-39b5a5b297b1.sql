-- Create transaction type enum
CREATE TYPE public.transaction_type AS ENUM ('entrada', 'saida');

-- Create transaction status enum
CREATE TYPE public.transaction_status AS ENUM ('completed', 'pending', 'cancelled');

-- Create transaction category enum
CREATE TYPE public.transaction_category AS ENUM ('mensalidade', 'pdv', 'despesa', 'suplemento', 'vestuario', 'acessorio', 'manutencao', 'salario', 'aluguel', 'energia', 'agua', 'outro');

-- Create transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    category transaction_category NOT NULL DEFAULT 'outro',
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    type transaction_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table for PDV
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'geral',
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    cost_price DECIMAL(10, 2) CHECK (cost_price >= 0),
    stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER DEFAULT 5,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS policies for transactions (public access for now - no auth required)
CREATE POLICY "Allow public read transactions"
ON public.transactions FOR SELECT
USING (true);

CREATE POLICY "Allow public insert transactions"
ON public.transactions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update transactions"
ON public.transactions FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete transactions"
ON public.transactions FOR DELETE
USING (true);

-- RLS policies for products
CREATE POLICY "Allow public read products"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Allow public insert products"
ON public.products FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update products"
ON public.products FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete products"
ON public.products FOR DELETE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, category, price, cost_price, stock) VALUES
('Whey Protein 900g', 'Proteína isolada sabor chocolate', 'suplemento', 129.90, 85.00, 25),
('Creatina 300g', 'Creatina monohidratada', 'suplemento', 89.90, 55.00, 40),
('BCAA 120 caps', 'Aminoácidos essenciais', 'suplemento', 69.90, 42.00, 30),
('Camiseta HimeFit', 'Camiseta dry-fit com logo', 'vestuario', 79.90, 35.00, 50),
('Squeeze 1L', 'Garrafa esportiva', 'acessorio', 39.90, 18.00, 35),
('Toalha Academia', 'Toalha de microfibra', 'acessorio', 29.90, 12.00, 45);

-- Insert sample transactions
INSERT INTO public.transactions (description, category, amount, type, status, payment_method) VALUES
('Mensalidade - Lucas Mendes', 'mensalidade', 189.00, 'entrada', 'completed', 'PIX'),
('Whey Protein 900g', 'pdv', 129.90, 'entrada', 'completed', 'Cartão Crédito'),
('Manutenção Equipamentos', 'manutencao', 850.00, 'saida', 'completed', 'Transferência'),
('Mensalidade - Juliana Ferreira', 'mensalidade', 99.00, 'entrada', 'completed', 'PIX'),
('Creatina 300g', 'pdv', 89.90, 'entrada', 'pending', 'Cartão Débito'),
('Energia Elétrica', 'energia', 2450.00, 'saida', 'completed', 'Boleto'),
('Mensalidade - Roberto Santos', 'mensalidade', 149.00, 'entrada', 'completed', 'Dinheiro'),
('Camiseta HimeFit', 'pdv', 79.90, 'entrada', 'completed', 'PIX'),
('Aluguel', 'aluguel', 5500.00, 'saida', 'completed', 'Transferência'),
('BCAA 120 caps', 'pdv', 69.90, 'entrada', 'completed', 'Cartão Crédito');