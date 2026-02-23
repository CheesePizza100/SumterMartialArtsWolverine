import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './core/context/AuthContext';
import Header from './shared/components/Header/Header';
import ProtectedRoute from './core/components/ProtectedRoute';
import './App.css';

// Lazy load route components
const Home = lazy(() => import('./features/home/Home'));
const About = lazy(() => import('./features/about/About'));
const ProgramsList = lazy(() => import('./features/programs/pages/ProgramsList/ProgramsList'));
const ProgramDetails = lazy(() => import('./features/programs/pages/ProgramDetails/ProgramDetails'));
const StudentDashboard = lazy(() => import('./features/students/pages/StudentDashboard/StudentDashboard'));
const StudentProfile = lazy(() => import('./features/students/pages/StudentProfile/StudentProfile'));
const InstructorDetails = lazy(() => import('./features/instructors/pages/InstructorDetails/InstructorDetails'));
const InstructorDashboard = lazy(() => import('./features/instructors/pages/InstructorDashboard/InstructorDashboard'));
const InstructorProfile = lazy(() => import('./features/instructors/pages/InstructorProfile/InstructorProfile'));
const InstructorStudentDetail = lazy(() => import('./features/instructors/pages/InstructorStudentDetail/InstructorStudentDetail'));
const Login = lazy(() => import('./features/login/Login'));
const ChangePassword = lazy(() => import('./features/auth/ChangePassword'));
const AdminStudents = lazy(() => import('./features/admin/pages/AdminStudents/AdminStudents'));
const AdminPrivateLessons = lazy(() => import('./features/admin/pages/AdminPrivateLessons/AdminPrivateLessons'));
const AdminInstructors = lazy(() => import('./features/admin/pages/AdminInstructors/AdminInstructors'));
const EmailTemplates = lazy(() => import('./features/admin/pages/EmailTemplates/EmailTemplates'));
const EmailTemplateEdit = lazy(() => import('./features/admin/pages/EmailTemplateEdit/EmailTemplateEdit'));
const AnalyticsDashboard = lazy(() => import('./features/admin/pages/AnalyticsDashboard/AnalyticsDashboard'));

function App() {
    return (
        <Router>
            <AuthProvider>
                <Header />
                <main>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            {/* Redirect root to home */}
                            <Route path="/" element={<Navigate to="/home" replace />} />

                            {/* Public routes */}
                            <Route path="/home" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/programs" element={<ProgramsList />} />
                            <Route path="/programs/:id" element={<ProgramDetails />} />
                            <Route path="/login" element={<Login />} />

                            {/* Protected routes - requires auth + password changed */}
                            <Route
                                path="/student"
                                element={
                                    <ProtectedRoute requireAuth requirePasswordChanged>
                                        <Navigate to="/student/dashboard" replace />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/student/dashboard"
                                element={
                                    <ProtectedRoute requireAuth requirePasswordChanged>
                                        <StudentDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/student/profile"
                                element={
                                    <ProtectedRoute requireAuth requirePasswordChanged>
                                        <StudentProfile />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Public instructor route */}
                            <Route path="/instructors/:id" element={<InstructorDetails />} />

                            {/* Protected instructor routes */}
                            <Route
                                path="/instructors/dashboard"
                                element={
                                    <ProtectedRoute requireAuth requirePasswordChanged>
                                        <InstructorDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/instructors/profile"
                                element={
                                    <ProtectedRoute requireAuth requirePasswordChanged>
                                        <InstructorProfile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/instructors/students/:id"
                                element={
                                    <ProtectedRoute requireAuth requirePasswordChanged>
                                        <InstructorStudentDetail />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Protected routes - requires auth only */}
                            <Route
                                path="/change-password"
                                element={
                                    <ProtectedRoute requireAuth>
                                        <ChangePassword />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Admin routes - requires auth + admin + password changed */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute requireAuth requireAdmin requirePasswordChanged>
                                        <Navigate to="/admin/students" replace />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/students"
                                element={
                                    <ProtectedRoute requireAuth requireAdmin requirePasswordChanged>
                                        <AdminStudents />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/private-lessons"
                                element={
                                    <ProtectedRoute requireAuth requireAdmin requirePasswordChanged>
                                        <AdminPrivateLessons />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/instructors"
                                element={
                                    <ProtectedRoute requireAuth requireAdmin requirePasswordChanged>
                                        <AdminInstructors />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/email-templates"
                                element={
                                    <ProtectedRoute requireAuth requireAdmin requirePasswordChanged>
                                        <EmailTemplates />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/email-templates/:id"
                                element={
                                    <ProtectedRoute requireAuth requireAdmin requirePasswordChanged>
                                        <EmailTemplateEdit />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/analytics"
                                element={
                                    <ProtectedRoute requireAuth requireAdmin requirePasswordChanged>
                                        <AnalyticsDashboard />
                                    </ProtectedRoute>
                                }
                            />                    </Routes>
                    </Suspense>
                </main>
            </AuthProvider>
        </Router>
    );
}

export default App;