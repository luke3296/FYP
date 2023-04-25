//author luke
// last update : 9/12/22
 
const express = require('express')
const monk = require("monk");
const db = monk(process.env.MONGO_URI);
const Joi = require('@hapi/joi');
const pdbs = db.get('pdbs');
const fs = require("fs");
const { exec , spawn} = require("child_process");
const https = require('https');


const matlab = require("node-matlab");
const { json } = require('express');
const { resolve } = require('path');
const path = require('path');
const { ifError } = require('assert');
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
    pdb_id: Joi.string().trim().required().strict().error(new Error('PDB ID is required')),
    fname: Joi.string().strict().trim(),
    //chain : Joi.string().regex(/^[a-zA-Z]$/).required(),
    chain: Joi.string().trim().required().error(new Error('Chain is required')),
    segbeg: Joi.number().integer().required().strict().error(new Error('Segbeg is required')),
    segend: Joi.number().integer().required().strict().error(new Error('Segend is required')),
    target_residues_phi: Joi.array().items(Joi.array().items(Joi.number().integer()).strict().error(new Error('needs to be int list'))),
    target_residues_psi: Joi.array().items(Joi.array().items(Joi.number().integer())).strict().error(new Error('Segbeg is required needs to be int list')),
    constr_residues_phi: Joi.array().items(Joi.number().integer()).strict().error(new Error(' needs to be int list')),
    constr_residues_psi: Joi.array().items(Joi.number().integer()).strict().error(new Error(' needs to be int list')),
    itterations: Joi.number().integer()
});


const router = express.Router();


router.get('/', async (req, res) => {
  const pdbid = req.query.pdbid;
  var seg_beg = req.query.segbeg;
  var seg_end = req.query.segend;
  if(seg_beg==undefined && seg_end==undefined){
    console.log("seg beg is undefined")
  
  try {
    var result = await pdbs.find({ pdb_id: pdbid });
    if (result) {
      res.json(result);
    } else {
      res.json({ message: 'No document found with the given pdb_id' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}else if(seg_beg != undefined && seg_end==undefined){
  try {
    var result = await pdbs.find({ pdb_id: pdbid , segbeg : parseInt(seg_beg)});
    if (result) {
      res.json(result);
    } else {
      res.json({ message: 'No document found with the given pdb_id segdeg' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}else if(seg_beg == undefined && seg_end!=undefined){
  try {
    const result = await pdbs.find({ pdb_id: pdbid, segend: parseInt(seg_end) });
    if (result) {
      res.json(result);
    } else {
      res.json({ message: 'No document found with the given pdb_id an segend' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}else{
  try {
    const result = await pdbs.find({ pdb_id: pdbid, segbeg: parseInt(seg_beg), segend: parseInt(seg_end) });
    if (result) {
      res.json(result);
    } else {
      res.json({ message: 'No document found with the given pdb_id and loop indexs' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
});

//post one
//RETURNS FILE PATH IF FILE EXSISTS OR FALSE IF NOT 
router.post('/:id', async  (req, res, next) => {
  console.log("post one "+ req.params.id );

  if(req.params.id==1){
  ret_str=process.env.HOST+"/public/OutputPDBS/"+sanitizeInput( req.body.fname)
  console.log(ret_str);
  const filePath = path.join(process.env.PDB_OUT_DIR,  sanitizeInput( req.body.fname));
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
}else if(req.params.id==2){
  const{ error } = schema.validate(req.body);
  if (error) return res.status(400).send("object invalid");

  obj=sanitizeInputObj(req.body)

  try{
    var check = await runMatlabScript2(process.env.SCRIPT_DIR,genCommand1(obj), genStandardFileName(obj), process.env.PDB_OUT_DIR)
    res.send(check)
    }catch(error){
      console.log(error)
    }
    res.status(400).send("err")
}
});

//post one
//returns file path if file data in db fase otherwise
router.post('/', async (req, res, next) => {
  //check schema
  const{ error } = schema.validate(req.body);
  if (error) return res.status(400).send("object invalid");

  //remove shell chars
  obj=sanitizeInputObj(req.body)
  std_name=genStandardFileName(obj)
  obj.fname=std_name
  //check if is exsists allready
  result=await checkRecordExists("fname", obj.fname)
  console.log( "result " +  result )

  if(result == false){
    //not in DB
    //make the file
    console.log("not in DB")

    //move the file
    //insert record of file to db
    try{
    var shouldInsert = await runMatlabScript1(process.env.SCRIPT_DIR,genCommand(obj), genStandardFileName(obj), process.env.PDB_OUT_DIR)
    }catch(error){
      console.log(error)
    }
    console.log(" should insert" +shouldInsert)
    if(shouldInsert){
      //generate the alt file
      var url = `https://files.rcsb.org/download/${obj.pdb_id}.pdb`;
      https.get(url, (res) => {
        if (res.statusCode === 200) {
          const filePath = `./src/api/tmp/${obj.pdb_id}.pdb`;
          const filePath1 = './src/public/OutputPDBS/'
          const fileStream = fs.createWriteStream(filePath);
    
          res.pipe(fileStream);
    
          fileStream.on('finish', () => {
            console.log(`Downloaded pdb `);
            var alt_name=obj.fname.replace('.pdb', '_ALT')+'.pdb'
            processFile(filePath,filePath1+obj.fname,filePath1+alt_name )
          });
        } else {
          console.error(`Failed to download : ${res.statusCode}`);
        }
      }).on('error', (err) => {
        console.error(`Failed to download : ${err}`);
      });
      //end of alternate
      var insertd = await insert2db(obj)
      res.json({"redirectUrl" : process.env.HOST+"/public/OutputPDBS/"+obj.fname})
    }else{
      res.json({"redirectUrl" : false})
    }

  }else{
    //in DB
    console.log("in db")
    res.json({"redirectUrl" : process.env.HOST+"/public/OutputPDBS/"+obj.fname})
  }
  
  console.log("res")
  console.log(result)
  //res.json({"res" : result})
});

async function insert2db(obj){

    std_name=genStandardFileName(obj)
    obj.fname=std_name


   // inserted = await pdbs.insert(obj);
    
  // result =  await pdbs.findOne({fname: std_name}).then((doc) => {if (doc) {resolve("exsists")}else{reject()}});
   pdbs.findOne({fname: std_name})
  .then(async (doc) => {
    if (doc) {
      result = "exists";
    } else {
      inserted = await pdbs.insert(obj);
      result = "does not exist inserting it";
    }
  })
  .catch((error) => {
    console.log(error);
    // handle error here
  });
/*
   console.log("result "+result)
    if(result !==  undefined ){
      console.log("in DB")
      //console.log(result)
        
        //run job, return error
        res.json({"redirect_str" : std_name})
        //const inserted = await pdbs.insert(value);
        
    }else{
      console.log("not in DB")

        var ok = false

        console.log("file made ok " + ok)
        if(ok != false){
        inserted = await pdbs.insert(obj);
        }else{
          console.log("failed with input " + std_name )
        }
     
    }
   */    
    //res.json(inserted);

}
//old
/*
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
      }
    })
      //if (error) {
      //  console.error(`exec error: ${error}`);
      //  return false
      //}else{
      //  return true
     // }
     // console.log(`stdout: ${stdout}`);
     // console.error(`stderr: ${stderr}`);
    //}); 
    proc.on('exit', (error, stdout, stderr) => {
      if(error){
        reject(false)
      }else{
        resolve(true)
      }
    });
  }
*/

function checkExecOutput(command, searchString) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.includes(searchString) ? stdout : true);
      }
    });
  });
}

function runMatlabScript1(dir1, scriptName, fname1, dir2) {
  return new Promise((resolve, reject) => {
    const matlabCommand = `matlab -batch ${scriptName}`;
    const moveCommand = `move ${dir1 + fname1} ${dir2}`;
    console.log(`COMMAND: cd ${dir1} && ${matlabCommand} && ${moveCommand}`);
    try{
    const proc = exec(`cd ${dir1} && ${matlabCommand} && ${moveCommand}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
      } else {
        resolve(true);
      }
    });
    }catch(error){console.log(error)}
  });
}

function runMatlabScript2(dir1, scriptName, fname1, dir2) {
  return new Promise((resolve, reject) => {
    const matlabCommand = `matlab -batch ${scriptName}`;
    const moveCommand = `move ${dir1 + fname1} ${dir2}`;
    console.log(`COMMAND: cd ${dir1} && ${matlabCommand}`);
    try{
    const proc = exec(`cd ${dir1} && ${matlabCommand}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
      } else {
        resolve(stdout);
      }
    });
    }catch(error){console.log(error)}
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
   
    for(var i=0;i<json_obj.target_residues_phi.length;i++){
        res=res+"_"+json_obj.target_residues_phi[i][0]+"_"+json_obj.target_residues_phi[i][1]
    }
    
    res=res+"_PSITARGS"
    for(var i=0;i<json_obj.target_residues_psi.length;i++){
        res=res+"_"+json_obj.target_residues_psi[i][0]+"_"+json_obj.target_residues_psi[i][1]
    }

    res=res+"_PHICONSTR"
    for(var i=0;i<json_obj.constr_residues_phi.length;i++){
       res=res+"_"+json_obj.constr_residues_phi[i]
    }
    
    res=res+"_PSICONSTR"
    for(var i=0;i<json_obj.constr_residues_psi.length;i++){
        res=res+"_"+json_obj.constr_residues_psi[i]
    }

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


function genCommand(obj){
  cmd_str=`"wrapper_loop_modeller2('${obj.pdb_id}','${genStandardFileName(obj)}','${obj.chain}',${obj.segbeg},${obj.segend},${Arr2dtoMLstr(obj.target_residues_phi)},${Arr2dtoMLstr(obj.target_residues_psi)},${ArrtoMLstr(obj.constr_residues_phi)},${ArrtoMLstr(obj.constr_residues_psi)},${obj.itterations});exit;"`
  console.log(cmd_str)
  return cmd_str
}


function genCommand1(obj){
  cmd_str=`"wrapper_loop_modeller2_validator('${obj.pdb_id}','${genStandardFileName(obj)}','${obj.chain}',${obj.segbeg},${obj.segend},${Arr2dtoMLstr(obj.target_residues_phi)},${Arr2dtoMLstr(obj.target_residues_psi)},${ArrtoMLstr(obj.constr_residues_phi)},${ArrtoMLstr(obj.constr_residues_psi)},${obj.itterations});exit;"`
  console.log(cmd_str)
  return cmd_str
}

function sanitizeInput(user_str){
  specialChars=['&', '|', '(', ')', '<', '>', '^', '%', '!', '@', ',', ';', '=', '+', '[', ']', '{', '}', '`', '~', '\'', '"'];
  res_str=user_str
  for(var i =0; i<specialChars.length; i++){
    res_str=res_str.replace(specialChars[i], '')
  }
  return res_str
}

function sanitizeInputObj(user_obj){
  if("fname" in user_obj){
    new_fname=sanitizeInput(user_obj.fname)
  }
  if( "chain" in user_obj){
    new_chain=sanitizeInput(user_obj.chain)
  }
  if("pdb_id" in user_obj){
    new_pdbid=sanitizeInput(user_obj.pdb_id)

  }
  obj = {
    pdb_id : new_pdbid,
    fname : new_fname,
    chain : new_chain,
    segbeg: user_obj.segbeg,
    segend: user_obj.segend,
    target_residues_phi:user_obj.target_residues_phi,
    target_residues_psi: user_obj.target_residues_psi,
    constr_residues_phi:user_obj.constr_residues_phi,
    constr_residues_psi: user_obj.constr_residues_psi,
    itterations: user_obj.itterations
  }

  return obj
}


// Read the contents of the two PDB files
//const file1Content = fs.readFileSync('file1.pdb', 'utf-8');
//const file2Content = fs.readFileSync('file2.pdb', 'utf-8');
function processFile(pdbfile, loopfile, outfile){
const readline = require('readline');
const fileContent = fs.readFileSync(loopfile, 'utf-8');
const fileContent1 = fs.readFileSync(pdbfile, 'utf-8');


const regexModelStart = /MODEL\s+1/;
const regexModelEnd = /ENDMDL/;

let startAtomLine;
let endAtomLine;

const lines = fileContent.split('\n');

for (let i = 0; i < lines.length; i++) {
    if( lines[i].match(regexModelStart)){
        startAtomLine=lines[i+1]
    }
    if( lines[i].match(regexModelEnd)){
        endAtomLine=lines[i-1]
    }

}

console.log('Start atom line:', startAtomLine);
console.log('End atom line:', endAtomLine);
var atom_re = /ATOM\s+\d+/
// When the entire file has been read, log a message to the console

var atom1=startAtomLine.match(atom_re)
var atom2=endAtomLine.match(atom_re)

start=parseInt(atom1[0].replace('ATOM', '').trim())
end=parseInt(atom2[0].replace('ATOM', '').trim())
console.log(start)
console.log(end)
const lines1 = fileContent1.split('\n');

var pdb_data=[]
for( var i =0; i<lines1.length;i++ ){
    
    //console.log(lines1[i])

    if (atom_re.test(lines1[i])){
        pdb_data.push(lines1[i])
        //console.log(lines1[i])
    }
}

//prepare the model datastructure
models=[]
atom_lines=[]
const regexModel = /MODEL/;
modelIdx=0
for( var i =0; i<lines.length;i++ )
{
    if (regexModel.test(lines[i])){
        models.push(atom_lines)
        atom_lines=[]
        modelIdx++
    }

    if (atom_re.test(lines[i])){
        atom_lines.push(lines[i])
        //console.log(lines1[i])
    }
}
//console.log(models.length)
//console.log(atom_lines.length)
//console.log(pdb_data.length)

start_data=pdb_data.slice(0, start-1)
end_data=pdb_data.slice(end)

final_file=[]
model_count=0
for(var i =0;i<models.length;i++){
    final_file.push('MODEL ' + i)
    final_file =final_file.concat(start_data)
    final_file =final_file.concat(models[i])
    final_file =final_file.concat(end_data)
    final_file.push("ENDMDL")

}
/*
for( var i =0; i<lines.length;i++ )
{
    if (regexModel.test(lines[i])){
         final_file.push("MODEL " + model_count)
        for( var i =0; i<pdb_data.length;i++ ){
            atom_num=parseInt((pdb_data[i].match(atom_re))[0].replace('ATOM', '').trim())
            if(atom_num==start){
                final_file+models[model_count]
                
            }else if(atom_num==end){

            }else{
                final_file.push(pdb_data[i])
            }
            //console.log(atom_num)
            //final_file.push()
        }
        final_file.push("ENDMDL")
        model_count++
    }
}
console.log(final_file)
*/
fs.writeFile(outfile, final_file.join('\n'), (err) => {
    if (err) throw err;
    console.log('File written successfully');
  });
}
init()
module.exports = router;