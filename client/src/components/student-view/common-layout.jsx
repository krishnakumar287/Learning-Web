import { Outlet, useLocation } from "react-router-dom";
import StudentViewCommonHeader from "./header";

function StudentViewCommonLayout() {
  const location = useLocation();
  const isProgressPage = location.pathname.includes("course-progress");
  
  return (
    <div className={!isProgressPage ? "min-h-screen bg-slate-50" : ""}>
      {!isProgressPage ? <StudentViewCommonHeader /> : null}

      <div className={!isProgressPage ? "pt-[72px]" : ""}>
        <Outlet />
      </div>
    </div>
  );
}

export default StudentViewCommonLayout;
