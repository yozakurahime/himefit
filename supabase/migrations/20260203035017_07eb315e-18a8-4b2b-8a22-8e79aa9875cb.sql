-- ==========================================
-- MÓDULO DE ALUNOS
-- ==========================================

-- Enum para status do aluno
CREATE TYPE public.student_status AS ENUM ('active', 'inactive', 'suspended', 'pending');

-- Enum para gênero
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_say');

-- Tabela de Planos
CREATE TABLE public.plans (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration_months INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(10,2) NOT NULL,
    modalities TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Alunos
CREATE TABLE public.students (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    -- Dados básicos
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    cpf TEXT UNIQUE,
    birth_date DATE,
    gender public.gender_type,
    photo_url TEXT,
    -- Endereço
    address_street TEXT,
    address_number TEXT,
    address_complement TEXT,
    address_neighborhood TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zip TEXT,
    -- Contato de emergência
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relation TEXT,
    -- Observações médicas
    medical_notes TEXT,
    blood_type TEXT,
    allergies TEXT,
    -- Modalidades e status
    modalities TEXT[] DEFAULT '{}',
    status public.student_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    -- Plano atual
    current_plan_id UUID REFERENCES public.plans(id),
    plan_start_date DATE,
    plan_end_date DATE,
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Assinaturas/Histórico de Planos
CREATE TABLE public.subscriptions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.plans(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    amount_paid NUMERIC(10,2),
    payment_method TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Check-ins/Frequência
CREATE TABLE public.checkins (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    checkin_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    checkout_at TIMESTAMP WITH TIME ZONE,
    modality TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Evolução Física
CREATE TABLE public.body_measurements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight NUMERIC(5,2),
    height NUMERIC(5,2),
    body_fat_percentage NUMERIC(5,2),
    muscle_mass NUMERIC(5,2),
    chest NUMERIC(5,2),
    waist NUMERIC(5,2),
    hips NUMERIC(5,2),
    arm_left NUMERIC(5,2),
    arm_right NUMERIC(5,2),
    thigh_left NUMERIC(5,2),
    thigh_right NUMERIC(5,2),
    calf_left NUMERIC(5,2),
    calf_right NUMERIC(5,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ==========================================
-- MÓDULO DE RÁDIO
-- ==========================================

-- Tabela de Playlists
CREATE TABLE public.radio_playlists (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    tracks JSONB DEFAULT '[]',
    duration_seconds INTEGER DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Agendamento de Playlists
CREATE TABLE public.radio_schedules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    playlist_id UUID NOT NULL REFERENCES public.radio_playlists(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Anúncios
CREATE TABLE public.radio_announcements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    audio_url TEXT,
    duration_seconds INTEGER DEFAULT 30,
    priority INTEGER DEFAULT 1,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    repeat_interval_minutes INTEGER,
    active BOOLEAN NOT NULL DEFAULT true,
    plays_count INTEGER DEFAULT 0,
    ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ==========================================
-- MÓDULO WHATSAPP IA
-- ==========================================

-- Enum para status da conversa
CREATE TYPE public.conversation_status AS ENUM ('active', 'waiting', 'resolved', 'escalated');

-- Enum para tipo de mensagem
CREATE TYPE public.message_type AS ENUM ('text', 'audio', 'image', 'document', 'location');

-- Enum para sentimento
CREATE TYPE public.sentiment_type AS ENUM ('positive', 'neutral', 'negative');

-- Tabela de Conversas
CREATE TABLE public.whatsapp_conversations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number TEXT NOT NULL,
    contact_name TEXT,
    student_id UUID REFERENCES public.students(id),
    status public.conversation_status NOT NULL DEFAULT 'active',
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    unread_count INTEGER DEFAULT 0,
    ai_handled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Mensagens
CREATE TABLE public.whatsapp_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
    direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
    message_type public.message_type NOT NULL DEFAULT 'text',
    content TEXT NOT NULL,
    audio_transcription TEXT,
    sentiment public.sentiment_type,
    is_ai_response BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Templates de Respostas IA
CREATE TABLE public.whatsapp_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    variables TEXT[] DEFAULT '{}',
    active BOOLEAN NOT NULL DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ==========================================
-- ENABLE RLS
-- ==========================================

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radio_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radio_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radio_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS POLICIES (Public access for now)
-- ==========================================

-- Plans
CREATE POLICY "Allow public read plans" ON public.plans FOR SELECT USING (true);
CREATE POLICY "Allow public insert plans" ON public.plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update plans" ON public.plans FOR UPDATE USING (true);
CREATE POLICY "Allow public delete plans" ON public.plans FOR DELETE USING (true);

-- Students
CREATE POLICY "Allow public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update students" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Allow public delete students" ON public.students FOR DELETE USING (true);

-- Subscriptions
CREATE POLICY "Allow public read subscriptions" ON public.subscriptions FOR SELECT USING (true);
CREATE POLICY "Allow public insert subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update subscriptions" ON public.subscriptions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete subscriptions" ON public.subscriptions FOR DELETE USING (true);

-- Checkins
CREATE POLICY "Allow public read checkins" ON public.checkins FOR SELECT USING (true);
CREATE POLICY "Allow public insert checkins" ON public.checkins FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update checkins" ON public.checkins FOR UPDATE USING (true);
CREATE POLICY "Allow public delete checkins" ON public.checkins FOR DELETE USING (true);

-- Body Measurements
CREATE POLICY "Allow public read body_measurements" ON public.body_measurements FOR SELECT USING (true);
CREATE POLICY "Allow public insert body_measurements" ON public.body_measurements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update body_measurements" ON public.body_measurements FOR UPDATE USING (true);
CREATE POLICY "Allow public delete body_measurements" ON public.body_measurements FOR DELETE USING (true);

-- Radio Playlists
CREATE POLICY "Allow public read radio_playlists" ON public.radio_playlists FOR SELECT USING (true);
CREATE POLICY "Allow public insert radio_playlists" ON public.radio_playlists FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update radio_playlists" ON public.radio_playlists FOR UPDATE USING (true);
CREATE POLICY "Allow public delete radio_playlists" ON public.radio_playlists FOR DELETE USING (true);

-- Radio Schedules
CREATE POLICY "Allow public read radio_schedules" ON public.radio_schedules FOR SELECT USING (true);
CREATE POLICY "Allow public insert radio_schedules" ON public.radio_schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update radio_schedules" ON public.radio_schedules FOR UPDATE USING (true);
CREATE POLICY "Allow public delete radio_schedules" ON public.radio_schedules FOR DELETE USING (true);

-- Radio Announcements
CREATE POLICY "Allow public read radio_announcements" ON public.radio_announcements FOR SELECT USING (true);
CREATE POLICY "Allow public insert radio_announcements" ON public.radio_announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update radio_announcements" ON public.radio_announcements FOR UPDATE USING (true);
CREATE POLICY "Allow public delete radio_announcements" ON public.radio_announcements FOR DELETE USING (true);

-- WhatsApp Conversations
CREATE POLICY "Allow public read whatsapp_conversations" ON public.whatsapp_conversations FOR SELECT USING (true);
CREATE POLICY "Allow public insert whatsapp_conversations" ON public.whatsapp_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update whatsapp_conversations" ON public.whatsapp_conversations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete whatsapp_conversations" ON public.whatsapp_conversations FOR DELETE USING (true);

-- WhatsApp Messages
CREATE POLICY "Allow public read whatsapp_messages" ON public.whatsapp_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert whatsapp_messages" ON public.whatsapp_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update whatsapp_messages" ON public.whatsapp_messages FOR UPDATE USING (true);
CREATE POLICY "Allow public delete whatsapp_messages" ON public.whatsapp_messages FOR DELETE USING (true);

-- WhatsApp Templates
CREATE POLICY "Allow public read whatsapp_templates" ON public.whatsapp_templates FOR SELECT USING (true);
CREATE POLICY "Allow public insert whatsapp_templates" ON public.whatsapp_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update whatsapp_templates" ON public.whatsapp_templates FOR UPDATE USING (true);
CREATE POLICY "Allow public delete whatsapp_templates" ON public.whatsapp_templates FOR DELETE USING (true);

-- ==========================================
-- TRIGGERS
-- ==========================================

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_radio_playlists_updated_at BEFORE UPDATE ON public.radio_playlists 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_radio_announcements_updated_at BEFORE UPDATE ON public.radio_announcements 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_conversations_updated_at BEFORE UPDATE ON public.whatsapp_conversations 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_templates_updated_at BEFORE UPDATE ON public.whatsapp_templates 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- SEED DATA
-- ==========================================

-- Planos iniciais
INSERT INTO public.plans (name, description, duration_months, price, modalities, features) VALUES
('Mensal Básico', 'Acesso à musculação e cardio', 1, 99.90, ARRAY['Musculação', 'Cardio'], ARRAY['Acesso ilimitado', 'Avaliação física inicial']),
('Trimestral Plus', 'Acesso completo a todas as modalidades', 3, 249.90, ARRAY['Musculação', 'Cardio', 'CrossFit', 'Yoga'], ARRAY['Acesso ilimitado', 'Avaliação física mensal', '1 aula experimental grátis']),
('Semestral Premium', 'Pacote premium com benefícios extras', 6, 449.90, ARRAY['Musculação', 'Cardio', 'CrossFit', 'Yoga', 'Spinning', 'Funcional'], ARRAY['Acesso ilimitado', 'Avaliação física mensal', 'Acompanhamento nutricional', 'Desconto 10% na loja']),
('Anual VIP', 'O melhor custo-benefício', 12, 799.90, ARRAY['Musculação', 'Cardio', 'CrossFit', 'Yoga', 'Spinning', 'Funcional', 'Natação'], ARRAY['Acesso ilimitado', 'Avaliação física quinzenal', 'Acompanhamento nutricional', 'Personal trainer 2x/mês', 'Desconto 20% na loja']);

-- Alunos de exemplo
INSERT INTO public.students (name, email, phone, cpf, birth_date, gender, status, modalities, address_city, address_state) VALUES
('Maria Silva', 'maria@email.com', '(11) 99999-1111', '123.456.789-00', '1995-03-15', 'female', 'active', ARRAY['Musculação', 'Yoga'], 'São Paulo', 'SP'),
('João Santos', 'joao@email.com', '(11) 99999-2222', '234.567.890-11', '1990-07-22', 'male', 'active', ARRAY['CrossFit', 'Funcional'], 'São Paulo', 'SP'),
('Ana Oliveira', 'ana@email.com', '(11) 99999-3333', '345.678.901-22', '1988-11-08', 'female', 'active', ARRAY['Spinning', 'Musculação'], 'São Paulo', 'SP'),
('Carlos Ferreira', 'carlos@email.com', '(11) 99999-4444', '456.789.012-33', '1992-05-30', 'male', 'inactive', ARRAY['Musculação'], 'São Paulo', 'SP'),
('Beatriz Costa', 'beatriz@email.com', '(11) 99999-5555', '567.890.123-44', '1998-09-12', 'female', 'pending', ARRAY['Yoga', 'Funcional'], 'São Paulo', 'SP');

-- Playlists de rádio
INSERT INTO public.radio_playlists (name, description, tracks, duration_seconds) VALUES
('Motivational Mix', 'Músicas para treino intenso', '[{"title": "Eye of the Tiger", "artist": "Survivor", "duration": 245}, {"title": "Lose Yourself", "artist": "Eminem", "duration": 326}]', 3600),
('Chill Workout', 'Músicas para aquecimento e alongamento', '[{"title": "Blinding Lights", "artist": "The Weeknd", "duration": 200}, {"title": "Levitating", "artist": "Dua Lipa", "duration": 203}]', 2400),
('CrossFit Power', 'Músicas intensas para CrossFit', '[{"title": "Till I Collapse", "artist": "Eminem", "duration": 297}, {"title": "Stronger", "artist": "Kanye West", "duration": 312}]', 3000);

-- Anúncios
INSERT INTO public.radio_announcements (title, content, priority, repeat_interval_minutes, ai_generated) VALUES
('Promoção Suplementos', 'Aproveite 20% de desconto em todos os suplementos! Válido até o final do mês.', 1, 60, false),
('Aula Experimental', 'Quer conhecer o CrossFit? Agende sua aula experimental grátis na recepção!', 2, 90, false),
('Hidratação', 'Lembre-se de se hidratar! Água é essencial para o seu treino.', 3, 30, true);

-- Templates WhatsApp
INSERT INTO public.whatsapp_templates (name, category, content, variables) VALUES
('Boas-vindas', 'onboarding', 'Olá {{nome}}! 🏋️ Seja bem-vindo(a) à HimeFit! Estamos muito felizes em ter você conosco. Como posso ajudar?', ARRAY['nome']),
('Lembrete de Treino', 'engagement', 'Ei {{nome}}! 💪 Sentimos sua falta! Que tal voltar a treinar hoje? Estamos te esperando!', ARRAY['nome']),
('Renovação', 'billing', 'Olá {{nome}}! Seu plano vence em {{dias}} dias. Renove agora e ganhe condições especiais!', ARRAY['nome', 'dias']),
('Aniversário', 'celebration', 'Feliz aniversário, {{nome}}! 🎂 Presenteamos você com 1 semana grátis. Aproveite!', ARRAY['nome']);