import { Bell, BookOpen, GraduationCap, LogOut, Search, Sparkles, TvMinimalPlay, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "@/context/auth-context";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { FadeIn, SlideIn, ScaleIn } from "../ui/animations";
import { GradientText } from "../ui/typography";
import { 
  slideInDown, 
  slideInUp, 
  fadeIn, 
  popIn, 
  getReducedMotionVariants 
} from "@/lib/animation-utils";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetCredentials, auth } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const [showSearchOnMobile, setShowSearchOnMobile] = useState(false);
  
  // Enhanced scroll handling with Framer Motion
  const { scrollY } = useScroll();
  const headerBackgroundOpacity = useTransform(
    scrollY, 
    [0, 50], 
    [0, 1]
  );
  const headerBlur = useTransform(
    scrollY,
    [0, 50],
    [0, 8]
  );
  const headerShadowOpacity = useTransform(
    scrollY,
    [0, 50],
    [0, 0.1]
  );
  
  // Track scroll position to change header appearance
  useEffect(() => {
    const unsubscribe = scrollY.onChange(value => {
      setIsScrolled(value > 10);
    });
    
    return () => unsubscribe();
  }, [scrollY]);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowSearchOnMobile(false);
  }, [location.pathname]);
  
  // Focus search input when search bar is shown on mobile
  useEffect(() => {
    if (showSearchOnMobile && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchOnMobile]);
  
  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }
  
  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchOnMobile(false);
    }
  }

  return (
    <>
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Gradient background that shows when not scrolled */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600"
          style={{ opacity: useTransform(headerBackgroundOpacity, value => 1 - value) }}
        />
        
        {/* White background with blur that appears on scroll */}
        <motion.div 
          className="absolute inset-0 bg-white"
          style={{ 
            opacity: headerBackgroundOpacity,
            backdropFilter: `blur(${headerBlur}px)`,
            WebkitBackdropFilter: `blur(${headerBlur}px)`,
            boxShadow: useTransform(
              headerShadowOpacity, 
              value => `0 4px 20px rgba(0, 0, 0, ${value})`
            )
          }}
        />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <Link to="/home" className="flex items-center group">
                <motion.div 
                  className={`rounded-xl overflow-hidden p-1.5 mr-2 ${
                    isScrolled 
                      ? "bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600" 
                      : "bg-white/20"
                  } transition-all duration-300`}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(79, 70, 229, 0.5)" 
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <GraduationCap className="h-7 w-7 text-white" />
                </motion.div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <motion.span 
                      className={`font-bold text-xl tracking-tight ${
                        isScrolled ? "text-slate-800" : "text-white"
                      } transition-all duration-300`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="font-black relative">
                        Elite
                        <motion.span 
                          className="absolute -top-1 -right-1 text-yellow-400" 
                          initial={{ opacity: 0, scale: 0, rotate: -30 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={{ delay: 0.5, type: "spring" }}
                        >
                          <Sparkles className="h-3 w-3" />
                        </motion.span>
                      </span>
                      <GradientText 
                        from="from-indigo-400" 
                        to="to-purple-600" 
                        className="ml-0.5"
                      >
                        Learn
                      </GradientText>
                    </motion.span>
                  </div>
                  <motion.span 
                    className={`text-xs tracking-widest uppercase ${
                      isScrolled ? "text-indigo-600/80" : "text-white/80"
                    }`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    Premium Learning
                  </motion.span>
                </div>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-1">
                <NavLink 
                  to="/home" 
                  isActive={location.pathname === "/home" || location.pathname === "/"} 
                  isScrolled={isScrolled}
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/courses" 
                  isActive={location.pathname === "/courses"} 
                  isScrolled={isScrolled}
                >
                  Courses
                </NavLink>
                <NavLink 
                  to="/student-courses" 
                  isActive={location.pathname === "/student-courses"} 
                  isScrolled={isScrolled}
                >
                  My Learning
                </NavLink>
              </nav>
            </div>
            
            {/* Search and Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Bar - Desktop */}
              <AnimatePresence>
                {!showSearchOnMobile && (
                  <motion.form 
                    onSubmit={handleSearch} 
                    className="hidden md:flex relative"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={getReducedMotionVariants(slideInDown)}
                  >
                    <Input 
                      type="search"
                      ref={searchInputRef}
                      placeholder="Search courses..."
                      className={`w-[250px] pl-9 pr-4 py-2 rounded-full text-sm transition-all duration-300 ${
                        isScrolled 
                          ? "bg-gray-100/80 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" 
                          : "bg-white/10 border-white/20 placeholder-white/70 text-white focus:bg-white/20 focus:ring-2 focus:ring-white/30"
                      }`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                      isScrolled ? "text-gray-400" : "text-white/70"
                    }`} />
                  </motion.form>
                )}
              </AnimatePresence>
              
              {/* Search Icon - Mobile */}
              <AnimatePresence>
                {!showSearchOnMobile && (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={getReducedMotionVariants(popIn)}
                  >
                    <motion.button 
                      className={`rounded-full md:hidden p-2 ${
                        isScrolled ? "text-slate-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                      }`}
                      onClick={() => setShowSearchOnMobile(true)}
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Search className="h-5 w-5" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Mobile Search Input */}
              <AnimatePresence>
                {showSearchOnMobile && (
                  <motion.form 
                    onSubmit={handleSearch}
                    className="absolute inset-x-0 top-0 bg-white z-50 p-2 flex items-center md:hidden"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={getReducedMotionVariants(slideInDown)}
                  >
                    <Input 
                      type="search"
                      ref={searchInputRef}
                      placeholder="Search courses..."
                      className="flex-1 pl-9 py-2 rounded-full text-sm border-gray-200 focus:border-indigo-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <motion.button 
                      type="button"
                      className="ml-1 rounded-full p-2 text-slate-700"
                      onClick={() => setShowSearchOnMobile(false)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div 
                        className="h-5 w-5 flex items-center justify-center"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 90 }}
                      >
                        ✕
                      </motion.div>
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
              
              {/* Notifications */}
              <AnimatePresence>
                {!showSearchOnMobile && (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={getReducedMotionVariants(popIn)}
                    custom={1}
                  >
                    <motion.button 
                      className={`rounded-full relative p-2 ${
                        isScrolled 
                          ? "text-slate-700 hover:bg-gray-100 hover:text-indigo-600" 
                          : "text-white hover:bg-white/10"
                      } transition-all duration-300`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Bell className="h-5 w-5" />
                      <motion.span 
                        className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        <motion.span 
                          className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-75"
                          initial={{ scale: 0.1, opacity: 0 }}
                          animate={{ scale: 2, opacity: 0 }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1.5,
                            repeatDelay: 1 
                          }}
                        />
                      </motion.span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* User Menu */}
              <AnimatePresence>
                {!showSearchOnMobile && (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={getReducedMotionVariants(popIn)}
                    custom={2}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <motion.button 
                          className={`flex items-center gap-2 rounded-full pl-2 pr-3 ${
                            isScrolled 
                              ? "hover:bg-gray-100 text-slate-800" 
                              : "hover:bg-white/10 text-white"
                          } transition-all duration-300`}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <motion.div 
                            className="relative"
                            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <Avatar className="h-8 w-8 border-2 border-white shadow-md">
                              <AvatarImage src={auth?.user?.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-600 text-white">
                                {auth?.user?.userName?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                          <div className="flex flex-col items-start text-xs">
                            <span className="font-medium">
                              {auth?.user?.userName?.split(" ")[0] || "User"}
                            </span>
                            <span className={`text-xs ${isScrolled ? "text-slate-500" : "text-white/70"}`}>
                              Student
                            </span>
                          </div>
                        </motion.button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 mt-1 p-2 rounded-xl shadow-xl border border-gray-100">
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">{auth?.user?.userName || "User"}</p>
                            <p className="text-xs text-muted-foreground">{auth?.user?.userEmail || "user@example.com"}</p>
                            <Badge variant="outline" className="w-fit mt-1 text-xs px-2 py-0 bg-indigo-50 text-indigo-700 border-indigo-200">
                              Premium Student
                            </Badge>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/student-courses")} className="cursor-pointer group">
                          <BookOpen className="mr-2 h-4 w-4 group-hover:text-indigo-600 transition-colors" />
                          <span className="group-hover:text-indigo-600 transition-colors">My Courses</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-rose-500 hover:text-rose-600 hover:bg-rose-50 group">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sign Out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Mobile Menu Button */}
              <AnimatePresence>
                {!showSearchOnMobile && (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={getReducedMotionVariants(popIn)}
                    custom={3}
                  >
                    <motion.button 
                      className={`rounded-full md:hidden p-2 ${
                        isScrolled ? "text-slate-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                      }`}
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Menu"
                      aria-expanded={isMobileMenuOpen}
                    >
                      <div className="w-5 h-5 flex flex-col justify-center items-center gap-1.5">
                        <motion.span 
                          className={`block h-0.5 w-5 ${isScrolled ? "bg-slate-700" : "bg-white"}`}
                          animate={{ 
                            rotate: isMobileMenuOpen ? 45 : 0, 
                            y: isMobileMenuOpen ? 3 : 0,
                            width: isMobileMenuOpen ? "20px" : "20px" 
                          }}
                          transition={{ duration: 0.2 }}
                        />
                        <motion.span 
                          className={`block h-0.5 w-3.5 ${isScrolled ? "bg-slate-700" : "bg-white"}`}
                          animate={{ 
                            opacity: isMobileMenuOpen ? 0 : 1,
                            x: isMobileMenuOpen ? 10 : 0
                          }}
                          transition={{ duration: 0.2 }}
                        />
                        <motion.span 
                          className={`block h-0.5 w-5 ${isScrolled ? "bg-slate-700" : "bg-white"}`}
                          animate={{ 
                            rotate: isMobileMenuOpen ? -45 : 0, 
                            y: isMobileMenuOpen ? -3 : 0,
                            width: isMobileMenuOpen ? "20px" : "20px"
                          }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 md:hidden"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={getReducedMotionVariants(fadeIn)}
          >
            <motion.div 
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav 
              className="fixed top-[64px] right-0 bottom-0 w-72 bg-white shadow-xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200,
                mass: 0.8
              }}
            >
              <motion.div 
                className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-indigo-600 to-purple-600"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
              
              <ScrollArea className="flex-grow">
                <div className="p-4 flex flex-col gap-2">
                  <motion.div 
                    className="flex items-center gap-3 p-3 mb-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                        <AvatarImage src={auth?.user?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-600 text-white">
                          {auth?.user?.userName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {auth?.user?.userName?.split(" ")[0] || "User"}
                      </span>
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Badge variant="outline" className="w-fit mt-0.5 text-xs px-2 py-0 bg-indigo-50 text-indigo-700 border-indigo-200">
                          Premium Student
                        </Badge>
                      </motion.div>
                    </div>
                  </motion.div>
                
                  <motion.div 
                    className="flex flex-col gap-1"
                    variants={getReducedMotionVariants(staggerContainer)}
                  >
                    <MobileNavLink to="/home" isActive={location.pathname === "/home" || location.pathname === "/"} custom={0}>
                      Home
                    </MobileNavLink>
                    <MobileNavLink to="/courses" isActive={location.pathname === "/courses"} custom={1}>
                      Courses
                    </MobileNavLink>
                    <MobileNavLink to="/student-courses" isActive={location.pathname === "/student-courses"} custom={2}>
                      My Learning
                    </MobileNavLink>
                  </motion.div>
                  
                  <motion.div 
                    className="mt-auto pt-4 border-t border-gray-100 mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.button 
                      className="w-full flex items-center justify-start px-3 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      onClick={handleLogout}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </motion.button>
                  </motion.div>
                </div>
              </ScrollArea>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Navigation Link Component for desktop
function NavLink({ to, children, isActive, isScrolled }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        to={to}
        className={`relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          isActive
            ? isScrolled
              ? "bg-indigo-50 text-indigo-700"
              : "bg-white/20 text-white"
            : isScrolled
              ? "text-slate-600 hover:bg-gray-100 hover:text-indigo-600"
              : "text-white/90 hover:bg-white/10"
        }`}
      >
        {children}
        {isActive && (
          <motion.div
            layoutId="activeNavIndicator"
            className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full ${
              isScrolled ? "bg-indigo-500" : "bg-white"
            }`}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({ to, children, isActive, custom = 0 }) {
  return (
    <motion.div
      variants={{
        initial: { x: 50, opacity: 0 },
        animate: { 
          x: 0, 
          opacity: 1,
          transition: { delay: 0.2 + (custom * 0.1) }
        }
      }}
    >
      <Link
        to={to}
        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden ${
          isActive
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-700 hover:bg-gray-50 hover:text-indigo-600"
        }`}
      >
        <motion.span 
          className="relative z-10"
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.97 }}
        >
          {children}
        </motion.span>
        
        {isActive && (
          <motion.div
            layoutId="activeMobileNavIndicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        
        <motion.div
          className="absolute inset-0 bg-indigo-50 origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
          style={{ originX: 0 }}
        />
      </Link>
    </motion.div>
  );
}

// Define a staggerContainer for animating groups of elements
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

export default StudentViewCommonHeader;
