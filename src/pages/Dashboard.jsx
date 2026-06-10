import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSavedCareers, saveCareer } from '../services/savedCareers';
import { getUserProfile } from '../services/userProfile';

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Rahul Kumar');
  const [savedTitles, setSavedTitles] = useState([]);

  const careerMatches = [
    { title: 'AI/ML Engineer', salary: '₹15-25 LPA', match: '95%' },
    { title: 'Content Creator', salary: '₹5-15 LPA', match: '88%' },
  ];

  useEffect(() => {
    const profile = getUserProfile();
    setUserName(profile.fullName || 'Rahul Kumar');
    setSavedTitles(getSavedCareers().map((item) => item.title));
  }, []);

  const handleSave = (career) => {
    saveCareer(career);
    setSavedTitles(getSavedCareers().map((item) => item.title));
  };

  const features = [
    { icon: '⊙', title: 'Explore Domains', color: '#e0f2fe' },
    { icon: '🔖', title: 'Saved Careers', color: '#fce7f3' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)',
          padding: '16px 20px',
          paddingTop: '40px',
          color: 'white',
          borderRadius: '0 0 24px 24px',
          position: 'relative',
        }}
      >
        {/* Status Bar (time removed) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            fontSize: '14px',
          }}
        >
          <div style={{ width: '24px' }} />
          <div
            style={{
              width: '24px',
              height: '12px',
              border: '1.5px solid white',
              borderRadius: '2px',
              backgroundColor: 'white',
            }}
          />
        </div>

        {/* Top Nav Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            ←
          </button>
          <h1
            style={{
              margin: '0',
              fontSize: '24px',
              fontWeight: '600',
              flex: 1,
              textAlign: 'center',
            }}
          >
            Career Planner
          </h1>
          <div style={{ width: '32px' }} />
        </div>

        {/* Welcome Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            gap: '12px',
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '14px', opacity: 0.9 }}>
              Welcome back,
            </p>
            <h2
              style={{
                margin: '0',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              {userName}
            </h2>
          </div>
          <button
            onClick={() => navigate('/profile')}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            👤
          </button>
        </div>

        
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px 16px', maxWidth: '700px', margin: '0 auto' }}>
        {/* AI Career Match Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #d946ef 0%, #ec4899 100%)',
            borderRadius: '20px',
            padding: '24px',
            color: 'white',
            marginBottom: '32px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px',
            }}
          >
            <h3 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>
              AI Career Match Ready!
            </h3>
            <span style={{ fontSize: '32px' }}>✨</span>
          </div>
          <p
            style={{
              margin: '0 0 20px 0',
              fontSize: '16px',
              opacity: 0.95,
              lineHeight: '1.5',
            }}
          >
            Take our assessment to discover your perfect career path
          </p>
          <button
            onClick={() => navigate('/assessment')}
            style={{
              backgroundColor: 'white',
              color: '#d946ef',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Start Assessment
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {features.map((feature, index) => (
          <div
              key={index}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 16px rgba(0, 0, 0, 0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 2px 8px rgba(0, 0, 0, 0.08)';
              }}
            onClick={() => {
              if (feature.title === 'Explore Domains') {
                navigate('/explore');
              } else if (feature.title === 'Saved Careers') {
                navigate('/saved-careers');
              }
            }}
            >
              {feature.icon ? (
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: feature.color,
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto 12px',
                    fontSize: '28px',
                  }}
                >
                  {feature.icon}
                </div>
              ) : null}
              <h3
                style={{
                  margin: '0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                }}
              >
                {feature.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Trending Careers Section */}
        <div style={{ marginBottom: '24px' }}>
          <h2
            style={{
              margin: '0 0 16px 0',
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: '#d946ef', fontSize: '24px' }}>📈</span>
            Trending Careers
          </h2>

          {careerMatches.map((career, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
            >
              <div>
                <h4
                  style={{
                    margin: '0 0 6px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                  }}
                >
                  {career.title}
                </h4>
                <p
                  style={{
                    margin: '0',
                    fontSize: '14px',
                    color: '#6b7280',
                  }}
                >
                  {career.salary}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      margin: '0',
                      fontSize: '18px',
                      fontWeight: '700',
                      background: 'linear-gradient(135deg, #d946ef, #ec4899)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {career.match}
                  </p>
                  <p
                    style={{
                      margin: '0',
                      fontSize: '12px',
                      color: '#9ca3af',
                    }}
                  >
                    Match
                  </p>
                </div>
                <button
                  onClick={() => handleSave(career)}
                  style={{
                    background: savedTitles.includes(career.title) ? '#d946ef' : '#f3f4f6',
                    border: 'none',
                    borderRadius: '12px',
                    color: savedTitles.includes(career.title) ? 'white' : '#6b7280',
                    width: 42,
                    height: 42,
                    cursor: 'pointer',
                    fontSize: 18,
                  }}
                  title={savedTitles.includes(career.title) ? 'Saved' : 'Save career'}
                >
                  {savedTitles.includes(career.title) ? '★' : '☆'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

