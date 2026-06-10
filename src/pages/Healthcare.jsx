import React from 'react';
import { useNavigate } from 'react-router-dom';

const careers = [
  { title: 'Doctor (MBBS)', salary: '₹8-25 LPA' },
  { title: 'Nurse', salary: '₹3-8 LPA' },
  { title: 'Physiotherapist', salary: '₹4-10 LPA' },
  { title: 'Pharmacist', salary: '₹3-7 LPA' },
  { title: 'Medical Lab Technician', salary: '₹2.5-6 LPA' },
  { title: 'Radiologist', salary: '₹10-30 LPA' },
  { title: 'Dentist', salary: '₹5-15 LPA' },
];

export default function Healthcare() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: 'linear-gradient(90deg,#4b6bf6,#8a3fe8)', color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Healthcare Careers</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(90deg,#ff4d4f,#ff7a45)', color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Healthcare Careers</h3>
          <p style={{ marginTop: 8 }}>Make a difference in people's lives</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {careers.map((c, i) => (
            <div key={i} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{c.title}</div>
                <div style={{ color: '#6b7280', marginTop: 6 }}>{c.salary}</div>
              </div>
              <div style={{ color: '#7c3aed', fontWeight: 700 }}>{/* match placeholder */}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(90deg,#8a3fe8,#d946ef)', color: 'white', border: 'none', fontWeight: 700 }}>Return to Home</button>
        </div>
      </main>
    </div>
  );
}
