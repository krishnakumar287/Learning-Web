import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/api/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { 
  Search, 
  UserCheck, 
  UserCog, 
  UserPlus, 
  Shield, 
  RefreshCw,
  CheckCircle,
  UserX,
  Filter
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function InstructorUserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentTab, setCurrentTab] = useState("search");
  const [roleFilter, setRoleFilter] = useState("all");
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await axiosInstance.get(`/auth/search-users?q=${searchQuery}`);
      setSearchResults(response.data.data || []);
      
      if (response.data.data.length === 0) {
        toast({
          title: "No results",
          description: "No users found matching your search",
        });
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to search users",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a user first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/update-role", {
        userId: selectedUser._id,
        newRole,
      });
      
      // Update the user in the search results
      setSearchResults(prevResults => 
        prevResults.map(user => 
          user._id === selectedUser._id ? {...user, role: newRole} : user
        )
      );
      
      // Update selected user
      setSelectedUser({...selectedUser, role: newRole});
      
      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter results based on role
  const filteredResults = roleFilter === 'all' 
    ? searchResults 
    : searchResults.filter(user => user.role === roleFilter);
  
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
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-teal-100 max-w-2xl">
              Search for users and manage their roles and permissions within the platform.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <UserCog className="h-5 w-5 text-white" />
            </div>
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="search" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-6 w-full max-w-md mx-auto grid grid-cols-2 bg-slate-100">
            <TabsTrigger value="search" className="flex items-center gap-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <Search className="h-4 w-4" />
              Search Users
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <UserCheck className="h-4 w-4" />
              Manage Roles
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-xl font-semibold">Search Users</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  <div className="flex flex-col md:flex-row items-end gap-4">
                    <div className="flex-1 relative">
                      <Label htmlFor="search" className="text-gray-700 mb-2 block">Search by Name or Email</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          id="search" 
                          placeholder="Enter name or email address"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleSearch} 
                      disabled={isSearching}
                      className="bg-teal-600 hover:bg-teal-700 transition-colors min-w-[120px]"
                    >
                      {isSearching ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="text-sm text-gray-500">
                          Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">Filter by role:</span>
                          <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-[140px] h-8 text-xs border-slate-200">
                              <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Roles</SelectItem>
                              <SelectItem value="student">Students</SelectItem>
                              <SelectItem value="instructor">Instructors</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="rounded-md overflow-hidden border border-slate-100">
                        <table className="w-full">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="text-left p-3 text-slate-700 font-semibold">User</th>
                              <th className="text-left p-3 text-slate-700 font-semibold">Email</th>
                              <th className="text-left p-3 text-slate-700 font-semibold">Role</th>
                              <th className="text-right p-3 text-slate-700 font-semibold">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredResults.map((user) => (
                              <tr 
                                key={user._id} 
                                className={`border-t hover:bg-slate-50 transition-colors ${selectedUser?._id === user._id ? 'bg-teal-50' : ''}`}
                              >
                                <td className="p-3">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 flex items-center justify-center text-white font-medium text-sm overflow-hidden mr-3">
                                      {user.userName?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium text-gray-900">{user.userName}</span>
                                  </div>
                                </td>
                                <td className="p-3 text-gray-600">{user.userEmail}</td>
                                <td className="p-3">
                                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    user.role === 'instructor' 
                                      ? 'bg-teal-100 text-teal-800' 
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}>
                                    {user.role === 'instructor' ? (
                                      <UserCheck className="h-3 w-3 mr-1" />
                                    ) : (
                                      <UserX className="h-3 w-3 mr-1" />
                                    )}
                                    <span className="capitalize">{user.role}</span>
                                  </div>
                                </td>
                                <td className="p-3 text-right">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className={`border-teal-200 ${
                                      selectedUser?._id === user._id 
                                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                                        : 'text-teal-700 hover:bg-teal-50'
                                    }`}
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setNewRole(user.role);
                                      setCurrentTab("manage");
                                    }}
                                  >
                                    {selectedUser?._id === user._id ? (
                                      <>
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Selected
                                      </>
                                    ) : (
                                      <>
                                        <UserCog className="h-4 w-4 mr-1" />
                                        Manage
                                      </>
                                    )}
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                  
                  {searchQuery && searchResults.length === 0 && !isSearching && (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                      <p className="text-gray-500 mb-4">
                        We couldn't find any users matching "{searchQuery}"
                      </p>
                      <Button variant="outline" onClick={() => setSearchQuery("")}>
                        Clear Search
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manage">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-xl font-semibold">Manage User Role</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {selectedUser ? (
                  <motion.div 
                    className="grid gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-start p-6 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg border border-teal-100">
                      <div className="flex-shrink-0 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden border-4 border-white shadow-md">
                          {selectedUser.userName?.charAt(0).toUpperCase()}
                        </div>
                        <div className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          selectedUser.role === 'instructor' 
                            ? 'bg-teal-100 text-teal-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          <span className="capitalize">{selectedUser.role}</span>
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedUser.userName}</h3>
                        <p className="text-gray-600 mb-4">{selectedUser.userEmail}</p>
                        
                        <div className="grid gap-4">
                          <div>
                            <Label htmlFor="current-role" className="text-gray-700 mb-2 block">Current Role</Label>
                            <div 
                              id="current-role"
                              className="p-3 border rounded-md bg-white capitalize flex items-center"
                            >
                              {selectedUser.role === 'instructor' ? (
                                <UserCheck className="h-5 w-5 mr-2 text-teal-600" />
                              ) : (
                                <UserX className="h-5 w-5 mr-2 text-emerald-600" />
                              )}
                              {selectedUser.role}
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="new-role" className="text-gray-700 mb-2 block">New Role</Label>
                            <Select value={newRole} onValueChange={setNewRole}>
                              <SelectTrigger id="new-role" className="bg-white">
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="instructor">Instructor</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 justify-end">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedUser(null)}
                        className="border-gray-200"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleUpdateRole} 
                        disabled={isLoading || selectedUser.role === newRole}
                        className="bg-teal-600 hover:bg-teal-700 transition-colors min-w-[140px]"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Update Role
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <UserCog className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No User Selected</h3>
                    <p className="text-gray-500 mb-4">
                      Please search and select a user to manage their role
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentTab("search")}
                      className="bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search Users
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

export default InstructorUserManagement;
