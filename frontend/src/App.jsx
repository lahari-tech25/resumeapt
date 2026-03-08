import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateResume from "./pages/dashboard/CreateResume";
import RegenerateResume from "./pages/dashboard/RegenerateResume";
import ProtectedRoute from "./components/ProtectedRoute";
import ResumeView from "./pages/dashboard/ResumeView";
import ATS from "./pages/dashboard/ATS";
import ATSHistory from "./pages/dashboard/ATSHistory";
import EditResume from "./pages/EditResume";
import Subscription from "./pages/Subscription";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-resume"
            element={
              <ProtectedRoute>
                <CreateResume />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard/create/:id?" element={
            <ProtectedRoute>
              <CreateResume />
            </ProtectedRoute>} />

          <Route
  path="/dashboard/regenerate"
  element={
    <ProtectedRoute>
      <RegenerateResume />
    </ProtectedRoute>
  }
  
/>
          <Route
  path="/dashboard/resume-view"
  element={
    <ProtectedRoute>
      <ResumeView />
    </ProtectedRoute>
  }
  
/>
<Route
  path="/dashboard/ats"
  element={
    <ProtectedRoute>
      <ATS />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/ats-history"
  element={
    <ProtectedRoute>
      <ATSHistory />
    </ProtectedRoute>
  }
/>


<Route path="/resume/edit/:id" element={
  <ProtectedRoute>
    <EditResume />
  </ProtectedRoute>} />

  <Route path="/resume/view/:id"
   element={<ProtectedRoute>
    <ResumeView />
    </ProtectedRoute>} />

    <Route path="/subscription"
     element={<ProtectedRoute>
      <Subscription />
      </ProtectedRoute>} />


        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
