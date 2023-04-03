server_name="http://localhost:5123/"

let target_residues_phi_stack =  [];
let target_residues_psi_stack = [];
let constr_residues_phi_stack = [];
let constr_residues_psi_stack = [];

function do_something(){
    console.log("click");
    jmolApplet(400,'load=1crn AS "myfile.pdb"', "1");
    document.getElementById("applet1").innerHTML = jmolApplet1._code; 

}
function load_pdb(){
    var pdb_id = document.getElementById("pdb_txt_input").value;
    if (pdb_id != null){
       // var pdbdata =load("="+pdb_id);
        jmolApplet1._loadFile("="+pdb_id);
        //document.getElementById("applet1").innerHTML =  jmolApplet(400,pdbdata, "1")._code;
        //jmolApplet1._code; 
    }
}

function add_target_phi(){
  console.log("call")
  let phi_idx = Number.parseInt( document.getElementById("target_residues_phi_idx").value);
  let phi_val = Number.parseFloat(  document.getElementById("target_residues_phi_value").value);
  let p_tag_text =document.getElementById("target_phi_string").innerHTML;
  phi_idx_is_num =  phi_idx.toString() != "NaN"//(typeof phi_idx === 'number' || phi_idx instanceof Number) && phi_idx != NaN
  phi_val_is_num  = phi_val.toString() != "NaN" //(typeof phi_val === 'number' || phi_val instanceof Number) && phi_val != NaN
  
  if(! phi_idx_is_num){
    showError("phi_idx not valid")
    if(!phi_val_is_num ){
      console.log(phi_idx_is_num + " " +phi_val_is_num )
      console.log(typeof(phi_val))
      showError("phi_val not valid")
    }
  }
  if(phi_idx_is_num && phi_val_is_num ){
 // p_tag_text = p_tag_text + " " + phi_idx + " " + phi_val + "\n"
  //document.getElementById("target_phi_string").innerHTML = p_tag_text;
  target_residues_phi_stack.push([phi_idx, phi_val]);
  printStacks();
  }
}
function remove_target_phi(){
  target_residues_phi_stack.pop();
  printStacks();
}
function add_target_psi(){
  let psi_idx = Number.parseInt(document.getElementById("target_residues_psi_idx").value);
  let psi_val = Number.parseFloat( document.getElementById("target_residues_psi_value").value);
  let p_tag_text =document.getElementById("target_psi_string").innerHTML;
  psi_idx_is_num = psi_idx.toString() != "NaN" // (typeof psi_idx === 'number' || psi_idx instanceof Number) && psi_idx != NaN
  psi_val_is_num  =psi_val.toString() != "NaN" // (typeof psi_val === 'number' || psi_val instanceof Number) && psi_val != NaN

  if(! psi_idx_is_num){
    showError("psi_idx not valid")
    if(! psi_val_is_num ){
      showError("psi_val not valid")
    }
  }
  if(psi_idx_is_num && psi_val_is_num ){
 // p_tag_text = p_tag_text + " " + psi_idx + " " + psi_val + "\n"
 // document.getElementById("target_psi_string").innerHTML = p_tag_text;
  target_residues_psi_stack.push([psi_idx,psi_val]);
  printStacks();
  }
}
function remove_target_psi(){
  target_residues_psi_stack.pop();
  printStacks();
}
function add_constr_phi(){
  let phi_idx = Number.parseInt(document.getElementById("constr_residues_phi").value);
  let p_tag_text =document.getElementById("constr_residues_phi_string").innerHTML;
  phi_idx_is_num = phi_idx.toString() != "NaN" //(typeof phi_idx === 'int' || phi_idx instanceof Number) && phi_idx != NaN
  if(! phi_idx_is_num){
    showError("phi_constr not valid")
  }
  if(phi_idx_is_num){
//  p_tag_text = p_tag_text + " " + phi_idx+ "\n"
//  document.getElementById("constr_residues_phi_string").innerHTML = p_tag_text;
  constr_residues_phi_stack.push(phi_idx);
  printStacks();
  }
}
function remove_constr_phi(){
  constr_residues_phi_stack.pop();
  printStacks();
}
function add_constr_psi(){
  let psi_idx =  Number.parseInt( document.getElementById("constr_residues_psi").value);
  let p_tag_text =document.getElementById("constr_residues_psi_string").innerHTML;
  psi_idx_is_num = psi_idx.toString() != "NaN" //(typeof psi_idx === 'int' || psi_idx instanceof Number) && psi_idx != NaN
  if(! psi_idx_is_num){
    showError("psi_constr not valid")
  }
  if(psi_idx_is_num){
 // p_tag_text = p_tag_text + " " + psi_idx+ "\n"
 // document.getElementById("constr_residues_psi_string").innerHTML = p_tag_text
   constr_residues_psi_stack.push(psi_idx);
   printStacks();
  }
}
function remove_constr_psi(){
  constr_residues_psi_stack.pop();
  printStacks();
}
//edited from https://stackoverflow.com/questions/29775797/fetch-post-json-data
async function send(){
  const rawResponse = await fetch(server_name, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({a: 1, b: 'Textual content'})
  });
  const content = await rawResponse.json();

  console.log(content);
}
async function submit_to_server(){ 
    console.log("submit()")                    
    let pdb_id = document.getElementById("pdb_txt_input").value;
    let output_fname = document.getElementById("fname").value;
    let chain = document.getElementById("chain").value;
    let segbeg =Number.parseInt( document.getElementById("segbeg").value);
    let segend = Number.parseInt(document.getElementById("segend").value);
    let itterations = Number.parseInt( document.getElementById("itterations").value);
    let isValid = validateInput(pdb_id,output_fname,chain,segbeg,segend,itterations);
   
    if(isValid){
      console.log("send json");
      obj={
        "pdb_id" : pdb_id,
        "fname" : output_fname,
        "chain" : chain,
        "segbeg" : segbeg,
        "segend" : segend,
        "target_residues_phi" : target_residues_phi_stack ,
        "target_residues_psi" : target_residues_psi_stack ,
        "constr_residues_phi" : constr_residues_phi_stack ,
        "constr_residues_psi" : constr_residues_psi_stack,
        "itterations" : itterations
      }
      console.log("client side obj : " + obj)
      console.log(obj)
      fetch('http://localhost:5123/api/v1/pdbs/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
        }).then(res => res.json())
        .then(res => {
          console.log(res)
          //if(res.)
        });
      
    }

}

const url = 'localhost:8000/index.php'; //A local page

function load(url, callback) {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    console.log("state change to " + xhr.readyState === 4)
    if (xhr.readyState === 4) {
        console.log(" hfbewkrnflweiknrflwekfrlkwehnfew ");
      callback(xhr.response);
    }
  }

  xhr.open('GET', url, true);
  xhr.send('');
}

function callback(rs){
    console.log(rs);
    console.log(" nownownownownownownownownownownownownownownownownownownownownownownownownownownow ");
    alert("calledback");
}

async function listen_for_file(fname) {
    console.log('calling eith fname ' + fname);
    const result = await load_from_server(fname);
    while(result != 'resolved'){
        result = await load_from_server(fname);
    }
    console.log("Hello " + result);
    
    jmolApplet0._loadFile(server_name+fname)
    
    // expected output: "resolved"
  }
  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  
 // delay(1000).then(() => console.log('ran after 1 second1 passed'));

  async function load_from_server(fname) {
    return new Promise(resolve => {
    console.log("fetching " + server_name+fname)
    fetch(server_name+fname)
    .then(function(){
      console.log('200 OK');
      resolve('resolved');
    }).catch(function(){
        console.log('400 not OK');
        resolve('error');
        });
    });
  }


//matlab -nodisplay -nojvm -r  "Loop_Modeller2_wrapper('1adg','LADH_loopmovement.pdb','A',290,301,[291 -90 ; 292 -110; 293 -64; 294 -90],[291 122; 292 -35; 293 147],[295 296],[294 295],10000);exit;"
  function validateInput(pdb_id, fname, chain, segbeg, segend, itterations ){
    // is pdb_id a 4 character string
    pdbid_is_4char = (typeof pdb_id === 'string' || pdb_id instanceof String) && pdb_id.length == 4
    if (! pdbid_is_4char){
      showError("pdb_id is invalid")
    }
    //is fname a string 
    fname_is_string=(typeof fname === 'string' || fname instanceof String)
    if (! fname_is_string){
      showError("fname invalid")
    }
    //is chain a string / character (length = 1)
    chain_is_1char =(typeof chain === 'string' || chain instanceof String) && chain.length == 1
    if (! chain_is_1char){
      showError("chain invalid")
    }
    //is segbeg a number
    segbeg_is_num =(typeof segbeg === 'number' || segbeg instanceof Number)
    if (! segbeg_is_num){
      showError("segbeg invalid")
    }
    //is seg end a number
    segend_is_num =(typeof segend === 'number' || segend instanceof Number)
    if (! segbeg_is_num){
      showError("segend invalid")
    }
    //is segend > segbeg
    if( segend < segbeg ){
      showError("segend is > than segbeg which is not allowd")
    }
    itterations_is_num =(typeof itterations === 'number' || itterations instanceof Number) && itterations<100000
    if (! segbeg_is_num){
      showError("segbeg invalid")
    }
    //is phi_targ_arr a list of number pairs 
    //is phi_targ_arr a list of number pairs 

    //is phi_targ_arr a list of numbers 
    //is phi_targ_arr a list of numbers

    //is number of pairs in phi tar and phi targ < segend - segbeg
    let lengths_fit = ((target_residues_phi_stack.length < (segend - segbeg))  ||
    (target_residues_psi_stack.length < (segend - segbeg))  ||
    (constr_residues_phi_stack.length < (segend - segbeg))  ||
    (constr_residues_psi_stack.length < (segend - segbeg)))

    if(!lengths_fit){
      showError("length mismatch")
      }
    //is number of pairs in phi const and phi const < segend - segbeg

    //check no residues are being targeted and constrained 
    return pdbid_is_4char & fname_is_string & chain_is_1char & segbeg_is_num & segend_is_num & itterations_is_num & lengths_fit


  }
  function showError(msg){
        document.getElementById("err_txt").innerText  = msg;
        document.getElementById("error_info").style.visibility = "visible"
  }

function printStacks(){

    targ_phi_str = "";
    targ_psi_str = "";
    constr_phi_str = "";
    constr_psi_str = "";
    target_residues_phi_stack.forEach(element => {
    console.log(target_residues_phi_stack);
    console.log(element);
    targ_phi_str = targ_phi_str +" "+ element[0] +" "+ element[1] + ", "
  }); 
  target_residues_psi_stack.forEach(element => {
    targ_psi_str = targ_psi_str +" "+ element[0] +" "+ element[1] + ", "
  }); 
  constr_residues_phi_stack.forEach(element => {
    constr_phi_str = constr_phi_str +" "+ element + ", "

  }); 
  constr_residues_psi_stack.forEach(element => {
    constr_psi_str = constr_psi_str +" "+ element + ", "
  }); 
  document.getElementById("target_phi_string").innerHTML = targ_phi_str;
  document.getElementById("target_psi_string").innerHTML =targ_psi_str;
  document.getElementById("constr_residues_phi_string").innerHTML = constr_phi_str;
  document.getElementById("constr_residues_psi_string").innerHTML =constr_psi_str;
  }
  function generate(){
    console.log("generate called")
  }


  

  function setDefault(){
     document.getElementById("pdb_txt_input").value = "1ADG";
     document.getElementById("fname").value = "1ADG_A_201_310_PHITARGS_291_-90_292_-110_293_-64_294_-90_PSITARGS_291_122_292_-35_293_147_PHICONSTR_295_296_PSICONSTR_294_295_INTR_10000"
     document.getElementById("chain").value = "A";
     document.getElementById("segbeg").value = 290;
     document.getElementById("segend").value = 301;
     document.getElementById("itterations").value =10000;


    target_residues_phi_stack =  [];
    target_residues_psi_stack = [];
    constr_residues_phi_stack = [];
    constr_residues_psi_stack = [];

     target_residues_phi_stack.push([291, -90])
     target_residues_phi_stack.push([292, -110])
     target_residues_phi_stack.push([293, -64])
     target_residues_phi_stack.push([294, -90])

     target_residues_psi_stack.push([291,122])
     target_residues_psi_stack.push([292,-35])
     target_residues_psi_stack.push([293,147])

     constr_residues_phi_stack.push(([295, 296]))
     constr_residues_psi_stack.push(([295, 296]))
 

     printStacks()

  }
function jmol_isReady(){
console.log("jmol is redy")

beg=Number.parseInt(document.getElementById("segbeg").value)
end=Number.parseInt(document.getElementById("segend").value)

console.log(Jmol.getPropertyAsArray(jmolApplet0, "polymerInfo"))
var phis=[]
var psis=[]
var torsions=[]

console.log("beg "+ beg+ " end " + end)
if (!(beg >0)){
  beg=beg-1
}
for(i=beg;i<=end;i++){
  console.log("getting phi psi")
  phis.push(Jmol.getPropertyAsArray(jmolApplet0, "polymerInfo").models[0].polymers[0].monomers[i].phi)
  psis.push(Jmol.getPropertyAsArray(jmolApplet0, "polymerInfo").models[0].polymers[0].monomers[i].psi)
  torsions.push(Jmol.getPropertyAsArray(jmolApplet0, "polymerInfo").models[0].polymers[0].monomers[i].phi)
  torsions.push(Jmol.getPropertyAsArray(jmolApplet0, "polymerInfo").models[0].polymers[0].monomers[i].psi)

}
console.log("finshed loop ")
document.getElementById("show_initial").style.setProperty("visibility" , "visible")
document.getElementById("show_initial1").style.setProperty("visibility" , "visible")
document.getElementById("show_tors").style.setProperty("visibility" , "visible")

document.getElementById("intial_phis").innerHTML=phis
document.getElementById("intial_psis").innerHTML=psis
document.getElementById("intial_tosions").innerHTML=torsions


}

function show_initial_torsions(){
  beg=Number.parseInt(document.getElementById("segbeg").value)
  end=Number.parseInt(document.getElementById("segend").value)
  pdbid=document.getElementById("pdb_txt_input").value
  console.log(pdbid)
  var JmolInfo = {
    width: 600,
    height: 600,
    //serverURL: "https://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
    use: "HTML5",
    readyFunction: jmol_isReady,
    script: "load="+pdbid 
    //script:"load http://localhost:5123/public/1crn.pdb"
  }
  document.getElementById("appdiv").innerHTML = Jmol.getAppletHtml(
    "jmolApplet0",
    JmolInfo
);
    Jmol.script("jmolApplet0",  "select backbone and (resno >="+ beg+ " and resno <= "+end+")")
}