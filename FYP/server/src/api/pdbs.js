//author luke
// last update : 9/12/22
 
const express = require('express')
const monk = require("monk");
const db = monk(process.env.MONGO_URI);
const Joi = require('@hapi/joi');
const pdbs = db.get('pdbs');
const fs = require("fs");
const { exec } = require("child_process");
const matlab = require("node-matlab");
const { json } = require('express');



//schmea example '1adg','LADH_loopmovement.pdb','A',290,301,[291 , -90; 292 , -110; 293 , -64; 294 , -90],[291 122; 292 -35; 293 147],[295 296],[295 296] ,10000
const schema = Joi.object({
    pdb_id: Joi.string().trim().required(),
    fname: Joi.string().trim(),
    chain: Joi.string().trim().required(),
    segbeg: Joi.number().integer().required(),
    segend: Joi.number().integer().required(),
    chain: Joi.string().trim().required(),
    target_residues_phi: Joi.array().items(Joi.array().items(Joi.number().integer())).required(),
    target_residues_psi: Joi.array().items(Joi.array().items(Joi.number().integer())).required(),
    constr_residues_phi: Joi.array().items(Joi.array().items(Joi.number().integer())).required(),
    constr_residues_psi: Joi.array().items(Joi.array().items(Joi.number().integer())).required(),
    itterations: Joi.number().integer()
});


const router = express.Router();

//read all
router.get('/', async (req, res, next) => {
try {
    const records = await pdbs.find({});
    res.json(records);
} catch (error) {
    next(error);
}

});

//read one
router.get('/:id',  (req, res, next) => {
    res.json({
        msg: 'Hello read one'
    });
});

//post one
router.post('/', async (req, res, next) => {
    try {
        console.log("called submit endpoint")

        std_name=genStandardFileName(req.body)
 
        const value = await schema.validateAsync(req.body);
        console.log(std_name)
       
//'1adg','LADH_loopmovement.pdb','A',290,301,[291 -90 ; 292 -110; 293 -64; 294 -90],[291 122; 292 -35; 293 147],[295 296],[294 295],10000
       // runMatlabScript("./../../../TAT_Matlabcode/wrapper_loop_modeller2.m", req.body.pdb_id, req.body.fname , req.body.chain, req.body.segbeg, req.body.segend, `[${req.body.target_residues_phi}]`, `[${req.body.target_residues_psi}]`, `[${req.body.constr_residues_phi}]`, `${[req.body.constr_residues_psi]}`, req.body.itterations) 
       const query = {}; 
       query["fname"] = std_name;
       const result = await pdbs.findOne({fname: std_name}).then((doc) => {console.log(doc)});

        if(result !== null){
            console.log(result)
            
            //run job, return error
            res.json({"redirect_str" : std_name})
            //const inserted = await pdbs.insert(value);
            console.log("in DB")
        }else{
            console.log(result)
            //refer to page
           // window.location.replace("http://www.w3schools.com");
            const inserted = await pdbs.insert(value);
            res.json(inserted);
            console.log("not in DB")

        }
        
       
        //res.json(inserted);
    } catch (error) {
        console.log(error)
        next(error);
    }
});


async function runMatlabScript(scriptPath, ...args) {
    
   
    //const session = new matlab.Session();
  
    // Create a string representation of the arguments
    const argString = args.map(arg => `'${arg}'`).join(', ');
    console.log(scriptPath+ " "+argString)
    // Execute the MATLAB script with the arguments
    //const result = await session.run(`run('${scriptPath}', ${argString})`);
    matlab
    .run(scriptPath + " " + argString)
    .then((result) => console.log(result))
    .catch((error) => console.log(error));
  
    
  
    return "result";
  }

  function genStandardFileName(json_obj){
    res="PDBID_"
    res=res+json_obj.pdb_id.toUpperCase()
    res=res+`_CHAIN_${json_obj.chain}`
    res=res+"_BEG_"
    res=res+json_obj.segbeg
    res=res+"_END_"
    res=res+json_obj.segend
    res=res+"_PHITARGS_"
    console.log(json_obj.target_residues_phi.length)
    console.log(json_obj.target_residues_phi[1].length)
    for(let i=0;i<json_obj.target_residues_phi.lengthl;i++){
        res=res+`_${json_obj.target_residues_phi[i][0]}_${json_obj.target_residues_phi[i][1]}`
        console.log(`_${json_obj.target_residues_phi[i][0]}_${json_obj.target_residues_phi[i][1]}`)
    }
    
    //res=res+String(json_obj.target_residues_phi).replace(",", "_");
    res=res+"_PSITARGS_"
    for(let i=0;i<json_obj.target_residues_psi.lengthl;i++){
        res=res+`_${json_obj.target_residues_psi[i][0]}_${json_obj.target_residues_psi[i][1]}`
    }
    console.log(json_obj.target_residues_psi[0][0])
   //res=res+String(json_obj.target_residues_psi).replace(",", "_");
    res=res+"_PHICONSTR_"
    for(let i=0;i<json_obj.constr_residues_phi.lengthl;i++){
       res=res+`_${json_obj.constr_residues_phi[i][0]}_${json_obj.constr_residues_phi[i][1]}`
    }
   //res=res+String(json_obj.constr_residues_phi).replace(",", "_");
    res=res+"_PSICONSTR_"
    for(let i=0;i<json_obj.constr_residues_psi.lengthl;i++){
        res=res+`_${json_obj.constr_residues_psi[i][0]}_${json_obj.constr_residues_psi[i][1]}`
    }
   // res=res+String(json_obj.constr_residues_psi).replace(",", "_");
    res=res+`_ITTR_${json_obj.itterations}`
    return res
  }

module.exports = router;