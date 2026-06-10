import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Define careers and their relevance weights for each question (10 questions)
const careers = [
  {
    id: 'senior-ai-engineer',
    title: 'Senior AI Engineer',
    salary: '₹25-40 LPA',
    weights: [0.9, 0.9, 0.2, 0.3, 0.1, 0.8, 0.8, 0.2, 0.9, 0.2],
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    salary: '₹18-30 LPA',
    weights: [0.7, 0.95, 0.2, 0.2, 0.1, 0.7, 0.7, 0.2, 0.8, 0.2],
  },
  {
    id: 'ux-ui-designer',
    title: 'UX/UI Designer',
    salary: '₹12-22 LPA',
    weights: [0.1, 0.1, 0.95, 0.2, 0.1, 0.2, 0.1, 0.3, 0.2, 0.4],
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    salary: '₹15-28 LPA',
    weights: [0.6, 0.6, 0.1, 0.2, 0.1, 0.3, 0.95, 0.2, 0.7, 0.1],
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    salary: '₹18-35 LPA',
    weights: [0.2, 0.3, 0.4, 0.95, 0.2, 0.3, 0.2, 0.6, 0.3, 0.9],
  },
  {
    id: 'technical-writer',
    title: 'Technical Writer',
    salary: '₹6-14 LPA',
    weights: [0.1, 0.2, 0.2, 0.1, 0.95, 0.2, 0.1, 0.2, 0.1, 0.3],
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    salary: '₹14-28 LPA',
    weights: [0.6, 0.6, 0.1, 0.3, 0.1, 0.5, 0.9, 0.2, 0.8, 0.2],
  },
  {
    id: 'ux-researcher',
    title: 'UX Researcher',
    salary: '₹10-20 LPA',
    weights: [0.2, 0.3, 0.9, 0.2, 0.2, 0.4, 0.2, 0.6, 0.2, 0.4],
  },
];

function mapOptionToScore(optIdx) {
  // optIdx: 0 = Very Interested, 1 = Interested, 2 = Neutral, 3 = Not Interested
  // Map to 3..0 so higher interest gives higher score
  if (optIdx === null || optIdx === undefined) return 0;
  return Math.max(0, 3 - optIdx);
}

export default function CareerRecommendation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // answers array either from route state or localStorage
  const answers = useMemo(() => {
    if (state && state.answers) return state.answers;
    try {
      const raw = localStorage.getItem('assessmentAnswers');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.answers || [];
      }
    } catch (e) {}
    return [];
  }, [state]);

  const scored = useMemo(() => {
    const scores = careers.map((c) => {
      let total = 0;
      let maxTotal = 0;
      for (let i = 0; i < c.weights.length; i++) {
        const w = c.weights[i] || 0;
        const ans = answers && answers[i];
        const s = mapOptionToScore(ans);
        total += w * s;
        maxTotal += w * 3; // max per question is 3
      }
      const pct = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
      return { ...c, score: Math.max(0, Math.min(100, pct)) };
    });
    return scores.sort((a, b) => b.score - a.score);
  }, [answers]);

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: 'linear-gradient(90deg,#4b6bf6,#8a3fe8)', color: 'white', padding: '14px 12px', display: 'flex', alignItems: 'center' }}>
        <button aria-label="back" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Career Recommendations</h2>
      </header>

      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <p style={{ color: '#374151' }}>Based on your assessment, here are your best career matches:</p>

        <div style={{ display: 'grid', gap: 16, marginTop: 12 }}>
          {scored.map((c) => (
            <div key={c.id} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0 }}>{c.title}</h3>
                <div style={{ color: '#6b7280', marginTop: 4 }}>{c.salary}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ background: '#f3e8ff', color: '#7c3aed', padding: '8px 12px', borderRadius: 12, fontWeight: 700 }}>{c.score}%</div>
                <div style={{ color: '#9ca3af', fontSize: 12 }}>Match</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28 }}>
          <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'linear-gradient(90deg,#8a3fe8,#d946ef)', color: 'white', border: 'none', fontWeight: 700 }}>Return to Home</button>
        </div>
      </main>
    </div>
  );
}
