import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  BookOpen, 
  Award, 
  Download, 
  Info, 
  Clock, 
  CheckCircle, 
  Coffee,
  Zap,
  Users
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState("content");
  const [sectionExpandedState, setSectionExpandedState] = useState({});
  const { id } = useParams();

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!studentCurrentCourseProgress?.progress || !studentCurrentCourseProgress?.courseDetails?.curriculum) {
      return 0;
    }
    
    const completedLectures = studentCurrentCourseProgress.progress.filter(item => item.viewed).length;
    const totalLectures = studentCurrentCourseProgress.courseDetails.curriculum.length;
    
    return Math.round((completedLectures / totalLectures) * 100);
  };

  const progressPercentage = calculateProgress();
  
  // Group curriculum into sections
  const curriculumSections = studentCurrentCourseProgress?.courseDetails?.curriculum?.reduce((acc, item, index) => {
    const sectionIndex = Math.floor(index / 5);
    
    if (!acc[sectionIndex]) {
      acc[sectionIndex] = {
        title: `Section ${sectionIndex + 1}`,
        lectures: []
      };
    }
    
    acc[sectionIndex].lectures.push(item);
    return acc;
  }, []);

  const toggleSection = (sectionIndex) => {
    setSectionExpandedState(prev => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex]
    }));
  };

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          
          // Expand the first section by default
          setSectionExpandedState({ 0: true });
        } else {
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          const nextLectureIndex = lastIndexOfViewedAsTrue + 1;
          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
              nextLectureIndex < response?.data?.courseDetails?.curriculum.length 
                ? nextLectureIndex 
                : 0
            ]
          );
          
          // Expand the section containing the current lecture
          const sectionIndex = Math.floor(nextLectureIndex / 5);
          setSectionExpandedState({ [sectionIndex]: true });
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }
  
  function selectLecture(lecture) {
    setCurrentLecture(lecture);
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 10000);
  }, [showConfetti]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      {/* Premium Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            variant="ghost"
            size="sm"
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            My Courses
          </Button>
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-gray-900 truncate max-w-lg">
              {studentCurrentCourseProgress?.courseDetails?.title}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center rounded-full px-4 py-1.5" 
            style={{
              background: "linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(16, 185, 129, 0.15) 100%)",
              boxShadow: "0 2px 4px rgba(5, 150, 105, 0.05)"
            }}>
            <div className="flex items-center mr-2">
              <div className="w-2 h-2 bg-emerald-600 rounded-full mr-1"></div>
              <span className="text-xs font-medium text-emerald-700">LEARNING IN PROGRESS</span>
            </div>
            <div className="h-5 w-[1px] bg-emerald-200 mx-2"></div>
            <div className="flex items-center">
              <span className="text-sm font-bold text-emerald-700">{progressPercentage}% Complete</span>
            </div>
          </div>

          <Button 
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            variant="outline"
            size="sm"
            className="border-gray-200 rounded-full shadow-sm hover:shadow transition-all"
          >
            {isSideBarOpen ? (
              <>
                <ChevronRight className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Hide Sidebar</span>
              </>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Show Sidebar</span>
              </>
            )}
          </Button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video and Content Area */}
        <AnimatePresence initial={false}>
          <motion.div
            key={`main-${isSideBarOpen}`}
            className="flex-1 overflow-y-auto"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{ 
              width: isSideBarOpen ? 'calc(100% - 380px)' : '100%'
            }}
          >
            {/* Video Player */}
            <div className="bg-gray-950 aspect-video max-h-[calc(100vh-160px)] relative shadow-lg">
              <VideoPlayer
                width="100%"
                height="100%"
                url={currentLecture?.videoUrl}
                onProgressUpdate={setCurrentLecture}
                progressData={currentLecture}
              />
              
              {/* Progress Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  style={{ width: `${currentLecture?.progressValue * 100 || 0}%` }}
                ></div>
              </div>
            </div>
            
            {/* Content Below Video */}
            <div className="p-6 md:p-8 max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentLecture?.title}
                  </h2>
                  
                  {/* Progress Circular Badge */}
                  <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-gray-100">
                    <div className="relative h-8 w-8 mr-2">
                      <svg className="h-full w-full" viewBox="0 0 36 36">
                        <path
                          className="stroke-current text-gray-200"
                          fill="none"
                          strokeWidth="3"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="stroke-current text-emerald-500"
                          fill="none"
                          strokeWidth="3"
                          strokeDasharray={`${progressPercentage}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-emerald-700">
                        {progressPercentage}%
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 pr-2">Progress</span>
                  </div>
                </div>
                
                <div className="flex items-center flex-wrap gap-2 mb-5">
                  {currentLecture && (
                    studentCurrentCourseProgress?.progress?.find(
                      (progressItem) => progressItem.lectureId === currentLecture._id
                    )?.viewed ? (
                      <Badge variant="success" className="font-medium">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="info" className="font-medium">
                        <Clock className="h-3 w-3 mr-1" />
                        In Progress
                      </Badge>
                    )
                  )}
                  
                  <Badge variant="secondary" className="font-medium">
                    <Info className="h-3 w-3 mr-1" />
                    Lecture {studentCurrentCourseProgress?.courseDetails?.curriculum.findIndex(
                      item => item._id === currentLecture?._id
                    ) + 1} of {studentCurrentCourseProgress?.courseDetails?.curriculum.length}
                  </Badge>
                </div>
                
                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm mb-8">
                  <div className="flex items-center mb-3">
                    <Award className="h-5 w-5 text-emerald-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Your Progress</h3>
                  </div>
                  
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-medium">{progressPercentage}% complete</span>
                    <span>{studentCurrentCourseProgress?.progress?.filter(item => item.viewed).length} of {studentCurrentCourseProgress?.courseDetails?.curriculum.length} lectures</span>
                  </div>
                </div>
              </div>
              
              {/* Notes and Resources Section */}
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 mb-8 border border-teal-100 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-emerald-600" />
                  Lecture Notes
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {currentLecture?.title} covers essential concepts for mastering this topic. 
                  Make sure to practice the techniques demonstrated in this lecture.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-start shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                    <Download className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Resources</h4>
                      <p className="text-sm text-gray-600">Download the lecture resources to practice</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-start shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                    <Coffee className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Take a Break</h4>
                      <p className="text-sm text-gray-600">Remember to take breaks between lectures</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mb-8">
                <Button 
                  variant="outline"
                  className="border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                  onClick={() => {
                    const currentIndex = studentCurrentCourseProgress?.courseDetails?.curriculum.findIndex(
                      item => item._id === currentLecture?._id
                    );
                    
                    if (currentIndex > 0) {
                      const prevLecture = studentCurrentCourseProgress?.courseDetails?.curriculum[currentIndex - 1];
                      setCurrentLecture(prevLecture);
                    }
                  }}
                  disabled={studentCurrentCourseProgress?.courseDetails?.curriculum.findIndex(
                    item => item._id === currentLecture?._id
                  ) === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous Lecture
                </Button>
                
                <Button 
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg shadow-sm"
                  onClick={() => {
                    const currentIndex = studentCurrentCourseProgress?.courseDetails?.curriculum.findIndex(
                      item => item._id === currentLecture?._id
                    );
                    
                    if (currentIndex < studentCurrentCourseProgress?.courseDetails?.curriculum.length - 1) {
                      const nextLecture = studentCurrentCourseProgress?.courseDetails?.curriculum[currentIndex + 1];
                      setCurrentLecture(nextLecture);
                    }
                  }}
                  disabled={studentCurrentCourseProgress?.courseDetails?.curriculum.findIndex(
                    item => item._id === currentLecture?._id
                  ) === studentCurrentCourseProgress?.courseDetails?.curriculum.length - 1}
                >
                  Next Lecture
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {isSideBarOpen && (
            <motion.div
              key="sidebar"
              className="w-[380px] border-l border-gray-200 bg-white overflow-hidden flex flex-col"
              initial={{ x: 380, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 380, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Tabs 
                value={currentTab} 
                onValueChange={setCurrentTab}
                className="h-full flex flex-col"
              >
                <TabsList className="bg-gray-100 w-full grid grid-cols-2 p-1 rounded-none">
                  <TabsTrigger 
                    value="content" 
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Course Content
                  </TabsTrigger>
                  <TabsTrigger 
                    value="overview" 
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                </TabsList>
                
                {/* Course Content Tab */}
                <TabsContent value="content" className="flex-1 overflow-hidden p-0 m-0">
                  <ScrollArea className="h-full">
                    <div className="divide-y">
                      {curriculumSections?.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="border-b border-gray-200">
                          <button
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors focus:outline-none"
                            onClick={() => toggleSection(sectionIndex)}
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                                <BookOpen className="h-4 w-4 text-emerald-700" />
                              </div>
                              <div className="text-left">
                                <h3 className="font-medium text-gray-900">
                                  {section.title}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {section.lectures.length} lectures
                                </p>
                              </div>
                            </div>
                            {sectionExpandedState[sectionIndex] ? (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                          
                          {sectionExpandedState[sectionIndex] && (
                            <div className="pl-16 pr-4 pb-4 space-y-2">
                              {section.lectures.map((lecture, lectureIndex) => {
                                const isCurrentLecture = lecture._id === currentLecture?._id;
                                const isCompleted = studentCurrentCourseProgress?.progress?.find(
                                  (progressItem) => progressItem.lectureId === lecture._id
                                )?.viewed;
                                
                                return (
                                  <button
                                    key={lectureIndex}
                                    className={`w-full text-left py-2 px-3 rounded-md flex items-center transition-colors ${
                                      isCurrentLecture 
                                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-900 shadow-sm' 
                                        : isCompleted
                                          ? 'text-gray-700 hover:bg-gray-50'
                                          : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                    onClick={() => selectLecture(lecture)}
                                  >
                                    <div className="mr-3 flex-shrink-0">
                                      {isCompleted ? (
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
                                          <Check className="h-3 w-3 text-emerald-600" />
                                        </div>
                                      ) : isCurrentLecture ? (
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center shadow-sm">
                                          <Play className="h-3 w-3 text-white" />
                                        </div>
                                      ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                                          <Play className="h-3 w-3 text-gray-600" />
                                        </div>
                                      )}
                                    </div>
                                    <span className={`text-sm ${isCurrentLecture ? 'font-medium' : ''}`}>
                                      {lecture.title}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="flex-1 overflow-hidden p-0 m-0">
                  <ScrollArea className="h-full">
                    <div className="p-6">
                      <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About This Course</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {studentCurrentCourseProgress?.courseDetails?.description}
                        </p>
                        
                        <div className="grid grid-cols-1 gap-4 mt-6">
                          <div className="bg-white p-4 rounded-lg flex items-start shadow-sm border border-gray-200">
                            <div className="bg-emerald-100 p-2 rounded-full mr-3">
                              <Users className="h-5 w-5 text-emerald-700" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Students</h4>
                              <p className="text-sm text-gray-600">
                                {studentCurrentCourseProgress?.courseDetails?.students?.length || 0} enrolled
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg flex items-start">
                            <BookOpen className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-gray-900">Lectures</h4>
                              <p className="text-sm text-gray-600">
                                {studentCurrentCourseProgress?.courseDetails?.curriculum?.length || 0} total lectures
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Zap className="h-5 w-5 mr-2 text-indigo-600" />
                          What You'll Learn
                        </h3>
                        
                        <ul className="space-y-3">
                          {studentCurrentCourseProgress?.courseDetails?.objectives
                            .split(",")
                            .map((objective, index) => (
                              <li key={index} className="flex items-start">
                                <div className="mt-1 mr-3 flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100">
                                  <Check className="h-3 w-3 text-indigo-600" />
                                </div>
                                <span className="text-gray-700">{objective.trim()}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Award className="h-5 w-5 mr-2 text-indigo-600" />
                          Your Progress
                        </h3>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div 
                              className="bg-gradient-to-r from-indigo-600 to-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{progressPercentage}% complete</span>
                            <span>{studentCurrentCourseProgress?.progress?.filter(item => item.viewed).length} of {studentCurrentCourseProgress?.courseDetails?.curriculum.length} lectures</span>
                          </div>
                          
                          {progressPercentage === 100 && (
                            <div className="mt-4 bg-emerald-50 p-3 rounded-md border border-emerald-100">
                              <div className="flex items-center">
                                <Award className="h-5 w-5 text-emerald-600 mr-2" />
                                <p className="text-sm font-medium text-emerald-800">
                                  Congratulations! You've completed this course.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lock Course Dialog */}
      <Dialog open={lockCourse}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900">Course Access Restricted</DialogTitle>
            <DialogDescription className="text-gray-600">
              You need to purchase this course to access its content.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
              <Lock className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-700 mb-6">
              This premium content is available for enrolled students only. 
              Return to the course page to purchase this course.
            </p>
            
            <Button 
              onClick={() => navigate(`/course/details/${id}`)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Go to Course Page
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Course Completion Dialog */}
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-gray-900">🎉 Congratulations!</DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              You have successfully completed this course
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center">
              <Award className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {studentCurrentCourseProgress?.courseDetails?.title}
            </h3>
            <p className="text-gray-600">
              You've mastered all {studentCurrentCourseProgress?.courseDetails?.curriculum?.length} lectures
            </p>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row sm:justify-center gap-4">
            <Button 
              variant="outline"
              className="border-gray-200 text-gray-700"
              onClick={() => navigate("/student-courses")}
            >
              My Courses
            </Button>
            <Button 
              onClick={handleRewatchCourse}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Rewatch Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;


