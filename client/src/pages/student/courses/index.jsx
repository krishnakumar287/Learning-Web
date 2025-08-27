import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { ArrowUpDownIcon, SearchIcon, FilterIcon, BookOpenIcon, GraduationCapIcon, ClockIcon, StarIcon, TagIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSeection =
      Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSeection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function toggleFilterSection(sectionId) {
    setActiveFilter(activeFilter === sectionId ? null : sectionId);
  }

  function handleClearFilters() {
    setFilters({});
    sessionStorage.removeItem("filters");
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    setLoadingState(true);
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
      search: searchQuery
    });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters !== null && sort !== null) {
        fetchAllStudentViewCourses(filters, sort);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [filters, sort, searchQuery]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
    setActiveFilter(Object.keys(filterOptions)[0]);
  }, []);

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Discover Your Next Course</h1>
            <p className="text-lg text-blue-100 mb-8">
              Explore our catalog of premium courses taught by industry experts
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 rounded-full bg-white/10 border-white/20 text-white placeholder:text-blue-100 focus:bg-white/20 h-14"
              />
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-100" />
            </div>
            
            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {Object.keys(filterOptions).map((keyItem) => (
                <div key={keyItem} className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-full px-4"
                      >
                        {keyItem.charAt(0).toUpperCase() + keyItem.slice(1)}
                        <span className="ml-1">
                          {filters[keyItem] && filters[keyItem].length > 0 ? 
                            `(${filters[keyItem].length})` : ''}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 p-2">
                      <div className="space-y-1">
                        {filterOptions[keyItem].map((option) => (
                          <Label key={option.id} className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <Checkbox
                              checked={
                                filters &&
                                Object.keys(filters).length > 0 &&
                                filters[keyItem] &&
                                filters[keyItem].indexOf(option.id) > -1
                              }
                              onCheckedChange={() =>
                                handleFilterOnChange(keyItem, option)
                              }
                              className="mr-2"
                            />
                            {option.label}
                          </Label>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-full px-4"
                  >
                    Sort
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={(value) => setSort(value)}
                  >
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        key={sortItem.id}
                        className="cursor-pointer"
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {Object.keys(filters).length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-full px-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#ffffff">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block w-64 space-y-6 self-start sticky top-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Filters
                </h3>
              </div>
              
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="p-2">
                  {Object.keys(filterOptions).map((keyItem) => (
                    <div key={keyItem} className="border-b border-gray-100 py-3">
                      <button
                        onClick={() => toggleFilterSection(keyItem)}
                        className="flex w-full justify-between items-center px-2 py-1 font-medium text-gray-700"
                      >
                        {keyItem.charAt(0).toUpperCase() + keyItem.slice(1)}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`transition-transform ${
                            activeFilter === keyItem ? "rotate-180" : ""
                          }`}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      
                      <div
                        className={`grid gap-1 mt-2 px-2 overflow-hidden transition-all ${
                          activeFilter === keyItem ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        {filterOptions[keyItem].map((option) => (
                          <Label key={option.id} className="flex items-center p-1 hover:bg-gray-50 rounded text-sm">
                            <Checkbox
                              checked={
                                filters &&
                                Object.keys(filters).length > 0 &&
                                filters[keyItem] &&
                                filters[keyItem].indexOf(option.id) > -1
                              }
                              onCheckedChange={() =>
                                handleFilterOnChange(keyItem, option)
                              }
                              className="mr-2"
                            />
                            {option.label}
                          </Label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {Object.keys(filters).length > 0 && (
                <div className="p-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </aside>
          
          {/* Mobile Filter Button */}
          <div className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200 p-4">
            <Button 
              onClick={() => setIsMobileFilterVisible(!isMobileFilterVisible)}
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <FilterIcon className="h-4 w-4 mr-2" />
              Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
            </Button>
            
            {/* Mobile Filter Panel */}
            {isMobileFilterVisible && (
              <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
                <div className="w-3/4 bg-white h-full overflow-y-auto">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-900">Filters</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsMobileFilterVisible(false)}
                    >
                      Close
                    </Button>
                  </div>
                  
                  <div className="p-4">
                    {Object.keys(filterOptions).map((keyItem) => (
                      <div key={keyItem} className="border-b border-gray-100 py-3">
                        <button
                          onClick={() => toggleFilterSection(keyItem)}
                          className="flex w-full justify-between items-center font-medium text-gray-700"
                        >
                          {keyItem.charAt(0).toUpperCase() + keyItem.slice(1)}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform ${
                              activeFilter === keyItem ? "rotate-180" : ""
                            }`}
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>
                        
                        <div
                          className={`grid gap-2 mt-2 overflow-hidden transition-all ${
                            activeFilter === keyItem ? "max-h-96" : "max-h-0"
                          }`}
                        >
                          {filterOptions[keyItem].map((option) => (
                            <Label key={option.id} className="flex items-center p-1 hover:bg-gray-50 rounded">
                              <Checkbox
                                checked={
                                  filters &&
                                  Object.keys(filters).length > 0 &&
                                  filters[keyItem] &&
                                  filters[keyItem].indexOf(option.id) > -1
                                }
                                onCheckedChange={() =>
                                  handleFilterOnChange(keyItem, option)
                                }
                                className="mr-2"
                              />
                              {option.label}
                            </Label>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        className="flex-1"
                      >
                        Clear All
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setIsMobileFilterVisible(false)}
                        className="flex-1"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Course List */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Courses</h2>
              <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
                {studentViewCoursesList.length} Results
              </span>
            </div>

            {/* Course Cards */}
            {loadingState ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row">
                      <Skeleton className="w-full md:w-64 h-48" />
                      <div className="p-6 flex-1">
                        <Skeleton className="h-7 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-1/2 mb-3" />
                        <Skeleton className="h-4 w-1/3 mb-6" />
                        <div className="flex gap-2">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                        <div className="flex justify-between items-center mt-6">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-10 w-32" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {studentViewCoursesList.map((courseItem) => (
                  <Card
                    key={courseItem?._id}
                    className="overflow-hidden hover:shadow-md transition-shadow duration-300 bg-white border-gray-100"
                  >
                    <div 
                      onClick={() => handleCourseNavigate(courseItem?._id)}
                      className="flex flex-col md:flex-row cursor-pointer h-full"
                    >
                      <div className="relative md:w-64 h-48 overflow-hidden">
                        <img
                          src={courseItem?.image}
                          alt={courseItem?.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-16"></div>
                        <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold py-1 px-2 rounded">
                          {courseItem?.category}
                        </div>
                      </div>
                      
                      <CardContent className="flex-1 p-6">
                        <div className="flex flex-col h-full">
                          <div>
                            <CardTitle className="text-xl mb-2 text-gray-900 line-clamp-1">
                              {courseItem?.title}
                            </CardTitle>
                            
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 mr-2 flex items-center justify-center text-xs font-bold">
                                {courseItem?.instructorName?.charAt(0)}
                              </div>
                              <p className="text-sm text-gray-600">
                                {courseItem?.instructorName}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 my-3">
                              <div className="flex items-center text-xs font-medium text-gray-700 bg-gray-100 rounded-full py-1 px-3">
                                <BookOpenIcon className="h-3 w-3 mr-1" />
                                {courseItem?.curriculum?.length} {courseItem?.curriculum?.length <= 1 ? "Lecture" : "Lectures"}
                              </div>
                              <div className="flex items-center text-xs font-medium text-gray-700 bg-gray-100 rounded-full py-1 px-3">
                                <GraduationCapIcon className="h-3 w-3 mr-1" />
                                {courseItem?.level.toUpperCase()}
                              </div>
                              <div className="flex items-center text-xs font-medium text-gray-700 bg-gray-100 rounded-full py-1 px-3">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {Math.floor(Math.random() * 10) + 2} Hours
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                            <div>
                              <div className="flex items-center mb-1">
                                <div className="flex text-amber-400">
                                  {[1,2,3,4,5].map(star => (
                                    <StarIcon key={star} className="h-4 w-4 fill-current" />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-2">
                                  {(4 + Math.random()).toFixed(1)} ({Math.floor(Math.random() * 500) + 50})
                                </span>
                              </div>
                              <p className="font-bold text-xl text-blue-700">
                                ${courseItem?.pricing}
                              </p>
                            </div>
                            
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCourseNavigate(courseItem?._id);
                              }}
                            >
                              Enroll Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <SearchIcon className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Courses Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                <Button 
                  variant="outline"
                  onClick={handleClearFilters}
                  className="mr-2"
                >
                  Clear Filters
                </Button>
                <Button onClick={() => setSearchQuery("")}>Reset Search</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
