const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const AUTH_USERS_STORAGE_KEY = 'careerAuthUsers';
const PERSONAL_DETAILS_STORAGE_KEY = 'careerPersonalDetails';
const EDUCATION_DETAILS_STORAGE_KEY = 'careerEducationDetails';
const ASSESSMENT_STORAGE_KEY = 'careerAssessmentResult';

function getStoredAuthUsers() {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(AUTH_USERS_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredAuthUsers(users) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(users));
}

function buildLocalUser(payload = {}) {
  return {
    id: Date.now(),
    full_name: payload?.full_name || payload?.fullName || payload?.fullname || '',
    email: payload?.email || '',
    age: payload?.age || '',
    gender: payload?.gender || '',
    phone_number: payload?.phone_number || payload?.phone || '',
    password: payload?.password || '',
  };
}

function registerUserLocally(payload) {
  const users = getStoredAuthUsers();
  const email = String(payload?.email || '').trim().toLowerCase();

  if (!email) {
    throw new Error('Email is required.');
  }

  const existingUser = users.find((user) => String(user.email || '').trim().toLowerCase() === email);

  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  const user = buildLocalUser(payload);
  const nextUsers = [...users, user];
  saveStoredAuthUsers(nextUsers);

  return {
    user,
    message: 'Account created locally.',
  };
}

function loginUserLocally(payload) {
  const users = getStoredAuthUsers();
  const email = String(payload?.email || '').trim().toLowerCase();
  const password = String(payload?.password || '');

  const user = users.find(
    (storedUser) =>
      String(storedUser.email || '').trim().toLowerCase() === email &&
      String(storedUser.password || '') === password,
  );

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  return {
    user,
    message: 'Signed in locally.',
  };
}

function saveRecordLocally(storageKey, record, responseKey) {
  if (typeof window === 'undefined') {
    return { [responseKey]: record };
  }

  window.localStorage.setItem(storageKey, JSON.stringify(record));
  return { [responseKey]: record };
}

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || data?.error || 'Request failed';
    throw new Error(message);
  }

  return data;
}

export function registerUser(payload) {
  const body = {
    full_name: payload?.full_name || payload?.fullName || payload?.fullname || '',
    email: payload?.email || '',
    age: payload?.age || '',
    password: payload?.password || '',
    confirm_password: payload?.confirm_password || payload?.confirmPassword || payload?.password || '',
    gender: payload?.gender || '',
    phone_number: payload?.phone_number || payload?.phone || '',
  };

  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  }).catch((error) => {
    if (error instanceof TypeError || error?.message === 'Failed to fetch') {
      return registerUserLocally(body);
    }

    throw error;
  });
}

export function loginUser(payload) {
  const body = {
    email: payload?.email || '',
    password: payload?.password || '',
  };

  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  }).catch((error) => {
    if (error instanceof TypeError || error?.message === 'Failed to fetch') {
      return loginUserLocally(body);
    }

    throw error;
  });
}

export function savePersonalDetails(payload) {
  const record = {
    user_id: payload?.user_id ?? payload?.userId ?? null,
    email: payload?.email || '',
    date_of_birth: payload?.date_of_birth || payload?.dob || '',
    gender: payload?.gender || '',
    phone_number: payload?.phone_number || payload?.phone || '',
    city: payload?.city || '',
  };

  return request('/api/personal-details', {
    method: 'POST',
    body: JSON.stringify(record),
  }).catch((error) => {
    if (error instanceof TypeError || error?.message === 'Failed to fetch') {
      return saveRecordLocally(PERSONAL_DETAILS_STORAGE_KEY, record, 'personal_details');
    }

    throw error;
  });
}

export function saveEducationDetails(payload) {
  const record = {
    user_id: payload?.user_id ?? payload?.userId ?? null,
    email: payload?.email || '',
    current_education_level: payload?.current_education_level || payload?.level || '',
    stream: payload?.stream || '',
    school_college_name: payload?.school_college_name || payload?.institution || '',
    average_percentage_gpa: payload?.average_percentage_gpa || payload?.gpa || '',
  };

  return request('/api/education-details', {
    method: 'POST',
    body: JSON.stringify(record),
  }).catch((error) => {
    if (error instanceof TypeError || error?.message === 'Failed to fetch') {
      return saveRecordLocally(EDUCATION_DETAILS_STORAGE_KEY, record, 'education_details');
    }

    throw error;
  });
}

export function getProfile(email) {
  return request(`/api/profile/${encodeURIComponent(email)}`, {
    method: 'GET',
  });
}

export function updateProfile(payload) {
  const body = {
    user_id: payload?.user_id ?? payload?.userId ?? null,
    full_name: payload?.full_name || payload?.fullName || payload?.fullname || '',
    email: payload?.email || '',
    age: payload?.age || '',
    gender: payload?.gender || '',
    password: payload?.password || '',
    confirm_password: payload?.confirm_password || payload?.confirmPassword || payload?.password || '',
  };

  return request('/api/profile/update', {
    method: 'POST',
    body: JSON.stringify(body),
  }).catch((error) => {
    if (error instanceof TypeError || error?.message === 'Failed to fetch') {
      return {
        success: true,
        message: 'Profile updated locally (offline mode).',
        user: buildLocalUser(body),
      };
    }

    throw error;
  });
}

function getChatFallbackReply(message) {
  const msg = String(message || '').trim().toLowerCase();

  if (!msg) {
    return 'Please send a question about careers, skills, or assessments.';
  }

  // Simple word tokenization
  const words = msg.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);

  // Helper functions
  const containsWord = (list) => list.some(w => words.includes(w));
  const containsAny = (list) => list.some(kw => msg.includes(kw));

  // 1. Greetings
  if (containsWord(['hello', 'hi', 'hii', 'hey', 'yo', 'greetings'])) {
    return "Hello! I am your Smart Career Path AI Assistant. How can I help you today? You can ask me about different career options, roadmaps, required skills, or how to prepare for specific fields.";
  }

  // 2. Self-introduction
  if (containsAny(['tell your self', 'tell me about yourself', 'who are you', 'introduce yourself', 'introduce your self', 'what are you', 'your capabilities'])) {
    return "I am the Smart Career Path AI Assistant! My purpose is to help you navigate your educational and career journeys. I can:\n1. Explain different career domains (IT, Business, Healthcare, Arts, Law, Govt, etc.)\n2. Recommend skills and roadmaps for specific roles\n3. Give advice on career preparation, resumes, and study plans\n4. Analyze your career assessment results.\n\nWhat would you like to explore?";
  }

  // 3. Creative/Arts/Dance/Music
  if (containsAny(['dance', 'music', 'acting', 'singing', 'creative', 'art', 'paint', 'sculpt'])) {
    return "To learn dance or pursue a creative/artistic career:\n1. Build your foundational skills by joining local classes/studios or practicing with structured online tutorials.\n2. Practice consistently and record your sessions to review and improve.\n3. Work on physical fitness, rhythm, and flexibility.\n4. Create a digital portfolio/showreel of your performances on platforms like YouTube or Instagram.\n\nYou can also check out our 'Arts & Creativity', 'Music Careers', and 'Acting & Entertainment' domains in the Explore Domains section of the app!";
  }

  // 4. AI/ML/Data/Software/Coding
  if (containsAny(['ai', 'ml', 'al/ml', 'artificial intelligence', 'machine learning', 'deep learning', 'software', 'developer', 'programmer', 'coding', 'data scientist', 'data science'])) {
    return "For AI/ML, Data Science, and Software roles:\n1. Master a language like Python or JavaScript.\n2. Learn essential math and statistics (especially linear algebra and probability for ML).\n3. Study Data Structures and Algorithms (DSA) and database management (SQL).\n4. Learn ML frameworks like TensorFlow or PyTorch.\n5. Build hands-on projects and host them on GitHub.\n\nCheck out the 'IT & Technology' domain in the app for specific roadmaps, required skills, and salary expectations!";
  }

  // 5. My Assessment Results
  if (containsAny(['my assessment', 'my result', 'my score', 'recommend based on my', 'what did i get', 'suitable for me', 'my career', 'my recommended', 'my path', 'my domain', 'suitable career', 'recommend career'])) {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('careerAssessmentResult');
        if (raw) {
          const assessment = JSON.parse(raw);
          const topCat = assessment.primaryCareerPath || assessment.top_category || 'Career Path';
          const recs = assessment.recommendedCareers || assessment.recommended_careers || [];
          const careersList = recs.map(c => c.career || c.title || c).slice(0, 5);
          if (careersList.length > 0) {
            return `Based on your latest career assessment, your primary career path is **${topCat}**.\n\nYour top recommended career matches are: **${careersList.join(', ')}**.\n\nYou can explore these domains to see detailed roadmaps, salary ranges, and skills!`;
          }
        }
      } catch (err) {}
    }
    return "You haven't completed a career assessment yet! Please go to the Dashboard and click 'Start Assessment' so I can give you personalized recommendations.";
  }

  // 5b. General Career Assessment
  if (msg.includes('assessment') || msg.includes('test')) {
    return "Take our career assessment to get personalized recommendations! It analyzes your interests, calculates your strengths, and suggests suitable career paths based on your profile.";
  }

  // 6. Business / commerce / entrepreneurship / BBA
  if (containsAny(['bba', 'mba', 'b.com', 'bcom', 'business', 'entrepreneur', 'marketing', 'commerce'])) {
    if (containsAny(['bba', 'mba', 'b.com', 'bcom'])) {
      return "BBA (Bachelor of Business Administration) is an undergraduate degree focusing on business management, administration, finance, marketing, and entrepreneurship. It equips you with leadership and organizational skills. Many graduates pursue corporate careers or an MBA (Master of Business Administration). Check out our 'Business & Commerce' and 'Entrepreneurship' domains in the app!";
    }
    return "Business and Entrepreneurship careers include startup management, finance, marketing, and consulting. Focus on building communication, leadership, and problem-solving skills. Doing internships or starting small projects is highly valuable!";
  }

  // 7. Healthcare
  if (msg.includes('healthcare') || msg.includes('medical') || msg.includes('doctor') || msg.includes('nurse')) {
    return "Healthcare careers like doctor, nurse, pharmacist, or lab technician require strong science backgrounds, clinical training, and empathy. Check out the 'Healthcare' domain page for details on qualifications and specializations!";
  }

  // 8. Law / Lawyer Workflow
  if (msg.includes('law') || msg.includes('legal') || msg.includes('lawyer')) {
    if (msg.includes('workflow') || msg.includes('responsibilities') || msg.includes('do')) {
      return "The typical workflow of a lawyer involves:\n1. Client Consultation: Meeting clients to understand their legal objectives.\n2. Case Research: Reviewing legal precedents, statutes, and evidence.\n3. Drafting: Writing contracts, briefs, pleadings, and opinions.\n4. Negotiation: Settling disputes out of court through agreements.\n5. Representation: Presenting arguments and defending clients in court trials.\n\nCheck out the 'Law Careers' domain page in the app for details on skills and salaries!";
    }
    return "Law careers require strong communication, research, and logical thinking. You can explore roles like corporate lawyer, judge, legal advisor, or prosecutor. Check out the 'Law Careers' domain in the app!";
  }

  // 9. Government
  if (msg.includes('government') || msg.includes('govt') || msg.includes('ias') || msg.includes('ips')) {
    return "Government and public sector jobs (like IAS, IPS, Railway Officer, or Bank PO) offer stable careers with huge public impact. Entry typically requires preparing for competitive exams like UPSC, SSC CGL, or railway boards.";
  }

  // 10. Agriculture
  if (msg.includes('agriculture') || msg.includes('agri') || msg.includes('farmer')) {
    return "Agricultural careers include agricultural science, agri-business, food technology, and organic farming. It combines biology, technology, and management to improve food systems.";
  }

  // 11. Gaming
  if (msg.includes('gaming') || msg.includes('esports')) {
    return "Gaming careers include game development, esports players, streaming, and gaming content creation. Learn programming for dev roles, or focus on content quality and community building for streaming!";
  }

  // 12. Thanks
  if (msg.includes('thank') || msg.includes('thanks')) {
    return "You're very welcome! Let me know if you have any other questions about careers, roadmaps, or domains. Good luck!";
  }

  return 'I can help with career guidance, skill choices, and assessment results. Ask me about a specific career or domain.';
}

export function sendChatMessage(payload) {
  const body = {
    message: payload?.message || '',
    context: payload?.context || null,
  };

  return request('/api/chat', {
    method: 'POST',
    body: JSON.stringify(body),
  }).catch((error) => {
    if (error instanceof TypeError || error?.message === 'Failed to fetch') {
      return {
        success: true,
        reply: getChatFallbackReply(body.message),
        source: 'local-fallback',
      };
    }

    throw error;
  });
}

export function submitCareerAssessment(payload) {
  const record = {
    user_id: payload?.user_id ?? payload?.userId ?? null,
    email: payload?.email || '',
    q1: payload?.q1 || '',
    q2: payload?.q2 || '',
    q3: payload?.q3 || '',
    q4: payload?.q4 || '',
    q5: payload?.q5 || '',
    q6: payload?.q6 || '',
    q7: payload?.q7 || '',
    q8: payload?.q8 || '',
    q9: payload?.q9 || '',
    q10: payload?.q10 || '',
  };

  return request('/api/career-assessment', {
    method: 'POST',
    body: JSON.stringify(record),
  }).catch((error) => {
    if (error instanceof TypeError || error?.message === 'Failed to fetch') {
      return saveRecordLocally(ASSESSMENT_STORAGE_KEY, record, 'assessment');
    }

    throw error;
  });
}

export function saveCareerToDb(payload) {
  return request('/api/saved-careers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getSavedCareersFromDb(userId) {
  return request(`/api/saved-careers/${userId}`, {
    method: 'GET',
  });
}

export function getCareerAssessmentFromDb(userId) {
  return request(`/api/career-assessment/${userId}`, {
    method: 'GET',
  });
}

export function deleteSavedCareerFromDb(userId, title) {
  return request('/api/saved-careers/delete', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, title }),
  });
}
