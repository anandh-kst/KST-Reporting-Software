import React, { Suspense, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

const EmployeeReportList = React.lazy(() => import(/* webpackPrefetch: true */ "../module/EmployeeReportList"));
const IdCardList = React.lazy(() => import(/* webpackPrefetch: true */ "../module/IdCardList"));
const TaskList = React.lazy(() => import(/* webpackPrefetch: true */ "../module/TaskList"));
const TaskListOld = React.lazy(() => import(/* webpackPrefetch: true */ "../module/TaskListOld"));

const ReportHistory = () => {
  return (
    <div className="bg-whitesmoke min-h-screen">
      <nav className="bg-white-50 shadow-md p-4 rounded-lg">
        <div className="flex items-center max-w-screen-xl px-4 mx-auto">
          <ul className="flex flex-row font-medium space-x-8 text-sm">
            <li>
              <Link to="/dashboard/report-history">
                <button className={`px-6 py-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-100 transition`}>
                  Employee Report
                </button>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/report-history/id-card-report">
                <button className={`px-6 py-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-100 transition`}>
                  ID Card Reports
                </button>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/report-history/taskList">
                <button className={`px-6 py-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-100 transition`}>
                  Daily Task
                </button>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/report-history/taskListOld">
                <button className={`px-6 py-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-100 transition`}>
                  Daily Task Old
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      
      
      <div className="mt-6">
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




