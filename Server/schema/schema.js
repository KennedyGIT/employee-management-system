const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Employee {
    _id: ID
    FirstName: String
    LastName: String
    Age: String
    DateOfJoining: String
    TitleDepartment: String
    EmployeeType: String
    CurrentStatus: Boolean
  }

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

  type Query {
    employees: [Employee]
    getAllEmployees(
      FirstName: String
      LastName: String
      Age: String
      DateOfJoining: String
      TitleDepartment: String
      EmployeeType: String
      CurrentStatus: Boolean
    ): [Employee]
    getEmployeeById(id: ID!): Employee
  }

  input EmployeeInput {
    FirstName: String
    LastName: String
    Age: String
    DateOfJoining: String
    TitleDepartment: String
    EmployeeType: String
    CurrentStatus: Boolean
  }

  input UpdateEmployeeInput {
    _id: ID!
    FirstName: String
    LastName: String
    Age: String
    DateOfJoining: String
    TitleDepartment: String
    EmployeeType: String
    CurrentStatus: Boolean
  }

  type Mutation {
    createEmployee(input: EmployeeInput): Employee
    updateEmployee(input: UpdateEmployeeInput!): Employee
    deleteEmployeeById(id: ID!): Employee
  }
`;

module.exports = typeDefs;
