//author luke
// last update : 9/12/22
 
const express = require('express')
const monk = require("monk");
const db = monk(process.env.MONGO_URI);
const Joi = require('@hapi/joi');
const pdbs = db.get('pdbs');
const fs = require("fs");
const { exec , spawn} = require("child_process");


const matlab = require("node-matlab");
const { json } = require('express');
const { resolve } = require('path');
const path = require('path');
let useBash=false

db.then(() => {
  console.log('Connected correctly to server')
}, () => {
  console.log('no server')
})

async function checkRecordExists(propertyName, propertyValue) {
  const query = { [propertyName]: propertyValue };
  const result = await pdbs.findOne(query);
  return result !== null;
}


//schmea example '1adg','LADH_loopmovement.pdb','A',290,301,[291 , -90; 292 , -110; 293 , -64; 294 , -90],[291 122; 292 -35; 293 147],[295 296],[295 296] ,10000
const schema = Joi.object({
    pdb_id: Joi.string().trim().required(),
    fname: Joi.string().trim(),
    chain: Joi.string().trim().required(),
    segbeg: Joi.number().integer().required(),
    segend: Joi.number().integer().required(),
    chain: Joi.string().trim().required(),
    target_residues_phi: Joi.array().items(Joi.array().items(Joi.number().integer())),
    target_residues_psi: Joi.array().items(Joi.array().items(Joi.number().integer())),
    constr_residues_phi: Joi.array().items(Joi.number().integer()),
    constr_residues_psi: Joi.array().items(Joi.number().integer()),
    itterations: Joi.number().integer()
});


const router = express.Router();

//read all
/*
router.get('/', async (req, res, next) => {
try {
    const records = await pdbs.find({});
    res.json(records);
} catch (error) {
    next(error);
}

});
*/
router.get('/', async (req, res) => {
  const pdbid = req.query.pdbid;
  try {
    const result = await pdbs.find({ pdb_id: pdbid });
    if (result) {
      res.json(result);
    } else {
      res.json({ message: 'No document found with the given pdb_id' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//post one
//RETURNS FILE PATH IF FILE EXSISTS OR FALSE IF NOT 
router.post('/:id',  (req, res, next) => {
  console.log("post one "+ req.params.id );
  ret_str=process.env.HOST+"/public/OutputPDBS/"+req.body.fname
  console.log(ret_str);
  const filePath = path.join(process.env.PDB_OUT_DIR,  req.body.fname);
  console.log("fpath " + filePath);
  try {
    if (fs.existsSync(filePath)) {
      //if the file exsists send the link to it
      res.send(ret_str);
    } else {
      res.send(false);
    }
  } catch (err) {
    //console.error(err);
  }
});

//post one
//returns file path if file data in db fase otherwise
router.post('/', async (req, res, next) => {
  result=await checkRecordExists("fname", req.body.fname)
  if(result == false){
    //not in DB
    //make the file
    console.log("not in DB")

    //move the file
    //insert record of file to db
    var shouldInsert = await runMatlabScript1(process.env.SCRIPT_DIR,genCommand(req.body), genStandardFileName(req.body), process.env.PDB_OUT_DIR)
    console.log("made file now insert to db")
    if(shouldInsert){
      var insertd = await insert2db(req.body)
      res.json({"redirectUrl" : process.env.HOST+"/public/OutputPDBS/"+req.body.fname})
    }else{
      res.json({"redirectUrl" : false})
    }

  }else{
    //in DB
    console.log("in db")
    res.json({"redirectUrl" : process.env.HOST+"/public/OutputPDBS/"+req.body.fname})
  }
  
  console.log("res")
  console.log(result)
  //res.json({"res" : result})
});

async function insert2db(obj){
  try {
    console.log("called submit endpoint")

    std_name=genStandardFileName(obj)

    const value = await schema.validateAsync(obj);
    console.log("value " +value)
   
//'1adg','LADH_loopmovement.pdb','A',290,301,[291 -90 ; 292 -110; 293 -64; 294 -90],[291 122; 292 -35; 293 147],[295 296],[294 295],10000
   // runMatlabScript("./../../../TAT_Matlabcode/wrapper_loop_modeller2.m", req.body.pdb_id, req.body.fname , req.body.chain, req.body.segbeg, req.body.segend, `[${req.body.target_residues_phi}]`, `[${req.body.target_residues_psi}]`, `[${req.body.constr_residues_phi}]`, `${[req.body.constr_residues_psi]}`, req.body.itterations) 
   //const query = {}; 
   //query["fname"] = std_name;
   result =  await pdbs.findOne({fname: std_name}).then((doc) => {console.log(doc)});
   console.log("result "+result)
    if(result !==  undefined ){
      console.log("in DB")
      //console.log(result)
        
        //run job, return error
        res.json({"redirect_str" : std_name})
        //const inserted = await pdbs.insert(value);
        
    }else{
      console.log("not in DB")
      //  console.log(result)
        //refer to page
       // window.location.replace("http://www.w3schools.com");
        //cmd_str = `${std_name} `

        
      //  runScript(obj).then((em)=>{
      //    console.log("resolved promise  "+ em )
      //}, (er)=>{
      //    console.log("resolved promise error " + er)
      //});

        ok = await runMatlabScript1(process.env.SCRIPT_DIR,genCommand(obj), genStandardFileName(obj), process.env.PDB_OUT_DIR)
        console.log("file made ok " + ok)
        if(ok != false){
        const inserted = await pdbs.insert(value);
        }else{
          console.log("failed with input " + std_name )
        }
        
    }
    //res.json(inserted);
} catch (error) {
    console.log(error)
}
}


  async function runMatlabScript1(dir1, scriptName, fname1, dir2) {
    const matlabCommand = `matlab -batch ${scriptName}`;
    console.log(matlabCommand)
    const moveCommand = `move ${dir1 + fname1} ${dir2}`;
    console.log(moveCommand)
    console.log("full command")
    console.log(`cd ${dir1} && ${matlabCommand} && ${moveCommand}`)
    proc = exec(`cd ${dir1} && ${matlabCommand} && ${moveCommand}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return false
      }else{
        return true
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
    proc.on('exit', () => {
      console.log("matlab finshed")
      console.log("now can insert to db")
    });
  }

  function genStandardFileName(json_obj){
    //console.log(json_obj)
    console.log("gen fnmae")
    console.log(json_obj)
    console.log(json_obj.constr_residues_phi)
    res="PDBID_"
    res=res+(json_obj.pdb_id).toUpperCase()
    res=res+`_CHAIN_${json_obj.chain}`
    res=res+"_BEG_"
    res=res+json_obj.segbeg
    res=res+"_END_"
    res=res+json_obj.segend
    res=res+"_PHITARGS"
    //console.log(json_obj.target_residues_phi.length)
    //console.log(json_obj.target_residues_phi[1].length)
    for(var i=0;i<json_obj.target_residues_phi.length;i++){
        res=res+"_"+json_obj.target_residues_phi[i][0]+"_"+json_obj.target_residues_phi[i][1]
        //console.log(`_${json_obj.target_residues_phi[i][0]}_${json_obj.target_residues_phi[i][1]}`)
    }
    
    //res=res+String(json_obj.target_residues_phi).replace(",", "_");
    res=res+"_PSITARGS"
    //console.log(json_obj.target_residues_psi.length)
    for(var i=0;i<json_obj.target_residues_psi.length;i++){
        //console.log( "value "+json_obj.target_residues_psi[i][0])
        res=res+"_"+json_obj.target_residues_psi[i][0]+"_"+json_obj.target_residues_psi[i][1]
        //console.log(`_${json_obj.target_residues_psi[i][0]}_${json_obj.target_residues_psi[i][1]}`)
    }
    //console.log(json_obj.target_residues_psi[0][0])
   //res=res+String(json_obj.target_residues_psi).replace(",", "_");
    res=res+"_PHICONSTR"
    for(var i=0;i<json_obj.constr_residues_phi.length;i++){
       res=res+"_"+json_obj.constr_residues_phi[i]
    }
    
   //res=res+String(json_obj.constr_residues_phi).replace(",", "_");
    res=res+"_PSICONSTR"
    for(var i=0;i<json_obj.constr_residues_psi.length;i++){
        res=res+"_"+json_obj.constr_residues_psi[i]
    }
   // res=res+String(json_obj.constr_residues_psi).replace(",", "_");
    res=res+"_ITTR_"+json_obj.itterations
    //console.log(res)
    res=res+".pdb"
    return res
    }



  async function isMatlabInstalled() {
      let command;
      if (process.platform === 'win32') {
        command = 'where matlab';
      } else {
        command = 'which matlab';
      }      
      return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
          if (err == null){
            console.log("err is null")
            resolve(stdout);
          } else {
            resolve(false);
          }
        });
      });
    }



function listDirectoryContents(directoryPath, useBash = false) {
  return new Promise((resolve, reject) => {
    // Determine which shell to use
    const shell = useBash ? 'bash' : 'cmd.exe';
    const shellArgs = useBash ? ['-c'] : ['/c'];

    // Create a child process to run the command
    const childProcess = spawn(shell, [...shellArgs, `cd "${directoryPath}" && dir`]);

    let output = '';

    // Capture the output of the command
    childProcess.stdout.on('data', data => {
      output += data.toString();
    });

    // Handle any errors
    childProcess.on('error', error => {
      reject(error);
    });

    // When the command has completed, resolve the promise with the output
    childProcess.on('exit', (code, signal) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Command exited with code ${code} and signal ${signal}`));
      }
    });
  });
}


 //it can be async but await makes it sequential
async function init(){
    res= await isMatlabInstalled()
    console.log("Matlab installed: "+res)
    useBash = process.env.BASH
    console.log("Use Bash: "+useBash)
    /*
    res1=listDirectoryContents("/home/luke/Documents/", useBash)
    
    a=res1.then((em)=>{
        console.log("resolved promise  "+ em )
    }, (er)=>{
        console.log("resolved promise error " + er)
    });
    console.log("a ",a)
    
    exec('cd '+process.env.SCRIPT_DIR+ ' && ls -la', (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        console.log(err)
        return;
      }
    
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
    */
}
function Arr2dtoMLstr(arr){
  console.log("Arr2dtoMLstr "+arr)
  str='['
  for(let i =0; i<arr.length;i++){
    str=str+ArrtoMLstr(arr[i])
    if(i==arr.length-1){

    }else{
      str=str+";"
    }
  }
  str = str+"]"
  console.log("Arr2dmlst " + str)
  return str
}
function ArrtoMLstr(arr){
  console.log("ArrtoMLstr "+ arr)
  str="["
  for(let i=0;i<arr.length;i++){
    str=str+ " " +arr[i]
  }
  str=str+"]"
  return str
}
async function runScript(obj){
  if(obj == null){
    console.log('runScript obj nul')
  }
  console.log("runscript got "+obj.fname)
  cmd_str=`cd ${process.env.SCRIPT_DIR} && matlab -nodisplay -nojvm -r  "wrapper_loop_modeller2('${obj.pdb_id}','${genStandardFileName(obj)}.pdb','${obj.chain}',${obj.segbeg},${obj.segend},${Arr2dtoMLstr(obj.target_residues_phi)},${Arr2dtoMLstr(obj.target_residues_psi)},${ArrtoMLstr(obj.constr_residues_phi)},${ArrtoMLstr(obj.constr_residues_psi)},${obj.itterations});exit; && cp '${genStandardFileName(obj)}.pdb' ./../OuputPdbs"`
  console.log(cmd_str)
  exec(cmd_str, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.log(err)
      return;
    }
  
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}
function genCommand(obj){
  cmd_str=`"wrapper_loop_modeller2('${obj.pdb_id}','${genStandardFileName(obj)}','${obj.chain}',${obj.segbeg},${obj.segend},${Arr2dtoMLstr(obj.target_residues_phi)},${Arr2dtoMLstr(obj.target_residues_psi)},${ArrtoMLstr(obj.constr_residues_phi)},${ArrtoMLstr(obj.constr_residues_psi)},${obj.itterations});exit;"`
  console.log(cmd_str)
  return cmd_str
}

init()
module.exports = router;