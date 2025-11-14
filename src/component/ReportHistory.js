import React, { Suspense, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

const EmployeeReportList = React.lazy(() => import(/* webpackPrefetch: true */ "../module/EmployeeReportList"));
const IdCardList = React.lazy(() => import(/* webpackPrefetch: true */ "../module/IdCardList"));
const TaskList = React.lazy(() => import(/* webpackPrefetch: true */ "../module/TaskList"));
const TaskListOld = React.lazy(() => import(/* webpackPrefetch: true */ "../module/TaskListOld"));

const ReportHistory = () => {
  const [category, setCategory] = useState("employeeReport");

  return (
    <div className="bg-whitesmoke min-h-screen px-2 py-8 bg-gray-200 rounded-md">
      <nav className="bg-white-50 p-4 rounded-lg">
        <div className="flex items-center max-w-screen-xl px-4 mx-auto ">
          <ul className=" flex font-medium space-x-8 text-sm w-full items-center justify-center flex-wrap gap-y-4">
            <li>
              <Link to="/dashboard/report-history">
                <button onClick={() => setCategory("employeeReport")} className={`  px-6 py-2 rounded-full border-2 ${category === "employeeReport" ? "bg-blue-500 text-white" : ""  } border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition`}>
                  Employee Report
                </button>
              </Link>
            </li>
            <li >
              <Link to="/dashboard/report-history/id-card-report" >
                <button onClick={() => setCategory("idCardReports")} className={`px-6 py-2 rounded-full border-2 ${ category === "idCardReports" ? "bg-blue-500 text-white" : ""  } border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white  transition`}>
                  ID Card Reports
                </button>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/report-history/taskList">
                <button onClick={ () => setCategory("dailyTask")} className={`px-6 py-2 rounded-full border-2 ${ category === "dailyTask" ? "bg-blue-500 text-white" : ""  } border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white  transition`}>
                  Daily Task
                </button>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/report-history/taskListOld">
                <button onClick={ () => setCategory("dailyTaskOld")} className={`px-6 py-2 rounded-full border-2 ${ category === "dailyTaskOld" ? "bg-blue-500 text-white" : ""  } border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white  transition`}>
                  Daily Task Old
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      
      
      <div className="mt-6 ">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<EmployeeReportList />} />
            <Route path="/id-card-report" element={<IdCardList />} />
            <Route path="/taskList" element={<TaskList />} />
            <Route path="/taskListOld" element={<TaskListOld />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default ReportHistory;




