-- Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');

-- Create user_roles table (separate from profiles to prevent privilege escalation)
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'staff',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is authenticated staff or admin
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('staff', 'admin')
  )
$$;

-- RLS policy for user_roles (only admins can manage roles, users can see their own)
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Drop all existing public policies and replace with authenticated policies
-- STUDENTS TABLE
DROP POLICY IF EXISTS "Allow public read students" ON public.students;
DROP POLICY IF EXISTS "Allow public insert students" ON public.students;
DROP POLICY IF EXISTS "Allow public update students" ON public.students;
DROP POLICY IF EXISTS "Allow public delete students" ON public.students;

CREATE POLICY "Staff can read students"
ON public.students FOR SELECT
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Staff can insert students"
ON public.students FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_or_admin());

CREATE POLICY "Staff can update students"
ON public.students FOR UPDATE
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can delete students"
ON public.students FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- TRANSACTIONS TABLE (Financial Data)
DROP POLICY IF EXISTS "Allow public read transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow public insert transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow public update transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow public delete transactions" ON public.transactions;

CREATE POLICY "Staff can read transactions"
ON public.transactions FOR SELECT
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Staff can insert transactions"
ON public.transactions FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_or_admin());

CREATE POLICY "Staff can update transactions"
ON public.transactions FOR UPDATE
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can delete transactions"
ON public.transactions FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- PRODUCTS TABLE (Financial Data)
DROP POLICY IF EXISTS "Allow public read products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert products" ON public.products;
DROP POLICY IF EXISTS "Allow public update products" ON public.products;
DROP POLICY IF EXISTS "Allow public delete products" ON public.products;

CREATE POLICY "Staff can read products"
ON public.products FOR SELECT
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Staff can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_or_admin());

CREATE POLICY "Staff can update products"
ON public.products FOR UPDATE
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- CHECKINS TABLE
DROP POLICY IF EXISTS "Allow public read checkins" ON public.checkins;
DROP POLICY IF EXISTS "Allow public insert checkins" ON public.checkins;
DROP POLICY IF EXISTS "Allow public update checkins" ON public.checkins;
DROP POLICY IF EXISTS "Allow public delete checkins" ON public.checkins;

CREATE POLICY "Staff can read checkins"
ON public.checkins FOR SELECT
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Staff can insert checkins"
ON public.checkins FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_or_admin());

CREATE POLICY "Staff can update checkins"
ON public.checkins FOR UPDATE
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can delete checkins"
ON public.checkins FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- WHATSAPP_MESSAGES TABLE
DROP POLICY IF EXISTS "Allow public read whatsapp_messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Allow public insert whatsapp_messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Allow public update whatsapp_messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Allow public delete whatsapp_messages" ON public.whatsapp_messages;

CREATE POLICY "Staff can read whatsapp_messages"
ON public.whatsapp_messages FOR SELECT
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Staff can insert whatsapp_messages"
ON public.whatsapp_messages FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_or_admin());

CREATE POLICY "Staff can update whatsapp_messages"
ON public.whatsapp_messages FOR UPDATE
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can delete whatsapp_messages"
ON public.whatsapp_messages FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- WHATSAPP_CONVERSATIONS TABLE
DROP POLICY IF EXISTS "Allow public read whatsapp_conversations" ON public.whatsapp_conversations;
DROP POLICY IF EXISTS "Allow public insert whatsapp_conversations" ON public.whatsapp_conversations;
DROP POLICY IF EXISTS "Allow public update whatsapp_conversations" ON public.whatsapp_conversations;
DROP POLICY IF EXISTS "Allow public delete whatsapp_conversations" ON public.whatsapp_conversations;

CREATE POLICY "Staff can read whatsapp_conversations"
ON public.whatsapp_conversations FOR SELECT
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Staff can insert whatsapp_conversations"
ON public.whatsapp_conversations FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_or_admin());

CREATE POLICY "Staff can update whatsapp_conversations"
ON public.whatsapp_conversations FOR UPDATE
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can delete whatsapp_conversations"
ON public.whatsapp_conversations FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- WHATSAPP_TEMPLATES TABLE
DROP POLICY IF EXISTS "Allow public read whatsapp_templates" ON public.whatsapp_templates;
DROP POLICY IF EXISTS "Allow public insert whatsapp_templates" ON public.whatsapp_templates;
DROP POLICY IF EXISTS "Allow public update whatsapp_templates" ON public.whatsapp_templates;
DROP POLICY IF EXISTS "Allow public delete whatsapp_templates" ON public.whatsapp_templates;

CREATE POLICY "Staff can read whatsapp_templates"
ON public.whatsapp_templates FOR SELECT
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Staff can insert whatsapp_templates"
ON public.whatsapp_templates FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_or_admin());

CREATE POLICY "Staff can update whatsapp_templates"
ON public.whatsapp_templates FOR UPDATE
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can delete whatsapp_templates"
ON public.whatsapp_templates FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- BODY_MEASUREMENTS TABLE
DROP POLICY IF EXISTS "Allow public read body_measurements" ON public.body_measurements;
DROP POLICY IF EXISTS "Allow public insert body_measurements" ON public.body_measurements;
DROP POLICY IF EXISTS "Allow public update body_measurements" ON public.body_measurements;
DROP POLICY IF EXISTS "Allow public delete body_measurements" ON public.body_measurements;

CREATE POLICY "Staff can read body_measurements"
ON public.body_measurements FOR SELECT
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Staff can insert body_measurements"
ON public.body_measurements FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_or_admin());

CREATE POLICY "Staff can update body_measurements"
ON public.body_measurements FOR UPDATE
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can delete body_measurements"
ON public.body_measurements FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- PLANS TABLE
DROP POLICY IF EXISTS "Allow public read plans" ON public.plans;
DROP POLICY IF EXISTS "Allow public insert plans" ON public.plans;
DROP POLICY IF EXISTS "Allow public update plans" ON public.plans;
DROP POLICY IF EXISTS "Allow public delete plans" ON public.plans;

CREATE POLICY "Staff can read plans"
ON public.plans FOR SELECT
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Staff can insert plans"
ON public.plans FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_or_admin());

CREATE POLICY "Staff can update plans"
ON public.plans FOR UPDATE
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can delete plans"
ON public.plans FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- SUBSCRIPTIONS TABLE
DROP POLICY IF EXISTS "Allow public read subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow public insert subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow public update subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow public delete subscriptions" ON public.subscriptions;

CREATE POLICY "Staff can read subscriptions"
ON public.subscriptions FOR SELECT
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Staff can insert subscriptions"
ON public.subscriptions FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_or_admin());

CREATE POLICY "Staff can update subscriptions"
ON public.subscriptions FOR UPDATE
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can delete subscriptions"
ON public.subscriptions FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RADIO_PLAYLISTS TABLE
DROP POLICY IF EXISTS "Allow public read radio_playlists" ON public.radio_playlists;
DROP POLICY IF EXISTS "Allow public insert radio_playlists" ON public.radio_playlists;
DROP POLICY IF EXISTS "Allow public update radio_playlists" ON public.radio_playlists;
DROP POLICY IF EXISTS "Allow public delete radio_playlists" ON public.radio_playlists;

CREATE POLICY "Staff can read radio_playlists"
ON public.radio_playlists FOR SELECT
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Staff can insert radio_playlists"
ON public.radio_playlists FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_or_admin());

CREATE POLICY "Staff can update radio_playlists"
ON public.radio_playlists FOR UPDATE
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can delete radio_playlists"
ON public.radio_playlists FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RADIO_SCHEDULES TABLE
DROP POLICY IF EXISTS "Allow public read radio_schedules" ON public.radio_schedules;
DROP POLICY IF EXISTS "Allow public insert radio_schedules" ON public.radio_schedules;
DROP POLICY IF EXISTS "Allow public update radio_schedules" ON public.radio_schedules;
DROP POLICY IF EXISTS "Allow public delete radio_schedules" ON public.radio_schedules;

CREATE POLICY "Staff can read radio_schedules"
ON public.radio_schedules FOR SELECT
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Staff can insert radio_schedules"
ON public.radio_schedules FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_or_admin());

CREATE POLICY "Staff can update radio_schedules"
ON public.radio_schedules FOR UPDATE
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can delete radio_schedules"
ON public.radio_schedules FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RADIO_ANNOUNCEMENTS TABLE
DROP POLICY IF EXISTS "Allow public read radio_announcements" ON public.radio_announcements;
DROP POLICY IF EXISTS "Allow public insert radio_announcements" ON public.radio_announcements;
DROP POLICY IF EXISTS "Allow public update radio_announcements" ON public.radio_announcements;
DROP POLICY IF EXISTS "Allow public delete radio_announcements" ON public.radio_announcements;

CREATE POLICY "Staff can read radio_announcements"
ON public.radio_announcements FOR SELECT
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Staff can insert radio_announcements"
ON public.radio_announcements FOR INSERT
TO authenticated
WITH CHECK (public.is_staff_or_admin());

CREATE POLICY "Staff can update radio_announcements"
ON public.radio_announcements FOR UPDATE
TO authenticated
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can delete radio_announcements"
ON public.radio_announcements FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger to auto-assign 'staff' role on first user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'staff');
  RETURN NEW;
END;
$$;

-- Trigger to auto-create role on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();