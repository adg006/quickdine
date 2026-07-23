import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppContext } from "../context/AppContext.tsx";

const Navbar = () => {
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  const { user, logout, setAuthModalOpen } = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDashboardClick = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md h-16 shadow-sm border-b border-outline-variant/10" : "bg-transparent h-20 border-b border-transparent"}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full px-6 md:px-10">
        {/* LOGO */}
        <div className="flex items-center gap-12">
          <Link to="/">
            <img
              src="/logo.svg"
              alt="Logo"
              className={`h-8.5 ${scrolled || (location.pathname === "/" && "invert")}`}
            />
          </Link>
        </div>

        {/* DESKTOP NAVIGATION LINKS */}
        <div className="hidden md:flex gap-8 items-center">
          <Link
            to="/"
            className={`text-sm transition-colors pb-1 border-b-2 cursor-pointer ${location.pathname === "/" ? (scrolled ? "text-secondary border-secondary" : "text-white border-white") : "text-black/55 hover:text-primary border-transparent"}`}
          >
            Discover
          </Link>

          <Link
            to="/search"
            className={`text-sm transition-colors pb-1 border-b-2 border-transparent cursor-pointer ${location.pathname.startsWith("/search") ? "text-secondary border-secondary" : scrolled || location.pathname !== "/" ? "text-black/55 hover:text-primary" : "text-white/80 hover:text-white"}}`}
          >
            Restaurants
          </Link>

          <button
            onClick={handleDashboardClick}
            className={`text-sm transition-colors pb-1 border-b-2 border-transparent cursor-pointer text-left ${location.pathname === "/dashboard" ? "text-secondary border-secondary" : scrolled || location.pathname !== "/" ? "text-black/55 hover:text-primary" : "text-white/80 hover:text-white"}`}
          >
            My Bookings
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
