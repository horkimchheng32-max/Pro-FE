"use client";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { getCommentsByEvent, createComment, deleteComment } from "@/api/commentApi";
import { commentText, idOf } from "@/utils/normalize";
import { Async } from "./States";

export default function Comments({ eventUuid }) {
  const state = useFetch(() => getCommentsByEvent(eventUuid), [eventUuid]);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true); setMsg("");
    try { await createComment({ eventUuid, comment: text.trim() }); setText(""); state.reload(); }
    catch (err) { setMsg(err.message); }
    setBusy(false);
  }
  async function remove(c) {
    try { await deleteComment(idOf(c)); state.reload(); } catch (err) { setMsg(err.message); }
  }
  return (
    <div className="comments">
      <h2>Comments</h2>
      <form onSubmit={submit} className="form">
        <label htmlFor="cm">Add a comment</label>
        <textarea id="cm" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="What did you think?" required />
        <button className="btn" disabled={busy}>{busy ? "Posting…" : "Post comment"}</button>
        {msg && <p className="hint error-text" role="alert">{msg}</p>}
      </form>
      <Async state={state} empty="No comments yet. Be the first.">
        {(list) => (
          <ul className="clist">
            {list.map((c) => (
              <li key={idOf(c) || commentText(c)}>
                <p>{commentText(c)}</p>
                {c.createdAt && <time>{new Date(c.createdAt).toLocaleString()}</time>}
                <button className="link" onClick={() => remove(c)} aria-label="Delete comment">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </Async>
    </div>
  );
}
