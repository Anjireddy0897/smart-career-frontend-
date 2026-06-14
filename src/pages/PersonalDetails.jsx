import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { savePersonalDetails } from "../services/api";
import { saveAuthSession } from "../services/authSession";
import { getDobError, getNameError, getPhoneError, getRequiredError } from "../services/validation";

const initialValues = {
  fullName: "",
  dob: "",
  gender: "",
  phone: "",
  city: "",
};

function validatePersonalField(name, value) {
  if (name === 'fullName') return getNameError(value);
  if (name === 'dob') return getDobError(value);
  if (name === 'gender') return getRequiredError(value, 'Gender');
  if (name === 'phone') return getPhoneError(value);
  if (name === 'city') return getRequiredError(value, 'City');
  return '';
}

function validatePersonalForm(values) {
  return {
    fullName: getNameError(values.fullName),
    dob: getDobError(values.dob),
    gender: getRequiredError(values.gender, 'Gender'),
    phone: getPhoneError(values.phone),
    city: getRequiredError(values.city, 'City'),
  };
}

function PersonalDetails() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: validatePersonalField(name, value),
    }));

    setError('');
    setSuccessMessage('');
  };

  const handleContinue = async (event) => {
    event.preventDefault();

    const nextErrors = validatePersonalForm(values);
    setErrors(nextErrors);
    setError('');

    if (Object.values(nextErrors).some(Boolean)) {
      setSuccessMessage('');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('Validation passed. Saving details...');

    try {
      const session = saveAuthSession({ fullName: values.fullName });
      const response = await savePersonalDetails({
        user_id: session.userId,
        email: session.email,
        date_of_birth: values.dob,
        gender: values.gender,
        phone_number: values.phone,
        city: values.city,
      });

      saveAuthSession({
        userId: response.personal_details?.user_id || session.userId,
        studentId: response.personal_details?.user_id || session.userId,
        email: session.email,
        fullName: values.fullName,
      });

      navigate('/education-details');
    } catch (err) {
      setSuccessMessage('');
      setError(err.message || 'Could not save personal details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    border: 'none',
    outline: 'none',
    flex: 1,
    fontSize: 16,
    background: 'transparent',
    width: '100%',
  };

  const errorStyle = {
    color: '#b91c1c',
    marginTop: 8,
    fontSize: 14,
    minHeight: 18,
    textAlign: 'left',
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

          <form onSubmit={handleContinue} style={{ display: "grid", gap: "18px" }} noValidate>
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
                  name="fullName"
                  value={values.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={inputStyle}
                  autoComplete="name"
                />
              </div>
              <div style={errorStyle}>{errors.fullName}</div>
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
                  name="dob"
                  type="date"
                  value={values.dob}
                  onChange={handleChange}
                  style={inputStyle}
                  autoComplete="bday"
                />
              </div>
              <div style={errorStyle}>{errors.dob}</div>
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
                  name="gender"
                  value={values.gender}
                  onChange={handleChange}
                  placeholder="Select your gender"
                  style={inputStyle}
                />
              </div>
              <div style={errorStyle}>{errors.gender}</div>
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
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  style={inputStyle}
                  inputMode="numeric"
                  autoComplete="tel"
                />
              </div>
              <div style={errorStyle}>{errors.phone}</div>
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
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  style={inputStyle}
                  autoComplete="address-level2"
                />
              </div>
              <div style={errorStyle}>{errors.city}</div>
            </div>

          {error ? (
            <p style={{ color: '#b91c1c', marginTop: 18, marginBottom: 0, fontSize: 14, textAlign: 'center' }}>
              {error}
            </p>
          ) : null}

          {successMessage ? (
            <p style={{ color: '#166534', marginTop: 12, marginBottom: 0, fontSize: 14, textAlign: 'center' }}>
              {successMessage}
            </p>
          ) : null}

          <button
            type="submit"
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default PersonalDetails;
