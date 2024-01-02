const Employee = require("../models/employee");

// Define GraphQL resolvers. Resolvers define how to retrieve or mutate data.
const resolvers = {
  Query: {
    // Resolver for the 'getAllEmployees' query.
    getAllEmployees: async (_, args) => {
      try {
        // Define an empty filter (initially) for the database query.
        const filter = {};

        // Use the 'Employee' model to find records in the database that match the filter.
        const result = await Employee.find(filter);

        // Return the result (typically an array of employee records).
        return result;
      } catch (error) {
        // Handle any errors, for instance, log the error, and return null.
        console.error(error);
        return null;
      }
    },

    getEmployeeById: async (_, { id }) => {
      try {
        // Use the 'Employee' model to find a record in the database by ID.
        const employee = await Employee.findById(id);

        // Return the found employee record.
        return employee;
      } catch (error) {
        // Handle any errors, for instance, log the error, and return null.
        console.error(error);
        return null;
      }
    },
    
  },
  
  Mutation: {
    createEmployee: async (_, args) => {
      // Create a new 'Employee' document based on the 'input' argument provided.
      const newEmployee = new Employee(args.input);

      // Log the 'args' to inspect the data received in the mutation.
      console.log(args);

      try {
        // Save the new 'Employee' document to the database.
        const result = await newEmployee.save();

        // Log the 'result' to inspect the saved document (optional).
        console.log(result);

        // Return the saved 'Employee' document.
        return result;
      } catch (error) {
        // If there's an error during saving, throw an error with an error message.
        throw new Error(error.message);
      }
    },
    updateEmployee: async (_, { input }) => {
      const { _id, ...updateData } = input;
      console.log(input._id);
      try {
        // Find the employee by ID and update the fields
        const updatedEmployee = await Employee.findByIdAndUpdate(_id, updateData, {
          new: true, // Return the updated document
          useFindAndModify: false, // To use native findOneAndUpdate() rather than deprecated findOneAndUpdate()
        });

        return updatedEmployee;
      } catch (error) {
        throw new Error(`Error updating employee: ${error.message}`);
      }
    },
    deleteEmployeeById: async (_, { id }) => {
      try {
        // Find the employee by ID and delete it
        const deletedEmployee = await Employee.findByIdAndDelete(id);

        // If the employee was found and deleted, return the deleted employee details
        if (deletedEmployee) {
          return deletedEmployee;
        } else {
          throw new Error('Employee not found');
        }
      } catch (error) {
        throw new Error(`Error deleting employee: ${error.message}`);
      }
    },
  },
};

// Export the 'resolvers' object to make it available to the GraphQL server.
module.exports = resolvers;
