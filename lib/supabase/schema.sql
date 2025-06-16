-- Create table for storing editor documents
CREATE TABLE IF NOT EXISTS editor_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_json JSONB NOT NULL,
    content_html TEXT,
    content_markdown TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE
    editor_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only see their own documents" ON editor_documents FOR
SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON editor_documents FOR
INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON editor_documents FOR
UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON editor_documents FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_editor_documents_user_id ON editor_documents(user_id);

CREATE INDEX idx_editor_documents_created_at ON editor_documents(created_at);