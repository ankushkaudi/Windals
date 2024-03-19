import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './stationPage.css';
import Modal from 'react-modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import { Form} from "react-bootstrap";
import {
  getOneStation,
  insertInStationyyyyFirstNextStation,
  getJobesAtStation,
  updateJobesAtStation,
  logout,
  getWorkAtStationInDay,
  getOneEmployee,
  getCurrentShift,
  getOneWorkerStation,
  getOneProductAllParameters,
  getParameterStatus,
  getOneStationOneProductMachinesData,
  getProductNames,
  updateJobStatus,
  getProductStationParameters
} from '../../helper/helper';
import { useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import WindalsNav from '../navbar';
import './firstStation.css'
import '../product/addProduct.css'
import Footer from '../footer';
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
const StationPage = () => {
  const location = useLocation()
  //const { loc } = useLocation();
  const { userInfo,stationInfo } = location.state;

  //const { employeeId, employeeName,userName, stationName } = useParams();
  // const stationName = "S2";
  // const employeeId = "1";
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stationAllInfo, setStationAllInfo] = useState("");
  const [stationOneProductInfo, setStationOneProductInfo] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);
  const [product_name, setProductName] = useState("");
  const [jobsAtStation, setJobsAtStation] = useState([]);
  const [parametermap, setparametermap] = useState({});
  const [OneProductStationParameters, setOneProductStationParameters] = useState([]);
  const [parameterNames, setParameterNames] = useState([]); // Store parameter names as an array
  const [workAtStationInDay, setWorkAtStationInDay] = useState([])
  const [employeeData, setEmployeeData] = useState("");
  const [activeShift, setActiveShift] = useState("");
  const [stations, setStations] = useState([]);
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState("")
  const [selectedStation, setSelectedStation] = useState("")
  const navigate = useNavigate()

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //setEmployeeData(userInfo);
  //setStations(stationInfo);

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const formik = useFormik({
    initialValues: {
      selectedJob: null,
      selectedJobIndex:null,
      status: "",  //1-ok,0-rework,-1-rejected
      reason: "",
      parameterValues: {}
    },
    // validationSchema: validateYupSchema,
    onSubmit: (values) => {
      setIsOpen(false);
      setIsModalOpen(false);
      console.log({ "this": values })
      let formattedString = '';
      // console.log(":test");
      if (values.reason!=="") {
          // Append the reason to the string if it exists
           if(values.status == -1){
              formattedString += "Not-Okay-"
           }
           else if(values.status == 0){
              formattedString += "Rework-"
           }
            formattedString += "Reason:";
            formattedString += values.reason;
            formattedString += ";"
        }
        var x = jobsAtStation[formik.values.selectedJobIndex];
        //console.log("Selected Job:",x)
        //var m=Object.entries(x);
        var paramString="";
        //console.log(m);
        Object.entries(jobsAtStation[formik.values.selectedJobIndex]).forEach((element)=>{
          if (!isNaN(parseInt(element[0])))
          {
            paramString+=element[0].toString()+":"+element[1].toString()+";";
          }
        })
        if (paramString.length>0)
        {
          formattedString += "Pms:"+paramString;
        }
      // if (values.parameterValues!==null && values.parameterValues!={}) {
      //     // Convert parameterValues object to a string
      //     formattedString += "Parameters:"
      //     const parameterString = Object.entries(values.parameterValues)
      //       .map(([key, value]) => `${key},${value}`)
      //       .join(';');
      
      //     formattedString += parameterString;
      //   }
      
        // If neither reason nor parameters exist, set the string to null
        if (formattedString.length === 0) {
          formattedString = null;
        }
        var machineID=0
        if(selectedMachine!==null || selectedMachine!== undefined)
        {
          machineID = selectedMachine.machine_id
        }
      const dataForServer={
        job_name: values.selectedJob.job_name,
        product_name: product_name,
        station_id: stationInfo.station_id,
        machine_id: machineID,
        employee_id:userInfo.id,
        status: values.status,
        parameters:formattedString
      }
      console.log("Data For Server:",dataForServer)
      const updateJobeAtStationPromise = updateJobStatus(dataForServer)
      updateJobeAtStationPromise.then((result) => {
        toast.success(result.msg)
        getSubmitedJobs()
        formik.resetForm()
        setDropdownOptions([])
        setDropdownPosition(null)
        closeModal()
        setJobesAtStationFunction()
      }).catch((err) => {
        toast.error(err.msg)
        console.log(err);
      })

      // const updateJobeAtStationPromise = updateJobesAtStation(values, stationOneProductInfo[0].station_id, employeeId, selectedMachine.machine_id)
      // updateJobeAtStationPromise.then((result) => {
      //   toast.success(result.msg)
      //   if (values["status"] == '1') {
      //     const newValues = {
      //       job_names: [values.selectedJob.job_name],
      //       product_name: product_name,
      //       station_id: stationOneProductInfo[0].station_id,
      //       machine_id: selectedMachine.machine_id
      //     }
      //     // console.log({newValues:newValues});
      //     const insertInStationyyyyFirstNextStationPromise = insertInStationyyyyFirstNextStation(newValues)
      //     insertInStationyyyyFirstNextStationPromise.then((result) => {
      //       toast.success(result.msg)
      //       getSubmitedJobs()
      //       formik.resetForm()
      //       setDropdownOptions([])
      //       setDropdownPosition(null)
      //       closeModal()
      //       setJobesAtStationFunction()
      //     }).catch((err) => {
      //       toast.error(err.msg)
      //       console.log(err);
      //     })
      //   }
      //   else {
      //     getSubmitedJobs()
      //     formik.resetForm()
      //     setDropdownOptions([])
      //     setDropdownPosition(null)
      //     closeModal()
      //     setJobesAtStationFunction()
      //   }
      // }).catch((err) => {
      //   toast.error(err.msg)
      //   console.log(err);
      // })
    }
  })

  useEffect(() => {
    console.log("User Info:", userInfo);
    console.log("Station Info:",stationInfo);
    if (stationInfo.station_name !== "") {
      console.log("Station Page ",stationInfo.station_name);
      setSelectedStation(stationInfo.station_name)
      setActiveShift(userInfo.shift)
      // var productNames=[]
      // stationInfo.forEach(element => {
      //   productNames.push(element.product_name);
      // });
      // setAvailableProducts(productNames);
      const parameterNamesArray = stationInfo.station_parameters.split(',');
      setParameterNames(parameterNamesArray);
      setStationOneProductInfo(stationInfo);
      setProductName(stationInfo.product_name);
      setJobesAtStationFunction();
      //getProductStationParameters(productName,stationId)
      const getParameterStatusPromise = getProductStationParameters(stationInfo.product_name,stationInfo.station_id);
      getParameterStatusPromise.then((result) => {
        console.log("Parameter Details:",result);
        setOneProductStationParameters(result);
        //console.log(OneProductStationParameters!== undefined)
        // console.log(result.result);
      }).catch((err) => {
        toast.error(err.msg);
      });

    }
  }, [stations])

  // useEffect(() => {
  //   const getOneEmployeeDataPromise = getOneEmployee(userName);
  //   toast.promise(getOneEmployeeDataPromise, {
  //     loading: "Getting employee data",
  //     success: (result) => {
  //       setEmployeeData(result);
  //       return "data fetched";
  //     },
  //     error: (err) => {
  //       return err.msg;
  //     },
  //   });
  //   const getCurrentShiftPromise = getCurrentShift();
  //   getCurrentShiftPromise.then((result) => {
  //     console.log("Shift Information ", result.shift_id)
  //     setActiveShift(result.shift_id);
  //   }).catch((err) => {
  //     toast.error(err.msg);
  //   });
  // }, []);

  // useEffect(() => {
  //   if (userName !== 'admin' && employeeData !== "" && activeShift !== "") {
  //     const getOneWorkerStationPromise = getOneWorkerStation(employeeData[0].employee_id, activeShift);
  //     toast.promise(getOneWorkerStationPromise, {
  //       loading: "Getting stations allocated to employee",
  //       success: (result) => {
  //         console.log("Station Received:", result);
  //         result.forEach(element => {
  //           element.station_name=element.station_name.trim();
  //         });
  //         console.log("Station Corrected:", result);
  //         setStations(result);
          
  //         return "data fetched";
  //       },
  //       error: (err) => {
  //         return err.msg;
  //       },
  //     });
  //   }
  // }, [employeeData, activeShift]);

  // useEffect(() => {
  //   const getStationAllInfoPromise = getOneStation(stationName);
  //   getStationAllInfoPromise.then((result) => {
  //     result.forEach(element => {
  //       element.station_name=element.station_name.trim();
  //     });

  //     setStationAllInfo(result);
  //     console.log("Station Info:",result)
  //   }).catch((err) => {
  //     toast.error(err.msg);
  //   });
  // }, [selectedStation]);

  // useEffect(() => {
  //   if (stationAllInfo.length > 0) {
  //     const productNames = [...new Set(stationAllInfo.map((station) => station.product_name))];
  //     const getProductNamesPromise = getProductNames()
  //     getProductNamesPromise.then(async (result) => {
  //       console.log({'this':result}); 
  //       const productnames = await result.map((product) => {
  //             return product.product_name
  //         })
  //         const commonProducts = productNames.filter(name => productnames.includes(name));
  //         console.log({"productname":productnames,productNames:productNames,commonProducts:commonProducts});
  //         setAvailableProducts(commonProducts);
  //       }).catch((err) => { 
  //         alert(err)
  //     })
  //   }
  // }, [stationAllInfo]);

  // useEffect(() => {
  //   if (product_name !== "") {
  //     const stationOneProductInfo = stationAllInfo.filter((station) => {
  //       return station.station_name === stationName && station.product_name === product_name;
  //     });
  //     setStationOneProductInfo(stationOneProductInfo);

  //     // Split the parameter names string into an array
  //     if (stationOneProductInfo[0].station_parameters != null) {
  //       const parameterNamesArray = stationOneProductInfo[0].station_parameters.split(',');
  //       setParameterNames(parameterNamesArray);
  //     }
  //   }
  //   else {
  //     setWorkAtStationInDay([])
  //     setJobsAtStation([])
  //   }
  // }, [product_name]);

  // useEffect(() => {
  //   if (product_name !== "" && parameterNames.length !== 0) {
  //     const getParameterStatusPromise = getParameterStatus(parameterNames, product_name);
  //     getParameterStatusPromise.then((result) => {
  //       setOneProductStationParameters(result.result);
  //       // console.log(result.result);
  //     }).catch((err) => {
  //       toast.error(err.msg);
  //     });
  //   }
  // }, [parameterNames, product_name]);
  // console.log(OneProductStationParameters)
  // useEffect(() => {
  //   setOneProductStationParameters([
  //     {
  //       "parameter": "length",
  //       "value_oknotok": 0
  //     },
  //     {
  //       "parameter": "width",
  //       "value_oknotok": 1
  //     }
  //   ])


  // }, [])

  // useEffect(() => {
  //   if (stationOneProductInfo.length > 0) {
  //     setJobesAtStationFunction()
  //   }
  // }, [stationOneProductInfo]);

  useEffect(() => {
    if (stationOneProductInfo != "") {
      getSubmitedJobs()
      const getOneStationMachineDataPromise = getOneStationOneProductMachinesData(stationInfo.station_id)
      toast.promise(getOneStationMachineDataPromise, {
        loading: "Getting machines data of this station",
        success: (result) => {
          setMachines(result);
          return "data fetched";
        },
        error: (err) => {
          //return "Machines data Not available"
          return err.msg;
        },
      });
    }
  }, [stationOneProductInfo])

  const setJobesAtStationFunction = () => {
    const getJobesAtStationPromise = getJobesAtStation(stationInfo.station_id, stationInfo.product_name);
    getJobesAtStationPromise.then((result) => {
      setJobsAtStation(result);
    }).catch((err) => {
      toast.error(err.msg);
    });
  }

  const getSubmitedJobs = () => {
    if (stationOneProductInfo != "") {
      const stationId = stationInfo.station_id
      const getWorkAtStationInDayPromise = getWorkAtStationInDay(stationId)
      getWorkAtStationInDayPromise.then((result) => {
        setWorkAtStationInDay(result)
      }).catch((err) => {
        console.log(err);
        toast.error(err.msg)
      })
    }
  }

  const handleJobIdClick = async (job,index, event) => {
    formik.setFieldValue("selectedJob", job);
    formik.setFieldValue("selectedJobIndex", index);
    
    // const rect = event.target.getBoundingClientRect();
    // console.log(rect)
    // const middleTop = (window.innerHeight - rect.height);
    // setDropdownPosition({
    //   top: middleTop,
    //   left: rect.left*2,
    // });

    console.log("test");
    setIsOpen(true)

    // Access the station_parameters from stationOneProductInfo
    const stationParameters = stationInfo?.station_parameters;
    // Create an object with keys from station_parameters and empty strings as values
    const parametersObject = stationParameters
      ? await stationParameters.split(',').reduce((acc, paramName) => {
        acc[paramName.trim()] = '';
        return acc;
      }, {})
      : null;


    formik.setFieldValue("parameterValues", parametersObject)

    const options = stationOneProductInfo.length > 0 && stationInfo.report === 1
      ? ['✅ Ok', '❌ Not Okay']
      : ['✅ Ok', '❌ Not Okay'];
    setDropdownOptions(options);
    
  };

  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  const closeReasonModal = () => {
    setIsModalOpen(false);
  };
  
  const handleDropdownOptionClick = (option) => {
    if (option === '✅ Ok') {
      console.log("Job Information:",jobsAtStation);
      
      setIsOpen(false)
      formik.setFieldValue("status", 1)
      // const parametersObject = formik.values.parameterValues;
      // for (const it of OneProductStationParameters) {
      //   if (it['value_oknotok'] === 0 && parametersObject[it['parameter']] === '') {
      //     parametersObject[it['parameter']] = 'O';
      //   }
      // }
      // formik.setFieldValue("parameterValues", parametersObject)
      formik.handleSubmit()
    } else if (option === '❌ Not Okay') {
      setIsOpen(false)
      setIsModalOpen(true)
      formik.setFieldValue("status", -1)
      const parametersObject = formik.values.parameterValues;
      for (const it of OneProductStationParameters) {
        if (it['value_oknotok'] === 0 && parametersObject[it['parameter']] === '') {
          parametersObject[it['parameter']] = 'N';
        }
      }
      formik.setFieldValue("parameterValues", parametersObject)
      openModal();
    }
  };

  const setParameterValue = (parameter, value) => {
    // Clone the existing parameterValues object
    const updatedParameterValues = { ...formik.values.parameterValues };

    // Trim the parameter name to remove leading/trailing spaces
    const trimmedParameter = parameter.trim();

    // Set the value for the parameter
    updatedParameterValues[trimmedParameter] = value;

    // Update the parameterValues field in Formik
    formik.setFieldValue("parameterValues", updatedParameterValues);
  };

  const handleStationSelection = (target) => {
    // Use the selectedStation value to construct the path or page you want to navigate to
    console.log("Station Clicked")
    setSelectedMachine([])
    setMachines([])
    setWorkAtStationInDay([])
    setOneProductStationParameters([])
    setJobsAtStation([])
    setProductName("")
    setAvailableProducts([])
    setStationOneProductInfo("")
    setStationAllInfo("")

    const selectedIndex = parseInt(target.options[target.selectedIndex].getAttribute("data-index"), 10);
    console.log(selectedIndex)
    if (selectedIndex !== -1) {
      const selectedStation = stations[selectedIndex];
      setSelectedStation(selectedStation.stationName.trim())
      console.log(selectedStation);
      // if (selectedStation.position === 1) {
      //   navigate(`/FirstStation/${employeeData[0].employee_id}/${employeeData[0].user_name}/${selectedStation.station_name}`);
      // }
      // else {
      //   navigate(`/Station/${employeeData[0].employee_id}/${employeeName}/${employeeData[0].user_name}/${selectedStation.station_name}`);
      // }
    }

  };

  const handleMachineSelection = (selectedMachine) => {
    setSelectedMachine(selectedMachine);
  };


  // console.log({ jobsAtStation: jobsAtStation, stationOneProductInfo: stationOneProductInfo, stationAllInfo: stationAllInfo, formikvalues: formik.values, parameterNames: parameterNames, workAtStationInDay: workAtStationInDay });
  // console.log(parameterNames)
  // console.log(formik.values.parameterValues)
  return (
    <div className="firststat">
      <WindalsNav />
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <h1>{stationInfo.station_name}</h1>

      <div className="divide">
        <div className='fslist'>
          <h5 className='sbox'>Employee : {userInfo.name}</h5>
          <h5 className='sbox'>Product : {stationInfo.product_name}</h5>
          {/* <h5 className='sbox'>User Name : {userName}</h5> */}
        </div>

        <div className="workerform">
          {/* <div style={{ fontSize: '1.2rem' }}>
            <label style={{ margin: 6, fontWeight: 500 }}>Select Station </label>
            <select value={stationName} onChange={(e) => handleStationSelection(e.target)}>
              <option value="" data-index={-1}>Select a station</option>
              {stations.map((station, index) => (
                <option key={index} value={station.station_name} data-index={index}>
                  {station.station_name}
                </option>
              ))}
            </select>
          </div> */}

          <div className="form-group" style={{marginBottom:'2vh'}}>
            <div className='d-flex justify-content-center align-items-center' style={{marginTop:20}}>
              {/*<div className='d-flex justify-content-start' style={{marginRight:20}}>
                <label style={{ fontSize: '1.5rem' }}  htmlFor="productSelect">Select Product</label>
              </div>
               <div className='d-flex justify-content-center' >
                <select style={{minWidth:500}}
                  id="productSelect"
                  value={product_name}
                  name="product_name"
                  onChange={(e) => {
                    setProductName(e.target.value)
                    closeModal()
                    formik.resetForm()
                  }}
                >
                  <option value="">--Select Product--</option>
                  {stationInfo.forEach((element,index)=>{
                    <option key={index} value={element.product_name}>
                      {element.product_name}
                    </option>
                  })}
                </select>
              </div> */}
            </div>
            {stationInfo.multiple_machine==1 && 
            <>
            <label style={{ fontSize: '1.5rem', marginTop:'4vh' }}>Select Machine</label>
            <select onChange={(e) => handleMachineSelection(JSON.parse(e.target.value))}>
              <option value="">Select a machine</option>
              {machines.map((machine, index) => (
                <option key={index} value={JSON.stringify(machine)}>
                  {machine.machine_name}
                </option>
              ))}
            </select>
            </>
            }
          </div>

          {stationInfo!==null && 
          <>
            {stationInfo.multiple_machine==1 &&
            <div className='params'>
            <table className='first_table'>
              <tbody>
                <tr>
                  <td>Daily Count</td>
                  <td>{selectedMachine.daily_count ? selectedMachine.daily_count : "alert:Select machine first"}</td>
                </tr>
                <tr>
                  <td>Cycle Time</td>
                  <td>{selectedMachine.cycle_time ? selectedMachine.cycle_time : "alert:Select machine first"}</td>
                </tr>
                <tr>
                  <td>Product/hour</td>
                  <td>{selectedMachine.product_per_hour ? selectedMachine.product_per_hour : "alert:Select machine first"}</td>
                </tr>
                <tr>
                  <td>Parameters to be checked</td>
                  <td>{stationInfo.report === 1 ? stationInfo.station_parameters : "NONE"}</td>
                </tr>
              </tbody>
            </table>
            {/* <h5>Daily Count: {stationOneProductInfo[0].daily_count}</h5>
        <h5>Cycle Time: {stationOneProductInfo[0].cycle_time}</h5>
        <h5>Product per hour: {stationOneProductInfo[0].product_per_hour}</h5>
        <h5>Parameters to be checked: {stationOneProductInfo[0].report === 1 ? stationOneProductInfo[0].station_parameters : "NONE"}</h5> */}
          </div>

            }
            {stationInfo.multiple_machine==0 &&
            <div className='params'>
            <table className='first_table'>
              <tbody>
                <tr style={{fontSize:18,fontWeight:'bold'}}>
                  <td>Daily Count</td>
                  <td>Cycle Time</td>
                  <td>Product/Hour</td>
                </tr>
                <tr style={{fontSize:18,fontWeight:'bold'}}>
                  <td>{stationInfo.daily_count}</td>
                  <td>{stationInfo.cycle_time}</td>
                  <td>{stationInfo.product_per_hour}</td>
                </tr>
                <tr>
                  <td>Parameters to be checked</td>
                  <td colSpan={2}>{stationInfo.report === 1 ? stationInfo.station_parameters : "NONE"}</td>
                </tr>
              </tbody>
            </table>
            {/* <h5>Daily Count: {stationOneProductInfo[0].daily_count}</h5>
        <h5>Cycle Time: {stationOneProductInfo[0].cycle_time}</h5>
        <h5>Product per hour: {stationOneProductInfo[0].product_per_hour}</h5>
        <h5>Parameters to be checked: {stationOneProductInfo[0].report === 1 ? stationOneProductInfo[0].station_parameters : "NONE"}</h5> */}
          </div>

            }
          </>
          }

          <p style={{ fontSize: '1.5rem', fontWeight: "bold", marginTop:'4vh' }}>Jobs At Station</p>
          <div className="col">
            {jobsAtStation.length > 0 ? jobsAtStation.map((job,index) => (
              // <li
              //   key={job.job_id}
              //   onClick={(e) => handleJobIdClick(job, e)}
              //   style={{ cursor: 'pointer', }}
              // >
              //   {job.job_name}
              // </li>
                <div
                  className="section-divs"
                  //onClick={openModal}
                  onClick={(e) => handleJobIdClick(job,index, e)}
                >
                  {job.job_name}
              </div>
  
              )) : product_name == "" ? "Product is not selected" : "No Jobs"}
            </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <>
        <div className="row">
            {formik.values.selectedJob!==null && <h2>{formik.values.selectedJob.job_name}</h2>}
        </div>
          <div className='row'>
          {dropdownOptions.map((option) => (
              <div className='col' style={{marginTop:10, marginLeft:10,marginBottom:10,cursor: 'pointer'}}
                key={option}
                onClick={() => handleDropdownOptionClick(option)}
              >
                {option}
              </div>
          ))}
          
          </div>
          {OneProductStationParameters!== undefined &&
          <>

      <div className='row' style={{marginTop:20, width:800, height:400}}>
                    {OneProductStationParameters.map((parameter) => (
                      <div className='row' style={{paddingTop:5,paddingBottom:5,marginTop:5, marginLeft:5,borderStyle:"solid",borderWidth:2,borderColor:"purple", borderRadius:10}}>
                        <div className='col d-flex align-content-center align-self-center'>
                            <label>{parameter.parameter}</label>
                        </div>
                        <div className='col col-md-auto align-self-center'>
                          {parameter.value_oknotok === 1 ?
                            <input style={{width:100}} type="number"
                              placeholder="Value"
                              onChange={(e) => {
                                jobsAtStation[formik.values.selectedJobIndex][parameter.id.toString()]=e.target.value;
                                //setParameterValue(parameter.parameter, e.target.value)
                              
                              }} /> 
                              :
                            <input style={{width:100}} type='checkbox' value='O' onChange={(e) => {
                              if (e.target.checked) {
                                jobsAtStation[formik.values.selectedJobIndex][parameter.id.toString()]='Y'
                                //setParameterValue(parameter.parameter, 'Y')
                              }
                              else 
                              {
                                jobsAtStation[formik.values.selectedJobIndex][parameter.id.toString()]='N'
                                //setParameterValue(parameter.parameter, 'N')
                              }
                            }} />}
                          </div>
                          </div>
                    ))}
                    <div style={{height:20}}>

                    </div>
          </div>
          </>
          }
          </>
      </Modal>
        </div>
      </div>

      <div style={{ marginLeft: '10vw' }}>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeReasonModal}
          contentLabel="Example Modal"
          className='reasonmodal'
        >
          <h2>Reason</h2>
          <label htmlFor="reason">Enter a reason</label>
          <input type="text" name="reason" id="reason" value={formik.values.reason} onChange={formik.handleChange} />
          
          <button className="buttoncss" onClick={formik.handleSubmit}>Submit</button>
          
          <button className="buttoncss" onClick={closeReasonModal}>Close Modal</button>
          

        </Modal>
      </div>
      {
        workAtStationInDay.length > 0 ?
          <div className='jobsub'>
            <h2>Jobs Submitted</h2>
            <table className="first_table">
              <thead>
                <tr>
                  <th>Job Id</th>
                  <th>Job Name</th>
                  <th>Product Name</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Parameter values</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(workAtStationInDay) && workAtStationInDay.map((job, index) => (
                  <tr key={index}>
                    <td>{job.job_id}</td>
                    <td>{job.job_name}</td>
                    <td>{job.product_name}</td>
                    <td>{(job.status == 1) ? "OK" : "Not-Ok"}</td>
                    <td>{(job.reason != "" || job.reason != null) ? job.reason : "N.A"}</td>
                    <td>{(job.parameters != "" || job.parameters != null) ? job.parameters : "N.A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          : null
      }
     

      <Footer />
    </div>
  );
};

export default StationPage;
