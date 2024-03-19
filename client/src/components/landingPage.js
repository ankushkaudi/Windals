import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WindalsNav from './navbar';
import Footer from './footer';
import {useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { getOneEmployee, getCurrentShift, getOneWorkerStation } from '../helper/helper';
import './landingPage.css'
import landingimg from '../images/landingpage.jpg'
import logo from '../images/appicon-01.png'
import Sidebar from './sidebar';

function LandingPage() {
  //const { userName } = useParams();
  //const { userName } = "WP01004";
  const location = useLocation()
  //const { loc } = useLocation();
  const { userInfo } = location.state;
  const [employeeData, setEmployeeData] = useState("");
  const [activeShift, setActiveShift] = useState("");
  const [stations, setStations] = useState([]);
  const [noStationAllocatedError, setNoStationAllocatedError] = useState("");
  const navigate = useNavigate()

  // useEffect(() => {
  //   console.log("User Data Received:",userInfo);
  //   setEmployeeData(userInfo)
  //   setActiveShift(userInfo.shift);
  //   // const getOneEmployeeDataPromise = getOneEmployee(userName);
  //   // toast.promise(getOneEmployeeDataPromise, {
  //   //   loading: "Getting employee data",
  //   //   success: (result) => {
  //   //     setEmployeeData(result);
  //   //     return "data fetched";
  //   //   },
  //   //   error: (err) => {
  //   //     return err.msg;
  //   //   },
  //   // });
  //   // const getCurrentShiftPromise = getCurrentShift();
  //   // getCurrentShiftPromise.then((result) => {
  //   //   setActiveShift(result.shift_id);
  //   // }).catch((err) => {
  //   //   toast.error(err.msg);
  //   // });
  // }, []);

  useEffect(() => {
    console.log("User Data Received:",userInfo);
    setEmployeeData(userInfo)
    setActiveShift(userInfo.shift);

    if (employeeData.userName !== 'admin' && employeeData !== "" && activeShift !== "") {
      const getOneWorkerStationPromise = getOneWorkerStation(employeeData.id, activeShift);
      toast.promise(getOneWorkerStationPromise, {
        loading: "Getting stations allocated to employee",
        success: (result) => {
          console.log("Stations Info",result,":",result.length);
          setStations(result);
          // if(result.length==1)
          // {
          //   console.log("Only one item in")
          //   setTimeout(() => {
          //     const target=
          //       handleStationSelection({selectedIndex:1});
          //   }, 3000);
            
          // }
          setNoStationAllocatedError("");
          return "data fetched";
        },
        error: (err) => {
          setNoStationAllocatedError(err.msg);
          return err.msg;
        },
      });
    }
  }, [employeeData, activeShift]);

  useEffect(() => {
    console.log("Stations Received")
    if(stations.length==1){
      console.log("Single Record")
      handleStationSelection({selectedIndex:1});
    }
  }, [stations]);
  const handleStationSelection = (target) => {
    // Use the selectedStation value to construct the path or page you want to navigate to
  console.log("Selected Index:",target.selectedIndex);
  //const selectedIndex = parseInt(target.options[target.selectedIndex].getAttribute("data-index"), 10);
  //console.log("Selected Index:",selectedIndex);
  const selectedIndex = parseInt(target.selectedIndex)-1
    if(selectedIndex!==-1)
    {
      console.log("Statiions:",stations);
      const selectedStation = stations[selectedIndex];
      console.log(selectedStation);
      var employeeName=employeeData.name;
      if(selectedStation.position===1)
      {
          navigate(`/FirstStation`,{state:{userInfo,stationInfo:stations[selectedIndex]}});
      }
      else
      {
        navigate(`/StationPage`,{state:{userInfo,stationInfo:stations[selectedIndex]}});
        //navigate(`/Station/${employeeData.id}/${employeeName}/${employeeData.userName}/${selectedStation.station_name}`,{state:{userInfo,stationInfo:stations[selectedIndex]}});
      }
    }
    
  };
  
  const redirectToHome = () => {
    if(employeeData.userName==="admin"){
      navigate(`/AdminPanel`,{state:{userInfo}},{ replace: true })
    }
  }

  console.log({ stations: stations,employeeData:employeeData});

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <WindalsNav />
      {/* <Sidebar/> */}
      <div className='landingpage'>
      <img src={logo} className='lplogo' alt=""/>
        <div className='info'>
        <h2>Windals Precision Pvt. Ltd.</h2>
        <p >Established in 1978, India Windals Precision Pvt. Ltd. has gained immense expertise in supplying & trading of Axle components, steering knuckles, steering arms etc. The supplier company is located in Chakan, Maharashtra and is one of the leading sellers of listed products. Buy Axle components, steering knuckles, steering arms in bulk from us for the best quality products and service.</p>
        {employeeData.userName === "admin" ? 
        <div>
        <button className='adminbtn' onClick={redirectToHome}>Admin Dashboard</button>
        </div>
        : 
        employeeData.length>0 && employeeData.access[18] === "1" ? 
          <div>
            <h5>Supervisor</h5>
            <button type='button' onClick={()=>{
              navigate(`/${employeeData.userName}/SupervisorDash`)
            }}>
              Go to supervisor Dashboard
            </button>
          </div>
        : 
          <div style={{fontSize:'1.2rem'}}>
            {noStationAllocatedError !== "" && noStationAllocatedError}
            <div>
              <label>Select a Station: </label>
              <select onChange={(e) => handleStationSelection(e.target)}>
                <option value="" data-index={-1}>Select a station</option>
                {stations.map((station, index) => (
                  <option key={index} value={station.station_name} data-index={index}>
                    {station.station_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        }
        </div>
        {/* {userName === "admin" ? 
        <div className='adminbtn'>
        <button className='buttoncss' style={{backgroundColor:'#1D3557'}} onClick={redirectToHome}>Admin Dashboard</button>
        </div>
        : 
        employeeData.length>0 && employeeData[0].access_given[18] === "1" ? 
          <div>
            <h5>Supervisor</h5>
            <button type='button' onClick={()=>{
              navigate(`/${userName}/SupervisorDash`)
            }}>
              Go to supervisor Dashboard
            </button>
          </div>
        : 
          <div className='statselect'>
            {noStationAllocatedError !== "" && noStationAllocatedError}
            <div>
              <label>Select a Station:</label>
              <select onChange={(e) => handleStationSelection(e.target)}>
                <option value="" data-index={-1}>Select a station</option>
                {stations.map((station, index) => (
                  <option key={index} value={station.station_name} data-index={index}>
                    {station.station_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        } */}
        
      </div>
      <br />
      <Footer />
    </div>
  );
}

export default LandingPage;
