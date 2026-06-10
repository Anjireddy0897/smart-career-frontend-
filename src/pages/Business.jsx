import React from 'react';
import { useNavigate } from 'react-router-dom';

const careers = [
  { title: 'Chartered Accountant (CA)', salary: '₹7-25 LPA' },
  { title: 'MBA Graduate', salary: '₹8-30 LPA' },
  { title: 'Investment Banker', salary: '₹10-40 LPA' },
  { title: 'Financial Analyst', salary: '₹5-15 LPA' },
  { title: 'Marketing Manager', salary: '₹6-20 LPA' },
  { title: 'Business Consultant', salary: '₹8-25 LPA' },
  { title: 'Company Secretary', salary: '₹5-12 LPA' },
];

export default function Business() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: 'linear-gradient(90deg,#06b6d4,#10b981)', color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Business & Commerce</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(90deg,#10b981,#16a34a)', color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Business & Commerce</h3>
          <p style={{ marginTop: 8 }}>Lead businesses to success</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {careers.map((c, i) => (
            <div key={i} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{c.title}</div>
                <div style={{ color: '#6b7280', marginTop: 6 }}>{c.salary}</div>
              </div>
              <div style={{ color: '#10b981', fontWeight: 700 }}>{/* placeholder */}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(90deg,#16a34a,#059669)', color: 'white', border: 'none', fontWeight: 700 }}>Return to Home</button>
        </div>
      </main>
    </div>
  );
}
