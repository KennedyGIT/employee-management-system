import React, { Component } from "react";
import EmployeeSearch from "./employeeSearchComponent";
import EmployeeTable from "./employeeTableComponent";
import EmployeeCreate from "./employeeCreateComponent";
import EmployeeRetired from "./employeeRetiredComponent";
import Navigation from "../routes/navigation/navigation.route";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Details from "../routes/details/details.route";

class EmployeeDirectory extends Component {
  state = {
    employees: [],
    loading: true,
    error: null,
    disabled : true,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetch("http://localhost:4200/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `{
              getAllEmployees{
                _id
                FirstName
                LastName
                Age
                DateOfJoining
                TitleDepartment
                EmployeeType
                CurrentStatus
              }
          }`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.data.getAllEmployees);
        this.setState({
          employees: data.data.getAllEmployees,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        this.setState({
          employees: [],
          loading: false,
          error: error.message,
        });
      });
  };

  enableEditDeleteButtons = () => {
    this.setState({ disabled: false });
  }

  

  // Implement a function to update the employee list
  updateEmployeeList = (newEmployees) => {
    this.setState({ employees: newEmployees });
  };

  updateEmployee = (updatedEmployee) => {
    const { employees } = this.state;
    const updatedEmployees = employees.map((employee) =>
      employee._id === updatedEmployee._id ? updatedEmployee : employee
    );
    this.setState({ employees: updatedEmployees });
  };

  createEmployee = (newEmployee) => {
    const updatedEmployees = [...this.state.employees, newEmployee];
    this.setState({ employees: updatedEmployees });
  };

  deleteEmployee = (employeeId) => {
    const updatedEmployees = this.state.employees.filter(
      (employee) => employee._id !== employeeId
    );
    console.log(updatedEmployees);
    this.setState({ employees: updatedEmployees });
  };

  render() {
    const { employees, loading, error } = this.state;

    if (loading) {
      return (
        <div className="alert alert-info" role="alert">
          Loading...
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger" role="alert">
          Error: ${error}
        </div>
      );
    }

    return (
      <Router>
        <div>
          <Navigation />
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <EmployeeSearch updateEmployeeList={this.updateEmployeeList} />
                  <EmployeeTable employees={employees} deleteEmployee={this.deleteEmployee} fetchEmployees = {this.fetchData}/>
                </div>
              }
            />
            <Route
              path="/CreateEmployee"
              element={<EmployeeCreate createEmployee={this.createEmployee}/>}
            />
            <Route
              path="/RetiredEmployees"
              element={<EmployeeRetired employees={employees} fetchEmployees = {this.fetchData}/>}
            />
            <Route path="/employee/:id" element={<Details updateEmployee={this.updateEmployee} />}  />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default EmployeeDirectory;
