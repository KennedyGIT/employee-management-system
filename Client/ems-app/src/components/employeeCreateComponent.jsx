import React, { Component } from "react";

class EmployeeCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      FirstName: "",
      LastName: "",
      Age: "",
      DateOfJoining: "",
      TitleDepartment: "",
      EmployeeType: "",
      CurrentStatus: true, // Assuming a new employee is active by default
      error: null,
      successMessage: "",
    };
  
  }
  

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // Perform input validation here
    if (this.isFormValid()) {
      // Create a new employee object based on the form input
      const newEmployee = {
        FirstName: this.state.FirstName,
        LastName: this.state.LastName,
        Age: this.state.Age,
        DateOfJoining: this.state.DateOfJoining,
        TitleDepartment: this.state.TitleDepartment,
        EmployeeType: this.state.EmployeeType,
        CurrentStatus: this.state.CurrentStatus,
      };

      console.log(newEmployee);

      fetch("http://localhost:4200/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `mutation CreateEmployee($input: EmployeeInput!) {
            createEmployee(input: $input) {
              FirstName
              LastName
              Age
              DateOfJoining
              TitleDepartment
              EmployeeType
              CurrentStatus
            }
          }`,
          variables: {
            input: newEmployee
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
          // Assuming the created employee is returned in data.createEmployee
          const createdEmployee = data.data.createEmployee;
          this.props.createEmployee(createdEmployee); // Update the employee list after successful creation
          this.clearForm();
          this.setState({ successMessage: "Employee Created successfully!" });
        })
        .catch((error) => {
          this.setState({
            error: "Error creating employee: " + error.message,
          });
        });
    }
  };

  

  isFormValid() {
    const {
      FirstName,
      LastName,
      Age,
      DateOfJoining,
      TitleDepartment,
      EmployeeType,
    } = this.state;

    // Check if any of the required fields are empty
    if (
      !FirstName ||
      !LastName ||
      !Age ||
      !DateOfJoining ||
      !TitleDepartment ||
      !EmployeeType
    ) {
      this.setState({ error: "All fields are required." });
      return false;
    }

    // Check if Age is a positive number
    if (isNaN(Age) || parseInt(Age) <= 0) {
      this.setState({ error: "Age must be a positive number." });
      return false;
    }

    // Check if DateOfJoining is a valid date
    if (isNaN(Date.parse(DateOfJoining))) {
      this.setState({ error: "Date of Joining is not a valid date." });
      return false;
    }

    // If all checks pass, return true to indicate the form is valid
    this.setState({ error: null });
    return true;
  }

  clearForm() {
    this.setState({
      FirstName: "",
      LastName: "",
      Age: "",
      DateOfJoining: "",
      TitleDepartment: "",
      EmployeeType: "",
      CurrentStatus: true,
      error: null, // Clear any previous error messages
    });
  }

  render() {
    return (
      <div className="container p-3 my-3 border">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Employee</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <div className="mb-3">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="FirstName"
                    value={this.state.FirstName}
                    onChange={this.handleInputChange}
                    placeholder="First Name"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="LastName"
                    value={this.state.LastName}
                    onChange={this.handleInputChange}
                    placeholder="Last Name"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Age</label>
                  <input
                    className="form-control"
                    type="number"
                    name="Age"
                    value={this.state.Age}
                    onChange={this.handleInputChange}
                    placeholder="Age"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Date Of Joining</label>
                  <input
                    className="form-control"
                    type="date"
                    name="DateOfJoining"
                    value={this.state.DateOfJoining}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Department</label>
                  <input
                    className="form-control"
                    type="text"
                    name="TitleDepartment"
                    value={this.state.TitleDepartment}
                    onChange={this.handleInputChange}
                    placeholder="Title or Department"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Employee Type</label>
                  <select
                    className="form-select"
                    name="EmployeeType"
                    value={this.state.EmployeeType}
                    onChange={this.handleInputChange}
                  >
                    <option value="">Select Employee Type</option>
                    <option value="Contract">Contract</option>
                    <option value="Seasonal">Seasonal</option>
                    <option value="FullTime">Full-Time</option>
                    <option value="PartTime">Part-Time</option>
                  </select>
                </div>
              </div>
            </div>
            <button className="btn btn-primary" type="submit">
              Create Employee
            </button>



            {this.state.error && (
              <div className="alert alert-danger mt-3">{this.state.error}</div>
            )}

            {this.state.successMessage && (
              <div className="alert alert-success mt-3">{this.state.successMessage}</div>
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default EmployeeCreate;
