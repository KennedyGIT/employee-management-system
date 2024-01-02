const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  Age: String,
  DateOfJoining: String,
  TitleDepartment: String,
  EmployeeType: String,
  CurrentStatus: Boolean,
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
