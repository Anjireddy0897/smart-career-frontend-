import React from 'react';
import { useNavigate } from 'react-router-dom';

const careers = [
  { title: 'Commercial Pilot', salary: '₹1.5-5 Cr (Career)' },
  { title: 'Aircraft Engineer', salary: '₹6-15 LPA' },
  { title: 'Air Traffic Controller', salary: '₹8-20 LPA' },
  { title: 'Flight Attendant', salary: '₹3-8 LPA' },
  { title: 'Airport Manager', salary: '₹7-18 LPA' },
  { title: 'Aviation Safety Officer', salary: '₹5-12 LPA' },
];

export default function Aviation() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: 'linear-gradient(90deg,#0ea5e9,#2563eb)', color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Aviation Careers</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(90deg,#38bdf8,#0ea5e9)', color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Aviation Careers</h3>
          <p style={{ marginTop: 8 }}>Reach for the skies</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {careers.map((c, i) => (
            <div key={i} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{c.title}</div>
                <div style={{ color: '#6b7280', marginTop: 6 }}>{c.salary}</div>
              </div>
              <div style={{ color: '#0ea5e9', fontWeight: 700 }}>{/* placeholder */}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(90deg,#0ea5e9,#3b82f6)', color: 'white', border: 'none', fontWeight: 700 }}>Return to Home</button>
        </div>
      </main>
    </div>
  );
}
