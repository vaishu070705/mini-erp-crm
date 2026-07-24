import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("Response:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.id.toString());
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("role", response.data.role);


      alert("Login Successful");

      navigate("/dashboard");
    } catch (err: any) {
      console.log("Error:", err);
      console.log("Response:", err.response);
      console.log("Data:", err.response?.data);

      alert(JSON.stringify(err.response?.data));
    }
  };

  return (
    <>
      <style>{loginStyles}</style>

      <main className="login-shell">
        <section className="login-panel">
          <div className="login-brand">
            <span className="login-brand-mark">M</span>
            <div>
              <p className="login-eyebrow">Mini ERP CRM</p>
              <h1>Welcome back</h1>
            </div>
          </div>

          <p className="login-subtitle">
            Sign in to manage customers, products, orders, and revenue from one
            professional dashboard.
          </p>

          <div className="login-form">
            <label className="login-field">
              <span>Email</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="login-field">
              <span>Password</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button className="login-button" onClick={handleLogin}>
              Login
            </button>
            <div className="demo-card">
              <h3>🚀 Demo Login</h3>

              <div className="demo-row">
                <strong>Email:</strong>
                <span>admin@example.com</span>
              </div>

              <div className="demo-row">
                <strong>Password:</strong>
                <span>password123</span>
              </div>

              <p className="demo-note">
                Use these credentials to explore the Mini ERP CRM application.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Login;

const loginStyles = `
  .login-shell {
    width: 100%;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
    color: #f8fafc;
    background:
      radial-gradient(circle at top right, rgba(37, 99, 235, 0.24), transparent 32rem),
      radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.16), transparent 28rem),
      #0f172a;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    text-align: left;
  }

  .login-panel {
    width: min(100%, 460px);
    border: 1px solid rgba(148, 163, 184, 0.14);
    border-radius: 24px;
    padding: 30px;
    background: rgba(30, 41, 59, 0.92);
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.36);
    animation: loginFadeIn 420ms ease both;
  }

  .login-brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .login-brand-mark {
    width: 48px;
    height: 48px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #2563eb, #8b5cf6);
    color: #ffffff;
    font-size: 22px;
    font-weight: 900;
    box-shadow: 0 16px 32px rgba(37, 99, 235, 0.28);
  }

  .login-eyebrow {
    margin: 0 0 6px;
    color: #93c5fd;
    font-size: 12px;
    font-weight: 850;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .login-brand h1 {
    margin: 0;
    color: #ffffff;
    font-size: clamp(32px, 7vw, 44px);
    line-height: 1.02;
    font-weight: 850;
    letter-spacing: 0;
  }

  .login-subtitle {
    margin: 18px 0 0;
    color: #cbd5e1;
    font-size: 15px;
    line-height: 1.65;
  }

  .login-form {
    display: grid;
    gap: 16px;
    margin-top: 26px;
  }

  .login-field {
    display: grid;
    gap: 8px;
  }

  .login-field span {
    color: #cbd5e1;
    font-size: 13px;
    font-weight: 800;
  }

  .login-field input {
    width: 100%;
    min-height: 50px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 14px;
    outline: 0;
    padding: 0 14px;
    background: rgba(15, 23, 42, 0.74);
    color: #ffffff;
    transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
  }

  .login-field input:focus {
    border-color: rgba(37, 99, 235, 0.8);
    background: rgba(15, 23, 42, 0.94);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14);
  }

  .login-field input::placeholder {
    color: #64748b;
  }

  .login-button {
    min-height: 50px;
    border: 0;
    border-radius: 14px;
    color: #ffffff;
    background: #2563eb;
    cursor: pointer;
    font-weight: 850;
    box-shadow: 0 16px 32px rgba(37, 99, 235, 0.32);
    transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
  }

  .login-button:hover {
    transform: translateY(-2px);
    background: #1d4ed8;
    box-shadow: 0 20px 38px rgba(37, 99, 235, 0.4);
  }

  @keyframes loginFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 520px) {
    .login-shell {
      padding: 18px;
    }

    .login-panel {
      padding: 22px;
    }
  }
`;
