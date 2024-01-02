import React, { Component } from "react";

class EmployeeEdit extends Component {
  constructor(props) {
    super(props);

    // Initialize state with the details of the employee being edited
    this.state = {
      employeeDetails: {}, // State to store employee details
      error: null,
      successMessage: "",
      employeeAge : "",
      remainingTime: {},
    };
  }

  componentDidMount() {
    // Retrieve employee ID from the props
    const { id } = this.props;

    // Fetch details of the employee using the ID
    fetch(`http://localhost:4200/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetEmployee($id: ID!) {
            getEmployeeById(id: $id) {
              _id
              FirstName
              LastName
              Age
              DateOfJoining
              TitleDepartment
              EmployeeType
              CurrentStatus
            }
          }
        `,
        variables: {
          id,
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Update state with fetched employee details
        const employeeDetails = data.data.getEmployeeById;
        console.log(employeeDetails.Age)
        this.state.employeeAge = employeeDetails.Age;
        console.log("State Employee Age : " + this.state.employeeAge)
        this.setState({ employeeDetails });
        this.calculateRemainingTime(this.state.employeeAge);
      })
      .catch((error) => {
        this.setState({
          error: "Error retrieving employee details: " + error.message,
        });
      });
      
  }


  

  calculateRemainingTime = (employeeAge) => {

    const today = new Date();
    const dateOfBirth = new Date(today.getFullYear() - employeeAge, today.getMonth(), today.getDate());

    //Calculate Retirement Date by adding 65 years to Date of Birth
    const retirementDate = new Date(dateOfBirth.getFullYear() + 65, 1, 1);

    // Calculate remaining time until retirement from the current date
    const calculatedRemainingTime = this.calculateTimeDifference(today, retirementDate);

    // Set the remaining time in state
    this.setState({ remainingTime : calculatedRemainingTime });
  };

  calculateTimeDifference = (date1, date2) => {
    let diff = Math.abs(date2.getTime() - date1.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days - (years * 365 + months * 30);
    return { years, months, days: remainingDays };
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      employeeDetails: {
        ...prevState.employeeDetails,
        [name]: value,
      },
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { employeeDetails } = this.state;

    // Create a payload with the updated employee details
    const updatedEmployee = { ...employeeDetails };

    // Convert the CurrentStatus value to boolean
    updatedEmployee.CurrentStatus = updatedEmployee.CurrentStatus === 'Active';

    // Update the employee details using a GraphQL mutation
    fetch(`http://localhost:4200/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation UpdateEmployee($input: UpdateEmployeeInput!) {
            updateEmployee(input: $input) {
              _id
              FirstName
              LastName
              Age
              DateOfJoining
              TitleDepartment
              EmployeeType
              CurrentStatus
            }
          }
        `,
        variables: {
          input: updatedEmployee,
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const updatedEmployee = data.data.updateEmployee;
        this.props.updateEmployee(updatedEmployee); 
        console.log("Updated Employee:", updatedEmployee);
        this.setState({ successMessage: "Employee was updated successfully!" });
      })
      .catch((error) => {
        this.setState({
          error: "Error updating employee: " + error.message,
        });
      });
  };

  render() {
    const { employeeDetails, error, successMessage, remainingTime  } = this.state;

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className="container p-3 my-3 border">
        <form onSubmit={this.handleSubmit}>
          {/* Input fields to edit employee details */}
          {/* Populate input fields with employeeDetails */}
            <div className="row mb-3">
                <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                    className="form-control"
                    type="text"
                    name="FirstName"
                    value={this.state.employeeDetails.FirstName || ""}
                    onChange={this.handleInputChange}
                    placeholder="First Name"
                    disabled= {true}
                />
                </div>
                <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                    className="form-control"
                    type="text"
                    name="LastName"
                    value={this.state.employeeDetails.LastName || ""}
                    onChange={this.handleInputChange}
                    placeholder="Last Name"
                    disabled= {true}
                />
                </div>
            </div>
            <div className="row mb-3">
            <div className="col-md-6">
                <label className="form-label">Age</label>
                <input
                className="form-control"
                type="number"
                name="Age"
                value={this.state.employeeDetails.Age}
                onChange={this.handleInputChange}
                placeholder="Age"
                disabled= {true}
                />
            </div>
            <div className="col-md-6">
                <label className="form-label">Date Of Joining</label>
                <input
                className="form-control"
                type="date"
                name="DateOfJoining"
                value={this.state.employeeDetails.DateOfJoining}
                onChange={this.handleInputChange}
                disabled= {true}
                />
            </div>
            </div>
            <div className="row mb-3">
            <div className="col-md-6">
                <label className="form-label">Department</label>
                <input
                className="form-control"
                type="text"
                name="TitleDepartment"
                value={this.state.employeeDetails.TitleDepartment}
                onChange={this.handleInputChange}
                placeholder="Title or Department"
                
                />
            </div>
            <div className="col-md-6">
                <label className="form-label">Employee Type</label>
                <select
                className="form-select"
                name="EmployeeType"
                value={this.state.employeeDetails.EmployeeType}
                onChange={this.handleInputChange}
                disabled= {true}
                >
                <option value="">Select Employee Type</option>
                <option value="Contract">Contract</option>
                <option value="Seasonal">Seasonal</option>
                <option value="FullTime">Full-Time</option>
                <option value="PartTime">Part-Time</option>
                </select>
            </div>
            </div>
            <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Current Status</label>
              <select
                className="form-select"
                name="CurrentStatus"
                value={employeeDetails.CurrentStatus ? 'Active' : 'Inactive'}
                onChange={this.handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="row mb-3">
            <div className="col-md-12">
              <label className="form-label">Remaining Time Until Retirement</label>
              <input
              className="form-control"
              type="text"
              value={`${remainingTime.years || 0} years, ${remainingTime.months || 0} months, ${remainingTime.days || 0} days`}
              disabled= {true}
            />
            </div>
        </div>
            </div>
          {/* Add other input fields for Age, DateOfJoining, TitleDepartment, EmployeeType */}
          {/* ... */}
          <button className="btn btn-primary" type="submit">
            Update Employee
          </button>
          {error && (
            <div className="alert alert-danger mt-3">{error}</div>
          )}
          {successMessage && (
            <div className="alert alert-success mt-3">{successMessage}</div>
          )}
        </form>
      </div>
    );
  }
}

export default EmployeeEdit;
