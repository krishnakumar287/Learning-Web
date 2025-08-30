import { courseCategories } from "@/config";
import banner from "../../../../public/banner-img.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState, useRef } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import CountUp from "react-countup";
import { 
  ArrowRight, 
  Award, 
  BookOpen, 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  Globe, 
  Headphones, 
  Lightbulb, 
  Play, 
  Shield,
  Star, 
  Users 
} from "lucide-react";
import { motion, useScroll, useTransform, useInView, useMotionValueEvent } from "framer-motion";
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
  PulseElement 
} from "@/components/ui/animations";

// Animated counter component
const Counter = ({ from, to, duration = 2, decimals = 0 }) => {
  const nodeRef = useRef(null);
  const [count, setCount] = useState(from);
  const [inView, setInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }
    
    return () => {
      if (nodeRef.current) {
        observer.unobserve(nodeRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!inView) return;
    
    let startTime;
    let animationFrame;
    
    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(from + progress * (to - from));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [from, to, duration, inView]);
  
  return (
    <div ref={nodeRef}>
      {decimals === 0 ? Math.floor(count) : count.toFixed(decimals)}
    </div>
  );
};

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation refs
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuredRef = useRef(null);
  const categoriesRef = useRef(null);
  const instructorsRef = useRef(null);
  const testimonialRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Animation states
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.5 });
  const featuredInView = useInView(featuredRef, { once: true, amount: 0.2 });
  const categoriesInView = useInView(categoriesRef, { once: true, amount: 0.2 });
  const instructorsInView = useInView(instructorsRef, { once: true, amount: 0.2 });
  const testimonialInView = useInView(testimonialRef, { once: true, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });
  
  // Parallax effects
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);
  const parallaxY1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const parallaxY2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const parallaxY3 = useTransform(scrollY, [0, 1000], [0, -50]);
  
  // Text animation variants
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3
      }
    }
  };
  
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  // Stagger container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  // Stats counter animation
  const countingRef = useRef(null);
  const countingInView = useInView(countingRef, { once: true, amount: 0.5 });
  const [countComplete, setCountComplete] = useState(false);
  
  useEffect(() => {
    if (countingInView && !countComplete) {
      setCountComplete(true);
    }
  }, [countingInView, countComplete]);

  function handleNavigateToCoursesPage(getCurrentId) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    setIsLoading(true);
    try {
      const response = await fetchStudentViewCourseListService();
      if (response?.success) {
        setStudentViewCoursesList(response?.data);
        
        // Set featured courses (could be based on ratings or other criteria)
        if(response?.data?.length > 0) {
          setFeaturedCourses(response.data.slice(0, 4));
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
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
    fetchAllStudentViewCourses();
    
    // Select a few popular categories
    setPopularCategories(courseCategories.slice(0, 6));
  }, []);

  // Benefits data
  const benefitsData = [
    {
      icon: <Award className="w-6 h-6 text-purple-500" />,
      title: "Industry-recognized certificates",
      description: "Add valuable credentials to your portfolio and LinkedIn profile"
    },
    {
      icon: <Headphones className="w-6 h-6 text-blue-500" />,
      title: "Personalized support",
      description: "Get help from expert mentors dedicated to your success"
    },
    {
      icon: <Globe className="w-6 h-6 text-emerald-500" />,
      title: "Learn anywhere, anytime",
      description: "Access courses on any device with our mobile-friendly platform"
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-amber-500" />,
      title: "Project-based learning",
      description: "Apply your skills with real-world projects and case studies"
    }
  ];

  // Instructor showcase
  const topInstructors = [
    { name: "Dr. Sarah Johnson", role: "Data Science Expert", students: 15432, courses: 8 },
    { name: "Michael Chen", role: "Full-Stack Developer", students: 12800, courses: 12 },
    { name: "Priya Sharma", role: "UX/UI Designer", students: 9745, courses: 6 }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Advanced Animations */}
      <motion.section 
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -inset-[10px] opacity-30"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
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
                <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="35" fill="url(#grad)">
                <animate attributeName="r" from="35" to="45" dur="8s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.8" to="0.2" dur="8s" repeatCount="indefinite" />
              </circle>
            </svg>
          </motion.div>
          
          {/* Floating shapes with advanced animation */}
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
            className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
          <motion.div 
            className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{ 
              x: [0, 15, -25, 0],
              y: [0, -15, 25, 0],
              scale: [1, 1.05, 0.95, 1]
            }}
            transition={{ 
              duration: 20, 
              ease: "easeInOut", 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 4
            }}
          ></motion.div>
        </div>
        
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between py-20 lg:py-32">
            <motion.div 
              className="lg:w-1/2 lg:pr-12 z-10"
              style={{ y: heroY }}
              variants={containerVariants}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
            >
              <motion.div 
                className="inline-block mb-4 px-4 py-1 bg-indigo-600/20 backdrop-blur-sm rounded-full text-indigo-300 text-sm font-medium border border-indigo-500/30"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Welcome to EliteLearn — Where Excellence Meets Education
              </motion.div>
              
              <motion.div variants={titleVariants} initial="hidden" animate={heroInView ? "visible" : "hidden"}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                  <motion.span 
                    className="block" 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    Master New Skills,
                  </motion.span>
                  <motion.span 
                    className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text text-gradient-animate"
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    Define Your Future
                  </motion.span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-xl text-indigo-100/90 mb-8 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Join a community of learners and industry experts on the premium learning platform designed for your success.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-6 px-8 rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-600/30 btn-pulse"
                    onClick={() => navigate('/courses')}
                  >
                    <span>Explore Courses</span>
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-indigo-400/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 py-6 px-8 rounded-xl transition-all duration-300 shine"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    <span>Watch Demo</span>
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="mt-12 flex items-center"
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <div className="flex -space-x-3">
                  {[1,2,3,4,5].map((i) => (
                    <motion.div 
                      key={i} 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-indigo-900 flex items-center justify-center shadow-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: 1.2 + (i * 0.1) }}
                    >
                      <span className="text-xs font-bold text-white">{i}</span>
                    </motion.div>
                  ))}
                </div>
                <motion.div 
                  className="flex flex-col ml-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 1.7 }}
                >
                  <p className="text-white font-medium">Join 25,000+ learners</p>
                  <div className="flex mt-1">
                    {[1,2,3,4,5].map((star, index) => (
                      <motion.div
                        key={star}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                        transition={{ duration: 0.3, delay: 1.8 + (index * 0.1) }}
                      >
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </motion.div>
                    ))}
                    <motion.span 
                      className="ml-2 text-xs text-indigo-200"
                      initial={{ opacity: 0 }}
                      animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.5, delay: 2.3 }}
                    >
                      4.9 (2.4k reviews)
                    </motion.span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 mt-10 lg:mt-0 z-10"
              style={{ y: parallaxY3 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="relative">
                <motion.div 
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-70 blur-lg"
                  animate={{ 
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    ease: "easeInOut", 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                ></motion.div>
                <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/80 via-transparent to-transparent z-10"></div>
                  <motion.img
                    src={banner}
                    alt="Learning Platform"
                    className="relative w-full max-w-lg mx-auto transform transition-transform duration-700 hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Floating badges with animations */}
                  <motion.div 
                    className="absolute top-6 right-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-sm font-medium z-20 flex items-center shadow-xl"
                    initial={{ opacity: 0, y: -20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <BookOpen className="w-4 h-4 mr-2" /> 
                    <span>500+ Premium Courses</span>
                  </motion.div>
                  <motion.div 
                    className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-sm font-medium z-20 flex items-center shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <Users className="w-4 h-4 mr-2" /> 
                    <span>100+ Expert Instructors</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Wave Divider with Animation */}
        <div className="absolute bottom-0 left-0 right-0">
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 120" 
            fill="#ffffff"
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </motion.svg>
        </div>
      </motion.section>

      {/* Benefits Section with Animation */}
      <motion.section 
        ref={statsRef}
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            <motion.h2 
              className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-md mb-3"
              variants={cardVariants}
            >
              Why Choose EliteLearn
            </motion.h2>
            <motion.h3 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              variants={cardVariants}
            >
              Learning that works <span className="text-indigo-600">for you</span>
            </motion.h3>
            <motion.p 
              className="max-w-2xl mx-auto text-gray-600 text-lg"
              variants={cardVariants}
            >
              Our platform is designed to provide the most effective and engaging learning experience possible.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            {benefitsData.map((benefit, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
                variants={cardVariants}
                whileHover={{ 
                  y: -8, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  borderColor: "rgb(224, 231, 255)" 
                }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4"
                  whileHover={{ 
                    rotate: 5,
                    scale: 1.1,
                    backgroundColor: "rgb(238, 242, 255)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {benefit.icon}
                </motion.div>
                <motion.h4 
                  className="text-xl font-semibold text-gray-900 mb-2"
                  whileHover={{ color: "#4f46e5" }}
                >
                  {benefit.title}
                </motion.h4>
                <motion.p className="text-gray-600">{benefit.description}</motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section with Animation */}
      <motion.section 
        ref={countingRef}
        className="py-20 px-4 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            animate={countingInView ? "visible" : "hidden"}
          >
            <motion.h2 
              className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-md mb-3"
              variants={cardVariants}
            >
              Our Impact
            </motion.h2>
            <motion.h3 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              variants={cardVariants}
            >
              Transforming education at scale
            </motion.h3>
            <motion.p 
              className="text-gray-600 text-lg"
              variants={cardVariants}
            >
              Join thousands of learners who have already advanced their careers with EliteLearn.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={countingInView ? "visible" : "hidden"}
          >
            {[
              { value: 100, label: "Expert Instructors", suffix: "+" },
              { value: 500, label: "Premium Courses", suffix: "+" },
              { value: 25, label: "Active Students", suffix: "k+" },
              { value: 4.9, label: "Average Rating", suffix: "" }
            ].map((stat, index) => (
              <TiltElement key={index} tiltFactor={10}>
                <motion.div 
                  className="bg-white p-8 rounded-xl shadow-lg border border-indigo-100 text-center transform transition-all duration-500 hover:-translate-y-1 hover:shadow-xl overflow-hidden relative"
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    borderColor: "rgb(129, 140, 248, 0.5)"
                  }}
                >
                  {/* Background shine effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-indigo-50 to-transparent opacity-0"
                    animate={countingInView ? { 
                      opacity: [0, 0.5, 0],
                      left: ["-100%", "100%", "100%"]
                    } : {}}
                    transition={{ 
                      duration: 1.5, 
                      delay: 0.2 + index * 0.2,
                      ease: "easeInOut",
                      times: [0, 0.5, 1]
                    }}
                  />
                  
                  <motion.p 
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={countingInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <CountUp 
                      from={0} 
                      to={stat.value} 
                      duration={2.5} 
                      delay={0.5} 
                      decimals={stat.value === 4.9 ? 1 : 0}
                      enableScrollSpy 
                      scrollSpyDelay={200}
                    />
                    {stat.suffix}
                  </motion.p>
                  <motion.p 
                    className="text-gray-600 mt-2 font-medium"
                    initial={{ opacity: 0 }}
                    animate={countingInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    {stat.label}
                  </motion.p>
                </motion.div>
              </TiltElement>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Courses - Enhanced */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <h2 className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-md mb-3">Featured Courses</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Learn from the Best</h3>
              <p className="text-gray-600 text-lg max-w-2xl">Discover our most popular courses designed to help you master in-demand skills.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/courses')}
              className="hidden md:flex mt-6 md:mt-0 border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium"
            >
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-[350px]"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                studentViewCoursesList.slice(0, 4).map((courseItem) => (
                  <Card 
                    key={courseItem?._id} 
                    className="overflow-hidden h-full border-0 shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
                    onClick={() => handleCourseNavigate(courseItem?._id)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={courseItem?.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"}
                        alt={courseItem?.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center space-x-2">
                          <span className="bg-indigo-600 text-white text-xs font-bold py-1 px-2 rounded-md">
                            {courseItem?.category}
                          </span>
                          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-medium py-1 px-2 rounded-md flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {courseItem?.curriculum?.length || 0} lectures
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-1 text-xl">{courseItem?.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3">{courseItem?.subtitle || "Learn essential skills in this comprehensive course designed for all levels."}</p>
                      
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 mr-2 flex items-center justify-center text-indigo-600 font-bold">
                          {courseItem?.instructorName?.charAt(0) || "I"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {courseItem?.instructorName}
                          </p>
                          <p className="text-xs text-gray-500">Instructor</p>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center">
                        <div className="flex text-amber-400">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">4.9 ({Math.floor(Math.random() * 500) + 50})</span>
                      </div>
                      <p className="font-bold text-xl text-indigo-600">
                        ${courseItem?.pricing}
                      </p>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl text-gray-500">No Courses Found</h3>
                  <Button 
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => fetchAllStudentViewCourses()}
                  >
                    Refresh
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Button 
              variant="outline" 
              onClick={() => navigate('/courses')}
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium"
            >
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section - Ultra Premium */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full opacity-20 blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl -z-10"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <div className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-md mb-3">
                <BookOpen className="w-4 h-4 mr-2" />
                <span>Browse Categories</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Find Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Perfect Path</span>
              </h3>
              <p className="text-gray-600 text-lg max-w-2xl">
                Explore our meticulously curated selection of learning paths designed to elevate your skills to professional levels.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <Button 
                variant="outline" 
                onClick={() => navigate('/courses')}
                className="group border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium px-6 py-3 rounded-xl"
              >
                <span>View All Categories</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
          
          {/* 3D Category Cards with Hexagon Design */}
          <div className="relative">
            {/* Decorative hex grid background */}
            <div className="absolute inset-0 bg-[url('/hex-pattern.svg')] bg-repeat opacity-5 -z-10"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {courseCategories.slice(0, 6).map((categoryItem, index) => (
                <div
                  key={categoryItem.id}
                  onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
                  className="group cursor-pointer transform transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative">
                    {/* Animated glow effect on hover */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-70 blur-md transition-all duration-500 group-hover:duration-200"></div>
                    
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden flex h-full">
                      {/* Color accent bar */}
                      <div className={`w-2 ${getCategoryColor(categoryItem.id)}`}></div>
                      
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`w-14 h-14 rounded-xl ${getCategoryBgColor(categoryItem.id)} flex items-center justify-center shadow-md`}>
                            {getCategoryIcon(categoryItem.id)}
                          </div>
                          
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-8 px-3 flex items-center text-xs font-medium text-gray-600 dark:text-gray-300">
                            {Math.floor(Math.random() * 30) + 10} courses
                          </div>
                        </div>
                        
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                          {categoryItem.label}
                        </h4>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                          {getCategoryDescription(categoryItem.id)}
                        </p>
                        
                        <div className="mt-auto">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {getTopicsForCategory(categoryItem.id).map((topic, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs text-gray-700 dark:text-gray-300">
                                {topic}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:text-indigo-500">
                            <span>Explore Path</span>
                            <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-12">
              <div className="inline-flex gap-1.5">
                {[0, 1].map(i => (
                  <span 
                    key={i} 
                    className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor Showcase - Ultra Premium */}
      <section className="py-24 px-4 bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden">
        {/* Abstract decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-md mb-3">
              <Award className="w-4 h-4 mr-2" />
              <span>Learn From The Best</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              World-Class <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Industry Experts</span>
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our instructors bring decades of real-world experience from leading global companies directly to your learning journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-16">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Data Science Expert",
                bio: "Former Lead Data Scientist at Google with 12+ years of industry experience. PhD in Computer Science from Stanford.",
                specialty: ["Machine Learning", "Neural Networks", "Big Data"],
                students: 15432,
                courses: 8,
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80"
              },
              {
                name: "Michael Chen",
                role: "Full-Stack Developer",
                bio: "Senior Software Architect who has led teams at Amazon and Microsoft. Specializes in scalable web applications.",
                specialty: ["JavaScript", "React", "Node.js"],
                students: 12800,
                courses: 12,
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80"
              },
              {
                name: "Priya Sharma",
                role: "UX/UI Design Leader",
                bio: "Award-winning designer with experience at Apple and Airbnb. Passionate about creating intuitive user experiences.",
                specialty: ["UI Design", "User Research", "Figma"],
                students: 9745,
                courses: 6,
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80"
              }
            ].map((instructor, index) => (
              <div key={index} className="group">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 h-full flex flex-col">
                  <div className="relative">
                    {/* Premium badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10 shadow-lg">
                      Elite Instructor
                    </div>
                    
                    {/* Instructor image with gradient overlay */}
                    <div className="relative h-60 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 z-10"></div>
                      <img 
                        src={instructor.image} 
                        alt={instructor.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Stats band */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md z-10 py-2 px-4 flex justify-between">
                      <div className="flex items-center text-white">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">{instructor.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-white">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{instructor.rating}</span>
                      </div>
                      <div className="flex items-center text-white">
                        <BookOpen className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">{instructor.courses} courses</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{instructor.name}</h4>
                    <p className="text-indigo-600 font-medium mb-3">{instructor.role}</p>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">
                      {instructor.bio}
                    </p>
                    
                    <div className="mb-5 mt-auto">
                      <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2 font-medium">Specialties</p>
                      <div className="flex flex-wrap gap-2">
                        {instructor.specialty.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => navigate('/courses')}
                      >
                        View Courses
                      </Button>
                      <Button 
                        variant="outline" 
                        className="aspect-square p-0 w-10 h-10 flex items-center justify-center border-indigo-200"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 flex justify-center">
            <Button 
              className="bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium px-8 py-6 rounded-xl shadow-sm group transition-all duration-300 hover:shadow-md"
              onClick={() => navigate('/courses')}
            >
              <span>View All Expert Instructors</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial Section - Enhanced */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-md mb-3">Success Stories</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Thousands of students have transformed their careers with our platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Thompson",
                role: "Web Developer",
                quote: "The courses on EliteLearn have completely transformed my career path. The instructors are top-notch and the content is always up-to-date with industry standards."
              },
              {
                name: "Samantha Lee",
                role: "Data Scientist",
                quote: "I switched careers from marketing to data science using only courses from this platform. The project-based approach gave me a portfolio that impressed employers during interviews."
              },
              {
                name: "Marcus Johnson",
                role: "UX Designer",
                quote: "As someone with no prior design experience, I was amazed at how quickly I developed professional UX skills. The community support is invaluable and the instructors are always available."
              }
            ].map((testimonial, i) => (
              <Card key={i} className="border-0 shadow-xl rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="h-2 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
                <CardContent className="pt-8">
                  <div className="flex mb-4">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-6 text-lg">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 mr-4 flex items-center justify-center text-indigo-600 font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - New */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-indigo-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-md mb-3">Common Questions</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Find answers to common questions about our platform and courses.</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "How do I get started?",
                answer: "Getting started is easy! Simply create an account, browse our course catalog, and enroll in any course that interests you. You can start learning immediately after enrollment."
              },
              {
                question: "Are there any prerequisites for courses?",
                answer: "Each course lists its prerequisites on the course details page. Some beginner courses have no prerequisites, while advanced courses may require prior knowledge or skills."
              },
              {
                question: "Do I get a certificate upon completion?",
                answer: "Yes! Upon successful completion of a course, you'll receive a certificate that you can share on LinkedIn or include in your resume to showcase your new skills."
              },
              {
                question: "What if I'm not satisfied with a course?",
                answer: "We offer a 30-day money-back guarantee if you're not completely satisfied with your purchase. Simply contact our support team to process your refund."
              }
            ].map((faq, index) => (
              <div key={index} className="mb-4 bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-900">{faq.question}</h4>
                    <div className="bg-indigo-100 rounded-full p-1 text-indigo-600">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2 text-gray-600">{faq.answer}</div>
                </div>
              </div>
            ))}
            
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                View All FAQs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra Premium Limited Offer Section */}
      <section className="py-28 px-4 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated particles */}
          <div className="particles absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="particle absolute rounded-full bg-white/20"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              ></div>
            ))}
          </div>
          
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          
          {/* Decorative patterns */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Glowing accent line */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          
          {/* Main content */}
          <div className="relative">
            {/* Premium badge */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-70 blur-sm animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg border border-white/20 flex items-center">
                  <span className="mr-2">✨</span>
                  <span>EXCLUSIVE OFFER</span>
                  <span className="ml-2">✨</span>
                </div>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto mt-6 text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="block mb-2">Transform Your Career</span>
                <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 text-transparent bg-clip-text">In The Next 30 Days</span>
              </h2>
              
              <p className="text-xl text-blue-100/90 mb-8 leading-relaxed max-w-3xl mx-auto">
                Join our elite community of learners and get exclusive access to our premium course catalog with a special limited-time offer.
              </p>
            </div>
            
            {/* Offer card */}
            <div className="relative mx-auto max-w-4xl">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-2xl opacity-70 blur-md"></div>
              
              <div className="relative bg-gradient-to-br from-indigo-800/70 to-blue-900/70 backdrop-blur-xl rounded-2xl p-1.5 shadow-2xl">
                {/* Border gradient */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 border-t border-l border-white/10"></div>
                </div>
                
                {/* Main content */}
                <div className="bg-gradient-to-br from-indigo-900/90 to-blue-900/90 rounded-xl p-10 relative overflow-hidden">
                  {/* Accent corner */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rotate-12"></div>
                  
                  {/* Ribbon */}
                  <div className="absolute top-8 -right-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-1 px-12 transform rotate-45 shadow-md">
                    40% OFF
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    {/* Left content */}
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-white">Elite Learning Experience</h3>
                      <p className="text-blue-100/80 mb-6">
                        Unlock your potential with our comprehensive learning platform designed to propel your career forward.
                      </p>
                      
                      <div className="space-y-4 mb-8">
                        {[
                          { icon: <BookOpen className="w-5 h-5" />, text: "Unlimited access to all 500+ premium courses" },
                          { icon: <Award className="w-5 h-5" />, text: "Industry-recognized certificates upon completion" },
                          { icon: <Headphones className="w-5 h-5" />, text: "1-on-1 mentoring sessions with industry experts" },
                          { icon: <Users className="w-5 h-5" />, text: "Exclusive access to our private community" },
                        ].map((item, i) => (
                          <div key={i} className="flex items-start">
                            <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-sm">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <div className="ml-3">
                              <div className="flex items-center text-blue-100">
                                {item.icon}
                                <span className="ml-2 font-medium">{item.text}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Right content */}
                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
                      <div className="text-center mb-4">
                        <div className="flex justify-center items-baseline mb-2">
                          <span className="text-2xl font-medium text-blue-200 line-through opacity-70">$199</span>
                          <span className="text-5xl font-bold text-white ml-2">$119</span>
                          <span className="text-xl text-blue-200 ml-1">/month</span>
                        </div>
                        <p className="text-blue-200/70 text-sm">Billed annually or $149 monthly</p>
                      </div>
                      
                      <div className="mb-6 bg-white/10 rounded-lg p-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-blue-100">Offer ends in:</span>
                          <span className="text-sm text-amber-300 font-medium">Limited spots!</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {['02', '11', '45', '19'].map((num, i) => (
                            <div key={i} className="bg-white/10 rounded-md p-2">
                              <div className="text-xl font-bold text-white">{num}</div>
                              <div className="text-xs text-blue-200">{['Days', 'Hours', 'Mins', 'Secs'][i]}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 group"
                        onClick={() => navigate('/courses')}
                      >
                        <span>Claim Your Discount</span>
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                      
                      <div className="mt-4 flex items-center justify-center text-sm text-blue-200/70">
                        <Shield className="w-4 h-4 mr-2" />
                        <span>30-day money-back guarantee</span>
                      </div>
                      
                      <div className="mt-6 flex justify-center space-x-4">
                        {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((payment, i) => (
                          <div key={i} className="bg-white/10 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-blue-100">
                            {payment}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Testimonial quote */}
                  <div className="mt-10 bg-white/5 backdrop-blur-sm rounded-lg p-4 border-l-4 border-amber-400">
                    <p className="italic text-blue-100/80">
                      "This platform completely transformed my career. I went from a junior position to leading a team in just 6 months after completing the advanced courses."
                    </p>
                    <div className="mt-2 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                        J
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium text-white">James Wilson</p>
                        <p className="text-xs text-blue-200/70">Senior Developer at Google</p>
                      </div>
                      <div className="ml-auto flex">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trust badges */}
            <div className="mt-12 max-w-3xl mx-auto">
              <p className="text-center text-sm text-blue-200/70 mb-4">Trusted by leading companies worldwide</p>
              <div className="flex flex-wrap justify-center items-center gap-6 opacity-70">
                {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'].map((company, i) => (
                  <div key={i} className="text-blue-100 font-bold text-lg">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper functions for category icons and descriptions
function getCategoryIcon(categoryId) {
  switch(categoryId) {
    case "web-development":
      return <Globe className="h-6 w-6 text-white" />;
    case "backend-development":
      return <BookOpen className="h-6 w-6 text-white" />;
    case "data-science":
      return <Lightbulb className="h-6 w-6 text-white" />;
    case "machine-learning":
      return <BookOpen className="h-6 w-6 text-white" />;
    case "artificial-intelligence":
      return <Lightbulb className="h-6 w-6 text-white" />;
    case "cloud-computing":
      return <Globe className="h-6 w-6 text-white" />;
    case "cyber-security":
      return <Lightbulb className="h-6 w-6 text-white" />;
    case "mobile-development":
      return <Globe className="h-6 w-6 text-white" />;
    case "game-development":
      return <BookOpen className="h-6 w-6 text-white" />;
    case "software-engineering":
      return <Lightbulb className="h-6 w-6 text-white" />;
    default:
      return <BookOpen className="h-6 w-6 text-white" />;
  }
}

function getCategoryDescription(categoryId) {
  const descriptions = {
    "web-development": "Master front-end technologies",
    "backend-development": "Build robust server-side applications",
    "data-science": "Analyze and visualize complex data",
    "machine-learning": "Build intelligent algorithms",
    "artificial-intelligence": "Create AI-powered solutions",
    "cloud-computing": "Master cloud infrastructure",
    "cyber-security": "Protect systems and networks",
    "mobile-development": "Create apps for iOS and Android",
    "game-development": "Design immersive gaming experiences",
    "software-engineering": "Learn software architecture"
  };
  
  return descriptions[categoryId] || "Expand your knowledge";
}

function getCategoryColor(categoryId) {
  const colors = {
    "web-development": "bg-gradient-to-b from-blue-500 to-blue-600",
    "backend-development": "bg-gradient-to-b from-green-500 to-green-600",
    "data-science": "bg-gradient-to-b from-purple-500 to-purple-600",
    "machine-learning": "bg-gradient-to-b from-indigo-500 to-indigo-600",
    "artificial-intelligence": "bg-gradient-to-b from-pink-500 to-pink-600",
    "cloud-computing": "bg-gradient-to-b from-cyan-500 to-cyan-600",
    "cyber-security": "bg-gradient-to-b from-red-500 to-red-600",
    "mobile-development": "bg-gradient-to-b from-amber-500 to-amber-600",
    "game-development": "bg-gradient-to-b from-emerald-500 to-emerald-600",
    "software-engineering": "bg-gradient-to-b from-violet-500 to-violet-600"
  };
  
  return colors[categoryId] || "bg-gradient-to-b from-gray-500 to-gray-600";
}

function getCategoryBgColor(categoryId) {
  const colors = {
    "web-development": "bg-blue-100 dark:bg-blue-900/30",
    "backend-development": "bg-green-100 dark:bg-green-900/30",
    "data-science": "bg-purple-100 dark:bg-purple-900/30",
    "machine-learning": "bg-indigo-100 dark:bg-indigo-900/30",
    "artificial-intelligence": "bg-pink-100 dark:bg-pink-900/30",
    "cloud-computing": "bg-cyan-100 dark:bg-cyan-900/30",
    "cyber-security": "bg-red-100 dark:bg-red-900/30",
    "mobile-development": "bg-amber-100 dark:bg-amber-900/30",
    "game-development": "bg-emerald-100 dark:bg-emerald-900/30",
    "software-engineering": "bg-violet-100 dark:bg-violet-900/30"
  };
  
  return colors[categoryId] || "bg-gray-100 dark:bg-gray-800";
}

function getTopicsForCategory(categoryId) {
  const topics = {
    "web-development": ["HTML/CSS", "JavaScript", "React", "UI/UX"],
    "backend-development": ["Node.js", "Python", "Databases", "APIs"],
    "data-science": ["Python", "R", "SQL", "Visualization"],
    "machine-learning": ["TensorFlow", "PyTorch", "Algorithms", "NLP"],
    "artificial-intelligence": ["Neural Networks", "CV", "Ethics", "GPT"],
    "cloud-computing": ["AWS", "Azure", "DevOps", "Serverless"],
    "cyber-security": ["Network", "Ethical Hacking", "Cryptography", "Defense"],
    "mobile-development": ["React Native", "Flutter", "iOS", "Android"],
    "game-development": ["Unity", "Unreal", "3D Modeling", "Game Design"],
    "software-engineering": ["System Design", "Architecture", "Testing", "CI/CD"]
  };
  
  return topics[categoryId] || ["Fundamentals", "Advanced", "Projects", "Career"];
}

// Add CSS animation classes
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes blob {
    0% { transform: scale(1); }
    33% { transform: scale(1.1); }
    66% { transform: scale(0.9); }
    100% { transform: scale(1); }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;
document.head.appendChild(styleTag);

export default StudentHomePage;
