import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveEducationDetails } from "../services/api";
import { getAuthSession, saveAuthSession } from "../services/authSession";

function EducationDetails() {
  const navigate = useNavigate();
  const [level, setLevel] = useState("");
  const [stream, setStream] = useState("");
  const [institution, setInstitution] = useState("");
  const [gpa, setGpa] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    setError("");

    const session = getAuthSession();

    if (!session.userId && !session.email) {
      setError('Missing user record. Please sign up or log in again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await saveEducationDetails({
        user_id: session.userId,
        email: session.email,
        current_education_level: level,
        stream,
        school_college_name: institution,
        average_percentage_gpa: gpa,
      });

      saveAuthSession({
        fullName: session.fullName,
        email: session.email,
        userId: response.education_details?.user_id || session.userId,
        studentId: response.education_details?.user_id || session.userId,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Could not save education details');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Education Details
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
            Step 2 of 4
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
                Current Education Level
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
                <span style={{ fontSize: 18, color: "#9ca3af" }}>🎓</span>
                <input
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  placeholder="Select your education level"
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
                Stream (if applicable)
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
                <span style={{ fontSize: 18, color: "#9ca3af" }}>📘</span>
                <input
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  placeholder="Enter your stream"
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
                School/College Name
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
                <span style={{ fontSize: 18, color: "#9ca3af" }}>🏫</span>
                <input
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Enter institution name"
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
                Average Percentage/GPA
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
                <span style={{ fontSize: 18, color: "#9ca3af" }}>📊</span>
                <input
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  placeholder="e.g., 85% or 8.5 GPA"
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

          {error ? (
            <p style={{ color: '#b91c1c', marginTop: 18, marginBottom: 0, fontSize: 14, textAlign: 'center' }}>
              {error}
            </p>
          ) : null}

          <button
            onClick={handleContinue}
            disabled={isSubmitting}
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
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EducationDetails;
