import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function UpdateRolePage() {
  const [userId, setUserId] = useState("");
  const [newRole, setNewRole] = useState("instructor");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { toast } = useToast();

  const handleUpdateRole = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please enter a user ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/auth/update-role", {
        userId,
        newRole,
      });
      
      setResult(response.data);
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
      setResult(error.response?.data || { success: false, message: "Failed to update role" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Update User Role</CardTitle>
          <CardDescription>Change a user's role in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                placeholder="Enter the MongoDB user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">New Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleUpdateRole} 
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Role"}
            </Button>
            
            {result && (
              <div className={`mt-4 p-3 rounded ${result.success ? "bg-green-100" : "bg-red-100"}`}>
                <p className="font-medium">{result.success ? "Success" : "Error"}</p>
                <p>{result.message}</p>
                {result.data && (
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
