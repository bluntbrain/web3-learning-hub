-- Create resources table
CREATE TABLE public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0
);

-- Create comments table
CREATE TABLE public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access
CREATE POLICY "Allow anonymous read access" ON public.resources
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert access" ON public.resources
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update access" ON public.resources
    FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow anonymous read access" ON public.comments
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert access" ON public.comments
    FOR INSERT TO anon WITH CHECK (true);