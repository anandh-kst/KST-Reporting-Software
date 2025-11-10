import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "./Redux/slice/loginSlice";
// import { useSelector } from "react-redux";
const Login = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./component/Login")
);
const Dashboard = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./component/Dashboard")
);
const ForgotPassword = React.lazy(() =>import(/* webpackPrefetch: true */ "./component/ForgotPassword"));
const ResetPassword = React.lazy(() =>import(/* webpackPrefetch: true */ "./component/ResetPassword"));

// const Nav = React.lazy(() => import(/* webpackPrefetch: true */ "./component/Nav"));

function App() {
  // const isAuth = useSelector((state) => state.login.isAuth);
  const dispatch = useDispatch();
  useEffect(() => {
    sessionStorage.setItem("is_reloaded", "true"); // Mark page load as a potential refresh

    const handleTabClose = () => {
      sessionStorage.removeItem("is_reloaded"); // Remove the reload flag
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      if (!sessionStorage.getItem("is_reloaded")) {
        // If flag is removed, it's a tab close, not a refresh
        dispatch(logOut());
      }
    };

    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, [dispatch]);


  // useEffect(() => {
  //   const handleTabClose = () => {
  //      dispatch(logOut());
  //   };

  //   window.addEventListener("beforeunload", handleTabClose);
  //   return () => window.removeEventListener("beforeunload", handleTabClose);
  // }, [dispatch]);  
  return (
    <div className="App">
      <header className="App-header">
        <React.Suspense
          fallback={
            <div className="loader">
              <div className="loaderRectangle">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          }
        >
<BrowserRouter >
            {/* {!isAuth && <Nav/>} */}
            <Routes>
              <Route index path="/" element={<Login />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/forgotPassword/*" element={<ForgotPassword />} />
              <Route path="/resetPassword/*" element={<ResetPassword />} />
            </Routes>
          </BrowserRouter>
        </React.Suspense>
      </header>
    </div>
  );
}

export default App;






// import "./App.css";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import React from "react";

// const Login = React.lazy(() =>
//   import(/* webpackPrefetch: true */ "./component/Login")
// );
// const Dashboard = React.lazy(() =>
//   import(/* webpackPrefetch: true */ "./component/Dashboard")
// );
// // const EmployeeMaster = React.lazy(() =>
// //   import(/* webpackPrefetch: true */ "./component/EmployeeMaster")
// // );
// const ForgotPassword = React.lazy(() =>
//   import(/* webpackPrefetch: true */ "./component/ForgotPassword")
// );
// const ResetPassword = React.lazy(() =>
//   import(/* webpackPrefetch: true */ "./component/ResetPassword")
// );

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <React.Suspense
//           fallback={
//             <div className="loader">
//               <div className="loaderRectangle">
//                 <div></div>
//                 <div></div>
//                 <div></div>
//                 <div></div>
//                 <div></div>
//               </div>
//             </div>
//           }
//         >
//           <BrowserRouter basename="/">
//             <Routes>
//               <Route path="/" element={<Login />} />
//               <Route path="/dashboard/*" element={<Dashboard />} />
//               {/* <Route path="/dashboard/employee-master" element={<EmployeeMaster />} /> */}
//               <Route path="/forgotPassword/*" element={<ForgotPassword />} />
//               <Route path="/resetPassword/*" element={<ResetPassword />} />
//             </Routes>
//           </BrowserRouter>
//         </React.Suspense>
//       </header>
//     </div>
//   );
// }

// export default App;







// import "./App.css";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import React from "react";

// const Login = React.lazy(() =>
//   import(/* webpackPrefetch: true */ "./component/Login")
// );
// const Dashboard = React.lazy(() =>
//   import(/* webpackPrefetch: true */ "./component/Dashboard")
// );
// const EmployeeMaster = React.lazy(() =>
//   import(/* webpackPrefetch: true */ "./component/EmployeeMaster")
// );
// const EmployeeList = React.lazy(() =>
//   import(/* webpackPrefetch: true */ "./component/EmployeeList")
// );
// const ForgotPassword = React.lazy(() =>
//   import(/* webpackPrefetch: true */ "./component/ForgotPassword")
// );
// const ResetPassword = React.lazy(() =>
//   import(/* webpackPrefetch: true */ "./component/ResetPassword")
// );

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <React.Suspense
//           fallback={
//             <div className="loader">
//               <div className="loaderRectangle">
//                 <div></div>
//                 <div></div>
//                 <div></div>
//                 <div></div>
//                 <div></div>
//               </div>
//             </div>
//           }
//         >
//           <BrowserRouter basename="/">
//             <Routes>
//               <Route path="/" element={<Login />} />
//               <Route path="/forgotPassword/*" element={<ForgotPassword />} />
//               <Route path="/resetPassword/*" element={<ResetPassword />} />
//               {/* Dashboard layout with nested routes */}
//               <Route path="/dashboard" element={<Dashboard />}>
//                 <Route path="/dashboard/employee-master" element={<EmployeeMaster />} />
//                 <Route path="employee-list" element={<EmployeeList />} />
//                 {/* Add additional nested routes if needed */}
//               </Route>
//             </Routes>
//           </BrowserRouter>
//         </React.Suspense>
//       </header>
//     </div>
//   );
// }

// export default App;
