import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveCareersBulk } from '../services/savedCareers';

const QUESTION_TO_SKILLS = {
  q1: { logic: 1 },
  q2: { data: 1 },
  q3: { ui: 1, creativity: 1 },
  q4: { management: 1, leadership: 1 },
  q5: { documentation: 1, communication: 1 },
  q6: { programming: 1, technical: 1 },
  q7: { business: 1 },
  q8: { communication: 1 },
  q9: { cybersecurity: 1, security: 1 },
  q10: { collaboration: 1, creativity: 1 },
};

const CAREER_CATEGORY_PROFILES = {
  'IT & Technology': { logic: 1, data: 1, programming: 1, cybersecurity: 1, ui: 1 },
  'Business & Commerce': { business: 1, management: 1, communication: 1 },
  'Entrepreneurship': { management: 1, business: 1, communication: 1, creativity: 1 },
  'Influencer & Content Creation': { creativity: 1, communication: 1, collaboration: 1 },
  'Arts & Creativity': { creativity: 1, ui: 1 },
  'Anime & Animation': { ui: 1, creativity: 1, logic: 1 },
  'Gaming & Esports': { logic: 1, creativity: 1, programming: 1 },
  'Acting & Entertainment': { communication: 1, creativity: 1 },
  'Music Careers': { creativity: 1, communication: 1 },
  'Law Careers': { communication: 1, logic: 1, business: 1 },
  'Government & Railway': { leadership: 1, communication: 1, logic: 1 },
  'Healthcare': { logic: 1, data: 1, communication: 1 },
  'Agriculture': { data: 1, business: 1, logic: 1 },
};

const CAREER_CATEGORY_CAREERS = {
  'IT & Technology': ['Software Engineer', 'AI/ML Engineer', 'Data Scientist', 'Full Stack Developer', 'DevOps Engineer', 'Cybersecurity Analyst', 'UI/UX Designer'],
  'Business & Commerce': ['Chartered Accountant', 'MBA Graduate', 'Investment Banker', 'Financial Analyst', 'Marketing Manager', 'Business Consultant', 'Company Secretary'],
  'Entrepreneurship': ['Startup Founder', 'Tech Entrepreneur', 'Small Business Owner', 'E-commerce Owner', 'Franchise Owner', 'Consultant'],
  'Influencer & Content Creation': ['YouTuber', 'Instagram Influencer', 'Content Creator', 'Social Media Manager', 'Podcast Host', 'Vlogger'],
  'Arts & Creativity': ['Graphic Designer', 'Illustrator', 'Digital Artist', 'Fine Artist', 'Art Director', 'Tattoo Artist'],
  'Anime & Animation': ['Animator', '3D Artist', 'Character Designer', 'Storyboard Artist', 'VFX Artist', 'Animation Director'],
  'Gaming & Esports': ['Esports Player', 'Game Streamer', 'Gaming Coach', 'Game Developer', 'Gaming Content Creator', 'Esports Commentator'],
  'Acting & Entertainment': ['Film Actor', 'Theater Artist', 'Voice Actor', 'TV Serial Actor', 'Stand-up Comedian'],
  'Music Careers': ['Playback Singer', 'Music Producer', 'Music Composer', 'DJ / Music Artist', 'Music Teacher', 'Sound Engineer'],
  'Law Careers': ['Lawyer', 'Corporate Lawyer', 'Judge', 'Legal Advisor', 'Public Prosecutor', 'Legal Analyst'],
  'Government & Railway': ['IAS Officer', 'IPS Officer', 'Railway Officer', 'Bank PO', 'SSC CGL', 'Forest Officer', 'Govt. Teacher'],
  'Healthcare': ['Doctor', 'Nurse', 'Physiotherapist', 'Pharmacist', 'Medical Lab Technician', 'Radiologist', 'Dentist'],
  'Agriculture': ['Agricultural Scientist', 'Agri-Business Manager', 'Horticulturist', 'Food Technologist', 'Agricultural Engineer', 'Organic Farmer'],
};

const CAREER_DESCRIPTIONS = {
  'Software Engineer': 'Designs and develops software applications.',
  'AI/ML Engineer': 'Builds artificial intelligence and machine learning solutions.',
  'Data Scientist': 'Analyzes data and builds predictive models.',
  'Full Stack Developer': 'Builds frontend and backend web applications.',
  'Cybersecurity Analyst': 'Protects systems from cyber threats.',
  'UI/UX Designer': 'Designs intuitive digital experiences and interfaces.',
  'DevOps Engineer': 'Automates deployment and keeps software delivery reliable.',
  'UX Researcher': 'Studies users to improve product design and usability.',
  'Esports Player': 'Competes in gaming tournaments.',
  'Game Streamer': 'Streams gameplay online.',
  'Game Developer': 'Designs and develops video games.',
  'Gaming Coach': 'Trains players and teams to improve competitive performance.',
  'Gaming Content Creator': 'Creates gaming videos and community content.',
  'Esports Commentator': 'Provides live commentary for gaming events.',
  'Startup Founder': 'Builds and manages startup companies.',
  'Tech Entrepreneur': 'Creates technology businesses.',
  'Small Business Owner': 'Runs and grows an independent business.',
  'E-commerce Owner': 'Operates an online retail business.',
  'Franchise Owner': 'Manages a business under an established brand.',
  'Consultant': 'Advises clients on business and growth strategy.',
  'Film Actor': 'Performs leading and supporting roles in movies.',
  'Theater Artist': 'Performs in stage plays and live productions.',
  'Voice Actor': 'Provides voices for animation and games.',
  'TV Serial Actor': 'Acts in television serials.',
  'Stand-up Comedian': 'Performs comedy before live audiences.',
  'Graphic Designer': 'Creates visual designs.',
  'Illustrator': 'Creates drawings and illustrations.',
  'Digital Artist': 'Produces digital artwork.',
  'Animator': 'Creates animated content.',
  'Character Designer': 'Creates animated characters.',
  'Storyboard Artist': 'Plans scenes and visual sequences for animation.',
  '3D Artist': 'Creates three-dimensional digital assets.',
  'VFX Artist': 'Builds visual effects for media and film.',
  'Animation Director': 'Leads animation projects and creative teams.',
  'Content Creator': 'Creates and publishes digital content.',
  'Social Media Manager': 'Manages brand presence on social platforms.',
  'YouTuber': 'Produces video content for online audiences.',
  'Instagram Influencer': 'Builds audience engagement through social content.',
  'Vlogger': 'Creates video blogs and personal content.',
  'Podcast Host': 'Hosts audio shows and interviews.',
};

const DOMAIN_DISPLAY_NAMES = {
  'IT & Technology': 'IT & Technology Careers',
  'Gaming & Esports': 'Gaming & Esports',
  'Entrepreneurship': 'Entrepreneurship',
  'Arts & Creativity': 'Arts & Creativity',
  'Anime & Animation': 'Anime & Animation',
  'Acting & Entertainment': 'Acting & Entertainment',
  'Influencer & Content Creation': 'Content Creation',
  'Business & Commerce': 'Business & Commerce',
  'Law Careers': 'Law Careers',
  'Government & Railway': 'Government & Railway',
  'Healthcare': 'Healthcare',
  'Agriculture': 'Agriculture',
  'Music Careers': 'Music Careers',
};

function computeAssessmentResult(answers) {
  const skillScores = {
    logic: 0, data: 0, ui: 0, management: 0, documentation: 0,
    programming: 0, business: 0, communication: 0, cybersecurity: 0,
    collaboration: 0, creativity: 0, leadership: 0, technical: 0, security: 0
  };

  const optionScores = { 0: 5, 1: 4, 2: 3, 3: 1, 4: 1 };

  Object.entries(QUESTION_TO_SKILLS).forEach(([questionKey, weights]) => {
    const questionIndex = Number(questionKey.slice(1)) - 1;
    const answerIndex = answers[questionIndex];
    const score = answerIndex !== null && answerIndex !== undefined ? (optionScores[answerIndex] || 0) : 0;
    
    Object.entries(weights).forEach(([skill, weight]) => {
      skillScores[skill] = (skillScores[skill] || 0) + (score * weight);
    });
  });

  const categoryScores = {};
  Object.entries(CAREER_CATEGORY_PROFILES).forEach(([category, profile]) => {
    const totalWeight = Object.values(profile).reduce((a, b) => a + b, 0);
    const rawScore = Object.entries(profile).reduce((total, [skill, weight]) => {
      return total + (skillScores[skill] || 0) * weight;
    }, 0);
    categoryScores[category] = totalWeight > 0 ? ((rawScore / totalWeight) * 20) : 0;
  });

  const rankedCategories = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]);
  const topDomains = rankedCategories.slice(0, 3).map(([category]) => DOMAIN_DISPLAY_NAMES[category] || category);

  const recommendedCareers = [];
  const seenCareers = new Set();

  rankedCategories.slice(0, 3).forEach(([category]) => {
    const careers = CAREER_CATEGORY_CAREERS[category] || [];
    careers.forEach((careerName) => {
      if (seenCareers.has(careerName)) return;
      seenCareers.add(careerName);
      recommendedCareers.push({
        career: careerName,
        description: CAREER_DESCRIPTIONS[careerName] || 'Recommended based on your assessment.'
      });
    });
  });

  return {
    topDomains,
    recommendedCareers: recommendedCareers.slice(0, 10),
  };
}

export default function CareerRecommendation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const assessment = useMemo(() => {
    if (state && state.assessment) return state.assessment;
    try {
      const raw = localStorage.getItem('careerAssessmentResult');
      return raw ? JSON.parse(raw) : null;
    } catch (error) {}
    return null;
  }, [state]);

  const answers = useMemo(() => {
    if (state && state.answers) return state.answers;
    try {
      const raw = localStorage.getItem('assessmentAnswers');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.answers || [];
      }
    } catch (error) {}
    return [];
  }, [state]);

  const result = useMemo(() => {
    if (assessment) {
      const recs = assessment.recommendedCareers || assessment.recommended_careers || [];
      const domains = assessment.topDomains || assessment.top_domains || 
                      (assessment.primaryCareerPath ? [assessment.primaryCareerPath] : []);
      if (recs.length > 0) {
        return {
          topDomains: domains,
          recommendedCareers: recs.map(c => ({
            career: c.career || c.title || c,
            description: c.description || 'Recommended based on your assessment.'
          }))
        };
      }
    }
    return computeAssessmentResult(answers);
  }, [assessment, answers]);

  useEffect(() => {
    if (result.recommendedCareers.length === 0) return;

    const careersToSave = result.recommendedCareers.map((career, index) => ({
      title: career.career,
      salary: 'Suggested by assessment',
      match: `${Math.max(60, 100 - index * 5)}%`,
      description: career.description,
      source: 'assessment',
    }));

    saveCareersBulk(careersToSave);
  }, [result.recommendedCareers]);

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: 'linear-gradient(90deg,#4b6bf6,#8a3fe8)', color: 'white', padding: '14px 12px', display: 'flex', alignItems: 'center' }}>
        <button aria-label="back" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Assessment Result</h2>
      </header>

      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: 18 }}>
          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 18 }}>
            <div style={{ color: '#6b7280', fontSize: 13, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>Top Domains Identified</div>
            <ol style={{ margin: '12px 0 0', paddingLeft: 20, display: 'grid', gap: 6 }}>
              {result.topDomains.map((domain, index) => (
                <li key={`${domain}-${index}`} style={{ color: '#111827', fontWeight: 600 }}>{domain}</li>
              ))}
            </ol>
          </section>

          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 18 }}>
            <div style={{ color: '#6b7280', fontSize: 13, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>Recommended Careers</div>
            <ol style={{ margin: '12px 0 0', paddingLeft: 20, display: 'grid', gap: 14 }}>
              {result.recommendedCareers.map((career, index) => (
                <li key={`${career.career}-${index}`} style={{ color: '#111827' }}>
                  <div style={{ fontWeight: 800 }}>{career.career}</div>
                  <div style={{ color: '#475569', marginTop: 4 }}>{career.description}</div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div style={{ marginTop: 28 }}>
          <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'linear-gradient(90deg,#8a3fe8,#d946ef)', color: 'white', border: 'none', fontWeight: 700 }}>Return to Home</button>
        </div>
      </main>
    </div>
  );
}
