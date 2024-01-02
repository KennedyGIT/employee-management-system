/*
   GROUP 8
   MBANO KENNEDY - 8826852
   ASHITKUMAR JASOLIYA - 8871074
   HINAL VAGHELA - 8873133

   GROUP RESPONSIBILITY
   GRAPHQL API (Including Resolver, schema, models and dbinit file) - KENNEDY
   EMPLOYEE DIRECTORY AND EMPLOYEE TABLE COMPONENTS - ASHITKUMAR
   CREATE EMPLOYEE AND SEARCH EMPLOYEE COMPONENTTS - HINAL


 */

import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import EmployeeDirectory from "./components/employeeDirectoryComponent";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div className="container p-3 my-3 border">
      <EmployeeDirectory />
    </div>
  </React.StrictMode>
);
