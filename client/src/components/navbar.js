import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { logout, getOneEmployee } from '../helper/helper';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../images/logo.png'
import logoutimg from '../images/logout.png'
import './navbar.css';

function WindalsNav() {

  //const { userInfo.userName } = useParams()
  const location = useLocation()
  //const { loc } = useLocation();
  const { userInfo } = location.state;
  const [workerAccess, setWorkerAccess] = useState("")
  const navigate = useNavigate()

  const accessOptions = ["0-ViewUser", "1-AddUser", "2-UpdateUser", "3-DeleteUser", "4-ViewProduct", "5-AddProduct", "6-UpdateProduct", "7-DeleteProduct",
    "8-ViewStation", "9-AddStation", "10-UpdateStation", "11-DeleteStation", "12-AllocateStationToWorker", "13-AllocateNextStation",
    "14-ViewShifs", "15-AddShifts", "16-UpdateShifts", "17-DeleteShifts", "18-Supervisor", "19-AdminPanel"]

  useEffect(() => {
    const access = localStorage.getItem("access")
    setWorkerAccess(access)
    // const getWorkerDataPromise = getOneEmployee(userInfo.userName)
    // getWorkerDataPromise.then((result) => {
    //   //const access = result[0].access_given.split(' ').map((char) => parseInt(char));
    //   //console.log("User Access:",access)
    //   //setWorkerAccess(access)
    //   //console.log("worker Access:",workerAccess[0])
    // }).catch((err) => {
    //   toast.error(err.msg)
    // })
  }, [])
  console.log(workerAccess);

  const redirectToHome = () => {
    //navigate(`/LandingPage`)
    navigate(`/LandingPage`,{state:{userInfo}})
  }

  // console.log({workerAccess:workerAccess,userInfo.userName:userInfo.userName});
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary fixed-top" style={{ width: '100%' }} >
        <div className="col" style={{ marginLeft: 5 }} >
          <button type='button' style={{ backgroundColor: 'white' }} onClick={redirectToHome}><img src={logo} alt='' style={{ height: 40, width: 50 }} /></button>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="col">
            <Nav className="me-auto stroke">
              <NavDropdown title="User Configuration" id="basic-nav-dropdown" style={{ marginRight: 12 }} >
                {workerAccess[0] === "1" && <NavDropdown.Item as={Link} to={`/ViewUser`} state={{ userInfo }}>View</NavDropdown.Item>}
                {workerAccess[1] === "1" && <NavDropdown.Item as={Link} to={`/AddUser`} state={{ userInfo }}>Add</NavDropdown.Item>}
                {(workerAccess[2] === "1" || workerAccess[3] === 1) && <NavDropdown.Item as={Link} to={`/UpdateAndDeleteUser`} state={{ type: "1",userInfo }}>Update</NavDropdown.Item>}
                {(workerAccess[3] === "1" || workerAccess[3] === 1) && <NavDropdown.Item as={Link} to={`/UpdateAndDeleteUser`} state={{ type: "2", userInfo }}>Delete</NavDropdown.Item>}
              </NavDropdown>

              <NavDropdown title="Product Configuration" id="basic-nav-dropdown" style={{ marginRight: 4 }}>
                {workerAccess[4] === "1" && <NavDropdown.Item as={Link} to={`/ViewProduct`} state={{ userInfo }}>View</NavDropdown.Item>}
                {workerAccess[5] === "1" && <NavDropdown.Item as={Link} to={`/AddProduct`} state={{ userInfo }}>Add</NavDropdown.Item>}
                {workerAccess[6] === "1" && <NavDropdown.Item as={Link} to={`/UpdateProduct`} state={{ userInfo }}>Update</NavDropdown.Item>}
                {(workerAccess[7] === "1") && <NavDropdown.Item as={Link} to={`/UpdateProduct`} state={{ userInfo }}>Delete</NavDropdown.Item>}
              </NavDropdown>

              <NavDropdown title="Station Configuration" id="basic-nav-dropdown" style={{ marginRight: 4 }}>
                {/* {workerAccess[8] === "1" && <NavDropdown.Item as={Link} to={`/ViewStation`}>View</NavDropdown.Item>} */}
                {(workerAccess[8] === "1") && <NavDropdown.Item as={Link} to={`/Add`} state={{ opr: "4", userInfo }}>View</NavDropdown.Item>}
                {(workerAccess[9] === "1" ) && <NavDropdown.Item as={Link} to={`/Add`} state={{ opr: "1", userInfo}}>Add</NavDropdown.Item>}
                {(workerAccess[10] === "1") && <NavDropdown.Item as={Link} to={`/Add`} state={{ opr: "2", userInfo }}>Update</NavDropdown.Item>}
                {(workerAccess[11] === "1") && <NavDropdown.Item as={Link} to={`/Add`} state={{ opr: "3", userInfo }}>Delete</NavDropdown.Item>}
                {/* {(workerAccess[9] === "1" || workerAccess[10] === 1 || workerAccess[11] === 1) && <NavDropdown.Item as={Link} to={`/Add/:id=1`} element={{ opr: "1" }}>Add</NavDropdown.Item>} */}
                {/* {(workerAccess[10] === "1" || workerAccess[10] === 1 || workerAccess[11] === 1) && <NavDropdown.Item as={Link} to={`/UpdateAndDeleteStation`} state={{ opr: "2" }}>Update</NavDropdown.Item>}
                {(workerAccess[11] === "1" || workerAccess[10] === 1 || workerAccess[11] === 1) && <NavDropdown.Item as={Link} to={`/UpdateAndDeleteStation`} state={{ opr: "3" }}>Delete</NavDropdown.Item>} */}
                {/* <NavDropdown.Item as={Link} to={`/updateStation`}>Update Station</NavDropdown.Item> */}

                {workerAccess[12] === "1" && <NavDropdown.Item as={Link} to={`/AllocateStationToWorker`} state={{ userInfo }}>Station Allocation</NavDropdown.Item>}
                {workerAccess[13] === "1" && <NavDropdown.Item as={Link} to={`/AllocateNextStation`} state={{ userInfo }}>Station Sequencing</NavDropdown.Item>}
              </NavDropdown>

              <NavDropdown title="Shift Configuration" id="basic-nav-dropdown" style={{ marginRight: 4 }}>
                {(workerAccess[14] === "1") && <NavDropdown.Item as={Link} to={`/ViewShifts`} state={{ userInfo }}>View</NavDropdown.Item>}
                {(workerAccess[15] === "1") && <NavDropdown.Item as={Link} to={`/ShiftConfig`} state={{ userInfo}}>Add</NavDropdown.Item>}
                {(workerAccess[16] === "1") && <NavDropdown.Item as={Link} to={`/ShiftConfig`} state={{ userInfo }}>Update</NavDropdown.Item>}
                {(workerAccess[17] === "1") && <NavDropdown.Item as={Link} to={`/ShiftConfig`} state={{ userInfo }}>Delete</NavDropdown.Item>}
                {/* {workerAccess[14] === "1" && <Nav.Link href={`/ViewShifts`} state={{ userInfo }}>View</Nav.Link>}
                {workerAccess[15] === "1" && <Nav.Link href={`/ShiftConfig`} state={{ userInfo }}>Add</Nav.Link>}
                {workerAccess[16] === "1" && <Nav.Link href={`/ShiftConfig`} state={{ userInfo }}>Update</Nav.Link>}
                {workerAccess[17] === "1" && <Nav.Link href={`/ShiftConfig`} state={{ userInfo }}>Delete</Nav.Link>} */}
              </NavDropdown>
              <NavDropdown title="Reports" id="basic-nav-dropdown" style={{ marginRight: 4 }}>
                {(workerAccess[18] === "1") && <NavDropdown.Item as={Link} to={`/ProductReport`} state={{ userInfo }}>Product</NavDropdown.Item>}
                {(workerAccess[19] === "1") && <NavDropdown.Item as={Link} to={`/JobReport`} state={{ userInfo}}>Job</NavDropdown.Item>}
                {(workerAccess[20] === "1") && <NavDropdown.Item as={Link} to={`/DailyProductionReport`} state={{ userInfo }}>Daily Production</NavDropdown.Item>}
                {(workerAccess[21] === "1") && <NavDropdown.Item as={Link} to={`/TrackingUserReport`} state={{ userInfo }}>User Tracking</NavDropdown.Item>}
                {(workerAccess[22] === "1") && <NavDropdown.Item as={Link} to={`/CompletedJobsReport`} state={{ userInfo }}>Completed Jobs</NavDropdown.Item>}
                {(workerAccess[23] === "1") && <NavDropdown.Item as={Link} to={`/LoginLog`} state={{ userInfo }}>Log</NavDropdown.Item>}
                {(workerAccess[24] === "1") && <NavDropdown.Item as={Link} to={`/ScrapJobsReport`} state={{ userInfo }}>Scrap Jobs</NavDropdown.Item>}
                {(workerAccess[24] === "1") && <NavDropdown.Item as={Link} to={`/TargetVsActualJobQntReport`} state={{ userInfo }}>Target Vs Actual Job Qnt</NavDropdown.Item>}
                {(workerAccess[24] === "1") && <NavDropdown.Item as={Link} to={`/TargetVsActualJobCycleTimeReport`} state={{ userInfo }}>Target Vs Actual Job Cycle Time</NavDropdown.Item>}
                
                {/* <Nav.Link href={`/ProductReport`} state={{ userInfo }}>Product</Nav.Link>
                <Nav.Link href={`/JobReport`} state={{ userInfo }}>Job</Nav.Link>
                <Nav.Link href={`/DailyProductionReport`} state={{ userInfo }}>Daily Production</Nav.Link>
                <Nav.Link href={`/TrackingUserReport`} state={{ userInfo }}>User Tracking</Nav.Link>
                <Nav.Link href={`/CompletedJobsReport`} state={{ userInfo }}>Completed Jobs</Nav.Link>
                <Nav.Link href={`/LoginLog`} state={{ userInfo }}>Login loginLogGet</Nav.Link> */}

                {/* <Nav.Link href={`/LoginLog`}>Login Logs</Nav.Link> */}
              </NavDropdown>

            </Nav>
          </div>
          <div className="nav navbar-nav navbar-right" style={{ marginRight: 20 }}>
            <p style={{ marginRight: 10, marginTop: 12, color: 'black' }}>Welcome {userInfo.userName} </p>
            <img src={logoutimg} style={{ width: 30, height: 28, marginTop: 12, marginLeft: 5, cursor: 'pointer' }} alt="" onClick={() => {
              logout()
            }} />

          </div>
        </Navbar.Collapse>
      </Navbar>

      {/* <br /> */}

    </>
  );
}

export default WindalsNav;