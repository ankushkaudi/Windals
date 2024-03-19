import React, { useState } from 'react';
import Table from '../table';
import WindalsNav from '../navbar';
import toast, { Toaster } from 'react-hot-toast';
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import Footer from '../footer';
import { GetCompletedJobsReport, GetDailyProductionReport, GetTrackingUserReport } from '../../helper/helper';
import { Button, Form, Alert, Row } from 'react-bootstrap';
import './dailyProductionReport.css'
import {useLocation } from 'react-router-dom';

function DailyProductionReport() {
    const location = useLocation()
    const { userInfo } = location.state;
  
    const currentPath = window.location.pathname;

    // Split the path by '/'
    const pathParts = currentPath.split('/');
     // Get the last part of the path (the end of the URL)
     const endOfUrl = pathParts.pop();
    console.log(endOfUrl);

  const dailyProductionColumns = [
    { label: 'Sr.', field: 'sr' },
    { label: 'In Time', field: 'intime' },
    { label: 'Out Time', field: 'out_time' },
    { label: 'Station Name', field: 'station_name' },
    { label: 'Model No/Product name', field: 'product_name' },
    { label: 'Heat Code No', field: 'job_name' },
    { label: 'Status', field: 'status' },
    { label: 'User Name', field: 'employee_name' },
  ];

  const userTrackingColumns = [
    { label: 'Employee Id', field: 'employee_id' },
    { label: 'User Name', field: 'employee_name' },
    { label: 'Model No/Product name', field: 'product_name' },
    { label: 'Station Name', field: 'station_name' }
  ]

  const completedJobsColumns = [
    { label: 'Job Id', field: 'job_id' },
    { label: 'Job Name', field: 'job_name' },
    { label: 'Model No/Product name', field: 'product_name' },
  ]

  const [dailyProductionData,setDailyProductionData] = useState("") 
  const [userTrackingData,setUserTrackingData] = useState("")
  const [completedJobsData,setCompletedJobsData] = useState("")

  const validationSchema = Yup.object().shape({
    formDate : Yup.date().required("Select from-Date"),
    toDate : Yup.date().required("Select to-Date")
  })

    const formik = useFormik({
        initialValues:{
            fromDate: Date.now(),
            toDate: Date.now()
        },
        // validationSchema: validationSchema,
        onSubmit: async (values) => {
            if(endOfUrl==="DailyProductionReport")
            {
                const getDailyProductionReportPromise = GetDailyProductionReport(values)
                toast.promise(
                    getDailyProductionReportPromise,
                    {
                        loading: "Getting the data, please wait.",
                        success: (result) =>{
                            console.log(result);
                            const newResult = result.map((data,key)=>{
                                return {
                                    ...data,
                                    sr: (key+1),
                                    status: data.status === 1 ? 'OK' : data.status === 2 ? "Ok with deviation" : data.status === -1 ? "Not-Ok" : data.status === -2 ? "Rework" : "Reject"                                         
                                }
                            })
                            console.log({newResult:newResult});
                            setDailyProductionData(newResult)
                        },
                        error: (err) => {
                            return err.msg
                        } 
                    }
                )
            }
            else if(endOfUrl==="TrackingUserReport")
            {
                const getTrackingUserReportPromise = GetTrackingUserReport(values)
                toast.promise(
                    getTrackingUserReportPromise,
                    {
                        loading: "Getting the data, please wait.",
                        success: (result) =>{
                            console.log(result);
                            setUserTrackingData(result)
                        },
                        error: (err) => {
                            return err.msg
                        } 
                    }
                )
            }
            else if(endOfUrl==="CompletedJobsReport")
            {
                const getCompletedJobsReportPromise = GetCompletedJobsReport(values)
                toast.promise(
                    getCompletedJobsReportPromise,
                    {
                        loading: "Getting the data, please wait.",
                        success: (result) =>{
                            console.log(result);
                            setCompletedJobsData(result)
                        },
                        error: (err) => {
                            return err.msg
                        } 
                    }
                )
            }
        }
    })
  
  return (
    <>
        <WindalsNav/>
        <Toaster position="top-center" reverseOrder={false}></Toaster>
            <Form className='mainDiv'>
                <div className='firstRow'>
                    <Form.Group style={{display:'flex', justifyContent:'space-between', flexDirection:'row'}}>
                            <Form.Label>From Date:</Form.Label>
                            <Form.Control
                                style={{width:'55%'}}
                                type="date"
                                name="fromDate"
                                onChange={formik.handleChange}
                                value={formik.values.fromDate}
                            />
                            {formik.touched.fromDate && formik.errors.fromDate && (
                                <Alert variant="danger" className="error-message">{formik.errors.fromDate}</Alert>
                            )}
                    </Form.Group>
                    <Form.Group style={{display:'flex', justifyContent:'space-between', flexDirection:'row'}}>
                            <Form.Label>To Date:</Form.Label>
                            <Form.Control
                                style={{width:'55%'}}
                                type="date"
                                name="toDate"
                                onChange={formik.handleChange}
                                value={formik.values.toDate}
                            />
                            {formik.touched.toDate && formik.errors.toDate && (
                                <Alert variant="danger" className="error-message">{formik.errors.toDate}</Alert>
                            )}
                    </Form.Group>
                </div>
                <div className='secondRow'>
                    <Button variant="danger" type="button" className="add-button-stn" onClick={formik.handleSubmit}>Get Data</Button>    
                </div>
            </Form>
        { endOfUrl==="DailyProductionReport" && dailyProductionData.length!==0 && <Table columns={dailyProductionColumns} data={dailyProductionData} /> }
        { endOfUrl==="TrackingUserReport" && userTrackingData.length!==0 && <Table columns={userTrackingColumns} data={userTrackingData} /> }
        { endOfUrl==="CompletedJobsReport" && completedJobsData.length!==0 && <Table columns={completedJobsColumns} data={completedJobsData} /> }
        
        <Footer />
    </>
  );
}


export default DailyProductionReport;
