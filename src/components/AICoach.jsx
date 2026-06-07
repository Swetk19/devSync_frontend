import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

const AICoach = () => {
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceTimer = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const content = text || input;
    if (!content.trim() || loading) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      const userMsg = { role: "user", content };
      setInput("");
      const updated = [...messages, userMsg];
      setMessages(updated);
      setLoading(true);

      try {
        const res = await fetch("/api/ai-coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            messages: updated,
            userProfile: {
              name: user.firstName,
              skills: user.skills || [],
              level: user.level || "mid",
            },
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Server error");
        }

        const data = await res.json();
        setMessages([
          ...updated,
          { role: "assistant", content: data.reply || "Sorry, try again." },
        ]);
      } catch (err) {
        setMessages([
          ...updated,
          { role: "assistant", content: `⚠️ ${err.message}` },
        ]);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  /* ─────────────────── CLOSED STATE ─────────────────── */
  if (!open)
    return (
      <>
        <style>{`
          @property --dg-angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
          }
          @keyframes dg-spin {
            to { --dg-angle: 360deg; }
          }
          @keyframes dg-sparkle {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50%       { transform: scale(1.35) rotate(20deg); }
          }
          @keyframes dg-pulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.4; }
          }

          .dg-outer {
            position: relative;
            width: 100%;
            height: 42px;
            border-radius: 14px;
            cursor: pointer;
            box-sizing: border-box;
          }
          .dg-outer::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 16px;
            background: conic-gradient(
              from var(--dg-angle),
              #7C3AED 0%,
              #C026D3 35%,
              #f472b6 65%,
              #7C3AED 100%
            );
            animation: dg-spin 2s linear infinite;
            z-index: 0;
          }
          .dg-btn {
            position: absolute;
            inset: 2px;
            border-radius: 12px;
            background: var(--card-bg);           /* ← was #ffffff */
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            border: none;
            cursor: pointer;
            transition: background 0.2s;
            z-index: 1;
          }
          .dg-outer:hover .dg-btn { background: var(--card-inner); } /* ← was #faf8ff */
          .dg-icon {
            font-size: 14px;
            display: inline-block;
            animation: dg-sparkle 2s ease-in-out infinite;
          }
          .dg-label {
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.02em;
            background: linear-gradient(90deg, #7C3AED, #C026D3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .dg-live-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #22c55e;
            flex-shrink: 0;
            animation: dg-pulse 1.5s ease-in-out infinite;
          }
        `}</style>

        <div className="dg-outer" onClick={() => setOpen(true)}>
          <button className="dg-btn">
            <span className="dg-icon">✦</span>
            <span className="dg-label">Ask DevGinie</span>
            <span className="dg-live-dot" />
          </button>
        </div>
      </>
    );

  /* ─────────────────── OPEN STATE ─────────────────── */
  return (
    <>
      <style>{`
        @property --dg-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes dg-spin {
          to { --dg-angle: 360deg; }
        }
        @keyframes dg-slide-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dg-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%           { transform: translateY(-4px); }
        }
        @keyframes dg-msg-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dg-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        .dg-panel {
          position: relative;
          margin-bottom: 12px;
          border-radius: 16px;
          animation: dg-slide-in 0.2s ease;
          z-index: 0;
        }
        .dg-panel::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 18px;
          background: conic-gradient(
            from var(--dg-angle),
            #7C3AED 0%,
            #C026D3 35%,
            #f472b6 65%,
            #7C3AED 100%
          );
          animation: dg-spin 2s linear infinite;
          z-index: -1;
        }
        .dg-inner {
          background: var(--card-bg);             /* ← was #ffffff */
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .dg-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: var(--card-bg);             /* ← was #ffffff */
          border-bottom: 1px solid var(--card-border); /* ← was #f0ecff */
        }
        .dg-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dg-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7C3AED, #C026D3);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; flex-shrink: 0;
        }
        .dg-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          background: linear-gradient(90deg, #7C3AED, #C026D3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .dg-status {
          display: flex; align-items: center; gap: 4px;
          font-size: 10px; color: #22c55e; font-weight: 500;
        }
        .dg-status-dot {
          width: 5px; height: 5px;
          border-radius: 50%; background: #22c55e;
          animation: dg-pulse 1.5s ease-in-out infinite;
        }
        .dg-close {
          background: none; border: none; cursor: pointer;
          color: #9ca3af; font-size: 18px; line-height: 1;
          padding: 2px 6px; border-radius: 4px;
          transition: color 0.15s, background 0.15s;
        }
        .dg-close:hover { color: #7C3AED; background: var(--card-inner); } /* ← was #f0ecff */

        .dg-messages {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          max-height: 210px;
          overflow-y: auto;
          background: var(--card-inner);          /* ← was #fafafa */
        }
        .dg-messages::-webkit-scrollbar { width: 3px; }
        .dg-messages::-webkit-scrollbar-thumb { background: #7C3AED55; border-radius: 4px; }

        .dg-empty {
          font-size: 12px;
          color: var(--dg-muted);                 /* ← was #9ca3af */
          line-height: 1.6; padding: 4px 0;
          animation: dg-msg-in 0.3s ease;
        }
        .dg-bubble {
          max-width: 88%;
          font-size: 13px;
          line-height: 1.55;
          padding: 8px 12px;
          animation: dg-msg-in 0.25s ease;
        }
        .dg-bubble-user {
          background: linear-gradient(135deg, #7C3AED, #9333ea);
          color: #fff;
          border-radius: 14px 14px 3px 14px;
          align-self: flex-end;
        }
        .dg-bubble-ai {
          background: var(--card-bg);             /* ← was #f0ecff */
          color: var(--dg-ai-text);               /* ← was #2d1d5e */
          border-radius: 14px 14px 14px 3px;
          align-self: flex-start;
          border: 1px solid var(--card-border);   /* ← was #e4deff */
        }
        .dg-typing {
          display: flex; gap: 4px; align-items: center;
          padding: 10px 12px;
          background: var(--card-bg);             /* ← was #f0ecff */
          border-radius: 14px 14px 14px 3px;
          align-self: flex-start;
          border: 1px solid var(--card-border);   /* ← was #e4deff */
        }
        .dg-dot {
          width: 6px; height: 6px;
          border-radius: 50%; background: #7C3AED;
        }

        .dg-chips {
          display: flex; gap: 6px; flex-wrap: wrap;
          padding: 8px 12px;
          background: var(--card-bg);             /* ← was #fff */
          border-top: 1px solid var(--card-border); /* ← was #f3f0ff */
        }
        .dg-chip {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 20px;
          background: var(--card-inner);          /* ← was #f0ecff */
          color: var(--dg-chip-text);             /* ← was #534AB7 */
          border: 1px solid var(--card-border);   /* ← was #d1cef7 */
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .dg-chip:hover { background: var(--card-border); transform: scale(1.03); }
        .dg-chip:disabled { opacity: 0.4; cursor: not-allowed; }

        .dg-input-row {
          display: flex; gap: 8px;
          padding: 10px 12px;
          background: var(--card-bg);             /* ← was #fff */
          border-top: 1px solid var(--card-border); /* ← was #f3f0ff */
        }
        .dg-input {
          flex: 1;
          border: 1.5px solid var(--card-border); /* ← was #e4deff */
          border-radius: 20px;
          padding: 7px 14px;
          font-size: 13px;
          outline: none;
          background: var(--card-inner);          /* ← was #fafafa */
          color: var(--dg-input-text);            /* ← was #1f1635 */
          transition: border-color 0.2s;
        }
        .dg-input:focus { border-color: #7C3AED; background: var(--card-bg); }
        .dg-input::placeholder { color: var(--dg-muted); } /* ← was #b0a8d0 */
        .dg-send {
          padding: 7px 16px;
          border-radius: 20px;
          border: none;
          background: linear-gradient(90deg, #7C3AED, #C026D3);
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .dg-send:hover { opacity: 0.9; transform: scale(1.03); }
        .dg-send:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
      `}</style>

      <div className="dg-panel">
        <div className="dg-inner">

          {/* Header */}
          <div className="dg-header">
            <div className="dg-header-left">
              <div className="dg-avatar">✦</div>
              <span className="dg-title">DevGinie</span>
              <span className="dg-status">
                <span className="dg-status-dot" />
                online
              </span>
            </div>
            <button className="dg-close" onClick={() => setOpen(false)}>×</button>
          </div>

          {/* Messages */}
          <div className="dg-messages">
            {messages.length === 0 && (
              <p className="dg-empty">
                Hey {user?.firstName || "there"} 👋<br />
                Ask me anything about your dev career!
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`dg-bubble ${m.role === "user" ? "dg-bubble-user" : "dg-bubble-ai"}`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="dg-typing">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="dg-dot"
                    style={{ animation: `dg-bounce 1s ${i * 0.18}s ease-in-out infinite` }}
                  />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick chips */}
          <div className="dg-chips">
            {["suggest tech stack", "improve my profile", "what to learn next"].map((s) => (
              <button
                key={s}
                className="dg-chip"
                onClick={() => sendMessage(s)}
                disabled={loading}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="dg-input-row">
            <input
              className="dg-input"
              placeholder="Ask your coach..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="dg-send"
              onClick={() => sendMessage()}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default AICoach;