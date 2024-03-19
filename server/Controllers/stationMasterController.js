import db from "../Database/connection.js";
//modified by SJT on 27-02-2024
async function insertIntoStationMaster(req, res) {
    console.log(req.body)
    var {process_number,
        stationName,
        productName,
        cycleTime,
        dailyCount,
        productPerHour,
        reportType, //0-for ok/notok, 1-for parameters
        stationParameter,
        machines, multipleMachines,paramIds } = req.body
    // if (stationParameter.length === 0) {
    //     stationParameter = null;
    // }
    // else {
    //     stationParameter = stationParameter.map((parameter) => parameter).join(",")
    // }
    try {
        const selectQuery = "SELECT station_id FROM station_master WHERE station_name = ? && product_name = ?"
        const [selectResult] = await db.promise().query(selectQuery, [stationName, productName])
        console.log(selectResult);
        if (selectResult.length == 0) {
            const insertQuery = "INSERT INTO station_master (station_name, product_name, report, station_parameters,multiple_machine,process_number,cycle_time,daily_count,product_per_hour,parameterIds) VALUES (?,?,?,?,?,?,?,?,?,?)"
            const [insertResult] = await db.promise().query(insertQuery, [stationName, productName, reportType, stationParameter, multipleMachines,process_number,cycleTime,dailyCount,productPerHour,paramIds])
            console.log(insertResult);
            console.log(insertResult.insertId)
            if (multipleMachines)
            {
                //const selectQuery = "SELECT station_id FROM station_master WHERE station_name = ? && product_name = ?"
                //const [selectResult] = await db.promise().query(selectQuery, [stationName, productName.label])
                //const station_id = selectResult[0].station_id;
                const station_id=insertResult.insertId;
                //console.log(selectResult[0].station_id);
                const insertQuery2 = "Insert Into machine_master (station_id,machine_name,cycle_time,daily_count,product_per_hour) values (?,?,?,?,?)";
    
                for (const machine of machines) {
                    const { machineName, cycleTime, dailyCount, productPerHour } = machine;
                    const [insertResult2] = await db.promise().query(insertQuery2, [station_id, machineName, cycleTime, dailyCount, productPerHour]);
                }    
            }
            console.log("Record Inserted");
            res.status(201).send({ msg: "Record inserted successfully" });
            
        }
        else{
            res.status(501).send({ msg: "Record already Present" });
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}
//added by SJT on 21-02-2024
async function deleteStation(req, res) {
    console.log("Deleting Station")
    console.log(req.query)
    const { stationId } = req.query
    console.log(stationId)
    try {
        const deleteStationQuery = "DELETE FROM station_master WHERE station_id = ?"
        const [deleteStationResult] = await db.promise().query(deleteStationQuery,[stationId])
        const deleteMachineQuery = "DELETE FROM machine_master WHERE station_id = ?"
        const [deleteMachineResult] = await db.promise().query(deleteMachineQuery,[stationId])
        console.log("Station Deleted")
        res.status(201).send({ msg: `Station deleted from database successfully` })
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function deleteFromStationMaster(req, res) {
    const { stationId,machineId } = req.query.values
    try {
        const deleteStationQuery = "DELETE FROM station_master WHERE station_id = ?"
        const [deleteStationResult] = await db.promise().query(deleteStationQuery,[stationId])
        const deleteMachineQuery = "DELETE FROM machine_master WHERE machine_id = ?"
        for(const machine_id of machineId)
        {
            const [deleteMachineResult] = await db.promise().query(deleteMachineQuery,[machine_id])
        }
        res.status(201).send({ msg: `Station deleted from database successfully` })

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function updateStationMaster(req, res) {
    var { stationId,
        process_number,
        stationName,
        productName,
        cycleTime,
        dailyCount,
        productPerHour,
        reportType,
        stationParameter,
        machines,
        multipleMachines,
        paramIds
        } = req.body
        console.log("updateStationMaster",stationId);
        console.log("updateStationMaster",req.body);
    // if (stationParameter.length === 0) {
    //     stationParameter = null;
    // }
    // else {
    //     stationParameter = stationParameter.map((parameter) => parameter).join(", ")
    // }
    try {
        if (stationId === undefined) {
            res.status(409).send({ msg: "The station configuration of this product does not exist." })
        }
        else {
            console.log("Updating")
            const updateStationMasterQuery = "UPDATE station_master SET process_number=?,station_name = ?, product_name = ?, report = ?, station_parameters = ?, multiple_machine = ?,cycle_time=?,daily_count=?,product_per_hour=?, parameterIds=? WHERE station_id = ?"
            const [updateStationMasterResult] = await db.promise().query(updateStationMasterQuery, [process_number,stationName, productName, reportType, stationParameter, multipleMachines, cycleTime, dailyCount, productPerHour, paramIds, stationId])
            if (multipleMachines)
            {
                const updateMachineMasterQuery = "UPDATE machine_master SET machine_name = ?, cycle_time = ?, product_per_hour = ?, daily_count = ? WHERE machine_id = ? "
                const insertIntoMachineMasterQuery = "INSERT INTO machine_master (station_id,machine_name,cycle_time,daily_count,product_per_hour) VALUES (?,?,?,?,?)";
                for(const machine of machines)
                {
                   const {machineId,machineName,dailyCount,cycleTime,productPerHour} = machine
                   if(machineId!==undefined)
                   {
                        const [updateMachineMasterResult] = await db.promise().query(updateMachineMasterQuery, [machineName,dailyCount,cycleTime,productPerHour,machineId])
                   }
                   else
                   {
                        const [insertIntoMachineMasterResult] = await db.promise().query(insertIntoMachineMasterQuery, [stationId, machineName, cycleTime, dailyCount, productPerHour]);
                   } 
                }    
            }
            console.log("Data Updated");
            res.status(201).send({ msg: `Data updated successfully` })
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function getInfoFromStationMaster(req, res) {
    try {
        console.log("Sending Station Information")
        var query = "SELECT * FROM station_master"
        const [result] = await db.promise().query(query)
        if (result.length === 0) {
            res.status(409).send({ msg: "No infomation about stations exist in database." })
        }
        else {
            res.status(201).send(result)
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` })
    }
}

async function getOneStationFromStationMaster(req, res) {
    const { stationName } = req.query
    try {
        const searchQuery = "SELECT * FROM station_master WHERE station_name = ?"
        const [searchResult] = await db.promise().query(searchQuery, [stationName])
        if (searchResult.length === 0) {
            res.status(409).send({ msg: "No such station exist in database." })
        }
        else {
            res.status(201).send(searchResult)
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` })
    }
}

async function getOneStationOneProductFromStationMaster(req, res) {
    const { stationName, productName } = req.query.values
    try {
        console.log("getOneStationOneProductFromStationMaster",req.query)
        const searchQuery = "SELECT * FROM station_master WHERE station_name = ? AND product_name = ?"
        const [searchResult] = await db.promise().query(searchQuery, [stationName, productName])
        if (searchResult.length === 0) {
            res.status(409).send({ msg: "Station configuration of this product does not exist in database." })
        }
        else {
            const station_id = searchResult[0]["station_id"]
            const searchQuery2 = "SELECT machine_id,machine_name,cycle_time,daily_count,product_per_hour FROM machine_master WHERE station_id = ?"
            const searchResult2 = await db.promise().query(searchQuery2,[station_id])
            const machines = searchResult2[0]
            const finalResult = {...searchResult[0],machines}
            res.status(201).send(finalResult)
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` })
    }
}
async function mobileGetOneStationOneProductFromStationMaster(req, res) {
    const { stationName, productName } = req.query
    try {
        const searchQuery = "SELECT * FROM station_master WHERE station_name = ? AND product_name = ?"
        const [searchResult] = await db.promise().query(searchQuery, [stationName, productName])
        if (searchResult.length === 0) {
            res.status(409).send({ msg: "Station configuration of this product does not exist in database." })
        }
        else {
            res.status(201).send(searchResult)
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` })
    }
}

async function getStationNamesFromStationMaster(req, res) {
    try {
        const selectQuery = "SELECT DISTINCT station_name FROM station_master"
        const [selectResult] = await db.promise().query(selectQuery)
        res.status(201).send(selectResult)
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send({ msg: `Internal server error: ${error}` })
    }
}

async function getStationNamesForOneProduct(req, res) {
    const { productName } = req.query
    try {
        console.log("getStationNamesForOneProduct",productName);
        const searchQuery = "SELECT station_name,station_id,next_station_name,nextStationId,position FROM station_master WHERE product_name = ?"
        const [searchResult] = await db.promise().query(searchQuery, [productName])
        res.status(201).send(searchResult)
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send({ msg: `Internal server error: ${error}` })
    }
}
//added by SJT on 20-02-2024
async function getProductStationsDetails(req, res) {
    const { productName } = req.query
    try {
        console.log("getProductStationsDetails ",productName);
        const searchQuery = "SELECT * FROM station_master WHERE product_name = ?"
        const [searchResult] = await db.promise().query(searchQuery, [productName])
        res.status(201).send(searchResult)
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send({ msg: `Internal server error: ${error}` })
    }
}

// async function addNextStationInStationMaster(req, res) {
//     const { productName, nextStationAllocation, firstStation, lastStation } = req.body;
//     // console.log({ productName, nextStationAllocation, firstStation, lastStation });
//     try {
//       const updateQuery = "UPDATE station_master SET next_station_name = ?, position = ? WHERE product_name=? AND station_name=?";
//       for (const station of nextStationAllocation) {
//         const { currentStation, nextStation } = station;
//         const position = currentStation === firstStation ? 1 : (currentStation === lastStation ? -1 : 0);
//         const [updateResult] = await db.promise().query(updateQuery, [nextStation, position, productName, currentStation]);
//       }
//       res.status(201).send({ msg: "Configuration saved successfully" });
//     } catch (error) {
//       console.error("Database error:", error);
//       res.status(500).send({ msg: `Internal server error: ${error}` });
//     }
// }

async function addNextStationInStationMaster(req, res) {
    //console.log("Configuring next Station")
    const { productName, nextStationAllocation, stationSequence } = req.body;
    //console.log("addNextStationInStationMaster:",stationSequence)
    // console.log({ productName, nextStationAllocation, firstStation, lastStation });
    try {
    //   const updateQuery = "UPDATE station_master SET next_station_name = ?, position = ? WHERE product_name=? AND station_name=?";
    //   var position=1;
    //   var i=0;
    //   for(i=0;i<nextStationAllocation.length-1;i++)
    //   {
    //     console.log(nextStationAllocation[i])
    //     const [updateResult] = await db.promise().query(updateQuery, [nextStationAllocation[i+1].value, position, productName, nextStationAllocation[i].value]);
    //     position=0;
    //   }
        // console.log("out")
        // console.log(nextStationAllocation[i])
        // const [updateResult] = await db.promise().query(updateQuery, [null, -1, productName, nextStationAllocation[i].value]);
        // console.log("Done")
    const updateQuery = "UPDATE station_master SET next_station_name = ?,nextStationId=?, position = ? WHERE product_name=? AND station_id=?";
      var position=1;
      var i=0;
      for(i=0;i<stationSequence.length-1;i++)
      {
        //console.log(stationSequence[i])
        const [updateResult] = await db.promise().query(updateQuery, [stationSequence[i+1].name,stationSequence[i+1].id, position, productName, stationSequence[i].id]);
        position=0;
      }
      //console.log("out")
     // console.log(stationSequence[i])
      const [updateResult] = await db.promise().query(updateQuery, [null,0, -1, productName, stationSequence[i].id]);
      //console.log("Done")
      //res.status(500).send({ msg: `Internal server error: ${error}` });
      res.status(201).send({ msg: "Configuration saved successfully" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).send({ msg: `Internal server error: ${error}` });
    }
}

async function getStationAndMachinesInfo(req,res){
    try {
        const searchQuery = "SELECT sm.station_id,sm.station_name,mm.machine_id,mm.machine_name FROM station_master sm JOIN machine_master mm ON sm.station_id = mm.station_id;"
        const [searchResult] = await db.promise().query(searchQuery)
        res.status(201).send(searchResult)
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send({ msg: `Internal server error: ${error}` })
    }
}
async function copyStationNamesFromOneProduct(req, res) {
    const { srcProduct,destProduct } = req.query
    console.log("Copying stations")
    console.log(req.query)
    console.log(srcProduct.value)
    try {
        //console.log(productName);
        const searchQuery = "SELECT * FROM station_master WHERE product_name = ?"
        const [searchResult] = await db.promise().query(searchQuery, [srcProduct.label])
        const insertQuery = "INSERT INTO station_master (station_name, product_name, report, station_parameters,multiple_machine,process_number,cycle_time,daily_count,product_per_hour) VALUES (?,?,?,?,?,?,?,?,?)"
        const machinMasterSearchQuery = "SELECT * FROM machine_master WHERE station_id = ?"
        const machinMasterInsertQuery = "Insert into machine_master (station_id,machine_name,cycle_time,daily_count,product_per_hour) values (?,?,?,?,?)";
        if (searchResult.length > 0) {
            searchResult.forEach(async (data)  =>
            {
                console.log(data);
                const [insertResult] = await db.promise().query(insertQuery, [data.station_name, destProduct.label, data.report, data.station_parameters, data.multiple_machine,data.process_number,data.cycle_time,data.daily_count,data.product_per_hour])
                const [machineMasterSearchResult] = await db.promise().query(machinMasterSearchQuery, [data.station_id]);
                console.log("Inserted ID:",insertResult.insertId)
                if(machineMasterSearchResult.length>0)
                {
                    machineMasterSearchResult.forEach(async (machineData)  =>
                    {
                        const [machineInsertResult] = await db.promise().query(machinMasterInsertQuery, [insertResult.insertId, machineData.machine_name, machineData.cycle_time,machineData.daily_count,machineData.product_per_hour])
                    })    
                }
            })
        }
        res.status(201).send({msg:"Done"})
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send({ msg: `Internal server error: ${error}` })
    }
}

export { insertIntoStationMaster, deleteFromStationMaster, getInfoFromStationMaster, getOneStationFromStationMaster, getOneStationOneProductFromStationMaster, updateStationMaster, getStationNamesFromStationMaster, getStationNamesForOneProduct, addNextStationInStationMaster, mobileGetOneStationOneProductFromStationMaster,getStationAndMachinesInfo,copyStationNamesFromOneProduct,getProductStationsDetails, deleteStation }