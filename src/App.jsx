import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PersonalDetails from "./pages/PersonalDetails";
import EducationDetails from "./pages/EducationDetails";
import ExploreDomains from "./pages/ExploreDomains";
import NonTraditionalDomains from "./pages/NonTraditionalDomains";
import TraditionalDomains from "./pages/TraditionalDomains";
import Dashboard from "./pages/Dashboard";
import SavedCareers from "./pages/SavedCareers";
import Profile from "./pages/Profile";
import ProfileInfo from "./pages/ProfileInfo";
import ForgotPassword from "./pages/ForgotPassword";
import CareerRecommendation from "./pages/CareerRecommendation";
import Assessment from "./pages/Assessment";
import Healthcare from "./pages/Healthcare";
import IT from "./pages/IT";
import Business from "./pages/Business";
import Govt from "./pages/Govt";
import Aviation from "./pages/Aviation";
import Agriculture from "./pages/Agriculture";
import Law from "./pages/Law";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/personal-details" element={<PersonalDetails />} />
        <Route path="/education-details" element={<EducationDetails />} />
        <Route path="/explore" element={<ExploreDomains />} />
        <Route path="/traditional-domains" element={<TraditionalDomains />} />
        <Route path="/non-traditional-domains" element={<NonTraditionalDomains />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/saved-careers" element={<SavedCareers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-info" element={<ProfileInfo />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/recommendation" element={<CareerRecommendation />} />
        <Route path="/domain/healthcare" element={<Healthcare />} />
        <Route path="/domain/it" element={<IT />} />
        <Route path="/domain/business" element={<Business />} />
        <Route path="/domain/govt" element={<Govt />} />
        <Route path="/domain/aviation" element={<Aviation />} />
        <Route path="/domain/agriculture" element={<Agriculture />} />
        <Route path="/domain/law" element={<Law />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;