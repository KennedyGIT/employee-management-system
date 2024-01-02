import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class EmployeeTable extends Component {
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

  handleEdit = (employeeId) => {
    // Find the employee object from the list based on the employeeId
    //const employeeToEdit = this.props.employees.find(
     // (employee) => employee._id === employeeId
    //);
    this.props.history.push(`/employee/${employeeId}`);
    
  };

  handleDelete = (employeeId) => {

    const employeeToDelete = this.props.employees.find(
      (employee) => employee._id === employeeId
    );

    if (employeeToDelete.CurrentStatus) {
      this.setState({ error: "An active employee cannot be deleted." });
    }
    else
    {
        // Perform the delete operation using fetch
      fetch(`http://localhost:4200/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation DeleteEmployee($id: ID!) {
              deleteEmployeeById(id: $id) {
                _id
              }
            }
          `,
          variables: {
            id: employeeId,
          },
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log(data.data.deleteEmployeeById);
          this.props.deleteEmployee(employeeId);
        })
        .catch((error) => {
          return <div className="alert alert-warning" role="alert"> error </div>;
        });
      }
    
  };

  dismissError = () => {
    this.setState({ error: null });
  };

  render() {
    const { employees, updateEmployeeTable } = this.props;
    const { filterType } = this.state;

    // Filter employees based on the selected employee type
    const filteredEmployees = filterType
      ? employees.filter((employee) => employee.EmployeeType === filterType)
      : employees;

    if (employees.length === 0) {
      return <div className="alert alert-warning" role="alert"> No Employees found! </div>;
    }

    return (
      
      <div>
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
              <th scope="col"></th>
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
                <td>
                  <Link to={`/employee/${employee._id}`}
                    className="btn btn-primary me-2"
                    onClick={() => this.handleEdit(employee._id)}
                    
                  >
                    Edit/View Details
                  </Link >
                
                <button
                    className="btn btn-danger"
                    onClick={() => this.handleDelete(employee._id)}
                    
                  >
                    Delete
                  </button>
                </td>
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

export default EmployeeTable;
