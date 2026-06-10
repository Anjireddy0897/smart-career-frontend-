import React from 'react';
import { useNavigate } from 'react-router-dom';

const careers = [
  { title: 'Lawyer / Advocate', salary: '₹3-20+ LPA' },
  { title: 'Corporate Lawyer', salary: '₹8-30 LPA' },
  { title: 'Judge', salary: '₹50,000-2L PM' },
  { title: 'Legal Advisor', salary: '₹5-15 LPA' },
  { title: 'Public Prosecutor', salary: '₹30,000-80,000 PM' },
  { title: 'Legal Analyst', salary: '₹4-12 LPA' },
];

export default function Law() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: 'linear-gradient(90deg,#0f172a,#111827)', color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Law Careers</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(90deg,#0f172a,#374151)', color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Law Careers</h3>
          <p style={{ marginTop: 8 }}>Fight for justice and rights</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {careers.map((c, i) => (
            <div key={i} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{c.title}</div>
                <div style={{ color: '#6b7280', marginTop: 6 }}>{c.salary}</div>
              </div>
              <div style={{ color: '#374151', fontWeight: 700 }}>{/* placeholder */}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(90deg,#374151,#111827)', color: 'white', border: 'none', fontWeight: 700 }}>Return to Home</button>
        </div>
      </main>
    </div>
  );
}
