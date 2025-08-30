import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import InstructorUserManagement from "@/components/instructor-view/user-management";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, 
  Book, 
  LogOut, 
  Users, 
  Menu, 
  ChevronRight, 
  User, 
  Bell, 
  HelpCircle,
  X,
  Search
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New student enrolled in React Fundamentals", time: "2 hours ago", read: false },
    { id: 2, message: "Course update successfully published", time: "Yesterday", read: true },
    { id: 3, message: "New review on Advanced JavaScript", time: "3 days ago", read: false }
  ]);
  
  const { resetCredentials, auth } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } = useContext(InstructorContext);
  const navigate = useNavigate();

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService();
    if (response?.success) setInstructorCoursesList(response?.data);
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);
  
  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard listOfCourses={instructorCoursesList} />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: Users,
      label: "User Management",
      value: "users",
      component: <InstructorUserManagement />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
  };
  
  const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex h-full min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <motion.aside 
        className="bg-white shadow-lg hidden md:block overflow-hidden border-r border-gray-200"
        animate={{ width: sidebarOpen ? "280px" : "80px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {sidebarOpen ? (
              <motion.div 
                className="flex items-center"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                  E
                </div>
                <h2 className="text-xl font-bold ml-3 text-gray-900">EliteLearn</h2>
              </motion.div>
            ) : (
              <div className="h-10 w-10 mx-auto rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                E
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          <div className={`p-4 ${!sidebarOpen ? 'px-0' : ''}`}>
            <div className={`flex items-center mb-8 ${!sidebarOpen ? 'justify-center' : ''}`}>
              {sidebarOpen ? (
                <motion.div 
                  className="flex items-center"
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden border-2 border-white shadow-md">
                      {auth?.user?.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-emerald-500 w-3 h-3 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">
                      {auth?.user?.userName || "Instructor"}
                    </h3>
                    <p className="text-xs text-gray-500">{auth?.user?.userEmail}</p>
                  </div>
                </motion.div>
              ) : (
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden border-2 border-white shadow-md">
                    {auth?.user?.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-emerald-500 w-2 h-2 rounded-full border border-white"></div>
                </div>
              )}
            </div>
            
            <nav className={`space-y-1 ${!sidebarOpen ? 'px-2' : ''}`}>
              {menuItems.map((menuItem) => (
                <Button
                  key={menuItem.value}
                  variant={activeTab === menuItem.value ? "default" : "ghost"}
                  className={`w-full justify-start transition-all mb-1 ${
                    activeTab === menuItem.value 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800' 
                      : 'bg-white text-zinc-800 hover:text-zinc-900 hover:bg-gray-100'
                  } ${!sidebarOpen ? 'px-0 justify-center' : ''}`}
                  onClick={
                    menuItem.value === "logout"
                      ? handleLogout
                      : () => setActiveTab(menuItem.value)
                  }
                >
                  <menuItem.icon className={`h-5 w-5 ${!sidebarOpen ? 'mr-0' : 'mr-3'}`} />
                  {sidebarOpen && (
                    <motion.span 
                      initial="hidden"
                      animate="visible"
                      variants={slideIn}
                    >
                      {menuItem.label}
                    </motion.span>
                  )}
                  {activeTab === menuItem.value && sidebarOpen && (
                    <div className="ml-auto">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              ))}
            </nav>
          </div>
          
          <div className="mt-auto p-4 border-t border-gray-200">
            {/* The Elite Status section and Settings button have been removed */}
          </div>
        </div>
      </motion.aside>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/70 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="fixed top-0 left-0 w-[280px] h-full bg-white shadow-xl"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                    E
                  </div>
                  <h2 className="text-xl font-bold ml-3 text-gray-900">EliteLearn</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-4">
                <div className="flex items-center mb-8">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden border-2 border-white shadow-md">
                      {auth?.user?.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-emerald-500 w-3 h-3 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">
                      {auth?.user?.userName || "Instructor"}
                    </h3>
                    <p className="text-xs text-gray-500">{auth?.user?.userEmail}</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  {menuItems.map((menuItem) => (
                    <Button
                      key={menuItem.value}
                      variant={activeTab === menuItem.value ? "default" : "ghost"}
                      className={`w-full justify-start transition-all mb-1 ${
                        activeTab === menuItem.value 
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800' 
                          : 'bg-white text-zinc-800 hover:text-zinc-900 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        if (menuItem.value === "logout") {
                          handleLogout();
                        } else {
                          setActiveTab(menuItem.value);
                          setMobileMenuOpen(false);
                        }
                      }}
                    >
                      <menuItem.icon className="h-5 w-5 mr-3" />
                      {menuItem.label}
                      {activeTab === menuItem.value && (
                        <div className="ml-auto">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  ))}
                </nav>
              </div>
              
              <div className="mt-auto p-4 border-t border-gray-200">
                {/* The Elite Status section and Settings button have been removed */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="flex-1 overflow-y-auto bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-md">
          <div className="flex items-center justify-between h-16 px-4 md:px-8">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden mr-2 text-slate-700 hover:bg-slate-100" 
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-slate-900 hidden md:block">
                {menuItems.find(item => item.value === activeTab)?.label || "Dashboard"}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative rounded-md bg-slate-100 items-center p-1 px-3 mr-1 hidden md:flex">
                <Search className="h-4 w-4 text-slate-500 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-sm py-1 w-40 focus:w-56 transition-all"
                />
              </div>
              
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full relative text-slate-700 hover:bg-slate-100"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
                  )}
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-slate-700 hover:bg-slate-100"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full md:hidden text-slate-700 hover:bg-slate-100"
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {menuItems.map((menuItem) => (
                  <TabsContent key={menuItem.value} value={menuItem.value}>
                    {menuItem.component !== null ? menuItem.component : null}
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
