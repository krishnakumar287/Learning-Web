import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { 
  ArrowUpDownIcon, 
  SearchIcon, 
  FilterIcon, 
  BookOpenIcon, 
  GraduationCapIcon, 
  ClockIcon, 
  StarIcon, 
  TagIcon,
  TrendingUpIcon,
  UsersIcon,
  BadgeCheckIcon,
  Brain as BrainIcon,
  Heart as HeartIcon,
  Flame as FireIcon,
  BarChart as BarChartIcon,
  Sparkles as SparklesIcon
} from "lucide-react";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { 
  FadeIn, 
  SlideIn, 
  ScaleIn, 
  StaggerContainer, 
  StaggerItem, 
  AnimatedText, 
  HoverElement, 
  ScrollReveal, 
  TiltElement, 
  PulseElement,
  BounceElement
} from "@/components/ui/animations";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  
  // Animation refs
  const heroRef = useRef(null);
  const filtersRef = useRef(null);
  const coursesRef = useRef(null);
  
  // Animation states
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const filtersInView = useInView(filtersRef, { once: true, amount: 0.2 });
  const coursesInView = useInView(coursesRef, { once: true, amount: 0.2 });
  
  // Scroll effects
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  
  // Animation variants
  const searchBarVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut",
        delay: 0.4
      } 
    }
  };
  
  const filterPillVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut",
        delay: 0.6 + (i * 0.05)
      } 
    })
  };
  
  const courseCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut",
        delay: 0.2 + (i * 0.1)
      }
    })
  };

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSeection =
      Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSeection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function toggleFilterSection(sectionId) {
    setActiveFilter(activeFilter === sectionId ? null : sectionId);
  }

  function handleClearFilters() {
    setFilters({});
    sessionStorage.removeItem("filters");
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    setLoadingState(true);
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
      search: searchQuery
    });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters !== null && sort !== null) {
        fetchAllStudentViewCourses(filters, sort);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [filters, sort, searchQuery]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
    setActiveFilter(Object.keys(filterOptions)[0]);
  }, []);

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Premium Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 pt-20 pb-28 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute inset-0 opacity-30"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ 
              duration: 8, 
              ease: "easeInOut", 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="coursesGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="35" fill="url(#coursesGrad)">
                <animate attributeName="r" from="35" to="45" dur="8s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.8" to="0.2" dur="8s" repeatCount="indefinite" />
              </circle>
            </svg>
          </motion.div>
          
          {/* Floating shapes */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{ 
              x: [0, 20, -10, 0],
              y: [0, -30, 10, 0],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{ 
              duration: 15, 
              ease: "easeInOut", 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          ></motion.div>
          <motion.div 
            className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{ 
              x: [0, -30, 20, 0],
              y: [0, 20, -20, 0],
              scale: [1, 0.9, 1.1, 1]
            }}
            transition={{ 
              duration: 18, 
              ease: "easeInOut", 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
          ></motion.div>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <motion.div 
              className="inline-block mb-4 px-4 py-1.5 bg-indigo-600/20 backdrop-blur-sm rounded-full text-indigo-300 text-sm font-medium border border-indigo-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SparklesIcon className="inline-block w-4 h-4 mr-2" />
              <span>Elite Learning Experience</span>
            </motion.div>
            
            <FadeIn delay={0.3}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                <span className="block">Discover Your Next</span>
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 text-transparent bg-clip-text text-gradient-animate">Elite Course</span>
              </h1>
            </FadeIn>
            
            <motion.p 
              className="text-xl text-indigo-200 mb-12 mx-auto max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Explore our catalog of premium courses crafted by industry experts to elevate your career to new heights
            </motion.p>
            
            {/* Enhanced Search Bar */}
            <motion.div 
              className="relative max-w-2xl mx-auto"
              variants={searchBarVariants}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-500 rounded-full opacity-75 blur-sm animate-gradient"></div>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search for courses, skills, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-16 py-7 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-indigo-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent h-14 shadow-lg"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-300">
                    <SearchIcon className="h-5 w-5" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white hover:bg-indigo-700/50 rounded-full h-10 px-4"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {/* Filter Pills */}
            <StaggerContainer className="flex flex-wrap justify-center gap-2 mt-8">
              {Object.keys(filterOptions).map((keyItem, i) => (
                <motion.div 
                  key={keyItem} 
                  className="relative"
                  custom={i}
                  variants={filterPillVariants}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white rounded-full px-4 shadow-md transition-all duration-300 hover:shadow-indigo-500/20 hover:shadow-lg"
                      >
                        {keyItem.charAt(0).toUpperCase() + keyItem.slice(1)}
                        {filters[keyItem] && filters[keyItem].length > 0 && (
                          <span className="ml-1.5 bg-indigo-500 text-white text-xs rounded-full h-5 min-w-5 inline-flex items-center justify-center px-1.5">
                            {filters[keyItem].length}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 p-2 rounded-xl border border-indigo-100 shadow-xl shadow-indigo-500/5 bg-white/95 backdrop-blur-md animate-in slide-in-from-top-3 fade-in-80">
                      <div className="space-y-1 p-1">
                        {filterOptions[keyItem].map((option) => (
                          <Label key={option.id} className="flex items-center p-2 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors duration-200">
                            <Checkbox
                              checked={
                                filters &&
                                Object.keys(filters).length > 0 &&
                                filters[keyItem] &&
                                filters[keyItem].indexOf(option.id) > -1
                              }
                              onCheckedChange={() =>
                                handleFilterOnChange(keyItem, option)
                              }
                              className="mr-2 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                            />
                            {option.label}
                          </Label>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
              
              <motion.div 
                custom={Object.keys(filterOptions).length}
                variants={filterPillVariants}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white rounded-full px-4 shadow-md transition-all duration-300 hover:shadow-indigo-500/20 hover:shadow-lg"
                    >
                      <span>Sort</span>
                      <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl border border-indigo-100 shadow-xl shadow-indigo-500/5 bg-white/95 backdrop-blur-md animate-in slide-in-from-top-3 fade-in-80">
                    <DropdownMenuRadioGroup
                      value={sort}
                      onValueChange={(value) => setSort(value)}
                    >
                      {sortOptions.map((sortItem) => (
                        <DropdownMenuRadioItem
                          value={sortItem.id}
                          key={sortItem.id}
                          className="cursor-pointer transition-colors duration-200 rounded-lg data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-700"
                        >
                          {sortItem.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
              
              {Object.keys(filters).length > 0 && (
                <motion.div 
                  custom={Object.keys(filterOptions).length + 1}
                  variants={filterPillVariants}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-rose-500/80 hover:text-white hover:border-transparent rounded-full px-4 shadow-md transition-all duration-300"
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </StaggerContainer>
          </motion.div>
        </div>
        
        {/* Premium Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none">
            <path 
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,69.3C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <ScrollReveal delay={0.3}>
            <aside ref={filtersRef} className="hidden md:block w-72 space-y-6 self-start sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl hover:border-indigo-100">
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
                  <h3 className="font-bold text-gray-900 flex items-center text-lg">
                    <FilterIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    <span>Refine Your Search</span>
                  </h3>
                </div>
                
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="p-4">
                    {Object.keys(filterOptions).map((keyItem) => (
                      <div key={keyItem} className="border-b border-gray-100 py-4">
                        <button
                          onClick={() => toggleFilterSection(keyItem)}
                          className="flex w-full justify-between items-center px-2 py-2 font-medium text-gray-700 hover:text-indigo-700 transition-colors duration-200 rounded-lg hover:bg-indigo-50"
                        >
                          <div className="flex items-center">
                            {keyItem === "category" && <TagIcon className="w-4 h-4 mr-2 text-indigo-500" />}
                            {keyItem === "level" && <BarChartIcon className="w-4 h-4 mr-2 text-indigo-500" />}
                            {keyItem === "duration" && <ClockIcon className="w-4 h-4 mr-2 text-indigo-500" />}
                            {keyItem === "price" && <TagIcon className="w-4 h-4 mr-2 text-indigo-500" />}
                            {keyItem === "rating" && <StarIcon className="w-4 h-4 mr-2 text-indigo-500" />}
                            {keyItem.charAt(0).toUpperCase() + keyItem.slice(1)}
                          </div>
                          <motion.div
                            animate={{ rotate: activeFilter === keyItem ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </motion.div>
                        </button>
                        
                        <motion.div
                          animate={{
                            height: activeFilter === keyItem ? "auto" : 0,
                            opacity: activeFilter === keyItem ? 1 : 0
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-1 mt-2 px-2 py-1">
                            {filterOptions[keyItem].map((option) => (
                              <Label key={option.id} className="flex items-center p-2 hover:bg-indigo-50 rounded-lg text-sm transition-colors duration-200 cursor-pointer">
                                <Checkbox
                                  checked={
                                    filters &&
                                    Object.keys(filters).length > 0 &&
                                    filters[keyItem] &&
                                    filters[keyItem].indexOf(option.id) > -1
                                  }
                                  onCheckedChange={() =>
                                    handleFilterOnChange(keyItem, option)
                                  }
                                  className="mr-2 border-indigo-200 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                />
                                <span className="text-gray-700">{option.label}</span>
                              </Label>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {Object.keys(filters).length > 0 && (
                  <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-white to-indigo-50">
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-all duration-300"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-2xl border border-indigo-100 shadow-md">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Learning Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <UsersIcon className="h-4 w-4 mr-2 text-indigo-500" />
                      <span>Active Learners</span>
                    </div>
                    <span className="font-semibold text-indigo-700">25K+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <BookOpenIcon className="h-4 w-4 mr-2 text-indigo-500" />
                      <span>Total Courses</span>
                    </div>
                    <span className="font-semibold text-indigo-700">500+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <BadgeCheckIcon className="h-4 w-4 mr-2 text-indigo-500" />
                      <span>Certifications</span>
                    </div>
                    <span className="font-semibold text-indigo-700">50+</span>
                  </div>
                </div>
              </div>
            </aside>
          </ScrollReveal>
          
          {/* Mobile Filter Button */}
          <div className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200 p-4 shadow-sm">
            <Button 
              onClick={() => setIsMobileFilterVisible(!isMobileFilterVisible)}
              variant="outline"
              className="w-full flex items-center justify-center bg-gradient-to-r from-indigo-50 to-white border-indigo-200 text-indigo-700 hover:bg-indigo-100"
            >
              <FilterIcon className="h-4 w-4 mr-2 text-indigo-600" />
              <span>Filters & Sorting</span>
              {Object.keys(filters).length > 0 && (
                <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full h-5 min-w-5 inline-flex items-center justify-center px-1.5">
                  {Object.keys(filters).length}
                </span>
              )}
            </Button>
            
            {/* Mobile Filter Panel */}
            <AnimatePresence>
              {isMobileFilterVisible && (
                <motion.div 
                  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="w-4/5 bg-white h-full overflow-y-auto"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  >
                    <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center">
                      <h3 className="font-bold text-gray-900 text-lg">Filters & Sorting</h3>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setIsMobileFilterVisible(false)}
                        className="rounded-full hover:bg-indigo-100 text-gray-500 hover:text-indigo-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </Button>
                    </div>
                    
                    <div className="p-5">
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <ArrowUpDownIcon className="h-4 w-4 mr-2 text-indigo-600" />
                          Sort By
                        </h4>
                        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                          {sortOptions.map((sortItem) => (
                            <Label key={sortItem.id} className="flex items-center p-2 hover:bg-indigo-50 rounded-lg transition-colors duration-200 cursor-pointer">
                              <input
                                type="radio"
                                name="sort"
                                value={sortItem.id}
                                checked={sort === sortItem.id}
                                onChange={() => setSort(sortItem.id)}
                                className="mr-2 text-indigo-600 focus:ring-indigo-600"
                              />
                              {sortItem.label}
                            </Label>
                          ))}
                        </div>
                      </div>
                      
                      {Object.keys(filterOptions).map((keyItem) => (
                        <div key={keyItem} className="border-b border-gray-100 py-4">
                          <button
                            onClick={() => toggleFilterSection(keyItem)}
                            className="flex w-full justify-between items-center font-medium text-gray-700 mb-2"
                          >
                            <div className="flex items-center">
                              {keyItem === "category" && <TagIcon className="w-4 h-4 mr-2 text-indigo-500" />}
                              {keyItem === "level" && <BarChartIcon className="w-4 h-4 mr-2 text-indigo-500" />}
                              {keyItem === "duration" && <ClockIcon className="w-4 h-4 mr-2 text-indigo-500" />}
                              {keyItem === "price" && <TagIcon className="w-4 h-4 mr-2 text-indigo-500" />}
                              {keyItem === "rating" && <StarIcon className="w-4 h-4 mr-2 text-indigo-500" />}
                              {keyItem.charAt(0).toUpperCase() + keyItem.slice(1)}
                            </div>
                            <motion.div
                              animate={{ rotate: activeFilter === keyItem ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </motion.div>
                          </button>
                          
                          <motion.div
                            animate={{
                              height: activeFilter === keyItem ? "auto" : 0,
                              opacity: activeFilter === keyItem ? 1 : 0
                            }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="grid gap-2 bg-gray-50 rounded-xl p-3">
                              {filterOptions[keyItem].map((option) => (
                                <Label key={option.id} className="flex items-center p-2 hover:bg-indigo-50 rounded-lg transition-colors duration-200 cursor-pointer">
                                  <Checkbox
                                    checked={
                                      filters &&
                                      Object.keys(filters).length > 0 &&
                                      filters[keyItem] &&
                                      filters[keyItem].indexOf(option.id) > -1
                                    }
                                    onCheckedChange={() =>
                                      handleFilterOnChange(keyItem, option)
                                    }
                                    className="mr-2 border-indigo-200 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                  />
                                  {option.label}
                                </Label>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      ))}
                      
                      <div className="mt-6 flex gap-3">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={handleClearFilters}
                          className="flex-1 border-indigo-200 text-indigo-600"
                        >
                          Clear All
                        </Button>
                        <Button
                          size="lg"
                          onClick={() => setIsMobileFilterVisible(false)}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Course List */}
          <main ref={coursesRef} className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <SlideIn direction="right" delay={0.3} className="mb-1">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></div>
                    <h4 className="text-sm font-medium text-indigo-600">Course Catalog</h4>
                  </div>
                </SlideIn>
                <FadeIn delay={0.4}>
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                    <span>Elite Courses</span>
                    {studentViewCoursesList.length > 0 && (
                      <span className="ml-3 text-base font-medium bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full">
                        {studentViewCoursesList.length} Results
                      </span>
                    )}
                  </h2>
                </FadeIn>
              </div>
              
              <FadeIn delay={0.5} className="mt-4 md:mt-0">
                <div className="bg-gradient-to-r from-indigo-50 to-white p-2 rounded-xl border border-indigo-100 shadow-sm flex items-center gap-2">
                  <div className="text-sm text-gray-500 font-medium px-2">View:</div>
                  <Button variant="ghost" size="sm" className="rounded-lg bg-white shadow-sm border border-gray-200 text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-lg text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  </Button>
                </div>
              </FadeIn>
            </div>

            {/* Course Cards */}
            {loadingState ? (
              <div className="grid grid-cols-1 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                    <div className="flex flex-col md:flex-row">
                      <Skeleton className="w-full md:w-72 h-52" />
                      <div className="p-6 flex-1">
                        <Skeleton className="h-8 w-3/4 mb-4" />
                        <Skeleton className="h-5 w-1/2 mb-3" />
                        <Skeleton className="h-5 w-2/3 mb-6" />
                        <div className="flex gap-3 mb-6">
                          <Skeleton className="h-6 w-20 rounded-full" />
                          <Skeleton className="h-6 w-20 rounded-full" />
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-10 w-36 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              <StaggerContainer className="grid grid-cols-1 gap-8">
                {studentViewCoursesList.map((courseItem, index) => (
                  <StaggerItem key={courseItem?._id} custom={index}>
                    <TiltElement tiltFactor={1}>
                      <Card
                        className={`overflow-hidden border-0 rounded-2xl transition-all duration-500 ${
                          hoveredCard === courseItem?._id 
                            ? "shadow-xl shadow-indigo-100 transform -translate-y-1" 
                            : "shadow-lg hover:shadow-xl"
                        }`}
                        onMouseEnter={() => setHoveredCard(courseItem?._id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div 
                          onClick={() => handleCourseNavigate(courseItem?._id)}
                          className="flex flex-col md:flex-row cursor-pointer h-full bg-white relative overflow-hidden"
                        >
                          <div className="relative md:w-72 h-52 overflow-hidden group">
                            <div className="absolute inset-0 bg-indigo-900/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <img
                              src={courseItem?.image}
                              alt={courseItem?.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-24 z-10"></div>
                            <div className="absolute top-4 left-4 z-20">
                              <div className="flex gap-2">
                                <div className="bg-indigo-600 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-lg flex items-center">
                                  {courseItem?.category}
                                </div>
                                
                                {Math.random() > 0.7 && (
                                  <div className="bg-amber-500 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-lg flex items-center">
                                    <FireIcon className="w-3 h-3 mr-1" />
                                    Popular
                                  </div>
                                )}
                                
                                {Math.random() > 0.8 && (
                                  <div className="bg-emerald-500 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-lg flex items-center">
                                    <SparklesIcon className="w-3 h-3 mr-1" />
                                    New
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="absolute bottom-3 left-4 z-20">
                              <div className="flex items-center text-white">
                                <div className="flex text-amber-400 mr-1.5">
                                  {[1,2,3,4,5].map(star => (
                                    <StarIcon key={star} className="h-4 w-4 fill-current" />
                                  ))}
                                </div>
                                <span className="text-sm font-medium">
                                  {(4 + Math.random()).toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-300 ml-1">
                                  ({Math.floor(Math.random() * 500) + 50})
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <CardContent className="flex-1 p-6 md:p-8">
                            <div className="flex flex-col h-full">
                              <div>
                                <CardTitle className="text-2xl mb-2 text-gray-900 font-bold">
                                  {courseItem?.title}
                                </CardTitle>
                                
                                <div className="flex items-center mb-4">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white mr-3 flex items-center justify-center text-xs font-bold shadow-md">
                                    {courseItem?.instructorName?.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {courseItem?.instructorName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {courseItem?.category} Expert
                                    </p>
                                  </div>
                                </div>
                                
                                <p className="text-gray-600 mb-5 line-clamp-2">
                                  {courseItem?.description || "Master the essential skills and concepts through hands-on projects and expert guidance. This comprehensive course is designed for learners at all levels."}
                                </p>
                                
                                <div className="flex flex-wrap gap-3 mb-5">
                                  <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-100 rounded-full py-1.5 px-4">
                                    <BookOpenIcon className="h-4 w-4 mr-2 text-indigo-600" />
                                    {courseItem?.curriculum?.length} {courseItem?.curriculum?.length <= 1 ? "Lecture" : "Lectures"}
                                  </div>
                                  <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-100 rounded-full py-1.5 px-4">
                                    <GraduationCapIcon className="h-4 w-4 mr-2 text-indigo-600" />
                                    {courseItem?.level.toUpperCase()}
                                  </div>
                                  <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-100 rounded-full py-1.5 px-4">
                                    <ClockIcon className="h-4 w-4 mr-2 text-indigo-600" />
                                    {Math.floor(Math.random() * 10) + 2} Hours
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-100">
                                <div>
                                  <p className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    ${courseItem?.pricing}
                                  </p>
                                  {Math.random() > 0.5 && (
                                    <p className="text-xs text-gray-500 line-through">
                                      ${(parseFloat(courseItem?.pricing) * 1.7).toFixed(2)}
                                    </p>
                                  )}
                                </div>
                                
                                <HoverElement>
                                  <Button
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full px-8 py-6 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCourseNavigate(courseItem?._id);
                                    }}
                                  >
                                    Enroll Now
                                  </Button>
                                </HoverElement>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </TiltElement>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <ScrollReveal>
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">
                      <SearchIcon className="h-12 w-12 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">No Courses Found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We couldn't find any courses matching your criteria. Try adjusting your search or filter settings.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      variant="outline"
                      onClick={handleClearFilters}
                      className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    >
                      Clear Filters
                    </Button>
                    <Button 
                      onClick={() => setSearchQuery("")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Reset Search
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            )}
            
            {/* Premium Call to Action */}
            {!loadingState && studentViewCoursesList && studentViewCoursesList.length > 0 && (
              <ScrollReveal delay={0.3}>
                <div className="mt-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-2xl p-8 lg:p-12 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 mix-blend-overlay opacity-20">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="ctaPattern" patternUnits="userSpaceOnUse" width="20" height="20" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="25" fill="white" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#ctaPattern)" />
                    </svg>
                  </div>
                  
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 transform rotate-12 translate-x-1/3 translate-y-1/4 rounded-full filter blur-3xl opacity-30"></div>
                  
                  <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                    <div className="lg:w-2/3">
                      <div className="inline-block mb-4 px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-indigo-100 text-sm font-medium">
                        <BadgeCheckIcon className="inline-block w-4 h-4 mr-2" />
                        <span>Exclusive Offer</span>
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-bold mb-4">Unlock Premium Course Bundle</h3>
                      <p className="text-indigo-100 text-lg mb-6">
                        Get unlimited access to our top 50 premium courses at a special price. Learn from industry experts and advance your career.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Button className="bg-white text-indigo-800 hover:bg-indigo-50 rounded-full px-8 py-6 font-medium shadow-lg">
                          Explore Bundle
                        </Button>
                        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6">
                          Learn More
                        </Button>
                      </div>
                    </div>
                    <div className="lg:w-1/3 flex justify-center">
                      <div className="relative">
                        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-70 blur-xl animate-pulse"></div>
                        <div className="relative bg-white/95 backdrop-blur-sm rounded-xl p-6 text-center shadow-2xl">
                          <h4 className="text-gray-900 font-bold text-xl mb-2">Premium Bundle</h4>
                          <div className="text-gray-500 line-through mb-1">$1,499</div>
                          <div className="text-3xl font-bold text-indigo-600 mb-4">$499</div>
                          <div className="bg-indigo-100 text-indigo-800 text-xs font-bold py-1 px-2 rounded mb-4 inline-block">
                            Save 67%
                          </div>
                          <ul className="text-left text-gray-700 space-y-2 mb-6">
                            <li className="flex items-center">
                              <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                              <span>50 Premium Courses</span>
                            </li>
                            <li className="flex items-center">
                              <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                              <span>Lifetime Access</span>
                            </li>
                            <li className="flex items-center">
                              <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                              <span>Premium Certificates</span>
                            </li>
                            <li className="flex items-center">
                              <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                              <span>1-on-1 Mentoring</span>
                            </li>
                          </ul>
                          <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full py-2 shadow-lg">
                            Get Started
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

const CheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default StudentViewCoursesPage;
