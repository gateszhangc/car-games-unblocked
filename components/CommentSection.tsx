"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface CommentNode {
  id: string;
  parent_id: string | null;
  author: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
}

interface CommentResponse {
  comments: CommentNode[];
  replies: CommentNode[];
  total: number;
  pageSize: number;
  totalPages: number;
}

const PAGE_SIZE = 5;

export default function CommentSection() {
  const [sort, setSort] = useState<"newest" | "oldest" | "hottest">("newest");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CommentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async (newPage = page, newSort = sort) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/comments?sort=${newSort}&page=${newPage}&pageSize=${PAGE_SIZE}`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        throw new Error("Failed to load comments");
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message ?? "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [page, sort]);

  useEffect(() => {
    fetchComments(page, sort);
  }, [page, sort, fetchComments]);

  const handleSubmit = useCallback(
    async (
      event: React.FormEvent<HTMLFormElement>,
      parentId: string | null
    ) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const formAuthor = (formData.get("author") as string)?.trim();
      const formContent = (formData.get("content") as string)?.trim();

      if (!formAuthor || !formContent) return;

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: formAuthor, content: formContent, parentId }),
      });

      if (!res.ok) {
        const json = await res.json();
        alert(json.message ?? "Failed to post comment");
        return;
      }

      if (parentId === null) {
        setAuthor("");
        setContent("");
        setPage(1);
      }

      await fetchComments(parentId ? page : 1, sort);
    },
    [fetchComments, page, sort]
  );

  const handleVote = useCallback(
    async (id: string, type: "like" | "dislike") => {
      const res = await fetch("/api/comments/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type }),
      });

      if (!res.ok) {
        const json = await res.json();
        alert(json.message ?? "Operation failed");
        return;
      }

      fetchComments();
    },
    [fetchComments]
  );

  const repliesMap = useMemo(() => {
    if (!data) return {} as Record<string, CommentNode[]>;
    return data.replies.reduce<Record<string, CommentNode[]>>((acc, comment) => {
      const key = comment.parent_id!;
      if (!acc[key]) acc[key] = [];
      acc[key].push(comment);
      return acc;
    }, {});
  }, [data]);

  const getReplies = useCallback(
    (id: string) => {
      return repliesMap[id] ?? [];
    },
    [repliesMap]
  );

  return (
    <section className="comments-container">
      <div className="comments-header">
        <div>
          <p className="coming-eyebrow">Community Discussion</p>
          <h2>Car Games Unblocked Comments</h2>
        </div>
        <div className="comments-sort">
          <label htmlFor="comment-sort">Sort by:</label>
          <select
            id="comment-sort"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as typeof sort);
              setPage(1);
            }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="hottest">Hottest</option>
          </select>
        </div>
      </div>

      <form className="comment-form" onSubmit={(e) => handleSubmit(e, null)}>
        <input
          type="text"
          name="author"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <textarea
          name="content"
          placeholder="Share your thoughts about car games unblocked"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {error && <p className="comment-error">{error}</p>}

      <div className="comment-list">
        {loading && !data ? (
          <p>Loading comments...</p>
        ) : !data || data.comments.length === 0 ? (
          <p className="comment-empty">No comments yet. Be the first to comment!</p>
        ) : (
          data.comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              getReplies={getReplies}
              onReply={handleSubmit}
              onVote={handleVote}
            />
          ))
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="comments-pagination">
          <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
            Previous
          </button>
          <span>
            {page} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(data.totalPages, prev + 1))}
            disabled={page === data.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

interface CommentItemProps {
  comment: CommentNode;
  getReplies: (id: string) => CommentNode[];
  onReply: (event: React.FormEvent<HTMLFormElement>, parentId: string | null) => Promise<void>;
  onVote: (id: string, type: "like" | "dislike") => void;
}

function CommentItem({ comment, getReplies, onReply, onVote }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const childReplies = getReplies(comment.id);

  return (
    <article className="comment-item">
      <header>
        <div>
          <strong>{comment.author}</strong>
          <time dateTime={comment.created_at}>
            {new Date(comment.created_at).toLocaleString()}
          </time>
        </div>
        <div className="comment-actions">
          <button type="button" onClick={() => onVote(comment.id, "like")}>
            👍 {comment.likes ?? 0}
          </button>
          <button type="button" onClick={() => onVote(comment.id, "dislike")}>
            👎 {comment.dislikes ?? 0}
          </button>
          <button type="button" onClick={() => setShowReplyForm((prev) => !prev)}>
            {showReplyForm ? "Cancel" : "Reply"}
          </button>
        </div>
      </header>
      <p>{comment.content}</p>

      {showReplyForm && (
        <form
          className="comment-reply-form"
          onSubmit={async (event) => {
            await onReply(event, comment.id);
            event.currentTarget.reset();
            setShowReplyForm(false);
          }}
        >
          <input type="text" name="author" placeholder="Your name" required />
          <textarea name="content" placeholder="Write a reply" required />
          <button type="submit">Send</button>
        </form>
      )}

      {childReplies.length > 0 && (
        <div className="comment-replies">
          {childReplies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              getReplies={getReplies}
              onReply={onReply}
              onVote={onVote}
            />
          ))}
        </div>
      )}
    </article>
  );
}
