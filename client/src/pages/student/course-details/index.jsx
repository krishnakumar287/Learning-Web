import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Globe, 
  Lock, 
  PlayCircle, 
  Clock, 
  User, 
  BarChart, 
  Award, 
  ChevronDown,
  ChevronRight,
  BookOpen,
  Star,
  DownloadCloud 
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreatePayment() {
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApprovalUrl(response?.data?.approveUrl);
    }
  }

  const toggleSection = (sectionIndex) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex]
    }));
  };

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details"))
      setStudentViewCourseDetails(null),
        setCurrentCourseDetailsId(null),
        setCoursePurchaseId(null);
  }, [location.pathname]);

  if (loadingState) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton className="h-40 w-full rounded-xl mb-8" />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-grow">
            <Skeleton className="h-64 w-full rounded-xl mb-6" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
          <div className="w-full md:w-[400px]">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;

  // Group curriculum into sections
  const curriculumSections = studentViewCourseDetails?.curriculum?.reduce((acc, item, index) => {
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

  // Calculate total course length
  const totalLectures = studentViewCourseDetails?.curriculum?.length || 0;
  
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen pb-16">
      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 text-white p-12 md:p-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-grow max-w-3xl">
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {studentViewCourseDetails?.title}
              </motion.h1>
              <motion.p 
                className="text-xl mb-6 text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {studentViewCourseDetails?.subtitle}
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap items-center gap-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="bg-blue-700/40 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                  <Award className="mr-2 h-4 w-4 text-yellow-300" />
                  <span className="text-blue-100">Bestseller</span>
                </div>
                
                <div className="bg-blue-700/40 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                  <Star className="mr-2 h-4 w-4 text-yellow-300" />
                  <span className="text-blue-100">4.8 Rating</span>
                </div>
                
                <div className="bg-blue-700/40 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                  <User className="mr-2 h-4 w-4 text-blue-100" />
                  <span className="text-blue-100">
                    {studentViewCourseDetails?.students.length}{" "}
                    {studentViewCourseDetails?.students.length <= 1
                      ? "Student"
                      : "Students"}
                  </span>
                </div>
                
                <div className="bg-blue-700/40 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-blue-100" />
                  <span className="text-blue-100">{studentViewCourseDetails?.primaryLanguage}</span>
                </div>
                
                <div className="bg-blue-700/40 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-blue-100" />
                  <span className="text-blue-100">{totalLectures} lectures</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl mr-3 border-2 border-white shadow-lg">
                  {studentViewCourseDetails?.instructorName?.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-medium">
                    Created by <span className="font-bold">{studentViewCourseDetails?.instructorName}</span>
                  </p>
                  <p className="text-sm text-blue-200">
                    Last updated {new Date(studentViewCourseDetails?.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="md:w-[450px] lg:w-[500px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video w-full">
                    <VideoPlayer
                      url={
                        getIndexOfFreePreviewUrl !== -1
                          ? studentViewCourseDetails?.curriculum[
                              getIndexOfFreePreviewUrl
                            ].videoUrl
                          : ""
                      }
                      width="100%"
                      height="100%"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-4xl font-bold">${studentViewCourseDetails?.pricing}</span>
                        <span className="text-xl line-through text-blue-300">$199.99</span>
                      </div>
                      <p className="text-blue-200 mb-1">92% discount • 3 days left at this price!</p>
                    </div>
                    
                    <Button 
                      onClick={handleCreatePayment} 
                      className="w-full mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-6 text-lg font-bold rounded-lg shadow-lg transition-all duration-300 border-0"
                    >
                      Enroll Now
                    </Button>
                    
                    <p className="text-center text-sm text-blue-200 mb-4">30-Day Money-Back Guarantee</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-3 text-blue-300" />
                        <span className="text-blue-100">{totalLectures} lessons</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-3 text-blue-300" />
                        <span className="text-blue-100">Full lifetime access</span>
                      </div>
                      <div className="flex items-center">
                        <DownloadCloud className="h-5 w-5 mr-3 text-blue-300" />
                        <span className="text-blue-100">Access on mobile and TV</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-5 w-5 mr-3 text-blue-300" />
                        <span className="text-blue-100">Certificate of completion</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto p-6 md:p-12">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-grow">
            <motion.section 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                  <CardTitle className="text-2xl text-indigo-900">What you'll learn</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studentViewCourseDetails?.objectives
                      .split(",")
                      .map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mt-1 mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100">
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="text-gray-700">{objective.trim()}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.section>

            <motion.section 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                  <CardTitle className="text-2xl text-indigo-900">Course Description</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="prose prose-blue max-w-none text-gray-700">
                    {studentViewCourseDetails?.description}
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            <motion.section 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                  <CardTitle className="text-2xl text-indigo-900">Course Curriculum</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {curriculumSections?.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="border-b border-gray-200">
                        <button
                          className="w-full flex items-center justify-between p-6 focus:outline-none"
                          onClick={() => toggleSection(sectionIndex)}
                        >
                          <div className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-3 text-indigo-600" />
                            <h3 className="text-lg font-medium text-gray-900">
                              {section.title}
                              <span className="ml-2 text-sm text-gray-500">({section.lectures.length} lectures)</span>
                            </h3>
                          </div>
                          {expandedSections[sectionIndex] ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        
                        {expandedSections[sectionIndex] && (
                          <div className="px-6 pb-6 space-y-4">
                            {section.lectures.map((lecture, lectureIndex) => (
                              <div 
                                key={lectureIndex}
                                className={`flex items-center p-3 rounded-lg ${
                                  lecture?.freePreview
                                    ? 'cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors'
                                    : 'bg-gray-50'
                                }`}
                                onClick={
                                  lecture?.freePreview
                                    ? () => handleSetFreePreview(lecture)
                                    : null
                                }
                              >
                                <div className="mr-3 flex-shrink-0">
                                  {lecture?.freePreview ? (
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                      <PlayCircle className="h-5 w-5 text-indigo-600" />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                      <Lock className="h-4 w-4 text-gray-600" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h4 className={`font-medium ${lecture?.freePreview ? 'text-indigo-900' : 'text-gray-700'}`}>
                                    {lecture?.title}
                                  </h4>
                                  {lecture?.freePreview && (
                                    <p className="text-xs text-indigo-600 font-medium">Preview available</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                  <CardTitle className="text-2xl text-indigo-900">About the Instructor</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mr-4 border-2 border-white shadow-lg">
                      {studentViewCourseDetails?.instructorName?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{studentViewCourseDetails?.instructorName}</h3>
                      <p className="text-indigo-600">Professional Instructor</p>
                    </div>
                  </div>
                  <div className="prose prose-blue max-w-none text-gray-700">
                    <p>
                      {studentViewCourseDetails?.instructorName} is an experienced educator and professional in the field, 
                      dedicated to providing high-quality instruction. With years of real-world experience, 
                      they have developed this comprehensive course to help students master the subject material.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          </div>
        </div>
      </div>

      {/* Free Preview Dialog */}
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="max-w-4xl bg-gradient-to-b from-indigo-50 to-white border-0 shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl text-indigo-900">Course Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg mb-6">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="100%"
              height="100%"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSetFreePreview(filteredItem)}
                  className={`text-left p-4 rounded-lg border border-indigo-100 transition-all ${
                    displayCurrentVideoFreePreview === filteredItem.videoUrl
                      ? "bg-indigo-100 shadow-md"
                      : "bg-white hover:bg-indigo-50"
                  }`}
                >
                  <div className="flex items-center">
                    <PlayCircle className={`h-5 w-5 mr-3 ${
                      displayCurrentVideoFreePreview === filteredItem.videoUrl
                        ? "text-indigo-600"
                        : "text-indigo-400"
                    }`} />
                    <span className={`font-medium ${
                      displayCurrentVideoFreePreview === filteredItem.videoUrl
                        ? "text-indigo-900"
                        : "text-gray-700"
                    }`}>
                      {filteredItem?.title}
                    </span>
                  </div>
                </button>
              ))}
          </div>
          <DialogFooter className="flex justify-between items-center mt-6">
            <p className="text-indigo-600 font-medium">
              Enjoy these free previews! Unlock the full course for ${studentViewCourseDetails?.pricing}
            </p>
            <div className="flex gap-4">
              <DialogClose asChild>
                <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                  Close
                </Button>
              </DialogClose>
              <Button 
                onClick={handleCreatePayment}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                Enroll Now
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;

