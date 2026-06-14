from __future__ import annotations

import os
import re
import sqlite3
from datetime import datetime
from typing import Any, Dict, Optional

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.environ.get('CAREER_DB_PATH', os.path.join(BASE_DIR, 'career_backend.db'))

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

# Enable CORS for all routes
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=False)

EMAIL_REGEX = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
PHONE_REGEX = re.compile(r'^\+?[0-9]{7,15}$')
GENDER_OPTIONS = {'male', 'female', 'other', 'prefer_not_to_say'}
OPTION_SCORES = {
    'very interested': 4,
    'interested': 3,
    'neutral': 2,
    'not interested': 1,
}

OPTION_ALIASES = {
    'strongly agree': 'very interested',
    'agree': 'interested',
    'neutral': 'neutral',
    'disagree': 'not interested',
    'strongly disagree': 'not interested',
}

QUESTION_TO_SKILLS = {
    'q1': {'logic': 1},
    'q2': {'data': 1},
    'q3': {'ui': 1, 'creativity': 1},
    'q4': {'management': 1, 'leadership': 1},
    'q5': {'documentation': 1, 'communication': 1},
    'q6': {'programming': 1, 'technical': 1},
    'q7': {'business': 1},
    'q8': {'communication': 1},
    'q9': {'cybersecurity': 1, 'security': 1},
    'q10': {'collaboration': 1, 'creativity': 1},
}

CAREER_CATEGORY_PROFILES = {
    'IT & Technology': {'logic': 1, 'data': 1, 'programming': 1, 'cybersecurity': 1, 'ui': 1},
    'Business & Commerce': {'business': 1, 'management': 1, 'communication': 1},
    'Entrepreneurship': {'management': 1, 'business': 1, 'communication': 1, 'creativity': 1},
    'Influencer & Content Creation': {'creativity': 1, 'communication': 1, 'collaboration': 1},
    'Arts & Creativity': {'creativity': 1, 'ui': 1},
    'Anime & Animation': {'ui': 1, 'creativity': 1, 'logic': 1},
    'Gaming & Esports': {'logic': 1, 'creativity': 1, 'programming': 1},
    'Acting & Entertainment': {'communication': 1, 'creativity': 1},
    'Music Careers': {'creativity': 1, 'communication': 1},
    'Law Careers': {'communication': 1, 'logic': 1, 'business': 1},
    'Government & Railway': {'leadership': 1, 'communication': 1, 'logic': 1},
    'Healthcare': {'logic': 1, 'data': 1, 'communication': 1},
    'Agriculture': {'data': 1, 'business': 1, 'logic': 1},
}

CAREER_CATEGORY_CAREERS = {
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
}

CAREER_DETAILS = {
    'Software Engineer': {'skillsRequired': ['Python', 'JavaScript', 'DSA', 'Git'], 'roadmap': ['Learn programming basics', 'Practice data structures', 'Build projects', 'Contribute to GitHub'], 'salaryRange': '4-20 LPA', 'demandLevel': 'High'},
    'AI/ML Engineer': {'skillsRequired': ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow'], 'roadmap': ['Learn Python', 'Learn statistics', 'Study ML fundamentals', 'Build AI projects'], 'salaryRange': '8-25 LPA', 'demandLevel': 'High'},
    'Data Scientist': {'skillsRequired': ['Python', 'Statistics', 'SQL', 'Data Visualization'], 'roadmap': ['Learn statistics', 'Practice SQL', 'Master Python for data', 'Work on datasets'], 'salaryRange': '6-22 LPA', 'demandLevel': 'High'},
    'Full Stack Developer': {'skillsRequired': ['HTML', 'CSS', 'JavaScript', 'Backend Development'], 'roadmap': ['Learn frontend basics', 'Learn backend basics', 'Build full stack apps', 'Deploy projects'], 'salaryRange': '5-22 LPA', 'demandLevel': 'High'},
    'Cybersecurity Analyst': {'skillsRequired': ['Networking', 'Security Tools', 'Linux', 'Threat Analysis'], 'roadmap': ['Learn networking', 'Study security fundamentals', 'Practice labs', 'Earn security certifications'], 'salaryRange': '5-20 LPA', 'demandLevel': 'High'},
    'UI/UX Designer': {'skillsRequired': ['Figma', 'Wireframing', 'User Research', 'Prototyping'], 'roadmap': ['Learn design basics', 'Study user research', 'Create wireframes', 'Build a portfolio'], 'salaryRange': '4-18 LPA', 'demandLevel': 'High'},
}

DEFAULT_CAREER_DETAILS = {
    'skillsRequired': ['Communication', 'Problem Solving', 'Domain Knowledge'],
    'roadmap': ['Understand the career path', 'Learn core skills', 'Practice through projects', 'Apply for internships'],
    'salaryRange': 'Varies',
    'demandLevel': 'Medium',
}

DOMAIN_DISPLAY_NAMES = {
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
}

DOMAIN_PROFILE_LABELS = {
    'IT & Technology': 'Technology',
    'Gaming & Esports': 'Gaming',
    'Entrepreneurship': 'Entrepreneurship',
    'Arts & Creativity': 'Creative',
    'Anime & Animation': 'Animation',
    'Acting & Entertainment': 'Entertainment',
    'Influencer & Content Creation': 'Content Creation',
    'Business & Commerce': 'Business',
    'Law Careers': 'Law',
    'Government & Railway': 'Government',
    'Healthcare': 'Healthcare',
    'Agriculture': 'Agriculture',
    'Music Careers': 'Music',
}

CAREER_DESCRIPTIONS = {
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
}

TOP_DOMAIN_ALLOCATION = [5, 3, 2]


def get_db() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute('PRAGMA foreign_keys = ON')
    return connection


def now_iso() -> str:
    return datetime.utcnow().isoformat(timespec='seconds') + 'Z'


def json_error(message: str, status_code: int, errors: Optional[Dict[str, Any]] = None):
    payload: Dict[str, Any] = {'success': False, 'message': message}
    if errors:
        payload['errors'] = errors
    return jsonify(payload), status_code


def get_request_data() -> Dict[str, Any]:
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else {}


def normalize_email(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    return value.strip().lower()


def validate_email(value: Optional[str]) -> bool:
    return bool(value and EMAIL_REGEX.match(value))


def validate_phone(value: Optional[str]) -> bool:
    return bool(value and PHONE_REGEX.match(value))


def ensure_column(connection: sqlite3.Connection, table_name: str, column_sql: str, column_name: str) -> None:
    columns = {row['name'] for row in connection.execute(f'PRAGMA table_info({table_name})').fetchall()}
    if column_name not in columns:
        connection.execute(f'ALTER TABLE {table_name} ADD COLUMN {column_sql}')


def ensure_database() -> None:
    os.makedirs(BASE_DIR, exist_ok=True)
    with get_db() as connection:
        connection.execute(
            '''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                age TEXT DEFAULT '',
                gender TEXT DEFAULT '',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            '''
        )
        connection.execute(
            '''
            CREATE TABLE IF NOT EXISTS personal_details (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL UNIQUE,
                date_of_birth TEXT NOT NULL,
                gender TEXT NOT NULL,
                phone_number TEXT NOT NULL,
                city TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            '''
        )
        connection.execute(
            '''
            CREATE TABLE IF NOT EXISTS education_details (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL UNIQUE,
                current_education_level TEXT NOT NULL,
                stream TEXT,
                school_college_name TEXT NOT NULL,
                average_percentage_gpa TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            '''
        )
        connection.execute(
            '''
            CREATE TABLE IF NOT EXISTS career_assessments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                answers_json TEXT NOT NULL,
                skill_scores_json TEXT NOT NULL,
                category_scores_json TEXT NOT NULL,
                recommendations_json TEXT NOT NULL,
                top_category TEXT NOT NULL,
                top_score INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            '''
        )
        connection.execute(
            '''
            CREATE TABLE IF NOT EXISTS saved_careers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                salary TEXT DEFAULT '',
                match TEXT DEFAULT '',
                description TEXT DEFAULT '',
                source TEXT DEFAULT '',
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, title)
            )
            '''
        )

        ensure_column(connection, 'users', "age TEXT DEFAULT ''", 'age')
        ensure_column(connection, 'users', "gender TEXT DEFAULT ''", 'gender')


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    with get_db() as connection:
        row = connection.execute(
            'SELECT id, full_name, email, password_hash, age, gender, created_at, updated_at FROM users WHERE email = ?',
            (email,),
        ).fetchone()
        return dict(row) if row else None


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    with get_db() as connection:
        row = connection.execute(
            'SELECT id, full_name, email, password_hash, age, gender, created_at, updated_at FROM users WHERE id = ?',
            (user_id,),
        ).fetchone()
        return dict(row) if row else None


def serialize_user(user_row: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'id': user_row['id'],
        'full_name': user_row['full_name'],
        'email': user_row['email'],
        'age': user_row.get('age', ''),
        'gender': user_row.get('gender', ''),
        'created_at': user_row['created_at'],
        'updated_at': user_row['updated_at'],
    }


def resolve_user_id(data: Dict[str, Any]) -> Optional[int]:
    user_id = data.get('user_id')
    if user_id is not None:
        try:
            return int(user_id)
        except (TypeError, ValueError):
            return None

    email = normalize_email(data.get('email'))
    if email and validate_email(email):
        user = get_user_by_email(email)
        if user:
            return int(user['id'])
    return None


def coalesce(existing: Any, incoming: Any) -> Any:
    return existing if incoming in (None, '') else incoming


def normalize_answer(value: Any) -> Optional[str]:
    if value is None:
        return None
    normalized = str(value).strip().lower()
    normalized = OPTION_ALIASES.get(normalized, normalized)
    return normalized if normalized in OPTION_SCORES else None


def normalize_answer_score(value: Any) -> int:
    if value is None:
        return 0

    if isinstance(value, bool):
        return 0

    if isinstance(value, (int, float)):
        numeric = int(value)
        if 1 <= numeric <= 5:
            return numeric
        if 0 <= numeric <= 4:
            return numeric + 1
        return 0

    normalized = str(value).strip().lower()
    mapped = {
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        'very interested': 5,
        'interested': 4,
        'neutral': 3,
        'not interested': 1,
        'strongly agree': 5,
        'agree': 4,
        'disagree': 1,
        'strongly disagree': 1,
    }
    return mapped.get(normalized, 0)


def json_dumps(value: Any) -> str:
    import json

    return json.dumps(value, ensure_ascii=False)


def json_loads(value: str) -> Any:
    import json

    return json.loads(value)


def calculate_skill_scores(answers: Dict[str, Any]) -> Dict[str, int]:
    skill_scores = {
        'logic': 0,
        'data': 0,
        'ui': 0,
        'management': 0,
        'documentation': 0,
        'programming': 0,
        'business': 0,
        'communication': 0,
        'cybersecurity': 0,
        'collaboration': 0,
        'creativity': 0,
        'leadership': 0,
        'technical': 0,
        'security': 0,
    }

    for question_key, skill_weights in QUESTION_TO_SKILLS.items():
        score = normalize_answer_score(answers.get(question_key))
        for skill_name, weight in skill_weights.items():
            skill_scores[skill_name] = skill_scores.get(skill_name, 0) + (score * weight)

    return skill_scores


def recommend_careers(answers: Dict[str, Any]) -> Dict[str, Any]:
    skill_scores = calculate_skill_scores(answers)

    category_scores: Dict[str, float] = {}
    for category_name, profile in CAREER_CATEGORY_PROFILES.items():
        total_weight = sum(profile.values())
        raw_score = sum(skill_scores.get(skill, 0) * weight for skill, weight in profile.items())
        # Normalize score to a 100-point scale (since max skill score is 5, divide by weight and multiply by 20)
        category_scores[category_name] = round((raw_score / total_weight) * 20, 1) if total_weight > 0 else 0.0

    ranked_categories = sorted(category_scores.items(), key=lambda item: item[1], reverse=True)
    top_category = ranked_categories[0][0] if ranked_categories else 'IT & Technology'
    top_score = ranked_categories[0][1] if ranked_categories else 0
    top_domains = [domain for domain, _ in ranked_categories[:3]]

    student_profile = ' + '.join(DOMAIN_PROFILE_LABELS.get(domain, domain) for domain in top_domains) if top_domains else 'Career Discovery'

    recommended_careers = []
    seen_careers = set()
    for index, domain in enumerate(top_domains):
        for career_name in CAREER_CATEGORY_CAREERS.get(domain, []):
            if career_name in seen_careers:
                continue
            seen_careers.add(career_name)
            details = CAREER_DETAILS.get(career_name, DEFAULT_CAREER_DETAILS)
            recommended_careers.append(
                {
                    'career': career_name,
                    'description': CAREER_DESCRIPTIONS.get(career_name, 'Recommended based on your assessment.'),
                    'category': DOMAIN_DISPLAY_NAMES.get(domain, domain),
                    'score': max(1, 100 - (index * 7)),
                    'skillsRequired': details['skillsRequired'],
                    'roadmap': details['roadmap'],
                    'salaryRange': details['salaryRange'],
                    'demandLevel': details['demandLevel'],
                }
            )

    # Keep the list focused like the sample result screen.
    recommended_careers = recommended_careers[:10]

    return {
        'skillScores': skill_scores,
        'categoryScores': ranked_categories,
        'studentProfile': student_profile,
        'topDomains': [DOMAIN_DISPLAY_NAMES.get(domain, domain) for domain in top_domains],
        'primaryCareerPath': top_category,
        'topScore': top_score,
        'recommendedCareers': recommended_careers,
    }


def store_career_assessment(user_id: int, answers: Dict[str, Any], recommendations: Dict[str, Any]) -> Dict[str, Any]:
    timestamp = now_iso()
    payload_answers = {key: answers.get(key) for key in [f'q{i}' for i in range(1, 11)]}

    with get_db() as connection:
        row = connection.execute(
            'SELECT id FROM career_assessments WHERE user_id = ? ORDER BY id DESC LIMIT 1',
            (user_id,),
        ).fetchone()

        if row:
            assessment_id = int(row['id'])
            connection.execute(
                '''
                UPDATE career_assessments
                SET answers_json = ?, skill_scores_json = ?, category_scores_json = ?, recommendations_json = ?,
                    top_category = ?, top_score = ?, updated_at = ?
                WHERE id = ?
                ''',
                (
                    json_dumps(payload_answers),
                    json_dumps(recommendations['skillScores']),
                    json_dumps(recommendations['categoryScores']),
                    json_dumps(recommendations['recommendedCareers']),
                    recommendations['primaryCareerPath'],
                    int(recommendations['topScore']),
                    timestamp,
                    assessment_id,
                ),
            )
        else:
            cursor = connection.execute(
                '''
                INSERT INTO career_assessments (
                    user_id, answers_json, skill_scores_json, category_scores_json,
                    recommendations_json, top_category, top_score, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''',
                (
                    user_id,
                    json_dumps(payload_answers),
                    json_dumps(recommendations['skillScores']),
                    json_dumps(recommendations['categoryScores']),
                    json_dumps(recommendations['recommendedCareers']),
                    recommendations['primaryCareerPath'],
                    int(recommendations['topScore']),
                    timestamp,
                    timestamp,
                ),
            )
            assessment_id = int(cursor.lastrowid)

        # Auto-save recommended careers from this assessment to saved_careers table
        for career in recommendations.get('recommendedCareers', []):
            c_title = career.get('career')
            if not c_title:
                continue
            c_salary = career.get('salaryRange') or 'Suggested by assessment'
            c_match = f"{career.get('score', 100)}%"
            c_desc = career.get('description') or ''
            connection.execute(
                '''
                INSERT OR REPLACE INTO saved_careers (user_id, title, salary, match, description, source, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''',
                (user_id, c_title, c_salary, c_match, c_desc, 'assessment', timestamp)
            )

    return {'assessment_id': assessment_id, 'stored_at': timestamp}


@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, OPTIONS'
    return response


@app.route('/', methods=['GET'])
def home():
    return jsonify(
        {
            'success': True,
            'message': 'Smart Career backend is running.',
            'database': {'type': 'sqlite', 'path': DB_PATH},
            'endpoints': {
                'register': '/api/auth/register',
                'login': '/api/auth/login',
                'profile_update': '/api/profile/update',
                'personal_details': '/api/personal-details',
                'education_details': '/api/education-details',
                'profile': '/api/profile/<email>',
                'debug_storage': '/api/debug/storage',
            },
        }
    )


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'success': True, 'status': 'ok'})


@app.route('/api/auth/register', methods=['POST'])
def register():
    data = get_request_data()
    full_name = (data.get('full_name') or '').strip()
    email = normalize_email(data.get('email'))
    password = data.get('password') or ''
    confirm_password = data.get('confirm_password') or ''
    age = (data.get('age') or '').strip()
    gender = (data.get('gender') or '').strip().lower()

    errors: Dict[str, str] = {}
    if not full_name:
        errors['full_name'] = 'Full name is required.'
    if not validate_email(email):
        errors['email'] = 'A valid email is required.'
    if len(password) < 6:
        errors['password'] = 'Password must be at least 6 characters long.'
    if password != confirm_password:
        errors['confirm_password'] = 'Passwords do not match.'

    if errors:
        return json_error('Validation failed.', 400, errors)

    if get_user_by_email(email):
        return json_error('An account with this email already exists.', 409)

    timestamp = now_iso()
    with get_db() as connection:
        cursor = connection.execute(
            '''
            INSERT INTO users (full_name, email, password_hash, age, gender, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''',
            (full_name, email, generate_password_hash(password), age, gender, timestamp, timestamp),
        )
        user_id = cursor.lastrowid

    return jsonify(
        {
            'success': True,
            'message': 'Account created successfully.',
            'user': {
                'id': user_id,
                'full_name': full_name,
                'email': email,
                'age': age,
                'gender': gender,
            },
        }
    ), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = get_request_data()
    email = normalize_email(data.get('email'))
    password = data.get('password') or ''

    errors: Dict[str, str] = {}
    if not validate_email(email):
        errors['email'] = 'A valid email is required.'
    if not password:
        errors['password'] = 'Password is required.'
    if errors:
        return json_error('Validation failed.', 400, errors)

    user = get_user_by_email(email)
    if not user or not check_password_hash(user['password_hash'], password):
        return json_error('Invalid email or password.', 401)

    return jsonify({'success': True, 'message': 'Login successful.', 'user': serialize_user(user)})


@app.route('/api/profile/update', methods=['POST', 'PUT', 'PATCH'])
def update_profile():
    data = get_request_data()
    user_id = resolve_user_id(data)
    full_name = (data.get('full_name') or '').strip()
    email = normalize_email(data.get('email'))
    age = (data.get('age') or '').strip()
    gender = (data.get('gender') or '').strip().lower()
    password = data.get('password') or ''
    confirm_password = data.get('confirm_password') or ''

    errors: Dict[str, str] = {}
    if not user_id or not get_user_by_id(user_id):
        errors['user'] = 'Valid user_id or email is required.'
    if not full_name:
        errors['full_name'] = 'Full name is required.'
    if email and not validate_email(email):
        errors['email'] = 'A valid email is required.'
    if gender and gender not in GENDER_OPTIONS:
        errors['gender'] = 'Gender must be one of: male, female, other, prefer_not_to_say.'
    if password or confirm_password:
        if len(password) < 6:
            errors['password'] = 'Password must be at least 6 characters long.'
        if password != confirm_password:
            errors['confirm_password'] = 'Passwords do not match.'

    if errors:
        return json_error('Validation failed.', 400, errors)

    current_user = get_user_by_id(user_id)
    assert current_user is not None

    if email and email != current_user['email']:
        existing_user = get_user_by_email(email)
        if existing_user and int(existing_user['id']) != int(user_id):
            return json_error('An account with this email already exists.', 409)

    timestamp = now_iso()
    update_fields = ['full_name = ?', 'updated_at = ?']
    update_values = [full_name, timestamp]

    if email:
        update_fields.insert(1, 'email = ?')
        update_values.insert(1, email)

    if age != '':
        update_fields.append('age = ?')
        update_values.append(age)

    if gender:
        update_fields.append('gender = ?')
        update_values.append(gender)

    if password:
        update_fields.append('password_hash = ?')
        update_values.append(generate_password_hash(password))

    update_values.append(user_id)

    with get_db() as connection:
        connection.execute(
            f"UPDATE users SET {', '.join(update_fields)} WHERE id = ?",
            update_values,
        )

    updated_user = get_user_by_id(user_id)
    return jsonify(
        {
            'success': True,
            'message': 'Profile updated successfully.',
            'user': serialize_user(updated_user) if updated_user else None,
        }
    )


@app.route('/api/personal-details', methods=['POST', 'PUT', 'PATCH'])
def save_personal_details():
    data = get_request_data()
    user_id = resolve_user_id(data)
    date_of_birth = (data.get('date_of_birth') or '').strip()
    gender = (data.get('gender') or '').strip().lower()
    phone_number = (data.get('phone_number') or '').strip()
    city = (data.get('city') or '').strip()

    errors: Dict[str, str] = {}
    if not user_id or not get_user_by_id(user_id):
        errors['user'] = 'Valid user_id or email is required.'
    if not date_of_birth:
        errors['date_of_birth'] = 'Date of birth is required.'
    if gender and gender not in GENDER_OPTIONS:
        errors['gender'] = 'Gender must be one of: male, female, other, prefer_not_to_say.'
    if not validate_phone(phone_number):
        errors['phone_number'] = 'Phone number must contain 7 to 15 digits and may start with +.'
    if not city:
        errors['city'] = 'City is required.'

    if errors:
        return json_error('Validation failed.', 400, errors)

    timestamp = now_iso()
    with get_db() as connection:
        existing = connection.execute(
            'SELECT id FROM personal_details WHERE user_id = ?',
            (user_id,),
        ).fetchone()
        if existing:
            connection.execute(
                '''
                UPDATE personal_details
                SET date_of_birth = ?, gender = ?, phone_number = ?, city = ?, updated_at = ?
                WHERE user_id = ?
                ''',
                (date_of_birth, gender, phone_number, city, timestamp, user_id),
            )
            action = 'updated'
        else:
            connection.execute(
                '''
                INSERT INTO personal_details (
                    user_id, date_of_birth, gender, phone_number, city, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ''',
                (user_id, date_of_birth, gender, phone_number, city, timestamp, timestamp),
            )
            action = 'created'

    return jsonify(
        {
            'success': True,
            'message': f'Personal details {action} successfully.',
            'personal_details': {
                'user_id': user_id,
                'date_of_birth': date_of_birth,
                'gender': gender,
                'phone_number': phone_number,
                'city': city,
            },
        }
    )


@app.route('/api/education-details', methods=['POST', 'PUT', 'PATCH'])
def save_education_details():
    data = get_request_data()
    user_id = resolve_user_id(data)
    current_education_level = (data.get('current_education_level') or '').strip()
    stream = (data.get('stream') or '').strip()
    school_college_name = (data.get('school_college_name') or '').strip()
    average_percentage_gpa = (data.get('average_percentage_gpa') or '').strip()

    errors: Dict[str, str] = {}
    if not user_id or not get_user_by_id(user_id):
        errors['user'] = 'Valid user_id or email is required.'
    if not current_education_level:
        errors['current_education_level'] = 'Current education level is required.'
    if not school_college_name:
        errors['school_college_name'] = 'School/college name is required.'
    if not average_percentage_gpa:
        errors['average_percentage_gpa'] = 'Average percentage/GPA is required.'

    if errors:
        return json_error('Validation failed.', 400, errors)

    timestamp = now_iso()
    with get_db() as connection:
        existing = connection.execute(
            'SELECT id FROM education_details WHERE user_id = ?',
            (user_id,),
        ).fetchone()
        if existing:
            connection.execute(
                '''
                UPDATE education_details
                SET current_education_level = ?, stream = ?, school_college_name = ?, average_percentage_gpa = ?, updated_at = ?
                WHERE user_id = ?
                ''',
                (current_education_level, stream, school_college_name, average_percentage_gpa, timestamp, user_id),
            )
            action = 'updated'
        else:
            connection.execute(
                '''
                INSERT INTO education_details (
                    user_id, current_education_level, stream, school_college_name,
                    average_percentage_gpa, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ''',
                (user_id, current_education_level, stream, school_college_name, average_percentage_gpa, timestamp, timestamp),
            )
            action = 'created'

    return jsonify(
        {
            'success': True,
            'message': f'Education details {action} successfully.',
            'education_details': {
                'user_id': user_id,
                'current_education_level': current_education_level,
                'stream': stream,
                'school_college_name': school_college_name,
                'average_percentage_gpa': average_percentage_gpa,
            },
        }
    )


@app.route('/api/career-assessment', methods=['POST'])
def submit_career_assessment():
    data = get_request_data()
    user_id = resolve_user_id(data)
    if not user_id or not get_user_by_id(user_id):
        return json_error('Valid user_id or email is required.', 400)

    answers: Dict[str, Any] = {}
    validation_errors: Dict[str, str] = {}
    for index in range(1, 11):
        key = f'q{index}'
        normalized = normalize_answer(data.get(key))
        if not normalized:
            validation_errors[key] = 'Choose one of: Strongly Agree, Agree, Neutral, Disagree, Strongly Disagree.'
        else:
            answers[key] = normalized

    if validation_errors:
        return json_error('Validation failed.', 400, validation_errors)

    recommendations = recommend_careers(answers)
    storage = store_career_assessment(user_id, answers, recommendations)

    return jsonify(
        {
            'success': True,
            'message': 'Career assessment saved successfully.',
            'assessment': {
                'assessment_id': storage['assessment_id'],
                'user_id': user_id,
                'answers': answers,
                'studentProfile': recommendations['studentProfile'],
                'topDomains': recommendations['topDomains'],
                'primaryCareerPath': recommendations['primaryCareerPath'],
                'topScore': recommendations['topScore'],
                'recommendedCareers': recommendations['recommendedCareers'],
            },
        }
    ), 201


@app.route('/api/career-assessment/<int:user_id>', methods=['GET'])
def get_career_assessment(user_id: int):
    if not get_user_by_id(user_id):
        return json_error('User not found.', 404)

    with get_db() as connection:
        row = connection.execute(
            '''
            SELECT id, user_id, answers_json, skill_scores_json, category_scores_json,
                   recommendations_json, top_category, top_score, created_at, updated_at
            FROM career_assessments
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT 1
            ''',
            (user_id,),
        ).fetchone()

    if not row:
        return json_error('Career assessment not found.', 404)

    assessment = dict(row)
    assessment['answers'] = json_loads(assessment.pop('answers_json'))
    assessment['skill_scores'] = json_loads(assessment.pop('skill_scores_json'))
    assessment['category_scores'] = json_loads(assessment.pop('category_scores_json'))
    assessment['recommended_careers'] = json_loads(assessment.pop('recommendations_json'))
    assessment['studentProfile'] = ' + '.join([assessment.get('top_category', 'Career Discovery')])
    assessment['topDomains'] = [assessment.get('top_category', 'Career Discovery')]

    return jsonify({'success': True, 'assessment': assessment})


@app.route('/api/profile/<email>', methods=['GET'])
def get_profile(email: str):
    normalized_email = normalize_email(email)
    if not validate_email(normalized_email):
        return json_error('A valid email is required.', 400)

    user = get_user_by_email(normalized_email)
    if not user:
        return json_error('User not found.', 404)

    user_id = int(user['id'])
    with get_db() as connection:
        personal_details = connection.execute(
            'SELECT date_of_birth, gender, phone_number, city, created_at, updated_at FROM personal_details WHERE user_id = ?',
            (user_id,),
        ).fetchone()
        education_details = connection.execute(
            'SELECT current_education_level, stream, school_college_name, average_percentage_gpa, created_at, updated_at FROM education_details WHERE user_id = ?',
            (user_id,),
        ).fetchone()

    return jsonify(
        {
            'success': True,
            'user': serialize_user(user),
            'personal_details': dict(personal_details) if personal_details else None,
            'education_details': dict(education_details) if education_details else None,
        }
    )


@app.route('/api/debug/storage', methods=['GET'])
def debug_storage():
    email = normalize_email(request.args.get('email'))
    user_id_value = request.args.get('user_id')
    user_id: Optional[int] = None

    if user_id_value:
        try:
            user_id = int(user_id_value)
        except (TypeError, ValueError):
            return json_error('user_id must be an integer.', 400)
    elif email:
        user = get_user_by_email(email)
        if user:
            user_id = int(user['id'])
    else:
        return json_error('Provide either email or user_id.', 400)

    if not user_id:
        return json_error('User not found.', 404)

    with get_db() as connection:
        user_row = connection.execute(
            'SELECT id, full_name, email, age, gender, created_at, updated_at FROM users WHERE id = ?',
            (user_id,),
        ).fetchone()
        personal_row = connection.execute(
            'SELECT * FROM personal_details WHERE user_id = ?',
            (user_id,),
        ).fetchone()
        education_row = connection.execute(
            'SELECT * FROM education_details WHERE user_id = ?',
            (user_id,),
        ).fetchone()

    return jsonify(
        {
            'success': True,
            'database': 'sqlite',
            'user': dict(user_row) if user_row else None,
            'personal_details': dict(personal_row) if personal_row else None,
            'education_details': dict(education_row) if education_row else None,
            'stored': {
                'user': bool(user_row),
                'personal_details': bool(personal_row),
                'education_details': bool(education_row),
            },
        }
    )


@app.route('/api/saved-careers', methods=['POST'])
def add_saved_careers():
    data = get_request_data()
    user_id = resolve_user_id(data)
    if not user_id or not get_user_by_id(user_id):
        return json_error('Valid user_id or email is required.', 400)
    
    careers = data.get('careers')
    if careers is None:
        title = (data.get('title') or '').strip()
        if not title:
            return json_error('Career title is required.', 400)
        careers = [{
            'title': title,
            'salary': data.get('salary', ''),
            'match': data.get('match', ''),
            'description': data.get('description', ''),
            'source': data.get('source', '')
        }]
    elif not isinstance(careers, list):
        return json_error('careers must be a list.', 400)
        
    timestamp = now_iso()
    with get_db() as connection:
        for career in careers:
            title = (career.get('title') or '').strip()
            if not title:
                continue
            salary = (career.get('salary') or '').strip()
            match = (career.get('match') or '').strip()
            description = (career.get('description') or '').strip()
            source = (career.get('source') or '').strip()
            connection.execute(
                '''
                INSERT OR REPLACE INTO saved_careers (user_id, title, salary, match, description, source, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''',
                (user_id, title, salary, match, description, source, timestamp)
            )
            
    return jsonify({'success': True, 'message': 'Careers saved successfully.'}), 201


@app.route('/api/saved-careers/<int:user_id>', methods=['GET'])
def get_user_saved_careers(user_id: int):
    if not get_user_by_id(user_id):
        return json_error('User not found.', 404)
        
    with get_db() as connection:
        rows = connection.execute(
            '''
            SELECT title, salary, match, description, source, created_at
            FROM saved_careers
            WHERE user_id = ?
            ORDER BY id DESC
            ''',
            (user_id,)
        ).fetchall()
        
    saved_careers = [dict(row) for row in rows]
    return jsonify({'success': True, 'saved_careers': saved_careers})


@app.route('/api/saved-careers/delete', methods=['POST', 'DELETE'])
def delete_saved_career():
    data = get_request_data()
    user_id = resolve_user_id(data)
    if not user_id:
        user_id_val = request.args.get('user_id')
        if user_id_val:
            try:
                user_id = int(user_id_val)
            except ValueError:
                pass
                
    if not user_id or not get_user_by_id(user_id):
        return json_error('Valid user_id or email is required.', 400)
        
    title = data.get('title') or request.args.get('title')
    if not title:
        return json_error('Career title is required.', 400)
        
    with get_db() as connection:
        connection.execute(
            'DELETE FROM saved_careers WHERE user_id = ? AND title = ?',
            (user_id, title)
        )
    return jsonify({'success': True, 'message': 'Saved career deleted successfully.'})


@app.errorhandler(404)
def not_found(_error):
    return json_error('Route not found.', 404)


@app.route('/api/chat', methods=['POST'])
def chat():
    data = get_request_data()
    user_message = (data.get('message') or '').strip().lower()
    
    if not user_message:
        return json_error('Message is required.', 400)
    
    # Resolve user ID and fetch their latest assessment if present
    user_id = resolve_user_id(data)
    assessment_summary = None
    if user_id:
        try:
            with get_db() as connection:
                row = connection.execute(
                    '''
                    SELECT top_category, recommendations_json
                    FROM career_assessments
                    WHERE user_id = ?
                    ORDER BY id DESC
                    LIMIT 1
                    ''',
                    (user_id,)
                ).fetchone()
                if row:
                    top_cat = row['top_category']
                    recs = json_loads(row['recommendations_json'])
                    careers_list = [c['career'] if isinstance(c, dict) else str(c) for c in recs]
                    assessment_summary = {
                        'top_category': top_cat,
                        'careers': careers_list[:5]
                    }
        except Exception as e:
            app.logger.error(f"Error querying career assessment in chat: {e}")

    # Simple word boundary matching by splitting cleaned text
    cleaned_message = ''.join(c if c.isalnum() or c.isspace() else ' ' for c in user_message)
    words = cleaned_message.split()
    
    # Simple keyword-based responses for career guidance
    reply = "I can help with career guidance! Try asking about specific careers or domains."
    
    # 1. Greetings
    if any(w in ['hello', 'hi', 'hii', 'hey', 'yo', 'greetings'] for w in words):
        reply = "Hello! I am your Smart Career Path AI Assistant. How can I help you today? You can ask me about different career options, roadmaps, required skills, or how to prepare for specific fields."
        
    # 2. Self-introduction
    elif any(kw in user_message for kw in ['tell your self', 'tell me about yourself', 'who are you', 'introduce yourself', 'introduce your self', 'what are you', 'your capabilities']):
        reply = "I am the Smart Career Path AI Assistant! My purpose is to help you navigate your educational and career journeys. I can:\n1. Explain different career domains (IT, Business, Healthcare, Arts, Law, Govt, etc.)\n2. Recommend skills and roadmaps for specific roles\n3. Give advice on career preparation, resumes, and study plans\n4. Analyze your career assessment results.\n\nWhat would you like to explore?"
        
    # 3. Creative/Arts/Dance/Music
    elif any(art in user_message for art in ['dance', 'music', 'acting', 'singing', 'creative', 'art', 'paint', 'sculpt']):
        reply = "To learn dance or pursue a creative/artistic career:\n1. Build your foundational skills by joining local classes/studios or practicing with structured online tutorials.\n2. Practice consistently and record your sessions to review and improve.\n3. Work on physical fitness, rhythm, and flexibility.\n4. Create a digital portfolio/showreel of your performances on platforms like YouTube or Instagram.\n\nYou can also check out our 'Arts & Creativity', 'Music Careers', and 'Acting & Entertainment' domains in the Explore Domains section of the app!"
        
    # 4. AI/ML/Data/Software/Coding
    elif any(tech in user_message for tech in ['ai', 'ml', 'al/ml', 'artificial intelligence', 'machine learning', 'deep learning', 'software', 'developer', 'programmer', 'coding', 'data scientist', 'data science']):
        reply = "For AI/ML, Data Science, and Software roles:\n1. Master a language like Python or JavaScript.\n2. Learn essential math and statistics (especially linear algebra and probability for ML).\n3. Study Data Structures and Algorithms (DSA) and database management (SQL).\n4. Learn ML frameworks like TensorFlow or PyTorch.\n5. Build hands-on projects and host them on GitHub.\n\nCheck out the 'IT & Technology' domain in the app for specific roadmaps, required skills, and salary expectations!"
        
    # 5. Career Assessment
    elif any(kw in user_message for kw in ['my assessment', 'my result', 'my score', 'recommend based on my', 'what did i get', 'suitable for me', 'my career', 'my recommended', 'my path', 'my domain', 'suitable career', 'recommend career']):
        if assessment_summary:
            careers_str = ", ".join(assessment_summary['careers'])
            reply = f"Based on your latest career assessment, your primary career path is **{assessment_summary['top_category']}**.\n\nYour top recommended career matches are: **{careers_str}**.\n\nYou can click on these careers in your profile or explore domains to see detailed roadmaps, salary ranges, and skills!"
        else:
            reply = "You haven't completed a career assessment yet! Please go to the Dashboard and click 'Start Assessment' so I can give you personalized recommendations."
            
    elif 'assessment' in user_message or 'test' in user_message or 'suitable' in user_message:
        reply = "Take our career assessment to get personalized recommendations! It analyzes your interests, calculates your strengths, and suggests suitable career paths based on your profile."
        
    # 6. Business / commerce / entrepreneurship / BBA
    elif any(biz in user_message for biz in ['bba', 'mba', 'b.com', 'bcom', 'business', 'entrepreneur', 'marketing', 'commerce']):
        if any(deg in user_message for deg in ['bba', 'mba', 'b.com', 'bcom']):
            reply = "BBA (Bachelor of Business Administration) is an undergraduate degree focusing on business management, administration, finance, marketing, and entrepreneurship. It equips you with leadership and organizational skills. Many graduates pursue corporate careers or an MBA (Master of Business Administration). Check out our 'Business & Commerce' and 'Entrepreneurship' domains in the app!"
        else:
            reply = "Business and Entrepreneurship careers include startup management, finance, marketing, and consulting. Focus on building communication, leadership, and problem-solving skills. Doing internships or starting small projects is highly valuable!"
        
    # 7. Healthcare
    elif 'healthcare' in user_message or 'medical' in user_message or 'doctor' in user_message or 'nurse' in user_message:
        reply = "Healthcare careers like doctor, nurse, pharmacist, or lab technician require strong science backgrounds, clinical training, and empathy. Check out the 'Healthcare' domain page for details on qualifications and specializations!"
        
    # 8. Law / Lawyer Workflow
    elif 'law' in user_message or 'legal' in user_message or 'lawyer' in user_message:
        if 'workflow' in user_message or 'responsibilities' in user_message or 'do' in user_message:
            reply = "The typical workflow of a lawyer involves:\n1. Client Consultation: Meeting clients to understand their legal objectives.\n2. Case Research: Reviewing legal precedents, statutes, and evidence.\n3. Drafting: Writing contracts, briefs, pleadings, and opinions.\n4. Negotiation: Settling disputes out of court through agreements.\n5. Representation: Presenting arguments and defending clients in court trials.\n\nCheck out the 'Law Careers' domain page in the app for details on skills and salaries!"
        else:
            reply = "Law careers require strong communication, research, and logical thinking. You can explore roles like corporate lawyer, judge, legal advisor, or prosecutor. Check out the 'Law Careers' domain in the app!"
        
    # 9. Government
    elif 'government' in user_message or 'govt' in user_message or 'ias' in user_message or 'ips' in user_message:
        reply = "Government and public sector jobs (like IAS, IPS, Railway Officer, or Bank PO) offer stable careers with huge public impact. Entry typically requires preparing for competitive exams like UPSC, SSC CGL, or railway boards."
        
    # 10. Agriculture
    elif 'agriculture' in user_message or 'agri' in user_message or 'farmer' in user_message:
        reply = "Agricultural careers include agricultural science, agri-business, food technology, and organic farming. It combines biology, technology, and management to improve food systems."
        
    # 11. Gaming
    elif 'gaming' in user_message or 'esports' in user_message:
        reply = "Gaming careers include game development, esports players, streaming, and gaming content creation. Learn programming for dev roles, or focus on content quality and community building for streaming!"
        
    # 12. Thanks
    elif 'thank' in user_message or 'thanks' in user_message:
        reply = "You're very welcome! Let me know if you have any other questions about careers, roadmaps, or domains. Good luck!"
        
    return jsonify({'success': True, 'reply': reply})


@app.errorhandler(500)
def server_error(_error):
    return json_error('Internal server error.', 500)


if __name__ == '__main__':
    ensure_database()
    app.run(host='0.0.0.0', port=5001, debug=False)
