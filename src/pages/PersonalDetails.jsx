import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PersonalDetails() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

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
          padding: "40px 24px",
          flex: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "540px",
            background: "white",
            borderRadius: "32px",
            padding: "34px 28px",
            boxShadow: "0 35px 80px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "22px" }}>
            <div
              style={{
                width: "72px",
                height: "5px",
                borderRadius: "999px",
                background: "linear-gradient(90deg, #2563eb, #7c3aed)",
              }}
            />
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 800,
              color: "#0f172a",
              textAlign: "center",
            }}
          >
            Personal Details
          </h2>
          <p
            style={{
              marginTop: 10,
              marginBottom: 28,
              color: "#6b7280",
              fontSize: "16px",
              textAlign: "center",
            }}
          >
            Step 1 of 4
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
                  borderRadius: 18,
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
                Date of Birth
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  borderRadius: 18,
                  padding: "14px 16px",
                  border: "1px solid #e6e7ea",
                }}
              >
                <span style={{ fontSize: 18, color: "#9ca3af" }}>📅</span>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
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
                Gender
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  borderRadius: 18,
                  padding: "14px 16px",
                  border: "1px solid #e6e7ea",
                }}
              >
                <span style={{ fontSize: 18, color: "#9ca3af" }}>⚧</span>
                <input
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  placeholder="Select your gender"
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
                Phone Number
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  borderRadius: 18,
                  padding: "14px 16px",
                  border: "1px solid #e6e7ea",
                }}
              >
                <span style={{ fontSize: 18, color: "#9ca3af" }}>📞</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
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
                City
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  borderRadius: 18,
                  padding: "14px 16px",
                  border: "1px solid #e6e7ea",
                }}
              >
                <span style={{ fontSize: 18, color: "#9ca3af" }}>📍</span>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city"
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
          </div>

          <button
            onClick={() => navigate('/education-details')}
            style={{
              width: "100%",
              padding: "16px 20px",
              marginTop: "28px",
              borderRadius: 16,
              border: "none",
              color: "white",
              fontSize: 18,
              fontWeight: 700,
              background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 60%, #d946ef 100%)",
              cursor: "pointer",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalDetails;
