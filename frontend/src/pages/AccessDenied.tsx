import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <>
      <style>{accessDeniedStyles}</style>
      <main className="access-shell">
        <section className="access-card">
          <p>Access Restricted</p>
          <h1>Access Denied</h1>
          <span>
            Your role does not have permission to view this page. Please contact
            an administrator if you need access.
          </span>
          <button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </section>
      </main>
    </>
  );
}

const accessDeniedStyles = `
  .access-shell { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: radial-gradient(circle at top right, rgba(37,99,235,.22), transparent 34rem), #0f172a; color: #f8fafc; text-align: left; }
  .access-card { width: min(100%, 520px); border: 1px solid rgba(148,163,184,.14); border-radius: 24px; padding: 30px; background: rgba(30,41,59,.92); box-shadow: 0 30px 90px rgba(0,0,0,.36); }
  .access-card p { margin: 0 0 10px; color: #93c5fd; font-size: 12px; font-weight: 850; letter-spacing: .08em; text-transform: uppercase; }
  .access-card h1 { margin: 0; color: #fff; font-size: clamp(34px,7vw,52px); line-height: 1.02; letter-spacing: 0; }
  .access-card span { display: block; margin-top: 16px; color: #cbd5e1; line-height: 1.65; }
  .access-card button { min-height: 48px; margin-top: 24px; border: 0; border-radius: 14px; padding: 0 20px; color: #fff; background: #2563eb; cursor: pointer; font-weight: 850; box-shadow: 0 16px 32px rgba(37,99,235,.32); transition: .18s ease; }
  .access-card button:hover { transform: translateY(-2px); background: #1d4ed8; }
`;
