import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  const body = await request.json();
  const id = String(body.id ?? "");
  const type = body.type === "dislike" ? "dislike" : "like";

  if (!id) {
    return NextResponse.json({ message: "缺少评论 ID" }, { status: 400 });
  }

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("comments")
    .select("likes, dislikes")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json(
      { message: "评论不存在或获取失败" },
      { status: 404 }
    );
  }

  const updated = {
    likes: type === "like" ? (existing.likes ?? 0) + 1 : existing.likes ?? 0,
    dislikes:
      type === "dislike" ? (existing.dislikes ?? 0) + 1 : existing.dislikes ?? 0,
  };

  const { data, error } = await supabaseAdmin
    .from("comments")
    .update(updated)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { message: "更新点赞/点踩失败", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ comment: data });
}
