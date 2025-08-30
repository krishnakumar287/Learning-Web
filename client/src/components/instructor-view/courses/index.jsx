import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { motion } from "framer-motion";
import { 
  Delete, 
  Edit, 
  PlusCircle, 
  FileEdit, 
  Trash2, 
  Eye, 
  BarChart4,
  Search,
  Filter,
  Bookmark,
  Star,
  Users
} from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Filter and search courses
  const filteredCourses = listOfCourses?.filter(course => {
    const matchesSearch = course?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "popular") return matchesSearch && course?.students?.length > 2;
    if (filter === "new") return matchesSearch; // In a real app, would check creation date
    
    return matchesSearch;
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.4
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="mb-8 p-8 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg"
        variants={itemVariants}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Courses</h1>
            <p className="text-teal-100 max-w-2xl">
              Manage your existing courses or create new ones. Track performance, edit content, and engage with your students.
            </p>
          </div>
          <Button
            onClick={() => {
              setCurrentEditedCourseId(null);
              setCourseLandingFormData(courseLandingInitialFormData);
              setCourseCurriculumFormData(courseCurriculumInitialFormData);
              navigate("/instructor/create-new-course");
            }}
            className="mt-4 md:mt-0 px-6 py-6 bg-white text-teal-600 hover:bg-gray-100 transition-all group"
          >
            <PlusCircle className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
            Create New Course
          </Button>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
          <div className="relative w-full md:w-auto flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2 w-full md:w-auto">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              All Courses
            </Button>
            <Button 
              variant={filter === "popular" ? "default" : "outline"} 
              onClick={() => setFilter("popular")}
              className={filter === "popular" ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              <Star className="h-4 w-4 mr-2" />
              Popular
            </Button>
            <Button 
              variant={filter === "new" ? "default" : "outline"} 
              onClick={() => setFilter("new")}
              className={filter === "new" ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md overflow-hidden">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-xl font-semibold">Course Management</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold">Course</TableHead>
                    <TableHead className="font-semibold">Students</TableHead>
                    <TableHead className="font-semibold">Revenue</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses && filteredCourses.length > 0 ? (
                    filteredCourses.map((course, index) => (
                      <TableRow key={course?._id || index} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-teal-100 to-emerald-100 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-lg mr-3">
                              {course?.title?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{course?.title}</div>
                              <div className="text-xs text-gray-500">
                                {course?.category || "Web Development"} • {course?.level || "Intermediate"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="bg-teal-100 text-teal-700 p-1 rounded-md mr-2">
                              <Users className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{course?.students?.length}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="bg-emerald-100 text-emerald-700 p-1 rounded-md mr-2">
                              <BarChart4 className="h-4 w-4" />
                            </div>
                            <span className="font-medium">${course?.students?.length * course?.pricing}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => {
                                navigate(`/instructor/edit-course/${course?._id}`);
                              }}
                              variant="outline"
                              size="sm"
                              className="border-teal-200 text-teal-700 hover:bg-teal-50"
                            >
                              <FileEdit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-rose-200 text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                        {searchTerm ? (
                          <div className="flex flex-col items-center">
                            <Search className="h-10 w-10 text-gray-300 mb-2" />
                            <p>No courses found matching "{searchTerm}"</p>
                            <Button 
                              variant="link" 
                              onClick={() => setSearchTerm("")} 
                              className="mt-2"
                            >
                              Clear search
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <PlusCircle className="h-10 w-10 text-gray-300 mb-2" />
                            <p>No courses available. Create your first course!</p>
                            <Button
                              onClick={() => {
                                setCurrentEditedCourseId(null);
                                setCourseLandingFormData(courseLandingInitialFormData);
                                setCourseCurriculumFormData(courseCurriculumInitialFormData);
                                navigate("/instructor/create-new-course");
                              }}
                              variant="link"
                              className="mt-2"
                            >
                              Create New Course
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Analytics Card */}
      {filteredCourses && filteredCourses.length > 0 && (
        <motion.div 
          className="mt-8"
          variants={itemVariants}
        >
          <Card className="border-0 shadow-md bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Course Performance Analytics</h3>
                  <p className="text-gray-600 mb-4">Get detailed insights about your courses' performance</p>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <BarChart4 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

export default InstructorCourses;
