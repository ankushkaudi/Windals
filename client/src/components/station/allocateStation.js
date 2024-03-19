import React, { useEffect, useState } from "react";
import { Table, Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import Select from 'react-select'
import { useFormik } from "formik";
import toast, { Toaster } from 'react-hot-toast';
import Multiselect from "multiselect-react-dropdown";
import { getAllStationNames, getAllWorkerNames, addStationAllocation, getActiveShiftNames, getWorkerAllocation,getProductStationAllocation, copyStationAllocation } from "../../helper/helper";
import WindalsNav from "../navbar";
import * as Yup from "yup";
import Footer from '../footer';
import './allocateStation.css';
import { getProductNames, getOneProductStationNames } from "../../helper/helper";
import {useLocation } from 'react-router-dom';

function StationAllocation() {
    const location = useLocation()
    const { userInfo } = location.state;
  
    const today = new Date();
    const [workers, setWorkers] = useState([]);
    const [workersCompleteName, setWorkersCompleteName] = useState({});
    const [stations, setStations] = useState([]);
    const [allocationStation, setAllocationStation] = useState([]);
    const [availableWorkerNames, setAvailableWorkerNames] = useState([]);
    const [selectedWorkers, setSelectedWorkers] = useState([]); // Maintain a list of selected workers
    const [activeShiftNames, setActiveShiftNames] = useState([]);
    const [allocatedData, setallocatedData] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [shift, setShift] = useState([]);
    //const [showEntry, setShowEntry] = useState(true);
    var srcProduct="";

    useEffect(() => {
        const getProductNamesPromise = getProductNames();
        getProductNamesPromise.then((result) => {
            console.log("Product Names");
            console.log(result);
            const productNames = result.map((product) => product);
            //const productNames = result.map((product) => product.product_name);
            setProductNames(result);
        }).catch((err) => {
            toast.error(err.msg);
        });
    }, []);

    useEffect(() => {
        //fetchStationsAndWorkers();
        const getActiveShiftNamesPromise = getActiveShiftNames()
        getActiveShiftNamesPromise.then((result) => {
            setActiveShiftNames(result)
        }).catch((err) => {
            toast.error(err.msg)
        })
    }, []);

    const fetchStationsAndWorkers = async () => {
        try {
            const stationNames = await getAllStationNames();
            setStations(stationNames);

            const workerNames = await getAllWorkerNames();
            setWorkers(workerNames);

            const tempObj = {};

            for (const w of workerNames) {
                const { first_name, last_name, employee_id, user_name } = w;
                tempObj[first_name + " " + last_name + " " + user_name] = { employee_id, name: first_name + " " + last_name + " " + user_name };
            }

            setWorkersCompleteName(tempObj);

            // Initialize allocationStation based on stations
            const initialAllocationStation = stationNames.map((station) => ({
                station: station.station_name,
                workers: [],
            }));
            console.log("Hello");
            setAllocationStation(initialAllocationStation);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const fetchStations = async () => {
        try {
            console.log("Fetching Station List : " ,formik.values.productName, ":", formik.values.productName.label,":",formik.values.shift.value);
            const stationNames = await getOneProductStationNames(formik.values.productName.label);
            const stationUserAllocated = await getProductStationAllocation(formik.values.productName.label,formik.values.shift.value);
            //const stations = stationNames.map((station) => station.station_name);
            //setStations(stations);
            console.log(stationNames);
            console.log("Allocation Details:",stationUserAllocated);
            //const updatedAllocation = [...formik.values.stationAllocations];
            //console.log("Allocations:");
            //console.log(updatedAllocation);
            //updatedAllocation[0].workers = ["w1 w1 w1"];
            //formik.setFieldValue("stationAllocations", updatedAllocation);
            //Array.isArray(stationUserAllocated)
            const initialAllocationStation = stationNames.map((station) => ({
                station: station.station_name,
                stationId:station.station_id,
                workers: [],
                removed:[],
            }));
            if (Array.isArray(stationUserAllocated))
            {
                    initialAllocationStation.forEach((station)=>{
                        console.log("station:",station)
                        stationUserAllocated.forEach((value)=>{
                            console.log("Fetched:",value)
                        if (value.stationId===station.stationId)
                        {
                            console.log("Found")
                            station.workers.push(value.first_name + " " + value.last_name + " " + value.user_name)
                        }
                    })
                })
            }
            //console.log("Allocated")
            //console.log(initialAllocationStation);
            //setAllocationStation(initialAllocationStation);
            //console.log(allocationStation);
            formik.setFieldValue("stationAllocations", initialAllocationStation);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchWorkers = async () => {
        try {
            const workerNames = await getAllWorkerNames();
            setWorkers(workerNames);

            const tempObj = {};

            for (const w of workerNames) {
                const { first_name, last_name, employee_id, user_name } = w;
                tempObj[first_name + " " + last_name + " " + user_name] = { employee_id, name: first_name + " " + last_name + " " + user_name };
            }

            setWorkersCompleteName(tempObj);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const allocateStationSchema = Yup.object().shape({
        date: Yup.string()
            .test(
                'is-present-or-future',
                'Date must be in the present or future',
                function (value) {
                    const currentDate = new Date().toISOString().substring(0, 10); // Get current date as a string in YYYY-MM-DD format
                    return !value || value >= currentDate;
                }
            )
            .required('Date is required'),
        shift: Yup.object().required('Shift is required'),
    })

    function fetchData() {
        try {
            setAllocationStation(JSON.parse(localStorage.getItem('allocationdata'))['stationAllocations']);
            formik.setFieldValue("stationAllocations", allocationStation);
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    }


    const formik = useFormik({
        initialValues: {
            date: today.toISOString().substring(0, 10),
            shift: '',
            productName: "",
            stationAllocations: [],
        },
        validationSchema: allocateStationSchema,
        onSubmit: (values) => {
            console.log("Data to send:")
            console.log(values);
            // Ensure that all stations have at least one worker
            const isValid = values.stationAllocations.every(
                (allocation) => allocation.workers.length > 0
            );

            if (!isValid) {
                toast.error("All stations must have at least one worker.");
            } else {
                const tempdata = {
                    date: values.date,
                    shift: values.shift.value,
                    productId:values.productName.value,
                    stationAllocations: allocationStation
                }
                localStorage.setItem('allocationdata', JSON.stringify(tempdata));

                // Map selected names to employee_ids when submitting the form
                const stationAllocationsWithEmployeeIds = values.stationAllocations.map((allocation) => ({
                    station: allocation.station,
                    stationId:allocation.stationId,
                    workers: allocation.workers.map((selectedName) => workersCompleteName[selectedName].employee_id),
                    removed: allocation.removed.map((selectedName) => workersCompleteName[selectedName].employee_id),
                }));
                console.log("Data For Storage:",stationAllocationsWithEmployeeIds)
                
                // console.log({
                //     date: values.date,
                //     shift: values.shift,
                //     stationAllocations: stationAllocationsWithEmployeeIds
                // });

                const addStationAllocationPromise = addStationAllocation({
                    date: values.date,
                    shift: values.shift.value,
                    productId:values.productName.value,
                    stationAllocations: stationAllocationsWithEmployeeIds,
                });

                toast.promise(addStationAllocationPromise, {
                    loading: "Saving data",
                    success: (result) => {
                        //formik.resetForm()
                        //fetchStationsAndWorkers()
                        //getStationAllocationData()
                        //formik.setFieldValue("stationAllocations", allocationStation)
                        return result.msg
                    },
                    error: (err) => err.msg,
                });
            }
        },
        //enableReinitialize: true,
    });

    
    useEffect(() => {
        filterAvailableWorkerNames();
    }, [formik.values.stationAllocations]);

    function handleSelect(selectedList, selectedItem, stationIndex) {
        console.log("Selected Items")
        console.log({ selectedItem: selectedItem, selectedList: selectedList });
        // Update the selected names for a specific station
        const updatedAllocation = [...formik.values.stationAllocations];
        updatedAllocation[stationIndex].workers = selectedList;
        formik.setFieldValue("stationAllocations", updatedAllocation);
        filterAvailableWorkerNames();
    }

    function handleShiftChange(data)
    {
        console.log("Shift:", data);
        formik.setFieldValue("shift", data);
        console.log(formik.values.shift);
        if (formik.values.productName !== "") {
            fetchWorkers();
            fetchStations();
        }
    }

    function handleRemove(selectedList, removedItem, stationIndex) {
        // console.log({ removedItem: removedItem, selectedList: selectedList });
        // Update the selected names for a specific station
        console.log(removedItem);
        const updatedAllocation = [...formik.values.stationAllocations];
        updatedAllocation[stationIndex].workers = selectedList;
        updatedAllocation[stationIndex].removed.push(removedItem);
        console.log("Removed:",updatedAllocation);
        formik.setFieldValue("stationAllocations", updatedAllocation);
        filterAvailableWorkerNames();
    }

    const filterAvailableWorkerNames = () => {
        // Combine the selected workers from all stations
        // const allSelectedWorkers = formik.values.stationAllocations.flatMap((allocation) => allocation.workers);
        // Filter out workers that are already selected
        const filteredAvailableWorkerNames = workers.map((worker) => {
            const workerName = `${worker.first_name} ${worker.last_name} ${worker.user_name}`;
            return workerName;
        });
        console.log({filteredAvailableWorkerNames:filteredAvailableWorkerNames});
        setAvailableWorkerNames(filteredAvailableWorkerNames);
    }

    useEffect(() => {
        getStationAllocationData()
    }, [])
    
    useEffect(()  => {
        if (formik.values.productName !== "") {
            console.log("Fetching info:");
            console.log(formik.values.productName.label);
            if (formik.values.shift !== "") {
                fetchWorkers();
                fetchStations();
            }
    
            // const getStationNamesPromise = getOneProductStationNames(formik.values.productName);
            // getStationNamesPromise.then((result) => {
            //     if (result.length <= 0) {
            //         toast.error("There is no station configuration done for this product.")
            //     }
            //     const stationNames = result.map((station) => station.station_name);
            //     // Initialize nextStationAllocation based on stationNames
            //     // const nextStationAllocation = stationNames.map((stationName) => ({
            //     //     currentStation: stationName,
            //     //     nextStation: -1 // Initialize as null
            //     // }));
            //     // //setNextStationAllocation(nextStationAllocation);
            //     // formik.setFieldValue("nextStationAllocation", nextStationAllocation); // Update formik value
            // }).catch((err) => {
            //     toast.error(err.msg);
            // });
        }
    }, [formik.values.productName]);

    useEffect(()  => {
        if (formik.values.shift !== "") {
            //console.log("Fetching info:");
            //console.log(formik.values.productName.label);
            if (formik.values.productName !== "") {
                fetchWorkers();
                fetchStations();
            }
    
            // const getStationNamesPromise = getOneProductStationNames(formik.values.productName);
            // getStationNamesPromise.then((result) => {
            //     if (result.length <= 0) {
            //         toast.error("There is no station configuration done for this product.")
            //     }
            //     const stationNames = result.map((station) => station.station_name);
            //     // Initialize nextStationAllocation based on stationNames
            //     // const nextStationAllocation = stationNames.map((stationName) => ({
            //     //     currentStation: stationName,
            //     //     nextStation: -1 // Initialize as null
            //     // }));
            //     // //setNextStationAllocation(nextStationAllocation);
            //     // formik.setFieldValue("nextStationAllocation", nextStationAllocation); // Update formik value
            // }).catch((err) => {
            //     toast.error(err.msg);
            // });
        }
    }, [formik.values.shift]);

    const getStationAllocationData = () => {
        const getAllocatedPromise = getWorkerAllocation()
        getAllocatedPromise.then(async (result) => {
            setallocatedData(result)
        }).catch((err) => { })
    }
    function copyData(data)
    {
        srcProduct=data;
        console.log(data,":",formik.values.productName);
    }
    function copyAllocation()
    {
        console.log("Copying Allocation")
        console.log(srcProduct,":",formik.values.productName);
        
        const status = copyStationAllocation(srcProduct.label,formik.values.productName.label);
        
        status.then(async (result) => {
            console.log("result:",result.msg);
            if(result.msg.includes("Done"))
            {
                toast.success(<b>Data Transfered successfully</b>);
            }
            else
            {
                toast.error(result.msg || 'An error occurred');
             
            }
            console.log(result)
        }).catch((err) => { })

    }
    // console.log({ allocatedData: allocatedData });
    // console.log({date:formik.values.date});

    console.log({ availableWorkerNames: availableWorkerNames });
    // console.log({workers:workers});
    return (
        <>
            <WindalsNav />
            <Toaster position="top-center" reverseOrder={false}></Toaster>

            <div className="allocstat" >
                <h1 className="heading">Allocate Station to Worker</h1>
                <div className="input-box">
                    <Form onSubmit={formik.handleSubmit}>
                    <Form.Group controlId="date" style={{display:'flex', margin:'20px', justifyContent:'center'}}>
                            <Form.Label>Date:</Form.Label>
                            <Form.Control
                            style={{width:'10%'}}
                                type="date"
                                name="date"
                                onChange={formik.handleChange}
                                value={formik.values.date}
                            />
                            {formik.touched.date && formik.errors.date && (
                                <Alert variant="danger" className="error-message">{formik.errors.date}</Alert>
                            )}
                        </Form.Group>
                        <div className="row" style={{width:'80%'}}>
                            <div className="col">
                            <Form.Group controlId="productName">
                            <Select 
                        options={productNames.map((product) => ({ label: product.product_name, value: product.product_id }))}
                        value={formik.values.productName}
                        name="productName"
                        onChange={(data) => formik.setFieldValue("productName", data)}
                        isSearchable={true}
                        placeholder="Select Product"
                    />
                    {formik.errors.productName && formik.touched.productName ? (
                        <Alert variant="danger" className="error-message">{formik.errors.productName}</Alert>
                    ) : null}
                        </Form.Group>
                            </div>
                            <div className="col-md-auto align-self-center">
                                <label style={{fontWeight:600, margin:10}} className="inplab">Same as</label>
                            </div>

                            <div className="col align-self-center">
                                        <Select 
                                            options={[
                                                ...productNames
                                                .filter((product) => (formik.values.productName.label!==product.product_name))
                                                    .map((product) => ({
                                                        label: product.product_name,
                                                        value: product.product_id
                                                    })),
                                            ]}
                                            //options={productNames.map((product) => {if(addFormFormik.values.productName.label!==product.product_name){label: product.product_name, value: product.product_id} })}
                                            name="fetchProductName"
                                            onChange={(data) => copyData(data)}
                                            isSearchable={true}
                                            placeholder="Select Product"
                                        />
                                    </div>
                            <div className="col-md-auto align-self-center">
                            <Button variant="danger" type="button" className="add-button-stn" onClick={copyAllocation}>COPY</Button>
                                        </div>

                        </div>
                        
                        <Form.Group controlId="shift" style={{display:'flex', margin:'20px',justifyContent:'center'}}>
                            {/* <Form.Label>Shift:</Form.Label> */}
                            <Select
                            style={{width:'100%'}}
                                options={activeShiftNames.map((shift) => ({ label: shift.shift_name, value: shift.shift_id }))}
                                value={formik.values.shift}
                                name="shift"
                                onChange={(data) => formik.setFieldValue("shift", data)}
                                isSearchable={true}
                                placeholder="Select Shift"
                            />
                            {formik.touched.shift && formik.errors.shift && (
                                <Alert variant="danger" className="error-message">{formik.errors.shift}</Alert>
                            )}
                        </Form.Group>
                        
            

                        {/* <h5 style={{marginTop:'5vh'}}>Please submit after allocating workers in the table below</h5> */}
                        {formik.values.stationAllocations.length>0 &&
                        <Container fluid>
                            <Row lg={3} style={{ marginTop:5, fontSize:20}}>
                                
                                <Col lg={1} md={1} style={{backgroundColor:"white",borderStyle:"solid",borderWidth:2,borderColor:"purple", borderRadius:10,paddingTop:10,paddingBottom:10}}>
                                #
                                </Col>
                                <Col lg={5} style={{backgroundColor:"white",borderStyle:"solid",borderWidth:2,borderColor:"purple", borderRadius:10,paddingTop:10,paddingBottom:10}} >
                                Station
                                </Col>
                                <Col lg={6} style={{backgroundColor:"white",borderStyle:"solid",borderWidth:2,borderColor:"purple", borderRadius:10,paddingTop:10,paddingBottom:10}} >
                                Users
                                </Col>
                            </Row>
                            {formik.values.stationAllocations.map((allocation, index) => (
                                
                                <Row lg={3} style={{ marginTop:2,fontSize:20}}>
                                    <Col lg={1} md={1} style={{backgroundColor:"white",borderStyle:"solid",borderWidth:2,borderColor:"purple", borderRadius:10,paddingTop:10,paddingBottom:10}}>
                                        {index + 1}
                                    </Col>
                                    <Col lg={5} style={{backgroundColor:"white",borderStyle:"solid",borderWidth:2,borderColor:"purple", borderRadius:10,paddingTop:10,paddingBottom:10}} >
                                        {allocation.station}
                                    </Col>
                                    <Col lg={6} style={{backgroundColor:"white",borderStyle:"solid",borderWidth:2,borderColor:"purple", borderRadius:10,paddingTop:10,paddingBottom:10}} >
                                        <Multiselect
                                            isObject={false}
                                            options={availableWorkerNames.map(
                                                (worker) => worker
                                            )}
                                            onSelect={(selectedList, selectedItem) =>
                                                handleSelect(selectedList, selectedItem, index)
                                            }
                                            onRemove={(selectedList, removedItem) =>
                                                handleRemove(selectedList, removedItem, index)
                                            }
                                            selectedValues={allocation.workers}
                                            showCheckbox
                                        />

                                    </Col>
                                </Row>
                            ))}
                                {/* </tbody>
                            </table> */}
                        </Container>
                    }
                        <Button variant="success" type="submit" style={{marginTop:20}} >
                            SAVE
                        </Button>
                    </Form>
                    
                    {/* <Button variant="danger" onClick={fetchData} style={{marginTop:'2vh'}}>
                        Fetchdata
                    </Button> */}
                </div>
            </div>

            {/* <Table striped responsive hover className='table' style={{ marginBottom: '15vh' }}>
                <thead>

                </thead>
                <tbody>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Station</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>User Name</th>
                        <th>Shift Name</th>
                    </tr>
                    {

                        Array.isArray(allocatedData) && allocatedData.map((allocateddata, index) => (
                            <tr key={index}>
                                <td>
                                    {index + 1}
                                </td>
                                <td>
                                    {allocateddata.date}
                                </td>
                                <td>
                                    {allocateddata.station_name}
                                </td>
                                <td>
                                    {allocateddata.first_name}
                                </td>
                                <td>
                                    {allocateddata.last_name}
                                </td>
                                <td>
                                    {allocateddata.user_name}
                                </td>
                                <td>
                                    {allocateddata.shift_name}
                                </td>

                            </tr>
                        ))
                    }

                </tbody>
            </Table> */}

            <Footer />
        </>
    );
}

export default StationAllocation;
