import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { BookOpen, Check, Clock, Info, Loader2, Play, Search, Tag, User, Watch } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FadeIn, ScaleIn, SlideIn, StaggerContainer } from "@/components/ui/animations";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [courseStats, setCourseStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0
  });

  async function fetchStudentBoughtCourses() {
    setIsLoading(true);
    try {
      const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
      if (response?.success) {
        const courses = response?.data || [];
        setStudentBoughtCoursesList(courses);
        
        // Calculate course statistics
        const completed = courses.filter(course => course.progress === 100).length;
        const inProgress = courses.filter(course => course.progress > 0 && course.progress < 100).length;
        
        setCourseStats({
          total: courses.length,
          inProgress,
          completed
        });
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  // Filter courses based on search query and active tab
  const filteredCourses = studentBoughtCoursesList?.filter(course => {
    const matchesSearch = course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course?.instructorName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "in-progress") return matchesSearch && course.progress > 0 && course.progress < 100;
    if (activeTab === "completed") return matchesSearch && course.progress === 100;
    if (activeTab === "not-started") return matchesSearch && course.progress === 0;
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                My Learning Journey
              </h1>
              <p className="text-slate-500 mt-1">
                Track your progress and continue learning from where you left off
              </p>
            </div>
            
            <div className="relative w-full md:w-auto">
              <Input 
                type="search"
                placeholder="Search your courses..."
                className="pl-9 pr-4 py-2 w-full md:w-[280px] bg-white/90 border-gray-200 focus:border-indigo-500 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </FadeIn>
        
        <SlideIn direction="up" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
              title="Total Courses"
              value={courseStats.total}
              icon={<BookOpen className="h-5 w-5 text-indigo-600" />}
              bgColor="bg-indigo-50"
              textColor="text-indigo-600"
            />
            <StatCard 
              title="In Progress"
              value={courseStats.inProgress}
              icon={<Clock className="h-5 w-5 text-amber-600" />}
              bgColor="bg-amber-50"
              textColor="text-amber-600"
            />
            <StatCard 
              title="Completed"
              value={courseStats.completed}
              icon={<Check className="h-5 w-5 text-emerald-600" />}
              bgColor="bg-emerald-50"
              textColor="text-emerald-600"
            />
            <StatCard 
              title="Instructors"
              value={[...new Set(studentBoughtCoursesList?.map(c => c.instructorName))].length}
              icon={<User className="h-5 w-5 text-purple-600" />}
              bgColor="bg-purple-50"
              textColor="text-purple-600"
            />
          </div>
        </SlideIn>
        
        <ScaleIn>
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="bg-white border border-gray-200 p-1 shadow-sm">
              <TabsTrigger value="all" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                All Courses
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
                In Progress
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                Completed
              </TabsTrigger>
              <TabsTrigger value="not-started" className="data-[state=active]:bg-gray-50 data-[state=active]:text-gray-700">
                Not Started
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </ScaleIn>
        
        <AnimatePresence>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-slate-500">Loading your courses...</p>
            </div>
          ) : filteredCourses && filteredCourses.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course, index) => (
                <CourseCard key={course.id || index} course={course} navigate={navigate} />
              ))}
            </StaggerContainer>
          ) : (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
              <Info className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                {searchQuery ? "No courses match your search" : "No courses found"}
              </h3>
              <p className="text-slate-500 mb-6 max-w-md">
                {searchQuery 
                  ? "Try adjusting your search query or browse our course catalog for more options"
                  : "Explore our course catalog to find the perfect course for you"}
              </p>
              <Button onClick={() => navigate("/courses")} variant="outline">
                Browse Course Catalog
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, bgColor, textColor }) {
  return (
    <div className={`${bgColor} p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4`}>
      <div className="rounded-full bg-white p-3 shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold mb-0.5">{value}</h3>
        <p className={`text-sm ${textColor}`}>{title}</p>
      </div>
    </div>
  );
}

// Course Card Component
function CourseCard({ course, navigate }) {
  // Calculate progress percentage
  const progress = course.progress || 0;
  
  // Determine the status badge
  let statusBadge;
  if (progress === 100) {
    statusBadge = <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Completed</Badge>;
  } else if (progress > 0) {
    statusBadge = <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">In Progress</Badge>;
  } else {
    statusBadge = <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Not Started</Badge>;
  }
  
  // Format the last accessed date if available
  const lastAccessed = course.lastAccessed 
    ? new Date(course.lastAccessed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex flex-col h-full overflow-hidden group border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300">
        <div className="relative">
          <img
            src={course?.courseImage || 'https://placehold.co/600x400/e2e8f0/1e293b?text=Course+Image'}
            alt={course?.title}
            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
          <div className="absolute bottom-3 left-3 flex gap-2">
            {statusBadge}
            {course.category && (
              <Badge variant="outline" className="bg-white/80 backdrop-blur-sm text-slate-800 border-white/20">
                <Tag className="h-3 w-3 mr-1" />
                {course.category}
              </Badge>
            )}
          </div>
          
          {progress > 0 && progress < 100 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        
        <CardContent className="p-5 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-800 line-clamp-2">{course?.title}</h3>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <User className="h-3.5 w-3.5 text-slate-500" />
            <p className="text-sm text-slate-600">
              {course?.instructorName || 'Unknown Instructor'}
            </p>
          </div>
          
          {lastAccessed && (
            <p className="text-xs text-slate-500 mb-2">
              Last accessed: {lastAccessed}
            </p>
          )}
          
          {progress > 0 && (
            <div className="flex justify-between items-center text-xs text-slate-600 mt-2">
              <span>{progress}% complete</span>
              {course.estimatedTimeLeft && (
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {course.estimatedTimeLeft} left
                </span>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={() => navigate(`/course-progress/${course?.courseId}`)}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            {progress === 0 ? (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Learning
              </>
            ) : progress === 100 ? (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                Review Course
              </>
            ) : (
              <>
                <Watch className="mr-2 h-4 w-4" />
                Continue Learning
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default StudentCoursesPage;
