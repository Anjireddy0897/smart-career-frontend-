import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, saveUserProfile } from '../services/userProfile';

function ProfileInfo() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    age: '',
    gender: 'Male',
  });

  useEffect(() => {
    setProfile(getUserProfile());
  }, []);

  const handleSave = () => {
    saveUserProfile(profile);
    navigate('/profile');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <div
        style={{
          background: 'linear-gradient(180deg, #4f46e5 0%, #6366f1 100%)',
          color: '#ffffff',
          padding: '32px 20px 28px',
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            border: 'none',
            background: 'rgba(255,255,255,0.16)',
            color: 'white',
            width: 42,
            height: 42,
            borderRadius: 14,
            cursor: 'pointer',
            fontSize: 18,
            marginBottom: 24,
          }}
        >
          ←
        </button>
        <div>
          <p style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>View and edit your profile details</p>
          <h1 style={{ margin: '12px 0 0', fontSize: 32, fontWeight: 700 }}>Profile Information</h1>
        </div>
      </div>

      <div style={{ padding: '28px 20px 40px' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: 28,
            padding: 24,
            boxShadow: '0 18px 64px rgba(15, 23, 42, 0.08)',
          }}
        >
          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Full Name</span>
            <input
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              placeholder="Enter your full name"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 16,
                border: '1px solid #e5e7eb',
                fontSize: 15,
                outline: 'none',
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Email Address</span>
            <input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 16,
                border: '1px solid #e5e7eb',
                fontSize: 15,
                outline: 'none',
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Age</span>
            <input
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              placeholder="Enter your age"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 16,
                border: '1px solid #e5e7eb',
                fontSize: 15,
                outline: 'none',
              }}
            />
          </label>

          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 10, fontWeight: 700 }}>Gender</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['Male', 'Female', 'Other'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: option })}
                  style={{
                    padding: '12px 18px',
                    borderRadius: 16,
                    border: profile.gender === option ? '2px solid #4f46e5' : '1px solid #d1d5db',
                    background: profile.gender === option ? '#eef2ff' : '#ffffff',
                    color: '#111827',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '16px 0',
              border: 'none',
              borderRadius: 18,
              background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
              color: '#ffffff',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
