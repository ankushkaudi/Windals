import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './firstStation.css';
import '../product/addProduct.css'
import Footer from '../footer';
import { getOneStation, createJobId, insertInStationyyyyFirst, insertInStationyyyyFirstNextStation, getWorkAtStationInDay, logout, getOneWorkerStation, getOneEmployee, getCurrentShift, getOneStationOneProductMachinesData } from '../../helper/helper';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import WindalsNav from '../navbar';
import Table from '../table'
import {Container, Row, Col } from 'react-bootstrap';
import { faHouseMedicalCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import {useLocation } from 'react-router-dom';

const FirstStation = () => {
    const location = useLocation()
    const { userInfo, stationInfo } = location.state;
  
    //const { employeeId,employeeName, userName, stationName } = useParams();
    const [stationAllInfo, setStationAllInfo] = useState("");
    const [stationOneProductInfo, setStationOneProductInfo] = useState("");
    const [availableProducts, setAvailableProducts] = useState([]);
    const [workAtStationInDay, setWorkAtStationInDay] = useState([])
    const [employeeData, setEmployeeData] = useState("");
    const [activeShift, setActiveShift] = useState("");
    const [stations, setStations] = useState([]);
    const [machines, setMachines] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState("")
    const [selectedStation, setSelectedStation] = useState("")

    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            job_name: "",
            product_name: "",
            job_start: "",
            job_end: ""
        },
        onSubmit: (values) => {
            console.log("Creaing new Jobs")
        const start = parseInt(values.job_start, 10);
        const end = parseInt(values.job_end, 10);

        // if (isNaN(start) || isNaN(end) || start > end) {
        //     toast.error("Invalid start or end number.");
        //     return;
        // }
        const jobNames = [];
        if (isNaN(start) || isNaN(end)) {
            jobNames.push(values.job_name)
        }
        else
        {
            for (let i = start; i <= end; i++) {
                jobNames.push(`${values.job_name}${i}`);
            }    
        }
        console.log(jobNames);
   
            var tempMachineID=0;
            if (machines.length>0)
            {
                tempMachineID=selectedMachine.machine_id
            }
            const newValues = {
                product_name:stationInfo.product_name,
                station_id: stationInfo.station_id,
                employee_id: userInfo.id,
                //machine_id: selectedMachine.machine_id
                machine_id: tempMachineID,
                job_names: jobNames
            }

            console.log({ newValues: newValues });


            const createJobIdPromise = createJobId(newValues)

            createJobIdPromise.then((createJobResult) => {

                console.log({ 'createJobResult': createJobResult });
                // toast.success({createJobResult})
                console.log("Product Name")
                console.log("Product Name:",formik.values.product_name)
                if (stationInfo.product_name) {
                    console.log("Adding Job to first station")
                    const insertInStationyyyyFirstPromise = insertInStationyyyyFirst(newValues)
                    insertInStationyyyyFirstPromise.then((insertInStationyyyyResult) => {
                        console.log({ insertInStationyyyyResult: insertInStationyyyyResult });
                        const insertInStationyyyyFirstNextStationPromise = insertInStationyyyyFirstNextStation(newValues)
                        insertInStationyyyyFirstNextStationPromise.then((insertInStationyyyyFirstNextResult) => {
                            toast.success(insertInStationyyyyFirstNextResult.msg)
                            console.log("Jobs moved to next station")
                            getSubmitedJobs()
                        }).catch((insertInStationyyyyFirstNextErr) => {
                            toast.error(insertInStationyyyyFirstNextErr.msg)
                        })
                        // console.log("Jobs moved to next station")
                        // getSubmitedJobs()
                    }).catch((insertInStationyyyyErr) => {
                        toast.error(insertInStationyyyyErr.msg)
                    })
                    formik.setFieldValue('job_name', "")
                    formik.setFieldValue('job_start', "")
                    formik.setFieldValue('job_end', "")
                }
            }).catch((createJobErr) => {
                toast.error(createJobErr.msg)
            })
        }
    });
        


    // useEffect(() => {
    //     if (stationName !== "") {
    //         setSelectedStation(stationName)
    //     }
    // }, [stationName])

    useEffect(() => {
        setEmployeeData(userInfo);
        setActiveShift(userInfo.shift);
        setSelectedStation(stationInfo);
        setStations(stationInfo);
        setAvailableProducts(stationInfo.product_name)
        getSubmitedJobs()
        // const getOneEmployeeDataPromise = getOneEmployee(userName);
        // toast.promise(getOneEmployeeDataPromise, {
        //     loading: "Getting employee data",
        //     success: (result) => {
        //         setEmployeeData(result);
        //         return "data fetched";
        //     },
        //     error: (err) => {
        //         return err.msg;
        //     },
        // });
        // const getCurrentShiftPromise = getCurrentShift();
        // getCurrentShiftPromise.then((result) => {
        //     setActiveShift(result.shift_id);
        // }).catch((err) => {
        //     toast.error(err.msg);
        // });
    }, []);

    // useEffect(() => {
    //     if (userInfo.userName !== 'admin' && employeeData !== "" && activeShift !== "") {
    //         const getOneWorkerStationPromise = getOneWorkerStation(employeeData[0].employee_id, activeShift);
    //         toast.promise(getOneWorkerStationPromise, {
    //             loading: "Getting stations allocated to employee",
    //             success: (result) => {
    //                 setStations(result);
    //                 return "data fetched";
    //             },
    //             error: (err) => {
    //                 return err.msg;
    //             },
    //         });

    //     }
    // }, [employeeData, activeShift]);

    useEffect(() => {
        if (stationOneProductInfo != "") {
            console.log("stationOneProductInfo")
            getSubmitedJobs()
            const getOneStationMachineDataPromise = getOneStationOneProductMachinesData(stationOneProductInfo[0].station_id)
            toast.promise(getOneStationMachineDataPromise, {
                loading: "Getting machines data of this station",
                success: (result) => {
                    setMachines(result);
                    return "data fetched";
                },
                error: (err) => {
                    return err.msg;
                },
            });
        }
    }, [stationOneProductInfo])

    // useEffect(() => {
    //     const getStationAllInfoPromise = getOneStation(stationName)
    //     getStationAllInfoPromise.then((result) => {
    //         setStationAllInfo(result)
    //     }).catch((err) => {
    //         toast.error(err.msg)
    //     })
    // }, []);

    // useEffect(() => {
    //     if (stationAllInfo.length > 0) {
    //         const productNames = [...new Set(stationAllInfo.map((station) => station.product_name))];
    //         setAvailableProducts(productNames);
    //     }
    // }, [stationAllInfo])

    useEffect(() => {
        if (formik.values.product_name !== "") {
            const stationOneProductInfo = stationAllInfo.filter((station) => {
                return station.station_name === stationInfo.station_name && station.product_name === formik.values.product_name;
            });
            console.log("Setting Product Info")
            setStationOneProductInfo(stationOneProductInfo);
            getSubmitedJobs()
        }
    }, [formik.values.product_name])

    const getSubmitedJobs = () => {
        console.log("Stations jobs Submiited Fetch:",stationOneProductInfo[0])
        if (stationOneProductInfo != "") {
            const stationId = stationOneProductInfo[0].station_id
            const getWorkAtStationInDayPromise = getWorkAtStationInDay(stationId,userInfo.id)
            getWorkAtStationInDayPromise.then((result) => {
                setWorkAtStationInDay(result)
            }).catch((err) => {
                console.log(err);
                toast.error(err.msg)
            })
        }
    }

    const handleStationSelection = (target) => {
        // Use the selectedStation value to construct the path or page you want to navigate to
        const selectedIndex = parseInt(target.options[target.selectedIndex].getAttribute("data-index"), 10);

        // if (selectedIndex !== -1) {
        //     const selectedStation = stations[selectedIndex];
        //     if (selectedStation.position === 1) {
        //         navigate(`/FirstStation/${employeeData[0].employee_id}/${employeeData[0].user_name}/${selectedStation.station_name}`);
        //     }
        //     else {
        //         navigate(`/Station/${employeeData[0].employee_id}/${employeeData[0].user_name}/${selectedStation.station_name}`);
        //     }
        // }

    };

    const handleMachineSelection = (selectedMachine) => {
        setSelectedMachine(selectedMachine);
    };


    // console.log({"stationOneProductInfo":stationOneProductInfo,"stationAllinfo":stationAllInfo});
    console.log({ "workAtStationInDay": workAtStationInDay, selectedMachine: selectedMachine });
    return (

        <>
            <WindalsNav />
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            {/* <button onClick={()=>{logout()}}>Log Out</button> */}

            <div className="firststat">
                <h1>First Station</h1>

                <div className='divide'>
                    <div className='fslist sbox'>
                        {/* <h3>Worker Details</h3> */}
                        <h5 >Station Name : {stationInfo.station_name}</h5>
                        <h5 >Employee Name : {userInfo.name}</h5>
                        <h5 >Product Name : {stationInfo.product_name}</h5>
                    </div>

                    <div className='workerform'>
                    {/* <div style={{ fontSize: '1.2rem' }}>
                        <label style={{ margin: 6, fontWeight: 500 }}>Select a Station: </label>
                        <select style={{ margin: 6 }} value={stationInfo.stationName} onChange={(e) => handleStationSelection(e.target)}>
                            <option value="" data-index={-1}>Select a station</option>
                            {stations.map((station, index) => (
                                <option key={index} value={station.station_name} data-index={index}>
                                    {station.station_name}
                                </option>
                            ))}
                        </select>
                    </div> */}

                    <div className="form-group">
                        {/* <label style={{ fontSize: '1.5rem', marginTop:'4vh' }} htmlFor="productSelect">Select Product</label>
                        <select
                            id="productSelect"
                            value={formik.values.product_name}
                            name="product_name"
                            onChange={formik.handleChange}
                        >
                            <option value="">--Select Product--</option>
                            {availableProducts.map((product, index) => (
                                <option key={index} value={product}>
                                    {product}
                                </option>
                            ))}
                        </select> */}
                        {machines.length>0 && 
                        <>
                        <label style={{ fontSize: '1.5rem', marginTop:'4vh' }}>Select a Machine: </label>
                        <select onChange={(e) => handleMachineSelection(JSON.parse(e.target.value))}>
                            <option value="">Select a machine</option>
                            {machines.map((machine, index) => (
                                <option key={index} value={JSON.stringify(machine)}>
                                    {machine.machine_name}
                                </option>
                            ))}
                        </select>
                        </>}
                        <br />
                        <br />
                    </div>
                    <div className="form-group">
                        <Container>
                            <Row>
                                <Col>
                                    <label style={{ fontSize: '1.5rem', marginTop:'4vh' }} htmlFor="job_nameInput">Job Name</label>
                                    <input
                                        type="text"
                                        className='jobnameinp'
                                        id="job_nameInput"
                                        value={formik.values.job_name}
                                        name="job_name"
                                        onChange={formik.handleChange}
                                        style={{ width: '40%',height:'4vh', border:'1px solid black' }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <label style={{ fontSize: '1.5rem', marginTop:'4vh' }} htmlFor="job_nameInput">Start</label>
                                    <input
                                        type="number"
                                        className='jobstart'
                                        id="job_start"
                                        value={formik.values.job_start}
                                        name="job_start"
                                        onChange={formik.handleChange}
                                        style={{ width: '40%',height:'4vh', border:'1px solid black' }}
                                    />
                                </Col>
                                <Col>
                                    <label style={{ fontSize: '1.5rem', marginTop:'4vh' }} htmlFor="job_nameInput">end</label>
                                    <input
                                        type="number"
                                        className='jobend'
                                        id="job_end"
                                        value={formik.values.job_end}
                                        name="job_end"
                                        onChange={formik.handleChange}
                                        style={{ width: '40%',height:'4vh', border:'1px solid black' }}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </div>

                    <div>
                        <button type="submit" className="btn btn-success" style={{ width: 200, marginBottom: '10', marginTop:10 }} onClick={formik.handleSubmit}>
                            Add Job
                        </button>
                    </div>

                    {workAtStationInDay.length > 0 ?
                        <div className='jobsub' style={{alignItems:'center',marginTop:30}}>
                            <h2>Jobs Submitted</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{padding:10}}>Job Name</th>
                                        <th style={{padding:10}}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(workAtStationInDay) && workAtStationInDay.map((job, index) => (
                                        <tr key={index}>
                                            <td style={{padding:10}}>{job.job_name}</td>
                                            <td style={{padding:10}}>{job.status == 1 ? "OK" : "Not-Ok"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        : null}
                </div>

                </div>
                <br />
                <br />
                <br />
                <Footer />
            </div>
        </>
    );
};

export default FirstStation;