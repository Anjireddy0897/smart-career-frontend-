import React from 'react';
import { useNavigate } from 'react-router-dom';

const careers = [
  { title: 'IAS Officer', salary: '₹56,100+ PM' },
  { title: 'IPS Officer', salary: '₹56,100+ PM' },
  { title: 'Railway Officer', salary: '₹30,000-80,000 PM' },
  { title: 'Bank PO', salary: '₹30,000-50,000 PM' },
  { title: 'SSC CGL', salary: '₹25,000-60,000 PM' },
  { title: 'Forest Officer', salary: '₹40,000-70,000 PM' },
  { title: 'Govt. Teacher', salary: '₹25,000-60,000 PM' },
];

export default function Govt() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: 'linear-gradient(90deg,#4b6bf6,#8a3fe8)', color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Government & Railway</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(90deg,#7c3aed,#6d28d9)', color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Government & Railway</h3>
          <p style={{ marginTop: 8 }}>Serve the nation with pride</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {careers.map((c, i) => (
            <div key={i} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{c.title}</div>
                <div style={{ color: '#6b7280', marginTop: 6 }}>{c.salary}</div>
              </div>
              <div style={{ color: '#6d28d9', fontWeight: 700 }}>{/* placeholder */}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(90deg,#6d28d9,#4f46e5)', color: 'white', border: 'none', fontWeight: 700 }}>Return to Home</button>
        </div>
      </main>
    </div>
  );
}
