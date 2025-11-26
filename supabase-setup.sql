-- 创建评论表
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

-- 启用行级安全策略（RLS）
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人读取评论
CREATE POLICY "允许所有人读取评论" ON public.comments
  FOR SELECT
  USING (true);

-- 创建策略：允许所有人插入评论
CREATE POLICY "允许所有人插入评论" ON public.comments
  FOR INSERT
  WITH CHECK (true);

-- 创建策略：允许所有人更新评论的点赞/点踩
CREATE POLICY "允许所有人更新评论" ON public.comments
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
