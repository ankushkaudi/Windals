import db from "../Database/connection.js";

// async function insertInProductyyyy(req,res){
//     const {product_name, station_id, job_name, machine_id } = req.body;

    
//     try {
//         const searchQuery = "SELECT job_name FROM productyyyy WHERE job_name=?"
//         const [selectResult] = await db.promise().query(searchQuery,[job_name,product_name])
//         if(selectResult.length>0)
//         {
            
//             res.status(409).send({ msg: `These job name already exist.` });

//         }       
//         else
//         {
//             const insertQuery = "INSERT INTO productyyyy (product_name, station_id, job_name,machine_id) VALUES (?, ?, ?,?)";
//             const [insertResult] = await db.promise().query(insertQuery, [product_name, station_id, job_name,machine_id]);
            
//             res.status(201).send({ msg: "Record inserted successfully"});
//         }
//     } catch (err) {
//         console.error("Database error:", err);
//         res.status(500).send({ msg: `Internal server error: ${err}` });
//     }

// }
async function insertInProductyyyy(req,res){
    const {product_name, station_id, job_names, machine_id} = req.body;
    console.log("insert:");
    console.log(job_names);
    console.log({product_name, station_id, job_names,machine_id});

    
    try {
        const insertResults = [];
        for (const job_name of job_names) {
            const searchQuery = "SELECT job_name FROM productyyyy WHERE job_name = ? AND product_name = ?";
            const [selectResult] = await db.promise().query(searchQuery, [job_name, product_name]);
            if (selectResult.length > 0) {
                res.status(409).send({ msg: `Job name '${job_name}' already exists for product '${product_name}'` });
                return; // Exit the function if any job name already exists
            }

            const insertQuery = "INSERT INTO productyyyy (product_name, station_id, job_name, machine_id) VALUES (?, ?, ?, ?)";
            const [insertResult] = await db.promise().query(insertQuery, [product_name, station_id, job_name, machine_id]);
            insertResults.push(insertResult);
            console.log("in the loop");
            
            // res.status(201).send({ msg: "Record inserted successfully"});
        }
        console.log("Insert in productyyyy");

        console.log(insertResults);
        res.status(201).send({ msg: "Record inserted successfully"});

        // const searchQuery = "SELECT job_name FROM productyyyy WHERE job_name=?"
        // const [selectResult] = await db.promise().query(searchQuery,[job_name,product_name])
        // if(selectResult.length>0)
        // {
            
        //     res.status(409).send({ msg: `These job name already exist.` });

        // }       
        // else
        // {
        //     const insertQuery = "INSERT INTO productyyyy (product_name, station_id, job_name,machine_id) VALUES (?, ?, ?,?)";
        //     const [insertResult] = await db.promise().query(insertQuery, [product_name, station_id, job_name,machine_id]);
            
        //     res.status(201).send({ msg: "Record inserted successfully"});
        // }
    } catch (err) {
        console.error("Database error:", err);
        // res.status(500).send({ msg: `Internal server error: ${err}` });
    }

}


export {insertInProductyyyy};