import {React, useState} from 'react';
import './App.css';

import LoginPage from './components/login';
import { Routes, Route, Link} from 'react-router-dom';
import WorkerReg from './components/user/adduser';
import DeleteUser from './components/user/deleteuser';
import UpdateProduct from './components/product/updateproduct';
import UpdateStation from './components/station/updateStation';
import AddProduct from './components/product/addProduct';
import AddStation from './components/station/addStation';
import Admin from './components/Admin';
import ViewUser from './components/user/viewUser';
import ViewProduct from './components/product/viewProduct';
import ViewStation from './components/station/viewStation';
import StationAllocation from './components/station/allocateStation';
import FirstStation from './components/station/firstStation';
import NextStationAllocation from './components/station/nextStationAllocation';
import StationPage from './components/station/stationPage';
import ShiftConfig from './components/shift/shiftConfiguration';
import ViewShifts from './components/shift/viewShift';
// import LoginLog from './components/reports/loginLog';
import JobReport from './components/reports/jobReport';
import ProductReport from './components/reports/productReport';
import LoginLog from './components/reports/loginLog';
import LandingPage from './components/landingPage.js';
import Supervisor from './components/supervisor/supervisor';
import SupervisorAllocation from './components/supervisor/supervisorAllocation';
import DailyProductionReport from './components/reports/dailyProductionReport.js';

function App() {
  console.log(window.location.href);
  
  return (
    <>

      <Routes>
        {/* <Route path='/:userName/LandingPage' element={<LandingPage/>}></Route> */}
        <Route path='/LandingPage' element={<LandingPage/>}></Route>
        
        <Route path='/AdminPanel' element={<Admin/>}></Route>
        
        <Route path='/AddUser' element={<WorkerReg />} />
        <Route path='/UpdateAndDeleteUser' element={<DeleteUser />} />
        <Route path='/ViewUser' element={<ViewUser />} />

        <Route path='/AddProduct' element={<AddProduct />}></Route>
        <Route path='/UpdateProduct' element={<UpdateProduct />}></Route>
        <Route path='/ViewProduct' element={<ViewProduct />}></Route>

        <Route path='/Add' element={<AddStation />}></Route>
        <Route path='/UpdateAndDeleteStation' element={<AddStation />}></Route>
        {/* <Route path='/:userName/updateStation' element={<UpdateStation />}></Route> */}
        <Route path='/ViewStation' element={<ViewStation />}></Route>
        <Route path='/AllocateStationToWorker' element={<StationAllocation />}></Route>
        <Route path='/AllocateNextStation' element={<NextStationAllocation />}></Route>
        
        {/* <Route path='/Station/:employeeId/:employeeName/:userName/:stationName' element={<StationPage />}></Route> */}
        {/* <Route path='/FirstStation/:employeeId/:employeeName/:userName/:stationName' element={<FirstStation />}></Route> */}
        <Route path='/StationPage' element={<StationPage/>}></Route>
        <Route path='/FirstStation' element={<FirstStation />}></Route>
        
        <Route path='/ShiftConfig' element={<ShiftConfig />}></Route>
        <Route path='/ViewShifts' element={<ViewShifts />}></Route>

        {/* <Route path='/:userName/LoginLog' element={<LoginLog />}></Route> */}
        <Route path='/JobReport' element={<JobReport />} />
        <Route path='/ProductReport' element={<ProductReport />} />
        <Route path='/LoginLog' element={<LoginLog />} />
        <Route path='/DailyProductionReport' element={<DailyProductionReport />} />
        <Route path='/TrackingUserReport' element={<DailyProductionReport />} />
        <Route path='/CompletedJobsReport' element={<DailyProductionReport />} />
        <Route path='/ScrapJobsReport' element={<DailyProductionReport />} />
        <Route path='/TargetVsActualJobQntReport' element={<DailyProductionReport />} />
        <Route path='/TargetVsActualJobCycleTimeReport' element={<DailyProductionReport />} />
        <Route path='/' element={<LoginPage />} />

        <Route path='/:userName/SupervisorDash' element={<Supervisor/>}/>
        <Route path='/:userName/SupervisorAllocation' element={<SupervisorAllocation/>}/>
      </Routes>
    </>
  );
}

export default App;