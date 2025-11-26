import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const DEFAULT_PAGE_SIZE = 5;

function sortComments(
  comments: any[],
  sort: "newest" | "oldest" | "hottest"
) {
  const clone = [...comments];
  switch (sort) {
    case "oldest":
      return clone.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    case "hottest":
      return clone.sort((a, b) => {
        const scoreA = (a.likes ?? 0) - (a.dislikes ?? 0);
        const scoreB = (b.likes ?? 0) - (b.dislikes ?? 0);
        if (scoreA === scoreB) {
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
        }
        return scoreB - scoreA;
      });
    case "newest":
    default:
      return clone.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sort = (url.searchParams.get("sort") as
    | "newest"
    | "oldest"
    | "hottest") ?? "newest";
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const pageSize =
    Math.max(1, Number(url.searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE);

  const { data: topLevel, count, error } = await supabaseAdmin
    .from("comments")
    .select("*", { count: "exact" })
    .is("parent_id", null);

  if (error) {
    return NextResponse.json(
      { message: "无法获取评论", details: error.message },
      { status: 500 }
    );
  }

  const sorted = sortComments(topLevel ?? [], sort);
  const total = count ?? sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const paginated = sorted.slice(start, start + pageSize);

  const { data: replies, error: repliesError } = await supabaseAdmin
    .from("comments")
    .select("*")
    .not("parent_id", "is", null);

  if (repliesError) {
    return NextResponse.json(
      { message: "无法获取评论回复", details: repliesError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    comments: paginated,
    replies: replies ?? [],
    total,
    pageSize,
    sort,
    page,
    totalPages,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const author = String(body.author ?? "").trim();
  const content = String(body.content ?? "").trim();
  const parentId = body.parentId ? String(body.parentId) : null;

  if (!author || !content) {
    return NextResponse.json(
      { message: "作者和内容不能为空" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("comments")
    .insert({
      author,
      content,
      parent_id: parentId,
      likes: 0,
      dislikes: 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { message: "保存评论失败", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ comment: data }, { status: 201 });
}
