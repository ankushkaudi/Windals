import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../helper/helper';
import toast, { Toaster } from 'react-hot-toast';
import Table from '../table';
import WindalsNav from '../navbar';
import Footer from '../footer';
import {useLocation } from 'react-router-dom';

function ViewUser() { // Changed the function name to start with an uppercase letter
  const location = useLocation()
  const { userInfo } = location.state;

  const [users, setUsers] = useState([]);
 
  const accessOptions = [ "View User", "Add User", "Update User", "Delete User", "View Product", "Add Product", "Update Product", "Delete Product",
  "View Station", "Add Station", "Update Station", "Delete Station", "Station Allocation", "Station Sequencing", 
  "View Shift", "Add Shift", "Update Shift", "Delete Shift"] 
 
  const columns = [
    { field: 'employee_id', label: 'Employee ID' },
    { field: 'first_name', label: 'First Name' },
    { field: 'last_name', label: 'Last Name' },
    { field: 'designation', label: 'Designation' },
    { field: 'joining_date', label: 'Joining Date' },
    { field: 'leaving_date', label: 'Leaving Date' },
    { field: 'mobile_no', label: 'Mobile Number' },
    { field: 'nick_name', label: 'Nick Name' },
    { field: 'user_name', label: 'User Name' },
    { field: 'access_given', label: 'Access Given'}
  ];
  
  useEffect(() => {
    // Fetch stations data
    const fetchData = async () => {
      try {
        const result = await getAllUsers();
        console.log({result:result});
        const modifiedUsers = result.map((user) => {
          if (user.mobile_no == null) {
            user.mobile_no = "Not entered";
          }
          if (user.leaving_date == null) {
            user.leaving_date = "N.A.";
          }
        
          // Check if access_given is defined before splitting
          if (user.access_given) {
            const accessGivenArray = user.access_given.split("");
            const accessGivenNames = [];
        
            accessOptions.forEach((option, index) => {
              if (accessGivenArray[index] === "1") {
                accessGivenNames.push(option);
              }
            });
        
            if (accessGivenNames.length > 0) {
              user.access_given = accessGivenNames.join(", ");
            } else {
              user.access_given = "None";
            }
          } else {
            user.access_given = "None"; // Set a default value if access_given is undefined
          }
        
          return user;
        });
        setUsers(modifiedUsers);
        toast.success(<b>Data fetched successfully</b>);
      } catch (error) {
        toast.error(error.message || 'An error occurred');
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array to run only once


  return (
    <>
    <WindalsNav/>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div style={{marginTop:'18vh'}}>
        <h1 className='heading'>User Details</h1>
      <Table columns={columns} data={users} />
      </div>
      <br />
      <br />
      
      <Footer/>
    </>
  );
}

export default ViewUser;