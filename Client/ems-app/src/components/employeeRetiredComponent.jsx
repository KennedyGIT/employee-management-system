import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class EmployeeRetired extends Component {
  state = {
    filterType: '', // State to store the selected filter type
    error : null
    
  };

  componentDidMount() {
    this.props.fetchEmployees();
  }

  handleFilterChange = (e) => {
    const { value } = e.target;
    this.setState({ filterType: value });
  };

  calculateRetirementAge = () => {
    const today = new Date();
    const retirementDate = new Date(today.getFullYear() - 64, today.getMonth() + 5, today.getDate());
    return retirementDate;
  };


  render() {
    const { employees } = this.props;
    const { filterType } = this.state;

    // Calculate retirement age with 6 months buffer
    const retirementAge = this.calculateRetirementAge();

    // Filter employees based on the selected employee type
    const filteredEmployees = employees.filter((employee) => {
        const today = new Date();
        const employeeJoiningDate = new Date(employee.DateOfJoining);
        const employeeBirthDate = new Date(today.getFullYear() - employee.Age, employeeJoiningDate.getMonth() , employeeJoiningDate.getDate());
        return (
          (!filterType || employee.EmployeeType === filterType) &&
          employeeBirthDate <= retirementAge
        );
      });

    if (employees.length === 0) {
      return <div className="alert alert-warning" role="alert"> No Employees found! </div>;
    }

    return (
      
      <div>
         <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Upcoming Retirement</h2>
        <div className="mb-3">
          <label htmlFor="employeeFilter" className="form-label">
            Filter by Employee Type:
          </label>
          <select
            id="employeeFilter"
            className="form-select"
            value={filterType}
            onChange={this.handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="Contract">Contract</option>
            <option value="Seasonal">Seasonal</option>
            <option value="FullTime">Full-Time</option>
            <option value="PartTime">Part-Time</option>
          </select>
        </div>
        <table className="table container p-3 my-3 border">
          <thead className="thead-dark">
            <tr>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Age</th>
              <th scope="col">Date of Joining</th>
              <th scope="col">Title/Department</th>
              <th scope="col">Employee Type</th>
              <th scope="col">Current Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.FirstName}</td>
                <td>{employee.LastName}</td>
                <td>{employee.Age}</td>
                <td>{employee.DateOfJoining}</td>
                <td>{employee.TitleDepartment}</td>
                <td>{employee.EmployeeType}</td>
                <td>{employee.CurrentStatus ? 'Active' : 'Inactive'}</td>
                
              </tr>
            ))}
          </tbody>
        </table><div>
        {this.state.error && (
          <div className="alert alert-danger alert-dismissible">
            {this.state.error}
            <button
              type="button"
              className="btn-close"
              onClick={this.dismissError}
              aria-label="Close"
            ></button>
          </div>)}
        </div>
      </div>
    );
  }
}

export default EmployeeRetired;
