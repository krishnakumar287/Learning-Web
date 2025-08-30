import CommonForm from "@/components/common-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { 
  ArrowRight,
  BookOpen, 
  CheckCircle, 
  GraduationCap, 
  Shield, 
  Star, 
  Trophy, 
  Users 
} from "lucide-react";
import { useContext, useState, useEffect } from "react";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [animateOut, setAnimateOut] = useState(false);
  const [brandAnimation, setBrandAnimation] = useState(false);
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
    isLoading
  } = useContext(AuthContext);

  // Handle tab transitions with animation
  function handleTabChange(value) {
    if (value === activeTab) return;
    setAnimateOut(true);
    setTimeout(() => {
      setActiveTab(value);
      setAnimateOut(false);
    }, 300);
  }

  // Trigger the brand animation on mount
  useEffect(() => {
    setBrandAnimation(true);
  }, []);

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  // List of testimonials for the rotating testimonial feature
  const testimonials = [
    {
      quote: "EliteLearn completely transformed my career path with its premium courses.",
      author: "Sarah Johnson",
      role: "Senior Developer"
    },
    {
      quote: "The quality of instruction and course materials is unmatched in the industry.",
      author: "Michael Chen",
      role: "Data Scientist"
    },
    {
      quote: "From beginner to professional in just 3 months with EliteLearn's structured path.",
      author: "Priya Sharma",
      role: "UX Designer"
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Left side - Premium branding and content */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Gradient background with animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white/10"
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
        
        {/* Decorative circles */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>
        
        {/* Content container */}
        <div className="relative h-full flex flex-col z-10">
          {/* Brand logo with animation */}
          <div className="p-8">
            <div className={`flex items-center transition-all duration-1000 ${brandAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl mr-3">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">ELITELEARN</span>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center px-12 py-10">
            {/* Animated heading and subheading */}
            <div className={`transition-all duration-1000 delay-300 ${brandAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
                Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Professional Journey</span>
              </h1>
              <p className="text-xl text-indigo-100/80 mb-10 max-w-xl">
                Join the elite community of learners mastering in-demand skills from industry experts.
              </p>
            </div>
            
            {/* Stats with premium design and animations */}
            <div className="mb-12">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur-lg"></div>
                
                <div className={`relative grid grid-cols-3 gap-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1 transition-all duration-1000 delay-500 ${brandAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {[
                    { count: "500+", label: "Premium Courses", icon: <BookOpen className="h-4 w-4 text-blue-300" /> },
                    { count: "100+", label: "Expert Instructors", icon: <Trophy className="h-4 w-4 text-amber-300" /> },
                    { count: "25k+", label: "Active Learners", icon: <Users className="h-4 w-4 text-green-300" /> }
                  ].map((stat, i) => (
                    <div 
                      key={i} 
                      className={`bg-white/5 hover:bg-white/10 transition-all duration-300 p-4 rounded-lg border border-white/5 ${i === 1 ? 'transform hover:-translate-y-1' : 'transform hover:-translate-y-1'}`}
                    >
                      <div className="flex items-center justify-center mb-1">
                        <div className="bg-white/10 p-1.5 rounded-md mr-2">
                          {stat.icon}
                        </div>
                        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                          {stat.count}
                        </div>
                      </div>
                      <p className="text-center text-indigo-200/70 text-xs font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Feature blocks with premium design */}
            <div className="mb-12">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-lg"></div>
                
                <div className={`relative grid grid-cols-2 gap-3 transition-all duration-1000 delay-700 ${brandAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {[
                    { 
                      icon: <BookOpen className="h-5 w-5 text-blue-300" />, 
                      title: "Premium Content", 
                      desc: "Industry-leading courses curated by experts",
                      gradient: "from-blue-600/20 to-blue-400/20",
                      delay: 100
                    },
                    { 
                      icon: <Shield className="h-5 w-5 text-emerald-300" />, 
                      title: "Certification", 
                      desc: "Recognized credentials to boost your career",
                      gradient: "from-emerald-600/20 to-emerald-400/20",
                      delay: 200
                    },
                    { 
                      icon: <Users className="h-5 w-5 text-purple-300" />, 
                      title: "Community", 
                      desc: "Connect with peers and industry professionals",
                      gradient: "from-purple-600/20 to-purple-400/20",
                      delay: 300
                    },
                    { 
                      icon: <Star className="h-5 w-5 text-amber-300" />, 
                      title: "Mentorship", 
                      desc: "1-on-1 guidance from experienced mentors",
                      gradient: "from-amber-600/20 to-amber-400/20",
                      delay: 400
                    }
                  ].map((feature, i) => (
                    <div 
                      key={i} 
                      className="group relative"
                      style={{ 
                        transitionDelay: `${feature.delay}ms`, 
                        animation: `fadeSlideUp 0.5s ease-out ${feature.delay}ms both` 
                      }}
                    >
                      {/* Hover glow effect */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-70 blur-md transition-opacity duration-300"></div>
                      
                      <div className={`relative bg-gradient-to-br ${feature.gradient} backdrop-blur-md border border-white/10 rounded-xl p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-indigo-900/20 h-full`}>
                        <div className="flex items-center mb-3">
                          <div className="bg-white/10 p-2 rounded-lg mr-3 group-hover:bg-white/20 transition-colors">
                            {feature.icon}
                          </div>
                          <h3 className="font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-sm text-indigo-100/70 group-hover:text-indigo-100/90 transition-colors">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Premium 3D Testimonial Carousel */}
            <div className={`mt-12 transition-all duration-1000 delay-900 ${brandAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="relative">
                {/* Enhanced Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-xl blur-lg opacity-70"></div>
                
                <div className="relative overflow-hidden rounded-xl perspective-1000">
                  {/* 3D Card Container */}
                  <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 backdrop-blur-md border border-white/10 rounded-xl shadow-xl transform-gpu transition-all duration-500">
                    {/* Decorative elements */}
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rotate-12"></div>
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rotate-45"></div>
                    
                    {/* Premium Section Header */}
                    <div className="px-6 py-5 border-b border-white/10 backdrop-blur-sm flex items-center justify-between relative">
                      {/* Decorative accent lines */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-10 bg-gradient-to-b from-indigo-400/80 to-blue-400/80 rounded-r-md"></div>
                      
                      <div className="flex items-center pl-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 flex items-center justify-center mr-3 shadow-lg shadow-indigo-900/30 ring-2 ring-white/10 p-0.5">
                          <div className="w-full h-full rounded-full bg-indigo-900/50 backdrop-blur-sm flex items-center justify-center">
                            <Star className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-indigo-200 font-bold tracking-wide text-lg">Elite Success Stories</h3>
                          <div className="flex items-center">
                            <div className="h-0.5 w-3 bg-blue-400/60 mr-2"></div>
                            <p className="text-indigo-200/80 text-xs font-medium">From our community of professionals</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Navigation Dots */}
                      <div className="flex space-x-1.5">
                        {testimonials.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentTestimonial(i)}
                            className={`group transition-all duration-300 focus:outline-none`}
                          >
                            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              i === currentTestimonial 
                                ? 'bg-gradient-to-r from-indigo-400 to-blue-400 scale-110 shadow-md shadow-indigo-900/50' 
                                : 'bg-white/30 group-hover:bg-white/50'
                            }`}></div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Enhanced 3D Testimonial Cards */}
                    <div className="p-6 relative">
                      {/* Animated background particle */}
                      <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-blue-500/5 rounded-full blur-xl animate-pulse"></div>
                      <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                      
                      <div className="relative h-[180px] overflow-hidden">
                        {testimonials.map((testimonial, i) => (
                          <div 
                            key={i} 
                            className={`absolute w-full transition-all duration-700 ease-out transform-gpu ${
                              i === currentTestimonial 
                                ? 'opacity-100 translate-x-0 rotate-0 scale-100 z-10' 
                                : i < currentTestimonial 
                                  ? 'opacity-0 -translate-x-full -rotate-3 scale-95 z-0' 
                                  : 'opacity-0 translate-x-full rotate-3 scale-95 z-0'
                            }`}
                          >
                            {/* Quote Icon with Enhanced Gradient */}
                            <div className="absolute -top-2 -left-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400/40 to-blue-400/40 transform -scale-x-100">
                              <svg className="w-10 h-10 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.077-1.928.71-2.932.214-.339.528-.634.943-.88l.159-.09c.49-.276.71-.81.49-1.298-.22-.488-.76-.714-1.251-.49l-.289.16c-.65.38-1.156.822-1.514 1.324-.358.502-.638 1.163-.843 1.983-.205.82-.197 1.513.026 2.078.223.565.6 1.02 1.132 1.362.53.343 1.162.527 1.898.55.286.007.53.112.684.315.154.203.222.463.203.777-.146 2.45.012 3.819.477 4.105.155.095.32.141.488.141.21 0 .425-.072.645-.215.325-.21.516-.796.573-1.766.058-.97.073-2.229.046-3.778zm6.152 0c0-.88-.23-1.618-.69-2.217-.326-.42-.771-.692-1.335-.82-.564-.13-1.087-.136-1.57-.021-.15-.962.09-1.94.707-2.932.22-.346.534-.645.957-.895l.165-.093c.49-.275.708-.806.488-1.298-.22-.49-.76-.716-1.25-.49l-.29.16c-.648.38-1.153.82-1.513 1.323-.36.502-.643 1.163-.848 1.983-.208.82-.2 1.513.024 2.078s.602 1.02 1.134 1.362c.53.343 1.16.526 1.896.55.287.006.53.112.685.315.154.202.22.463.2.777-.145 2.45.012 3.819.477 4.105.156.094.322.14.49.14.21 0 .425-.072.645-.215.325-.21.516-.796.574-1.766.057-.97.073-2.229.045-3.778z"/>
                              </svg>
                            </div>
                            
                            {/* Premium Card Content with Depth Effect */}
                            <div className="mb-6 bg-gradient-to-br from-white/8 to-white/3 p-5 pt-6 rounded-xl border border-white/10 backdrop-blur-sm shadow-lg transform transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-900/10 relative overflow-hidden">
                              {/* Subtle card pattern */}
                              <div className="absolute inset-0 opacity-5">
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                  <defs>
                                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                                    </pattern>
                                  </defs>
                                  <rect width="100" height="100" fill="url(#grid)" />
                                </svg>
                              </div>
                              
                              {/* Enhanced Star Rating with Animation */}
                              <div className="flex mb-3">
                                {[1,2,3,4,5].map((star, index) => (
                                  <div key={star} className="relative mr-1.5" style={{ animationDelay: `${index * 100}ms` }}>
                                    {/* Star glow effect */}
                                    <div className="absolute inset-0 bg-amber-400/30 blur-md rounded-full -z-10 scale-75"></div>
                                    <Star className="w-4 h-4 fill-amber-300 text-amber-300 filter drop-shadow-lg" />
                                  </div>
                                ))}
                              </div>
                              
                              {/* Enhanced Quote with Proper Typography */}
                              <p className="text-indigo-100 italic text-lg leading-relaxed font-light tracking-wide pl-2 border-l-2 border-indigo-500/30">
                                "{testimonial.quote}"
                              </p>
                            </div>
                            
                            {/* Enhanced Author Section with Premium Styling */}
                            <div className="flex items-center mt-2">
                              {/* Premium Avatar with 3D Effect */}
                              <div className="relative transform-gpu transition-all duration-300 hover:scale-105">
                                {/* Layered glow effects */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full blur-sm opacity-80 animate-pulse"></div>
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full blur-sm"></div>
                                
                                {/* Actual avatar with depth */}
                                <div className="w-14 h-14 rounded-full relative z-10 p-0.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 shadow-xl shadow-indigo-900/30">
                                  <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-900 to-blue-900 flex items-center justify-center text-white text-lg font-bold overflow-hidden">
                                    {/* Inner light effect */}
                                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-white/20 blur-sm rounded-full"></div>
                                    <span className="z-10 text-lg font-bold">{testimonial.author.charAt(0)}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Enhanced Author Details with Premium Typography */}
                              <div className="ml-4">
                                <p className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-blue-200 font-bold text-lg tracking-wide">
                                  {testimonial.author}
                                </p>
                                <div className="flex items-center mt-0.5">
                                  {/* Professional role with premium styling */}
                                  <div className="flex items-center">
                                    <div className="h-3 w-0.5 bg-gradient-to-b from-indigo-400 to-blue-400 mr-2"></div>
                                    <p className="text-indigo-200/90 font-medium text-sm">{testimonial.role}</p>
                                  </div>
                                  
                                  {/* Premium Verification Badge */}
                                  <div className="ml-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 text-xs text-white flex items-center shadow-inner">
                                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 mr-1 shadow-sm shadow-emerald-600/50"></div>
                                    <span className="font-medium">Elite Member</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Premium Navigation Button with 3D Effect */}
                              <button 
                                className="ml-auto group relative overflow-hidden"
                                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                              >
                                {/* Button glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-blue-600/80 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                                
                                {/* Button with premium styling */}
                                <div className="relative bg-gradient-to-r from-indigo-600/30 to-blue-600/30 group-hover:from-indigo-600/50 group-hover:to-blue-600/50 p-3 rounded-full border border-white/10 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-indigo-900/20 z-10">
                                  <ArrowRight className="h-4 w-4 text-white group-hover:text-white transition-colors" />
                                </div>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Premium Status Indicator with Enhanced Design */}
                    <div className="absolute bottom-3 right-3">
                      <div className="flex items-center bg-gradient-to-r from-indigo-500/10 to-blue-500/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
                        <div className="flex items-center mr-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1 animate-pulse"></div>
                          <span className="text-xs font-medium text-indigo-200/90">Live Updates</span>
                        </div>
                        <div className="h-3 w-px bg-white/20 mx-1"></div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1 text-indigo-300" />
                          <span className="text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-blue-200">25,000+ success stories</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Authentication form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-gray-50">
        {/* Mobile logo header */}
        <header className="px-6 py-4 flex items-center justify-center lg:hidden border-b bg-white">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-2 rounded-lg mr-2">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
            </div>
            <span className="font-extrabold text-xl">ELITELEARN</span>
          </div>
        </header>
        
        <div className="flex-1 flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            {/* Premium welcome message with animation */}
            <div className={`mb-8 text-center transition-all duration-700 ${animateOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <h2 className="text-3xl font-bold mb-2 text-gray-900 relative inline-block">
                {activeTab === "signin" ? (
                  <>
                    Welcome 
                    <span className="inline-block relative ml-1">
                      back
                      <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transform origin-left animate-slideDown"></span>
                    </span>
                  </>
                ) : (
                  <>
                    Join 
                    <span className="inline-block relative ml-1">
                      EliteLearn
                      <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transform origin-left animate-slideDown"></span>
                    </span>
                  </>
                )}
              </h2>
              <p className="text-gray-600 animate-fadeIn" style={{ animationDelay: '300ms' }}>
                {activeTab === "signin" 
                  ? "Sign in to access your premium learning experience" 
                  : "Create your account and start your professional journey"}
              </p>
            </div>
            
            {/* Premium card with glassmorphism and subtle shadow */}
            <div className="relative">
              {/* Animated background blur */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl opacity-20 blur-lg"></div>
              
              <Card className="relative bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-xl overflow-hidden">
                {/* Tab navigation with premium styling */}
                <div className="flex bg-gray-50 p-1 rounded-t-xl relative">
                  {/* Tab indicator slide effect */}
                  <div 
                    className="absolute top-1 bottom-1 rounded-lg bg-white shadow-sm transition-all duration-500 ease-out-expo"
                    style={{ 
                      left: activeTab === "signin" ? "0.25rem" : "50%", 
                      right: activeTab === "signin" ? "50%" : "0.25rem",
                      transform: activeTab === "signin" ? "translateX(0)" : "translateX(0)"
                    }}
                  ></div>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => handleTabChange("signin")} 
                    className={`flex-1 rounded-lg h-12 font-medium z-10 transition-all duration-500 ${
                      activeTab === "signin" 
                        ? 'text-indigo-700' 
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-white/50'
                    }`}
                  >
                    <span className="relative overflow-hidden inline-block">
                      Sign In
                      {activeTab === "signin" && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 animate-slideDown"></span>
                      )}
                    </span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleTabChange("signup")} 
                    className={`flex-1 rounded-lg h-12 font-medium z-10 transition-all duration-500 ${
                      activeTab === "signup" 
                        ? 'text-indigo-700' 
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-white/50'
                    }`}
                  >
                    <span className="relative overflow-hidden inline-block">
                      Create Account
                      {activeTab === "signup" && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 animate-slideDown"></span>
                      )}
                    </span>
                  </Button>
                </div>
                
                <CardContent className="p-8">
                  {/* Form with slide transition */}
                  <div className={`transition-all duration-500 ${animateOut ? 'opacity-0 translate-x-12' : 'opacity-100 translate-x-0'}`}>
                    {activeTab === "signin" ? (
                      <div className="space-y-6">
                        <CommonForm
                          formControls={signInFormControls}
                          buttonText={isLoading ? "Signing In..." : "Sign In"}
                          formData={signInFormData}
                          setFormData={setSignInFormData}
                          isButtonDisabled={!checkIfSignInFormIsValid() || isLoading}
                          handleSubmit={handleLoginUser}
                        />
                        
                        <div className="relative flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                          </div>
                          <div className="relative bg-white px-4 text-sm text-gray-500">Or continue with</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            type="button" 
                            className="border-gray-300 hover:bg-gray-50 text-gray-700 group relative overflow-hidden transition-all duration-300"
                          >
                            {/* Hover animation */}
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-50 to-blue-100 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            
                            <span className="relative z-10 flex items-center justify-center">
                              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                              </svg>
                              <span className="transition-transform duration-300 group-hover:translate-x-1">Google</span>
                            </span>
                          </Button>
                          <Button 
                            variant="outline" 
                            type="button" 
                            className="border-gray-300 hover:bg-gray-50 text-gray-700 group relative overflow-hidden transition-all duration-300"
                          >
                            {/* Hover animation */}
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-50 to-gray-100 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            
                            <span className="relative z-10 flex items-center justify-center">
                              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.451 14.095c-.212.639-.491 1.236-.838 1.789-.545.864-1.194 1.599-1.947 2.204-.847.68-1.605 1.04-2.272 1.079-.582.04-1.192-.137-1.831-.53-.639-.392-1.222-.588-1.75-.588-.561 0-1.151.196-1.77.588-.62.393-1.219.577-1.799.55-.655-.025-1.413-.378-2.272-1.058-.795-.647-1.459-1.394-1.993-2.24-.6-.946-1.087-1.993-1.459-3.139-.403-1.255-.604-2.47-.604-3.647 0-1.346.29-2.518.87-3.517.452-.807 1.052-1.447 1.803-1.92.751-.472 1.561-.716 2.429-.734.598 0 1.383.189 2.356.566.972.377 1.598.566 1.875.566.205 0 .902-.223 2.092-.67 1.121-.412 2.067-.583 2.839-.514 2.092.169 3.663 1 4.712 2.492-1.871 1.135-2.797 2.723-2.776 4.764.018 1.589.593 2.912 1.724 3.968.512.493 1.085.875 1.719 1.147-.138.4-.285.782-.442 1.144zM18.163 2.4c0 1.246-.456 2.41-1.367 3.492-.11.012-.172.024-.185.036-1.102 1.016-2.438 1.607-3.785 1.514-.018-.169-.028-.338-.028-.508 0-1.281.511-2.505 1.408-3.554.444-.54.1-.987 1.67-1.342.67-.354 1.31-.551 1.92-.59.018.185.028.367.028.553.001.136-.002.274-.009.409z" />
                              </svg>
                              <span className="transition-transform duration-300 group-hover:translate-x-1">Apple</span>
                            </span>
                          </Button>
                        </div>
                        
                        <div className="text-center text-sm text-gray-600">
                          <div className="flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span>Secure, encrypted connection</span>
                          </div>
                          
                          <div className="mt-4">
                            <span>Don't have an account? </span>
                            <button 
                              onClick={() => handleTabChange("signup")} 
                              className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors relative group"
                            >
                              <span className="relative z-10">Sign up now</span>
                              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <CommonForm
                          formControls={signUpFormControls}
                          buttonText={isLoading ? "Creating Account..." : "Create Account"}
                          formData={signUpFormData}
                          setFormData={setSignUpFormData}
                          isButtonDisabled={!checkIfSignUpFormIsValid() || isLoading}
                          handleSubmit={handleRegisterUser}
                        />
                        
                        <div className="relative flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                          </div>
                          <div className="relative bg-white px-4 text-sm text-gray-500">Or continue with</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            type="button" 
                            className="border-gray-300 hover:bg-gray-50 text-gray-700"
                          >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                          </Button>
                          <Button 
                            variant="outline" 
                            type="button" 
                            className="border-gray-300 hover:bg-gray-50 text-gray-700"
                          >
                            <svg className="w-5 h-5 mr-2 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M22.451 14.095c-.212.639-.491 1.236-.838 1.789-.545.864-1.194 1.599-1.947 2.204-.847.68-1.605 1.04-2.272 1.079-.582.04-1.192-.137-1.831-.53-.639-.392-1.222-.588-1.75-.588-.561 0-1.151.196-1.77.588-.62.393-1.219.577-1.799.55-.655-.025-1.413-.378-2.272-1.058-.795-.647-1.459-1.394-1.993-2.24-.6-.946-1.087-1.993-1.459-3.139-.403-1.255-.604-2.47-.604-3.647 0-1.346.29-2.518.87-3.517.452-.807 1.052-1.447 1.803-1.92.751-.472 1.561-.716 2.429-.734.598 0 1.383.189 2.356.566.972.377 1.598.566 1.875.566.205 0 .902-.223 2.092-.67 1.121-.412 2.067-.583 2.839-.514 2.092.169 3.663 1 4.712 2.492-1.871 1.135-2.797 2.723-2.776 4.764.018 1.589.593 2.912 1.724 3.968.512.493 1.085.875 1.719 1.147-.138.4-.285.782-.442 1.144zM18.163 2.4c0 1.246-.456 2.41-1.367 3.492-.11.012-.172.024-.185.036-1.102 1.016-2.438 1.607-3.785 1.514-.018-.169-.028-.338-.028-.508 0-1.281.511-2.505 1.408-3.554.444-.54.1-.987 1.67-1.342.67-.354 1.31-.551 1.92-.59.018.185.028.367.028.553.001.136-.002.274-.009.409z" />
                            </svg>
                            Apple
                          </Button>
                        </div>
                        
                        <div className="mt-2 text-center">
                          <p className="text-xs text-gray-500">
                            By signing up, you agree to our 
                            <a href="#" className="text-indigo-600 hover:text-indigo-500 mx-1">Terms of Service</a> 
                            and 
                            <a href="#" className="text-indigo-600 hover:text-indigo-500 mx-1">Privacy Policy</a>
                          </p>
                        </div>
                        
                        <div className="text-center text-sm text-gray-600 mt-4">
                          <div className="flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span>Secure, encrypted connection</span>
                          </div>
                          
                          <div className="mt-4">
                            <span>Already have an account? </span>
                            <button 
                              onClick={() => handleTabChange("signin")} 
                              className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors relative group"
                            >
                              <span className="relative z-10">Sign in</span>
                              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Trust badges */}
            <div className="mt-10">
              <div className="text-center text-sm text-gray-500 mb-4">Trusted by leading companies worldwide</div>
              <div className="flex justify-center space-x-6 grayscale opacity-70">
                <div className="w-16">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                  </svg>
                </div>
                <div className="w-16">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                    <path d="M9.5 3C4.81 3 1 6.81 1 11.5 1 16.19 4.81 20 9.5 20h5c4.69 0 8.5-3.81 8.5-8.5C23 6.81 19.19 3 14.5 3h-5zm0 2h5c3.59 0 6.5 2.91 6.5 6.5S18.09 18 14.5 18h-5C5.91 18 3 15.09 3 11.5S5.91 5 9.5 5zm0 2C7.01 7 5 9.01 5 11.5S7.01 16 9.5 16 14 13.99 14 11.5 11.99 7 9.5 7z" />
                  </svg>
                </div>
                <div className="w-16">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                    <path d="M22 17.607c-.786 2.28-3.139 6.317-5.563 6.361-1.608.031-2.125-.953-3.963-.953-1.837 0-2.412.923-3.932.983-2.572.099-6.542-5.827-6.542-10.995 0-4.747 3.308-7.1 6.198-7.143 1.55-.028 3.014 1.045 3.959 1.045.949 0 2.727-1.29 4.596-1.101.782.033 2.979.315 4.389 2.377-3.741 2.442-3.158 7.549.858 9.426zm-5.222-17.607c-2.826.114-5.132 3.079-4.81 5.531 2.612.203 5.118-2.725 4.81-5.531z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="py-4 px-8 border-t text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} EliteLearn. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
