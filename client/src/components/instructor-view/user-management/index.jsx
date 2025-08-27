import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/api/axiosInstance";
import { useToast } from "@/hooks/use-toast";

function InstructorUserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Users</Label>
              <Input 
                id="search" 
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Current Role</th>
                    <th className="text-left p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((user) => (
                    <tr 
                      key={user._id} 
                      className={`border-t ${selectedUser?._id === user._id ? 'bg-muted/50' : ''}`}
                    >
                      <td className="p-3">{user.userName}</td>
                      <td className="p-3">{user.userEmail}</td>
                      <td className="p-3 capitalize">{user.role}</td>
                      <td className="p-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedUser && (
            <div className="border p-4 rounded-md bg-muted/30">
              <h3 className="font-semibold mb-4">Update Role for {selectedUser.userName}</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Current Role</Label>
                    <div className="p-2 border rounded-md bg-white capitalize">
                      {selectedUser.role}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="role">New Role</Label>
                    <Select value={newRole} onValueChange={setNewRole}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="instructor">Instructor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={handleUpdateRole} 
                  disabled={isLoading || selectedUser.role === newRole}
                >
                  {isLoading ? "Updating..." : "Update Role"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorUserManagement;
