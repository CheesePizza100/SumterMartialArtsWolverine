import { useState, useEffect, useRef } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext';
import './Header.css';

interface NavLink {
    path: string;
    label: string;
    exact?: boolean;
}

function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
    const { user, isAuthenticated, isAdmin, isStudent, isInstructor, logout } = useAuth();
    const location = useLocation();
    const adminDropdownRef = useRef<HTMLDivElement>(null);

    // Navigation links
    const navLinks: NavLink[] = [
        { path: '/home', label: 'Home', exact: true },
        { path: '/programs', label: 'Programs', exact: false },
        { path: '/about', label: 'About Us', exact: false }
    ];

    // Auth links (shown when not logged in)
    const authLinks: NavLink[] = [
        { path: '/login', label: 'Login' },
    ];

    // Admin dropdown links
    const adminLinks: NavLink[] = [
        { path: '/admin/private-lessons', label: 'Private Lessons' },
        { path: '/admin/students', label: 'Students' },
        { path: '/admin/instructors', label: 'Instructors' },
        { path: '/admin/analytics', label: 'Analytics' },
        { path: '/admin/email-templates', label: 'Email' }
    ];

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
                setAdminDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const toggleMobile = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const closeAdminDropdown = () => {
        setAdminDropdownOpen(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            // Logout successful - auth context handles redirect
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <>
            <header className="header">
                <div className="left">
                    <div className="logo-box">LOGO</div>
                    <div className="academy-name">Sumter Martial Arts</div>
                </div>

                {/* Desktop Navigation */}
                <nav className="nav desktop-nav">
                    {/* Main Navigation Links */}
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => (isActive ? 'active' : '')}
                            end={link.exact}
                        >
                            {link.label}
                        </NavLink>
                    ))}

                    {/* Auth Links (when not logged in) */}
                    {!isAuthenticated && authLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            {link.label}
                        </NavLink>
                    ))}

                    {/* Admin Dropdown (when admin) */}
                    {user && isAdmin && (
                        <div
                            className="admin-dropdown-container"
                            ref={adminDropdownRef}
                            onMouseEnter={() => setAdminDropdownOpen(true)}
                            onMouseLeave={() => setAdminDropdownOpen(false)}
                        >
                            <NavLink
                                to="/admin"
                                className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
                            >
                                Admin
                            </NavLink>
                            <div className={`admin-dropdown ${adminDropdownOpen ? 'open' : ''}`}>
                                {adminLinks.map((link) => (
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        className={({ isActive }) => (isActive ? 'active' : '')}
                                        onClick={closeAdminDropdown}
                                    >
                                        {link.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Student Links */}
                    {user && isStudent && (
                        <>
                            <NavLink to="/student/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                                Dashboard
                            </NavLink>
                            <NavLink to="/student/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                                My Profile
                            </NavLink>
                        </>
                    )}

                    {/* Instructor Links */}
                    {user && isInstructor && (
                        <>
                            <NavLink to="/instructor/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                                My Students
                            </NavLink>
                            <NavLink to="/instructor/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                                My Profile
                            </NavLink>
                        </>
                    )}

                    {/* User Actions (when logged in) */}
                    {isAuthenticated && (
                        <div className="user-actions">
                            <span className="username">{user?.username}</span>
                            <button className="btn-logout" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    )}
                </nav>

                {/* Hamburger Menu Button */}
                <button
                    className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
                    onClick={toggleMobile}
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                {/* Main Navigation Links */}
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) => (isActive ? 'active' : '')}
                        end={link.exact}
                    >
                        {link.label}
                    </NavLink>
                ))}

                {/* Auth Links (when not logged in) */}
                {!isAuthenticated && authLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={closeMobileMenu}
                    >
                        {link.label}
                    </NavLink>
                ))}

                {/* Admin Links (when admin) - Expanded in mobile */}
                {user && isAdmin && (
                    <>
                        <div className="mobile-section-label">Admin</div>
                        {adminLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={closeMobileMenu}
                                className={({ isActive }) => `mobile-indent ${isActive ? 'active' : ''}`}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </>
                )}

                {/* Student Links (when student) - Expanded in mobile */}
                {user && isStudent && (
                    <>
                        <div className="mobile-section-label">Student Portal</div>
                        <NavLink
                            to="/student/dashboard"
                            onClick={closeMobileMenu}
                            className={({ isActive }) => `mobile-indent ${isActive ? 'active' : ''}`}
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/student/profile"
                            onClick={closeMobileMenu}
                            className={({ isActive }) => `mobile-indent ${isActive ? 'active' : ''}`}
                        >
                            My Profile
                        </NavLink>
                    </>
                )}

                {/* Instructor Links - Expanded in mobile */}
                {user && isInstructor && (
                    <>
                        <div className="mobile-section-label">Instructor Portal</div>
                        <NavLink
                            to="/instructor/dashboard"
                            onClick={closeMobileMenu}
                            className={({ isActive }) => `mobile-indent ${isActive ? 'active' : ''}`}
                        >
                            My Students
                        </NavLink>
                        <NavLink
                            to="/instructor/profile"
                            onClick={closeMobileMenu}
                            className={({ isActive }) => `mobile-indent ${isActive ? 'active' : ''}`}
                        >
                            My Profile
                        </NavLink>
                    </>
                )}

                {/* User Actions (when logged in) */}
                {isAuthenticated && (
                    <div className="mobile-user">
                        <div>{user?.username}</div>
                        <button className="btn-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default Header;