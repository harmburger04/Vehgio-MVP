
CREATE TABLE public.shops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT,
  barangay TEXT,
  services TEXT[] DEFAULT '{}',
  working_hours TEXT,
  price_range TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  contact_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Allow public read access
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on shops" ON public.shops
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow service role full access on shops" ON public.shops
  FOR ALL TO service_role USING (true) WITH CHECK (true);
