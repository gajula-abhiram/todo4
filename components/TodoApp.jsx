"use client";
import { useEffect, useMemo, useRef, useState } from "react";

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
}

const STORE_KEY = "todo:v1";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | done
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      const raw = globalThis?.localStorage?.getItem(STORE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      globalThis?.localStorage?.setItem(STORE_KEY, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const active = total - done;
    return { total, done, active };
  }, [tasks]);

  const filtered = useMemo(() => {
    if (filter === "active") return tasks.filter(t => !t.done);
    if (filter === "done") return tasks.filter(t => t.done);
    return tasks;
  }, [tasks, filter]);

  function addTask(e) {
    e?.preventDefault?.();
    const value = text.trim();
    if (!value) return;
    setTasks(prev => [{ id: uid(), text: value, done: false, createdAt: Date.now() }, ...prev]);
    setText("");
    inputRef.current?.focus();
  }

  function toggle(id) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function editTask(id, newText) {
    const v = newText.trim();
    if (!v) return;
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, text: v } : t)));
  }

  function clearCompleted() {
    setTasks(prev => prev.filter(t => !t.done));
  }

  return (
    <section className="stack">
      <div className="card stack">
        <form onSubmit={addTask} className="row">
          <input
            ref={inputRef}
            className="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a task…"
            aria-label="Task text"
            autoFocus
          />
          <button className="btn primary" type="submit">Add</button>
        </form>

        <div className="row" style={{justifyContent:"space-between", alignItems:"center"}}>
          <div className="pillbar">
            <button className="pill" data-active={filter==="all"} onClick={() => setFilter("all")}>All ({stats.total})</button>
            <button className="pill" data-active={filter==="active"} onClick={() => setFilter("active")}>Active ({stats.active})</button>
            <button className="pill" data-active={filter==="done"} onClick={() => setFilter("done")}>Done ({stats.done})</button>
          </div>
          <div className="row" style={{gap:8}}>
            <button className="btn good" onClick={() => setTasks(prev => prev.map(t => ({...t, done:true})))}>Mark all done</button>
            <button className="btn danger" onClick={clearCompleted}>Clear done</button>
          </div>
        </div>
      </div>

      <div className="list">
        {filtered.length === 0 ? (
          <div className="card muted">Nothing here. Add something above.</div>
        ) : filtered.map((t) => <Item key={t.id} task={t} onToggle={toggle} onRemove={removeTask} onEdit={editTask} />)}
      </div>
    </section>
  );
}

function Item({ task, onToggle, onRemove, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(task.text);
  const ref = useRef(null);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  function save() {
    if (val.trim() && val.trim() !== task.text) onEdit(task.id, val);
    setEditing(false);
  }

  return (
    <div className={`item ${task.done ? "done" : ""}`}>
      <button
        className="checkbox"
        data-checked={task.done}
        aria-pressed={task.done}
        onClick={() => onToggle(task.id)}
        title={task.done ? "Mark as not done" : "Mark as done"}
      >
        {task.done ? "✓" : ""}
      </button>

      {editing ? (
        <input
          ref={ref}
          className="input"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setVal(task.text); setEditing(false); } }}
        />
      ) : (
        <div
          className="text"
          role="textbox"
          tabIndex={0}
          onDoubleClick={() => setEditing(true)}
          onKeyDown={(e) => { if (e.key === "Enter") setEditing(true); }}
          title="Double‑click to edit"
        >
          {task.text}
        </div>
      )}

      <div className="row" style={{gap:8}}>
        {!editing && <button className="btn" onClick={() => setEditing(true)}>Edit</button>}
        <button className="btn danger" onClick={() => onRemove(task.id)}>Delete</button>
      </div>
    </div>
  );
}
