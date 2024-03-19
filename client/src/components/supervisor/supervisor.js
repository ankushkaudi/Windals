import React from "react";
import WindalsNav from "../navbar";
import './supervisor.css'
import Footer from "../footer";
import Table from 'react-bootstrap/Table';
import { getStationRework,insertInStationyyyyFirstNextStation,updateJobsfromSupervisorDash , insertInStationyyyySameStation, updateJobStatus} from "../../helper/helper";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {useLocation } from 'react-router-dom';

function Supervisor() {
  const location = useLocation()
  const { userInfo } = location.state;

    const [rework, setRework] = useState([]);
    
    useEffect(() => {
        const getStationReworkPromise = getStationRework();
    
        toast.promise(getStationReworkPromise, { 
          loading: "Fetching data",
          success: (result) => {
            const resultWithStatus = result.map(item => ({ ...item, status: -1 }));
            setRework(resultWithStatus);
            toast.success(<b>Data fetched successfully</b>);
          },
          error: (err) => {
            toast.error(err.msg);
          },
        });
      }, []);

      const handleButtonClick = (index, buttonType) => {
        const updatedRework = [...rework];

        const dataForServer={
          job_name: updatedRework[index].job_name,
          product_name: updatedRework[index].product_name,
          station_id: updatedRework[index].station_id,
          machine_id: updatedRework[index].machine_id,
          employee_id:updatedRework[index].employee_id,
          status: updatedRework[index].status,
          parameters:updatedRework[index].parameters
        }
  
        // const newValues={product_name:updatedRework[index].product_name, 
        //                  station_id:updatedRework[index].station_id, 
        //                  job_name:updatedRework[index].job_name,
        //                  employee_id:updatedRework[index].employee_id,
        //                  status:updatedRework[index].status,
        //                  parameters:updatedRework[index].parameters,
        //                  machine_id:updatedRework[index].machine_id,
        //                  station_name:updatedRework[index].station_name};

        //  const insertValues={product_name:updatedRework[index].product_name, 
        //                     station_id:updatedRework[index].station_id, 
        //                     job_name:updatedRework[index].job_name,
        //                     };
        // console.log({buttonType:buttonType})
        if (buttonType === "ok") {
          dataForServer.status=2
          // newValues.status = 2;
          // console.log({"this1":newValues});
          // // Call insertInStationyyyyFirstNextStation here
         
          // const  updateJobsfromSupervisorDashPromise = updateJobsfromSupervisorDash(newValues)
          // updateJobsfromSupervisorDashPromise.then((result)=>{
          //   const insertInStationyyyyFirstNextStationPromise = insertInStationyyyyFirstNextStation(insertValues)
          //   toast.promise(insertInStationyyyyFirstNextStationPromise,{
          //     loading: "Inserting data",
          //     error: (err) => err.msg,
          //     success: (result)=> {
          //         return result.msg
          //     }
          //   }) 
          // }).catch((err)=>{
          //   toast.error(err.msg)
          // })
          
          //setRework(updatedRework.filter((item, i) => i !== index));
        } else if (buttonType === "notOk") {
          dataForServer.status=-3
          // newValues.status = -2;
         
          
          // console.log(newValues);
          // // You can handle any other logic for "Not Ok" here if needed
          // updateJobsfromSupervisorDash(newValues)
          //   .then(() => {
          //     toast.success("Job updated at the station for rework");
          //   })
          //   .catch((error) => {
          //     toast.error(error.msg);
          //   });

            //setRework(updatedRework.filter((item, i) => i !== index));
        } else if (buttonType === "rework") {
          dataForServer.status=-2
          // newValues.status = -3;

          // // console.log(newValues);
          // const  updateJobsfromSupervisorDashPromise = updateJobsfromSupervisorDash(newValues)
          // updateJobsfromSupervisorDashPromise.then((result)=>{
          //   const insertInStationyyyySameStationPromise = insertInStationyyyySameStation(insertValues)
          //   toast.promise(insertInStationyyyySameStationPromise,{
          //     loading: "Inserting data",
          //     error: (err) => err.msg,
          //     success: (result)=> {
          //         return result.msg
          //     }
          //   }) 
          // }).catch((err)=>{
          //   toast.error(err.msg)
          // })
          
          //setRework(updatedRework.filter((item, i) => i !== index));
          // Call updateJobesAtStation here
          // updateJobsfromSupervisorDash(newValues)
          //   .then(() => {
          //     toast.success("Job updated at the station for rework");
          //   })
          //   .catch((error) => {
          //     toast.error(error.msg);
          //   });
          //   setRework(updatedRework.filter((item, i) => i !== index));
        }
        console.log("Data For Server:",dataForServer)
        const updateJobeAtStationPromise = updateJobStatus(dataForServer)
        updateJobeAtStationPromise.then((result) => {
          toast.success(result.msg)
          setRework(updatedRework.filter((item, i) => i !== index));
        }).catch((err) => {
          toast.error(err.msg)
          console.log(err);
        })
        
      };
    
    return (
        <>
            <div>
                <WindalsNav />
                <div className="superv">
                    <h1>Supervisor Dashboard</h1>
                    <div className="svdash">
                    <table className="product-table" style={{width:"50%"}}>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Job</th>
                            <th>Station</th>
                            <th>Reason</th>
                            <th>Ok</th>
                            <th>Not Ok</th>
                            <th>Rework</th>
                            </tr>
                        </thead>
                        <tbody>
                        {rework.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        {/* <td>{item.job_id}</td>
                                        <td>{item.station_id}</td> */}
                                        <td>{item.job_name}</td>
                                        <td>{item.station_name}</td>
                                        <td>{item.parameters}</td>
                                        
                                        <td>
                                            <Button variant="success"
                                            onClick={() => handleButtonClick(index, "ok")}
                                            >Ok</Button>
                                        </td>
                                        <td>
                                            <Button variant="danger"
                                            onClick={() => handleButtonClick(index, "notOk")}
                                            >Not Ok</Button>
                                        </td>
                                        <td>
                                            <Button variant="warning"
                                            onClick={() => handleButtonClick(index, "rework")}
                                            >Rework</Button>
                                        </td>
                                    </tr>
                                ))}
                            
                        </tbody>
                        </table>

                    </div>




                </div>
                <Footer />
            </div>

        </>
    )
}

export default Supervisor;