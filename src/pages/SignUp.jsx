import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fa",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)",
          padding: "16px 20px",
          paddingTop: "28px",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
              padding: "6px",
            }}
            aria-label="back"
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>
            Career Planner
          </h1>
          <div style={{ flex: 1 }} />
          <div
            style={{
              width: "26px",
              height: "14px",
              border: "1.5px solid white",
              borderRadius: "3px",
            }}
          />
        </div>
      </div>

      <div
        style={{
          padding: "40px 28px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            background: "white",
            borderRadius: "32px",
            padding: "36px 28px",
            boxShadow: "0 35px 80px rgba(15, 23, 42, 0.08)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 800,
              color: "#0f172a",
              textAlign: "center",
            }}
          >
            Create Account
          </h2>
          <p
            style={{
              marginTop: 12,
              marginBottom: 28,
              color: "#6b7280",
              fontSize: "16px",
              textAlign: "center",
            }}
          >
            Start your career planning journey
          </p>

          <div style={{ display: "grid", gap: "18px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Full Name
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid #e6e7ea",
                }}
              >
                <span style={{ fontSize: 18, color: "#9ca3af" }}>👤</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  style={{
                    border: "none",
                    outline: "none",
                    flex: 1,
                    fontSize: 16,
                    background: "transparent",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Email
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid #e6e7ea",
                }}
              >
                <span style={{ fontSize: 18, color: "#9ca3af" }}>✉️</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    border: "none",
                    outline: "none",
                    flex: 1,
                    fontSize: 16,
                    background: "transparent",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Password
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid #e6e7ea",
                }}
              >
                <span style={{ fontSize: 18, color: "#9ca3af" }}>🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  style={{
                    border: "none",
                    outline: "none",
                    flex: 1,
                    fontSize: 16,
                    background: "transparent",
                  }}
                />
                <button
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 18,
                    color: "#9ca3af",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  aria-label="toggle-password"
                >
                  👁️
                </button>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Confirm Password
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid #e6e7ea",
                }}
              >
                <span style={{ fontSize: 18, color: "#9ca3af" }}>🔒</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  style={{
                    border: "none",
                    outline: "none",
                    flex: 1,
                    fontSize: 16,
                    background: "transparent",
                  }}
                />
                <button
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 18,
                    color: "#9ca3af",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  aria-label="toggle-confirm-password"
                >
                  👁️
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/personal-details')}
            style={{
              width: "100%",
              padding: "14px 20px",
              marginTop: "24px",
              borderRadius: 16,
              border: "none",
              color: "white",
              fontSize: 18,
              fontWeight: 600,
              background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 60%, #d946ef 100%)",
              cursor: "pointer",
            }}
          >
            Create Account
          </button>

          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              marginTop: "20px",
              fontSize: "15px",
            }}
          >
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{
                background: "none",
                border: "none",
                color: "#7c3aed",
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
              }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
