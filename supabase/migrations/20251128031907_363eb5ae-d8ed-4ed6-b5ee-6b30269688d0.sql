-- Create treasure_code table
CREATE TABLE public.treasure_code (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  treasure_scan TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Entry table with foreign key to treasure_code
CREATE TABLE public.Entry (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  treasure_code_id UUID NOT NULL REFERENCES public.treasure_code(id),
  team TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.treasure_code ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.Entry ENABLE ROW LEVEL SECURITY;

-- Create policies for treasure_code (read-only for all)
CREATE POLICY "treasure_code is viewable by everyone" 
ON public.treasure_code 
FOR SELECT 
USING (true);

-- Create policies for Entry (insert and read for all)
CREATE POLICY "Entry is viewable by everyone" 
ON public.Entry 
FOR SELECT 
USING (true);

CREATE POLICY "Entry can be created by everyone" 
ON public.Entry 
FOR INSERT 
WITH CHECK (true);

-- Enable realtime for Entry table
ALTER PUBLICATION supabase_realtime ADD TABLE public.Entry;

-- Add some sample treasure codes
INSERT INTO public.treasure_code (code, treasure_scan) VALUES
  ('1234567', 'Treasure1'),
  ('2345678', 'Treasure2'),
  ('3456789', 'Treasure3'),
  ('4567890', 'Treasure4'),
  ('5678901', 'Treasure5'),
  ('6789012', 'Treasure6'),
  ('7890123', 'Treasure7'),
  ('8901234', 'Treasure8');