
-- Scan history table (public, no auth required)
CREATE TABLE public.scan_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_type TEXT NOT NULL CHECK (scan_type IN ('news', 'image', 'email', 'url', 'message')),
  input_preview TEXT NOT NULL DEFAULT '',
  classification TEXT NOT NULL,
  confidence INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('safe', 'suspicious', 'danger')),
  explanation TEXT NOT NULL DEFAULT '',
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Allow public read/insert (no auth in this app)
CREATE POLICY "Anyone can read scan history" ON public.scan_history FOR SELECT USING (true);
CREATE POLICY "Anyone can insert scans" ON public.scan_history FOR INSERT WITH CHECK (true);

-- Index for recent scans
CREATE INDEX idx_scan_history_created ON public.scan_history (created_at DESC);
