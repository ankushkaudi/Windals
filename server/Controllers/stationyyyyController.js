import db from "../Database/connection.js";
async function insertInStationyyyyFirst(req,res){
    const {product_name, station_id,  job_names, job_name,  employee_id,machine_id} = req.body;
    
    try {
        const insertResults = [];

        for (const job_name of job_names) {
            const searchQuery = "SELECT job_id FROM productyyyy WHERE job_name = ? AND product_name = ?";
            const [selectResult] = await db.promise().query(searchQuery, [job_name, product_name]);
            if (selectResult.length === 0) {
                res.status(400).send({ msg: `Job '${job_name}' not found for product '${product_name}'` });
                return;
            }
            const job_id = selectResult[0].job_id;

            const insertQuery = "INSERT INTO station_yyyy (product_name, station_id, job_id, employee_id, status, intime, out_time, machine_id) VALUES (?, ?, ?, ?, 1, NOW(), NOW(), ?)";
            const [insertResult] = await db.promise().query(insertQuery, [product_name, station_id, job_id, employee_id, machine_id]);
            insertResults.push(insertResult);
        }

        res.status(201).send({ msg: "Records inserted successfully", insertResults });


        // const searchQuery = "SELECT job_id FROM productyyyy WHERE job_name=? AND product_name=?"
        // const [selectResult] = await db.promise().query(searchQuery,[job_name,product_name])
        // const job_id=selectResult[0]["job_id"];
        

        // const insertQuery = "INSERT INTO station_yyyy (product_name, station_id, job_id, employee_id,status,intime,out_time,machine_id) VALUES (?, ?, ?,?,1,NOW(),NOW(),?)";
        // const [insertResult] = await db.promise().query(insertQuery, [product_name, station_id, job_id,employee_id,machine_id]);
            
        // res.status(201).send({ msg: "Record inserted successfully"});
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}

async function insertInStationyyyyFirstNextStation(req,res){
    const {product_name, station_id,  job_names,machine_id} = req.body;
    console.log("firstnextstation");
    console.log(job_names);
    console.log({product_name, station_id, job_names,machine_id});
    try {
        const insertResults = [];

        for (const job_name of job_names) {
            const searchQueryJob = "SELECT job_id FROM productyyyy WHERE job_name = ? AND product_name = ?";
            const [selectResultJob] = await db.promise().query(searchQueryJob, [job_name, product_name]);
            if (selectResultJob.length === 0) {
                res.status(400).send({ msg: `Job '${job_name}' not found for product '${product_name}'` });
                return;
            }
            const job_id = selectResultJob[0].job_id;

            const selectNextStationNameQuery = "SELECT next_station_name FROM station_master WHERE station_id = ? AND product_name = ?";
            const [selectNextStationNameResult] = await db.promise().query(selectNextStationNameQuery, [station_id, product_name]);

            if (!selectNextStationNameResult || selectNextStationNameResult.length === 0 || !selectNextStationNameResult[0].next_station_name) {
                return res.status(201).send({ msg: "This is the final station." });
            }

            const next_station_name = selectNextStationNameResult[0].next_station_name;

            const searchQueryNextStation = "SELECT station_id FROM station_master WHERE station_name = ? AND product_name = ?";
            const [selectResultNextStation] = await db.promise().query(searchQueryNextStation, [next_station_name, product_name]);
            if (selectResultNextStation.length === 0) {
                res.status(500).send({ msg: "Next station not found." });
                return;
            }
            const next_station_id = selectResultNextStation[0].station_id;

            const insertQuery = "INSERT INTO station_yyyy (product_name, station_id, job_id, intime) VALUES (?, ?, ?, NOW())";
            const [insertResult] = await db.promise().query(insertQuery, [product_name, next_station_id, job_id]);
            insertResults.push(insertResult);
        }

        res.status(201).send({ msg: "Records inserted successfully", insertResults });



        // const searchQueryJob = "SELECT job_id FROM productyyyy WHERE job_name=? AND product_name=? "
        // const [selectResultJob] = await db.promise().query(searchQueryJob,[job_name,product_name])
        // const job_id=selectResultJob[0]["job_id"];
        // console.log(job_id)

        // const selectNextStationNameQuery = "SELECT next_station_name FROM station_master WHERE station_id=? AND product_name=?"
        // const [selectNextStationNameResult] = await db.promise().query(selectNextStationNameQuery,[station_id,product_name])

        // console.log(selectNextStationNameResult);
        
        // if(selectNextStationNameResult[0].next_station_name===null)
        // {
        //     return res.status(201).send({msg: "This is final station."})
        // }

        // const searchQueryNextStation = "SELECT station_id FROM station_master WHERE station_name=(select next_station_name from station_master where station_id=? and product_name=?) AND product_name=? "
        // const [selectResultNextStation] = await db.promise().query(searchQueryNextStation,[station_id,product_name,product_name])
        // const next_station_id=selectResultNextStation[0]["station_id"];
        // console.log(next_station_id)

        // const insertQuery = "INSERT INTO station_yyyy (product_name, station_id, job_id,intime) VALUES (?, ?, ?,NOW())";
        // const [insertResult] = await db.promise().query(insertQuery, [product_name, next_station_id, job_id]);
            
        // res.status(201).send({ msg: "Record inserted successfully"});
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}
/*
async function insertInStationyyyyFirst(req,res){
    const {product_name, station_id, job_name,  employee_id,machine_id} = req.body;
    
    try {
        const searchQuery = "SELECT job_id FROM productyyyy WHERE job_name=? AND product_name=?"
        const [selectResult] = await db.promise().query(searchQuery,[job_name,product_name])
        const job_id=selectResult[0]["job_id"];
        

        const insertQuery = "INSERT INTO station_yyyy (product_name, station_id, job_id, employee_id,status,intime,out_time,machine_id) VALUES (?, ?, ?,?,1,NOW(),NOW(),?)";
        const [insertResult] = await db.promise().query(insertQuery, [product_name, station_id, job_id,employee_id,machine_id]);
            
        res.status(201).send({ msg: "Record inserted successfully"});
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}

async function insertInStationyyyyFirstNextStation(req,res){
    const {product_name, station_id, job_name,machine_id} = req.body;
    console.log("firstnextstation");
    console.log({product_name, station_id, job_name,machine_id});
    try {
        const searchQueryJob = "SELECT job_id FROM productyyyy WHERE job_name=? AND product_name=? "
        const [selectResultJob] = await db.promise().query(searchQueryJob,[job_name,product_name])
        const job_id=selectResultJob[0]["job_id"];
        console.log(job_id)

        const selectNextStationNameQuery = "SELECT next_station_name FROM station_master WHERE station_id=? AND product_name=?"
        const [selectNextStationNameResult] = await db.promise().query(selectNextStationNameQuery,[station_id,product_name])

        console.log(selectNextStationNameResult);
        
        if(selectNextStationNameResult[0].next_station_name===null)
        {
            return res.status(201).send({msg: "This is final station."})
        }

        const searchQueryNextStation = "SELECT station_id FROM station_master WHERE station_name=(select next_station_name from station_master where station_id=? and product_name=?) AND product_name=? "
        const [selectResultNextStation] = await db.promise().query(searchQueryNextStation,[station_id,product_name,product_name])
        const next_station_id=selectResultNextStation[0]["station_id"];
        console.log(next_station_id)

        const insertQuery = "INSERT INTO station_yyyy (product_name, station_id, job_id,intime) VALUES (?, ?, ?,NOW())";
        const [insertResult] = await db.promise().query(insertQuery, [product_name, next_station_id, job_id]);
            
        res.status(201).send({ msg: "Record inserted successfully"});
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}
*/
async function updateInStationyyyy(req,res){
    console.log("Updating Job Completion");
    console.log(req.body);
    const {product_name, station_id, job_name,employee_id,status,parameters, machine_id} = req.body;
    try {
        const searchQueryJob = "SELECT job_id FROM productyyyy WHERE job_name=? and product_name=?"
        const [selectResultJob] = await db.promise().query(searchQueryJob,[job_name,product_name])
        const job_id=selectResultJob[0]["job_id"];
        // console.log(job_id)
        console.log(status);

        // const searchQueryNextStation = "SELECT station_id FROM station_master WHERE station_name=(select next_station_name from station_master where station_id=?) "
        // const [selectResultNextStation] = await db.promise().query(searchQueryNextStation,[station_id])
        // const next_station_id=selectResultNextStation[0]["station_id"];
        // console.log(next_station_id)

        //const searchQintime="Select intime From station_yyyy Where station_id=? and product_name=? and job_id=? and status is null;"
        const searchQintime="Select intime From station_yyyy Where station_id=? and product_name=? and job_id=(Select job_id From productyyyy Where product_name=? and job_name=?) and status is null;"
        const [selectRintime] = await db.promise().query(searchQintime,[station_id,product_name,product_name,job_name])
        const intime=selectRintime[0]["intime"];
        //console.log(intime)


        const updateQuery = "UPDATE station_yyyy SET employee_id = ?, status = ?, parameters = ? ,out_time=NOW(), machine_id=? WHERE (intime = ?) and (station_id = ?) and (product_name = ?) and (job_id = ?);";
        const [updateResult] = await db.promise().query(updateQuery, [employee_id,status,parameters,machine_id,intime,station_id,product_name, job_id]);
            
        res.status(201).send({ msg: "Record updated successfully"});
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}
//Added by SJT on 20-02-2024
async function updateJobStatus(req,res){
    console.log("Updating Job Status");
    console.log(req.body);
    const {product_name, station_id, job_name,employee_id,status,parameters, machine_id} = req.body;
    try {
        const searchQueryJob = "SELECT job_id FROM productyyyy WHERE job_name=? and product_name=?"
        const [selectResultJob] = await db.promise().query(searchQueryJob,[job_name,product_name])
        const job_id=selectResultJob[0]["job_id"];

        //const searchQintime="Select intime From station_yyyy Where station_id=? and product_name=? and job_id=(Select job_id From productyyyy Where product_name=? and job_name=?) and status is null;"
        const searchQintime="Select intime From station_yyyy Where station_id=? and product_name=? and job_id=(Select job_id From productyyyy Where product_name=? and job_name=?);"
        const [selectRintime] = await db.promise().query(searchQintime,[station_id,product_name,product_name,job_name])
        //const intime=selectRintime[0]["intime"];
        //console.log(intime)

        const updateQuery = "UPDATE station_yyyy SET employee_id = ?, status = ?, parameters = ? ,out_time=NOW(), machine_id=? WHERE (intime = ?) and (station_id = ?) and (product_name = ?) and (job_id = ?);";
        const [updateResult] = await db.promise().query(updateQuery, [employee_id,status,parameters,machine_id,selectRintime[0]["intime"],station_id,product_name, job_id]);
        if(status>0){
            //Add Job to Next Station
            const selectNextStationNameQuery = "SELECT next_station_name FROM station_master WHERE station_id = ? AND product_name = ?";
            const [selectNextStationNameResult] = await db.promise().query(selectNextStationNameQuery, [station_id, product_name]);

            if (selectNextStationNameResult.length>0)
            {
                const next_station_name = selectNextStationNameResult[0].next_station_name;

                const searchQueryNextStation = "SELECT station_id FROM station_master WHERE station_name = ? AND product_name = ?";
                const [selectResultNextStation] = await db.promise().query(searchQueryNextStation, [next_station_name, product_name]);

                const next_station_id = selectResultNextStation[0].station_id;
        
                const insertQuery = "INSERT INTO station_yyyy (product_name, station_id, job_id, intime) VALUES (?, ?, ?, NOW())";
                const [insertResult] = await db.promise().query(insertQuery, [product_name, next_station_id, job_id]);
                //insertResults.push(insertResult);
        
            }
        }

        res.status(201).send({ msg: "Record updated successfully"});
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function updateInStationyyyyrework(req,res){
    const {product_name, station_id, job_name,employee_id,status,parameters, machine_id} = req.body;
    console.log(req.body);
    try {
        const searchQueryJob = "SELECT job_id FROM productyyyy WHERE job_name=? and product_name=?"
        const [selectResultJob] = await db.promise().query(searchQueryJob,[job_name,product_name])
        const job_id=selectResultJob[0]["job_id"];
        // console.log(job_id)


        // const searchQueryNextStation = "SELECT station_id FROM station_master WHERE station_name=(select next_station_name from station_master where station_id=?) "
        // const [selectResultNextStation] = await db.promise().query(searchQueryNextStation,[station_id])
        // const next_station_id=selectResultNextStation[0]["station_id"];
        // console.log(next_station_id)

        const searchQintime="select intime from station_yyyy where station_id=? and product_name=? and job_id=?;"
        const [selectRintime] = await db.promise().query(searchQintime,[station_id,product_name,job_id])
        const intime=selectRintime[0]["intime"];
        // console.log(intime)


        const updateQuery = "UPDATE station_yyyy SET employee_id = ?, status = ?, parameters = ? ,out_time=NOW(), machine_id=? WHERE (intime = ?) and (station_id = ?) and (product_name = ?) and (job_id = ?);";
        const [updateResult] = await db.promise().query(updateQuery, [employee_id,status,parameters,machine_id,intime,station_id,product_name, job_id]);
            
        res.status(201).send({ msg: "Record updated successfully"});
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function jobsAtStation(req,res){
    const {station_id} = req.body;
    // console.log(station_id);
    try {
        //status is null if job shifted from previous station, -1 if rejected by worker, -2 if rework by supervisor
        const searchQueryJob = "SELECT job_id, job_name, product_name FROM productyyyy as py where py.job_id in (select job_id from station_yyyy where (`status` is null or `status`=-2) and `station_id`=?) Limit 10;"
        const [selectResultJob] = await db.promise().query(searchQueryJob,[station_id])
        console.log(selectResultJob);
            
        res.status(201).send(selectResultJob);
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}

async function jobsAtReworkStation(req,res){
    // const {station_id} = req.body;
    // console.log(station_id);
    try {
        const searchQueryJob = "select newt2.job_id,newt2.product_name,newt2.station_id,newt2.employee_id,newt2.machine_id,newt2.parameters,newt2.job_name,employee_master.first_name,employee_master.last_name,station_master.station_name from (select newt.job_id,newt.product_name,newt.station_id,newt.employee_id,newt.machine_id,newt.parameters,productyyyy.job_name from (select * from station_yyyy where status='-1') as newt inner join productyyyy on newt.job_id=productyyyy.job_id) as newt2 inner join employee_master on newt2.employee_id=employee_master.employee_id INNER JOIN station_master on newt2.station_id=station_master.station_id"
        //const searchQueryJob = "select newt2.job_id,newt2.product_name,newt2.station_id,newt2.employee_id,newt2.machine_id,newt2.parameters,newt2.job_name,employee_master.first_name,employee_master.last_name from (select newt.job_id,newt.product_name,newt.station_id,newt.employee_id,newt.machine_id,newt.parameters,productyyyy.job_name from (select * from station_yyyy where status='-1') as newt inner join productyyyy on newt.job_id=productyyyy.job_id) as newt2 inner join employee_master on newt2.employee_id=employee_master.employee_id ;"
        const [selectResultJob] = await db.promise().query(searchQueryJob)
        console.log(selectResultJob);
            
        res.status(201).send(selectResultJob);
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}

async function insertInStationyyyySameStation(req,res){
    const {product_name, station_id, job_name} = req.body;
    console.log({product_name, station_id, job_name});
    try {
        const searchQueryJob = "SELECT job_id FROM productyyyy WHERE job_name=? AND product_name=? "
        const [selectResultJob] = await db.promise().query(searchQueryJob,[job_name,product_name])
        const job_id=selectResultJob[0]["job_id"];
        console.log(job_id)

        const insertQuery = "INSERT INTO station_yyyy (product_name, station_id, job_id,intime) VALUES (?, ?, ?,NOW())";
        const [insertResult] = await db.promise().query(insertQuery, [product_name, station_id, job_id]);
            
        res.status(201).send({ msg: "Record inserted successfully"});
        
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}

async function stationJobsStats(req,res){
    console.log("Finding Job Statistics");
    console.log(req.query);
    const {stationID } = req.query;
    console.log(stationID);
    try {
    // //const searchStationIdQuery = "SELECT station_id FROM station_master WHERE station_name = ?";
    // //const [selectstationIdResult] = await db.promise().query(searchStationIdQuery, [stationName]);

    // //const stationIds = selectstationIdResult.map((station) => station.station_id);
    // //const placeholders = stationIds.map(() => '?').join(', ');


    // //const searchQueryDone = `SELECT COUNT(*) AS ok FROM station_yyyy WHERE status = 1 AND station_id IN (${placeholders})`;
    // const searchQueryDone = `SELECT COUNT(*) AS ok FROM station_yyyy WHERE status = 1 AND station_id=?`;
    // const [selectResultDone] = await db.promise().query(searchQueryDone, stationID);
    // const done = selectResultDone[0]['ok'];

    // //const searchQueryNotDone = `SELECT COUNT(*) AS notok FROM station_yyyy WHERE status = -1 AND station_id IN (${placeholders})`;
    // const searchQueryNotDone = `SELECT COUNT(*) AS notok FROM station_yyyy WHERE status = -1 AND station_id=?`;
    // const [selectResultNotDone] = await db.promise().query(searchQueryNotDone, stationID);
    // //const [selectResultNotDone] = await db.promise().query(searchQueryNotDone, stationIds);
    // const notdone = selectResultNotDone[0]['notok'];

    // //const searchQueryRework = `SELECT COUNT(*) AS rework FROM station_yyyy WHERE status = 0 AND station_id IN (${placeholders})`;
    // const searchQueryRework = `SELECT COUNT(*) AS rework FROM station_yyyy WHERE status = 0 AND station_id=?`;
    // const [selectResultRework] = await db.promise().query(searchQueryRework, stationID);
    // const rework = selectResultRework[0]['rework'];
    //var searchQuery="";   
    //Date(station_yyyy.out_time)=CURRENT_DATE() 
    const searchQuery = 'SELECT station_id,status, COUNT(*) AS count FROM station_yyyy GROUP BY station_id,status HAVING station_id=?';
    const [searchResult] = await db.promise().query(searchQuery, stationID);
    
    console.log(searchResult);
    var done=0,notdone=0,rework=0;

    searchResult.forEach((element)=>{
        if(element['status']==1)
            done=element['count'];
        else if (element['status']==-1)
            notdone=element['count'];
        else if (element['status']==0)
            rework=element['count'];
    })
    res.status(201).send({ ok: done, notok: notdone, rework: rework });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function getJobesSubmitedAtStation(req,res){
    const {stationId} = req.body;

    try {
        // const date='2023-09-05'; //date format YYYY-MM-DD
        const searchQueryWork = "select newt2.product_name,job_name,status,first_name,last_name,intime from (select newt.product_name, employee_id,job_name, status,intime from (select * from station_yyyy where employee_id is not null and status is not null and station_id = ?) as newt left join productyyyy on newt.job_id=productyyyy.job_id) as newt2 left join employee_master on newt2.employee_id=employee_master.employee_id where intime between ? AND ?;"
        const [selectResultWork] = await db.promise().query(searchQueryWork,[stationId])

        res.status(201).send(selectResultWork);

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}

async function workAtStationInDay(req, res) {
    console.log("Getting work at station in a day data");
    console.log(req.query);
    //const { stationId, date, empID } = req.query;
    const { stationId, empID } = req.query;
  try {
    //const start = date + ' 00:00:00';
    //const end = date + ' 23:59:59';
    //const searchQuery =
    //  "SELECT newt.product_name, newt.status, newt.parameters, newt.intime, newt.out_time, newt.job_id, job_name FROM (SELECT * FROM station_yyyy WHERE employee_id IS NOT NULL AND status IS NOT NULL AND station_id = ?) as newt LEFT JOIN productyyyy ON newt.job_id=productyyyy.job_id WHERE intime BETWEEN ? AND ?;";
    //const searchQuery ="SELECT station_yyyy.job_id,productyyyy.job_name,station_yyyy.status FROM `station_yyyy` LEFT JOIN productyyyy ON station_yyyy.job_id=productyyyy.job_id WHERE station_yyyy.station_id=? and station_yyyy.status IS NOT null and Date(station_yyyy.out_time)=? AND station_yyyy.employee_id=?"
    //const [selectResult] = await db.promise().query(searchQuery, [stationId, date,empID]);
    const searchQuery ="SELECT station_yyyy.job_id,productyyyy.job_name,station_yyyy.status FROM `station_yyyy` LEFT JOIN productyyyy ON station_yyyy.job_id=productyyyy.job_id WHERE station_yyyy.station_id=? and station_yyyy.status IS NOT null and Date(station_yyyy.out_time)=CURRENT_DATE() AND station_yyyy.employee_id=?"
    const [selectResult] = await db.promise().query(searchQuery, [stationId,empID]);

    // // Iterate through selectResult and split parameters and reason
    // for (const row of selectResult) {
    //   const formattedString = row.parameters || "";
    //   let reason = null;
    //   let parameters = null;

    //   // Split the formattedString into parts using ';'
    //   const parts = formattedString.split(';');

    //   for (const part of parts) {
    //     if (part.startsWith("Not-Ok-Reason:") || part.startsWith("Rework-Reason:")) {
    //       reason = part;
    //     } else if (part.startsWith("Parameters:")) {
    //       parameters = part.substring("Parameters:".length);
    //     }
    //   }

    //   // Store reason and parameters as strings, or set them to null if absent
    //   row.reason = reason ? reason : null;
    //   row.parameters = parameters ? parameters : null;
    // }

    console.log({ selectResult: selectResult });
    res.status(201).send(selectResult);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send({ msg: `Internal server error: ${err}` });
  }
}

async function productReport(req,res){
    const {product_name} = req.body;

    try {
        const searchQueryid="select station_id from station_master where next_station_name is null and product_name=?"
        const [selectResultid] = await db.promise().query(searchQueryid,[product_name])
        if(selectResultid.length!=1){
            res.status(409).send({ msg: `allocate next station` });
        }
        else{
            
            const lastStationId=selectResultid[0]['station_id']
            const searchQueryWork = "select date(temp.out_time) as 'date' ,time(temp.out_time) as 'time',productyyyy.job_name from (select job_id , out_time from station_yyyy  where status=1 and station_id=? and product_name=?) as temp inner join productyyyy on productyyyy.job_id=temp.job_id;"
            const [selectResultWork] = await db.promise().query(searchQueryWork,[lastStationId,product_name])
            res.status(201).send(selectResultWork);
        }        

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}  

async function jobDetailsReport(req,res){
    const {jobName} = req.body;
    try {
        const searchQueryJob = "SELECT job_id FROM productyyyy WHERE job_name=?"
        const [selectResultJob] = await db.promise().query(searchQueryJob,[jobName])
        if(selectResultJob.length==0)
        {
            
            res.status(409).send({ msg: `These job name does not exist.` });

        } 
        else{
            const job_id=selectResultJob[0]["job_id"];


            const searchQueryWork = "select first_name, last_name, station_name, temp2.product_name, status, intime, out_time from (select station_name, temp1.product_name, employee_id, status, intime, out_time from (select station_id,product_name, employee_id,status,intime,out_time from station_yyyy where job_id=?) as temp1 inner join station_master on temp1.station_id=station_master.station_id) as temp2 inner join employee_master on temp2.employee_id=employee_master.employee_id;"
            const [selectResultWork] = await db.promise().query(searchQueryWork,[job_id])

            console.log(selectResultWork);
            res.status(201).send(selectResultWork);
        }
        

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }

} 

async function undoJobs(req, res) {
    console.log("Undoing JOBS")
    console.log(req.body);
    const { station_id,product_name, job_id, status  } = req.body
    //dont use req.query.values it create problem in mobile app
    try {
        if(status===1){
            const selectNextStationNameQuery = "SELECT next_station_name FROM station_master WHERE station_id=? AND product_name=?"
            const [selectNextStationNameResult] = await db.promise().query(selectNextStationNameQuery,[station_id,product_name])
            console.log(selectNextStationNameResult[0].next_station_name);
            //const nextEntryQuery = "SELECT * FROM station_yyyy WHERE station_id = (select station_id from station_master where product_name=? and station_name=? ) AND product_name=? and job_id=? and employee_id is null and status is null; "
            //const [nextEntryResut] = await db.promise().query(nextEntryQuery,[product_name,selectNextStationNameResult[0].next_station_name,product_name, job_id])
            const nextEntryQuery = "SELECT station_id FROM station_master WHERE station_id = (select station_id from station_master where product_name=? and station_name=? ) ; "
            const [nextEntryResut] = await db.promise().query(nextEntryQuery,[product_name,selectNextStationNameResult[0].next_station_name])

            if(nextEntryResut.length===1){
                const deletenextEntryQuery = "DELETE FROM station_yyyy WHERE station_id =?;"
                const [deletenextEntryResult] = await db.promise().query(deletenextEntryQuery,[nextEntryResut[0].station_id])
            }
        }
        const updateQuery = "UPDATE station_yyyy SET employee_id = null, status = null, parameters = null ,out_time= null, machine_id=null WHERE (station_id = ?) and (product_name = ?) and (job_id = ?);";
        const [updateResult] = await db.promise().query(updateQuery, [station_id,product_name, job_id]);
        res.status(201).send({ msg: `Undo done` })

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}


async function dailyProductionReport(req,res) {
    const {fromDate,toDate} = req.query.value
    const formattedFromDate = fromDate + ' 00:00:00';
    const formattedToDate = toDate + ' 23:59:59';
    try {
        const searchQuery = "Select station_yyyy.intime, station_yyyy.out_time, station_yyyy.status, station_yyyy.product_name, station_master.station_name, productyyyy.job_name, CONCAT(employee_master.first_name, ' ', employee_master.last_name) AS employee_name FROM station_yyyy INNER JOIN station_master ON station_yyyy.station_id = station_master.station_id INNER JOIN employee_master ON station_yyyy.employee_id = employee_master.employee_id INNER JOIN productyyyy ON station_yyyy.job_id = productyyyy.job_id WHERE station_yyyy.intime BETWEEN ? AND ?"
        const searchResult = await db.promise().query(searchQuery,[formattedFromDate,formattedToDate])
        console.log(searchResult);
        if(searchResult[0].length === 0)
            return res.status(401).send({msg:"There is no data between the selected dates."})
        else
            res.status(200).send(searchResult[0])
    } catch (error) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function trackingUserReport(req,res) {
    const {fromDate,toDate} = req.query.value
    const formattedFromDate = fromDate + ' 00:00:00';
    const formattedToDate = toDate + ' 23:59:59';
    try {
        const searchQuery = "SELECT e.employee_id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, s.station_name, sy.product_name FROM station_yyyy sy INNER JOIN employee_master e ON sy.employee_id = e.employee_id INNER JOIN station_master s ON sy.station_id = s.station_id WHERE sy.intime BETWEEN ? AND ? ORDER BY e.employee_id"
        const searchResult = await db.promise().query(searchQuery,[formattedFromDate,formattedToDate])
        console.log(searchResult);
        if(searchResult[0].length === 0)
            return res.status(401).send({msg:"There is no data between the selected dates."})
        else
            res.status(200).send(searchResult[0])
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function completedJobsReport(req,res) {
    const {fromDate,toDate} = req.query.value
    const formattedFromDate = fromDate + ' 00:00:00';
    const formattedToDate = toDate + ' 23:59:59';
    try {
        const searchQuery = "SELECT job_name, job_id, product_name FROM productyyyy WHERE job_id IN (SELECT job_id FROM station_yyyy WHERE station_id IN (SELECT station_id FROM station_master WHERE position = -1 AND intime BETWEEN ? AND ?) AND ( status = 1 OR status = 2))"
        const searchResult = await db.promise().query(searchQuery,[formattedFromDate,formattedToDate])
        console.log(searchResult);
        if(searchResult[0].length === 0)
            return res.status(401).send({msg:"There is no data between the selected dates."})
        else
            res.status(200).send(searchResult[0]) 
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function scrapJobsReport(req,res) {
    const {fromDate,toDate} = req.query.value
    const formattedFromDate = fromDate + ' 00:00:00';
    const formattedToDate = toDate + ' 23:59:59';
    try {
        const searchQuery = "SELECT sm.station_name, sy.product_name, py.job_name , Date(sy.intime) as date FROM station_yyyy as sy JOIN station_master as sm ON sy.station_id = sm.station_id JOIN productyyyy as py  ON sy.job_id = py.job_id WHERE status = -3 "
        const searchResult = await db.promise().query(searchQuery,[formattedFromDate,formattedToDate])
        console.log(searchResult);
        if(searchResult[0].length === 0)
            return res.status(401).send({msg:"There is no data between the selected dates."})
        else
            res.status(200).send(searchResult[0]) 
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function targetVsActualJobQntReport(req,res) {
    const {fromDate,toDate} = req.query.value
    const formattedFromDate = fromDate + ' 00:00:00';
    const formattedToDate = toDate + ' 23:59:59';
    try {
        const searchQuery = "SELECT Date(intime) AS date, em.user_name, sm.station_name, sy.product_name, sm.daily_count AS targetQty, COUNT(status) as actualQty, ABS(sm.daily_count - COUNT(status)) AS VarianceQty FROM station_yyyy AS sy JOIN station_master AS sm ON sy.station_id = sm.station_id JOIN employee_master AS em ON sy.employee_id = em.employee_id  WHERE status = 1 AND sy.intime BETWEEN ? AND ? GROUP BY product_name, sy.station_id, em.employee_id, Date(intime) "
        const searchResult = await db.promise().query(searchQuery,[formattedFromDate,formattedToDate])
        console.log(searchResult);
        if(searchResult[0].length === 0)
            return res.status(401).send({msg:"There is no data between the selected dates."})
        else
            res.status(200).send(searchResult[0]) 
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}

async function targetVsActualJobCycleTimeReport(req,res) {
    const {fromDate,toDate} = req.query.value
    const formattedFromDate = fromDate + ' 00:00:00';
    const formattedToDate = toDate + ' 23:59:59';
    try {
        const searchQuery = "SELECT Date(intime) AS date, em.user_name, sm.station_name, sy.product_name, py.job_name AS heat_code, sm.cycle_time AS targetCycleTime, TIMEDIFF(sy.out_time, sy.intime) AS actualCycleTime, TIME_TO_SEC(TIMEDIFF(sy.out_time, sy.intime)) - sm.cycle_time AS varianceCycleTime FROM station_yyyy AS sy JOIN station_master AS sm ON sy.station_id = sm.station_id JOIN employee_master AS em ON sy.employee_id = em.employee_id JOIN productyyyy AS py ON py.job_id = sy.job_id WHERE status = 1 AND sy.intime BETWEEN ? AND ? GROUP BY product_name, sy.station_id, em.employee_id, Date(intime), py.job_id, sy.out_time, sy.intime"
        const searchResult = await db.promise().query(searchQuery,[formattedFromDate,formattedToDate])
        console.log(searchResult);
        if(searchResult[0].length === 0)
            return res.status(401).send({msg:"There is no data between the selected dates."})
        else
            res.status(200).send(searchResult[0]) 
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send({ msg: `Internal server error: ${err}` });
    }
}



export {insertInStationyyyyFirst, insertInStationyyyyFirstNextStation,updateInStationyyyy, jobsAtStation,stationJobsStats,workAtStationInDay,getJobesSubmitedAtStation,productReport,jobDetailsReport,jobsAtReworkStation,insertInStationyyyySameStation,updateInStationyyyyrework,undoJobs,updateJobStatus,dailyProductionReport,trackingUserReport,completedJobsReport,scrapJobsReport,targetVsActualJobQntReport,targetVsActualJobCycleTimeReport};