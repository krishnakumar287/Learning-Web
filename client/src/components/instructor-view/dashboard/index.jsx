import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  Users, 
  Award, 
  BookOpen, 
  TrendingUp, 
  BarChart3,
  ChevronRight,
  Clock,
  Calendar,
  UserPlus,
  FileText
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

function InstructorDashboard({ listOfCourses }) {
  function calculateTotalStudentsAndProfit() {
    const { totalStudents, totalProfit, studentList, totalCourses, recentActivity } = listOfCourses.reduce(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalStudents += studentCount;
        acc.totalProfit += course.pricing * studentCount;
        acc.totalCourses++;

        // Add student enrollments to the activity list
        course.students.forEach((student) => {
          acc.studentList.push({
            courseTitle: course.title,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
          });
          
          // Add recent activity (simplified - would use real dates in production)
          const randomDaysAgo = Math.floor(Math.random() * 14) + 1; // Random day between 1-14 days ago
          acc.recentActivity.push({
            type: 'enrollment',
            courseTitle: course.title,
            studentName: student.studentName,
            daysAgo: randomDaysAgo,
            icon: UserPlus
          });
        });

        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
        totalCourses: 0,
        studentList: [],
        recentActivity: []
      }
    );
    
    // Sort activities by most recent
    recentActivity.sort((a, b) => a.daysAgo - b.daysAgo);

    // Get completion rate (simulated for demo)
    const completionRate = totalStudents > 0 ? Math.floor(Math.random() * 30) + 70 : 0; // 70-100%

    return {
      totalProfit,
      totalStudents,
      studentList,
      totalCourses: totalCourses || 0,
      completionRate,
      recentActivity: recentActivity.slice(0, 5) // Just show the 5 most recent activities
    };
  }

  const stats = calculateTotalStudentsAndProfit();

  const statCards = [
    {
      icon: BookOpen,
      label: "Total Courses",
      value: stats.totalCourses,
      color: "bg-emerald-500",
      increase: "+2 this month",
    },
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents,
      color: "bg-teal-500",
      increase: "+12% from last month",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${stats.totalProfit.toLocaleString()}`,
      color: "bg-teal-600",
      increase: "+8% from last month",
    },
    {
      icon: Award,
      label: "Completion Rate",
      value: `${stats.completionRate}%`,
      color: "bg-emerald-600",
      increase: "+5% from last month",
    },
  ];
  
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
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
          >
            <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className={`h-1 ${stat.color}`}></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-5 w-5 ${stat.color} text-opacity-80`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-green-600 font-medium">{stat.increase}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Student Performance & Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="lg:col-span-2"
          variants={itemVariants}
        >
          <Card className="border-0 shadow-md h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Student Enrollment Trends
                </CardTitle>
                <p className="text-sm text-muted-foreground">Student growth over time</p>
              </div>
              <div className="flex items-center gap-2">
                <select className="text-xs bg-gray-50 border border-gray-200 rounded-md px-2 py-1">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last year</option>
                </select>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full flex items-end justify-between gap-2 mt-2 pt-10 border-b border-t border-gray-100 relative">
                {/* Simulated chart bars - would use a real chart library in production */}
                {Array.from({ length: 7 }).map((_, i) => {
                  const height = 30 + Math.random() * 170;
                  const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className="bg-gradient-to-t from-teal-600 to-emerald-400 rounded-t-md w-8 md:w-14"
                        style={{ height: `${height}px` }}
                      ></div>
                      <div className="text-xs mt-2 text-gray-500">{day}</div>
                    </div>
                  )
                })}
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 py-4">
                  <div>50</div>
                  <div>25</div>
                  <div>0</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[250px] pr-4">
                <div className="space-y-5">
                  {stats.recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 p-2 rounded-full bg-teal-100">
                        <activity.icon className="h-4 w-4 text-teal-600" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium">
                          <span className="font-semibold">{activity.studentName}</span> enrolled in <span className="font-semibold">{activity.courseTitle}</span>
                        </p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" /> 
                          {activity.daysAgo === 0 ? 'Today' : 
                           activity.daysAgo === 1 ? 'Yesterday' : 
                           `${activity.daysAgo} days ago`}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add some additional activities */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 p-2 rounded-full bg-emerald-100">
                      <FileText className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium">
                        You published a new update to <span className="font-semibold">React Fundamentals</span>
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" /> 3 days ago
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 p-2 rounded-full bg-teal-100">
                      <Award className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium">
                        <span className="font-semibold">Advanced JavaScript</span> received 5-star rating
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" /> 5 days ago
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Student Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Students List</CardTitle>
              <div className="flex items-center text-sm text-teal-600">
                <span>View All</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-semibold">Course Name</TableHead>
                    <TableHead className="font-semibold">Student Name</TableHead>
                    <TableHead className="font-semibold">Student Email</TableHead>
                    <TableHead className="font-semibold text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.studentList.length > 0 ? (
                    stats.studentList.slice(0, 5).map((studentItem, index) => (
                      <TableRow key={index} className="hover:bg-slate-50">
                        <TableCell className="font-medium">
                          {studentItem.courseTitle}
                        </TableCell>
                        <TableCell>{studentItem.studentName}</TableCell>
                        <TableCell>{studentItem.studentEmail}</TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                        No students enrolled yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default InstructorDashboard;
