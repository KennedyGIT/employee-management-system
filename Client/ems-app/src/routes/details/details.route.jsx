import React from 'react';
import { useParams } from 'react-router-dom';
import EmployeeEdit from '../../components/employeeEditDetailsComponent'; 

const Details = ({ updateEmployee, buttonActivator}) => {
    const { id } = useParams();
  
    return <EmployeeEdit id={id} updateEmployee={updateEmployee} enableButtons = {buttonActivator}/>;
  }
  
  export default Details;
