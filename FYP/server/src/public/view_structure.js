//import { text } from "express"

var left_crtl = true
var width_crtl = true
var current_loop='290-301'
current_loop_fname='PDBID_1ADG_CHAIN_A_BEG_290_END_301_PHITARGS_291_-90_292_-110_293_-64_294_-90_PSITARGS_291_122_292_-35_293_147_PHICONSTR_295_296_PSICONSTR_295_296_ITTR_10000.pdb'
var highted=false
var showing_labels=false
var cmd_hist=''
var theme='original'

var server_name = "http://localhost:5123/"
var post_job_endpoint='/api/v1/pdbs/'
var Submit_endpoint='http://localhost:5123/api/v1/pdbs/'
var protocol='http'




window.onload = function() { 
window.onresize = handleWindowSize;
server_name=window.location.host
protocol=window.location.protocol
port=window.location.port
Submit_endpoint=protocol+'//'+server_name+post_job_endpoint
//Search_endpoint=http://localhost:5123/api/v1/pdbs/?pdbid="+query.toUpperCase()

document.getElementById("right window").checked = false;
document.getElementById("left window").checked = true;
document.getElementById("sync").checked=false;
document.getElementById("highlight").checked=false;
document.getElementById("show_labels").checked=false;

  
w =Number( window.innerWidth)

if(w<860){
 size_inital=400
 document.getElementById("left_label").textContent="up"
 document.getElementById("right_label").textContent="down"
}else{
  size_inital=598
  document.getElementById("left_label").textContent="left"
  document.getElementById("right_label").textContent="right"
}

        var JmolInfo = {
          width: size_inital,
          height: size_inital,
            //serverURL: "https://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
            use: "HTML5",
            script: "load=1adg"
        }
      
        document.getElementById("appdiv1").innerHTML = Jmol.getAppletHtml(
            "jmolApplet0",
            JmolInfo
        );

        var JmolInfo = {
          width: size_inital,
          height: size_inital,
          //serverURL: "https://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
          use: "HTML5",
          script: "load http://localhost:5123/public/OutputPDBS/PDBID_1ADG_CHAIN_A_BEG_290_END_301_PHITARGS_291_-90_292_-110_293_-64_294_-90_PSITARGS_291_122_292_-35_293_147_PHICONSTR_295_296_PSICONSTR_295_296_ITTR_10000.pdb"
      }
    
      document.getElementById("appdiv2").innerHTML = Jmol.getAppletHtml(
          "jmolApplet1",
          JmolInfo
      );

document.getElementById("third").innerHTML+=Jmol.jmolBr(jmolApplet0)
document.getElementById("third").innerHTML+=`Background color : `
document.getElementById("third").innerHTML+=Jmol.jmolRadioGroup(jmolApplet0, [["set background white", "white", true],["set background black", "black"]])
document.getElementById("third").innerHTML+=Jmol.jmolBr(jmolApplet0)
document.getElementById("third").innerHTML+=`Style : `
document.getElementById("third").innerHTML+=Jmol.jmolMenu(jmolApplet0, [
  ["select * ; spacefill only;spacefill 23%;wireframe 0.15", "ball and stick"],
  ["select * ; cartoon only",  "cartoon"],
  ["select * ; wireframe -0.25", "stick"],
  ["select * ; spacefill", "van ser walls"]
]);

document.getElementById("third").innerHTML+=Jmol.jmolBr(jmolApplet0)

document.getElementById("third").innerHTML+=`Color : `
document.getElementById("third").innerHTML+=Jmol.jmolMenu(jmolApplet0, [
  ["select * ; color cpk", "cpk"],
  ["select * ; color group",  "group"],
  ["select * ; color amino", "amino"],
  ["select * ; color structure", "structure"],
  ["select * ; color chain", "chain"]
]);

document.getElementById("third").innerHTML+=Jmol.jmolBr(jmolApplet0)

document.getElementById("third").innerHTML+=`View from : `
document.getElementById("third").innerHTML+=Jmol.jmolMenu(jmolApplet0, [
[ "reset", "Front"], 
[ "moveto 1 1 0 0 180 #Back", "Back"],
[ "moveto 1 1 0 0 -90 #Top", "Top"],
[ "moveto 1 1 0 0 90 #Bottom", "Bottom"],
[ "moveto 1 0 1 0 90 #Left", "Left"],
[ "moveto 1 0 1 0 -90 #Right", "Right"],
]);

document.getElementById("fifth").innerHTML+=`Background color : `
document.getElementById("fifth").innerHTML+=Jmol.jmolRadioGroup(jmolApplet1, [["set background white", "white", true],["set background black", "black"]])
document.getElementById("fifth").innerHTML+=Jmol.jmolBr(jmolApplet1)
document.getElementById("fifth").innerHTML+=`Anim : `
document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1, "anim play", "play")
document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1, "anim off", "stop")
document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1, "anim off;anim rewind#;","First")
document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1, "anim off;frame prev", "Prev")
document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1, "anim off;frame next", "Next")
document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1, "anim off;frame last", "Last")
//document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1, "anim off;frame all", "All")
document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1, "anim mode loop;frame 1;anim play", "loop")
document.getElementById("fifth").innerHTML+=Jmol.jmolBr(jmolApplet1)
//document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1,"select * ; cartoon only", "cartoon")
//document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1,"select * ; wireframe -0.25", "stick")
//document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1,"select * ; spacefill only;spacefill 23%;wireframe 0.15","ball&stick")
//document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1,"select * ; spacefill","Van der Waals")
document.getElementById("fifth").innerHTML+=`Style : `

document.getElementById("fifth").innerHTML+=Jmol.jmolMenu(jmolApplet1, [
  ["select * ; spacefill only;spacefill 23%;wireframe 0.15", "ball and stick"],
  ["select * ; cartoon only",  "cartoon"],
  ["select * ; wireframe -0.25", "stick"],
  ["select * ; spacefill", "van ser walls"]
]);

document.getElementById("fifth").innerHTML+=Jmol.jmolBr(jmolApplet1)
//document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1,"select * ; color cpk", "cpk color") 
//document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1,"select * ; color group", "group color")
//document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1,"select * ; color amino", "amino color")
//document.getElementById("fifth").innerHTML+=Jmol.jmolButton(jmolApplet1,"select * ; color structure", "structure color")
document.getElementById("fifth").innerHTML+=`Color : `

document.getElementById("fifth").innerHTML+=Jmol.jmolMenu(jmolApplet1, [
  ["select * ; color cpk", "cpk"],
  ["select * ; color group",  "group"],
  ["select * ; color amino", "amino"],
  ["select * ; color structure", "structure"],
  ["select * ; color chain", "chain"]
]);
document.getElementById("fifth").innerHTML+=Jmol.jmolBr(jmolApplet1)
document.getElementById("fifth").innerHTML+=`View from : `
document.getElementById("fifth").innerHTML+=Jmol.jmolMenu(jmolApplet1, [
  [ "reset", "Front"], 
  [ "moveto 1 1 0 0 180 #Back", "Back"],
  [ "moveto 1 1 0 0 -90 #Top", "Top"],
  [ "moveto 1 1 0 0 90 #Bottom", "Bottom"],
  [ "moveto 1 0 1 0 90 #Left", "Left"],
  [ "moveto 1 0 1 0 -90 #Right", "Right"],
  ]);
  
document.getElementById("Rotate").addEventListener("click", rotate_model);
document.getElementById("ResetView").addEventListener("click", reset_view)
//document.getElementById("Highlight segment").addEventListener("click", highlight)
document.getElementById("run_cmd").addEventListener("click", run_jmol_script);
document.getElementById("load2model").addEventListener("click", load_pdb);
document.getElementById("seqNumBtn").addEventListener("click", show_torsion);
document.getElementById("seqClearBtn").addEventListener("click", clear_torsion);
document.getElementById("loadAltBtn").addEventListener("click", load_alt);
document.getElementById("ShowHeader").addEventListener("click", show_header);
document.getElementById("close_modal").addEventListener("click", close_modal);
document.getElementById("search_db_btn").addEventListener("click", Search);
document.getElementById("sync").addEventListener("click", Sync);
document.getElementById("highlight").addEventListener("click", HighlightLoop);
document.getElementById("show_labels").addEventListener("click", label_phi_psi_togg)
document.getElementById("left window").addEventListener("click", toggle_ctr1)
document.getElementById("right window").addEventListener("click", toggle_ctr2)
document.getElementById("original").addEventListener("click", setTheme)
document.getElementById("Solarised Dark").addEventListener("click", setTheme)
document.getElementById("Pastel").addEventListener("click", setTheme)



//document.getElementById("show_labels").addEventListener("change", label_phi_psi_togg);

//jmolApplet1.jmolSetCallback(jmolApplet1, "animframecallback", "label_phi_psi");
Jmol.script(jmolApplet1,'set animFrameCallback "label_phi_psi"')


};

//matlab -nodisplay -nojvm -r  "wrapper_loop_modeller2('1adg','LADH_loopmovement.pdb','A',290,301,[291 -90 ; 292 -110; 293 -64; 294 -90],[291 122; 292 -35; 293 147],[295 296],[294 295],10000);exit;"
    function setDefault(){
      pdbid='1adg'
      fname='LADH_loop_movement.pdb'
      chain='A'
      segb=290
      sege=301
      //291 -90 ; 292 -110; 293 -64; 294 -90]
      phitargs=[]
      phitargs.append([291,-90])
      phitargs.append([292, -110])
      phitargs.append([293, -64])
      phitargs.append([294, -90])
      //[291 122; 292 -35; 293 147]
      psitargs=[]
      psitargs.append([291, 122])
      psitargs.append([292, -35])
      psitargs.append([293 , 147])
      //[295 296]
      phiconstr=[295,  296]
      //[294 295]
      psiconstr=[294 , 295]

      itter=10000

      document.getElementById("pdbcode_input").value = pdbid
    }

    function load_pdb() {
        console.log("clicked" + jmolApplet0);
        var pdbCode = document.getElementById("pdbcode_input").value;
        Jmol.script(jmolApplet0, "load=" + pdbCode);
    }

    function rotate_model() {
      console.log("called rotate")
        Jmol.script(jmolApplet0, "rotate y 30");
    }

    function reset_view() {
        Jmol.script(jmolApplet0, "reset");
    }

    function highlight() {
        var start = document.getElementById("start").value;
        var end = document.getElementById("end").value;
        Jmol.script(
            jmolApplet0,
            "select " + start + "-" + end + "; color orange"
        );
    }


function run_jmol_script() {
        console.log("run jmol cmd")
        var cmd = document.getElementById("cmd_str").value;
        console.log("cmd" +cmd)
        cmd_hist += "cmd: " +cmd+"\n\n"
        if(left_crtl){
        Jmol.script(jmolApplet0, cmd);
        }else{
        Jmol.script(jmolApplet1, cmd);
        }
        document.getElementById("search_result2").innerText+=cmd+"\n"
    }


function Sync(){
  if (document.getElementById("sync").checked == true){
    Jmol.script(jmolApplet0,'sync * on; sync * "set syncMouse true"')
  }else{
    Jmol.script(jmolApplet0,'sync * off')
  }
}

async function Load(){
  val = document.getElementById("load").value
  console.log(val)
  data = await getPdb(val)
  console.log(data)
  Jmol.script(jmolApplet0, "load "+data.redirectUrl)
}

var re = /BEG_\d+_END_\d+/;

var re1 = /seq \d+/;

async function load_from_server(event){
  console.log(event)
  parent=event.target.parentNode
  console.log(parent)
  console.log(parent.querySelectorAll('p'))
  
  fname=parent.querySelectorAll('p')[0].innerText

  //set the current loops begin / end string 
  result = fname.match(re)[0]
  result2 = result.replace('BEG','')
  result3 = result2.replace('END','')
  result4 = result3.replace('_','')
  result5 = result4.replace('__','-')
  result6 = result5.trim()
  current_loop=result6

  
  console.log(parent.querySelectorAll('p')[0].innerText)
  console.log(parent.querySelectorAll('p')[0].innerHTML)
  exsists=await check_file_exsists(fname)
  console.log("exsists")
  console.log(exsists)
  if(exsists == false){
    alert("server err that file doesn't exsist but is reference in the database")
  }else{
    Jmol.script(jmolApplet1, "load "+exsists)
    current_loop_fname=fname
  }
}
async function check_file_exsists(fname_){
  console.log("searching for "+fname_ )
  let res_= await fetch("http://localhost:5123/api/v1/pdbs/1", {
    method : 'POST',
    headers : {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({
      fname : fname_
    })
  }).then(res_ => res_.text())
  return res_
}

async function Search(){
  pdbid=document.getElementById("search_q").value.toUpperCase()
  q_beg=document.getElementById("search_beg").value
  q_end=document.getElementById("search_end").value
  var query=Submit_endpoint+'?pdbid='
  if(q_beg =="" && q_end ==""){ //search pdb only
    query+=pdbid
  }else if(q_beg !="" && q_end ==""){ //search for pdb + segbeg
    query+=pdbid+'&segbeg='+q_beg
  }else if(q_beg =="" && q_end !=""){ //seach for pdb + segend
    query+=pdbid+'&segend='+q_end
  }else{                              //search for pdb + segbeg + segend
    query+=pdbid+'&segbeg='+q_beg+'&segend='+q_end
  }
  console.log(query)
  //query="http://localhost:5123/api/v1/pdbs/?pdbid="+query.toUpperCase()

  fetch(query)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    //document.getElementById("search_result").value = data
    resultDiv=document.getElementById("search_result")
    resultDiv.innerHTML=''
    
    for(var i=0;i<data.length;i++){
      innerDiv= document.createElement('div');
      console.log(data[i])
      a = document.createElement('a');
      p = document.createElement('p');
      p.style.display='none'
      p.textContent=data[i].fname  
      a.textContent = "Beg: "+ data[i].segbeg + " End: " + data[i].segend + " Targ φ: "+ data[i].target_residues_phi + " Targ ψ : "+ data[i].target_residues_psi + " Cnstr φ: "+ data[i].constr_residues_phi+ + " Cnstr ψ: "+ data[i].constr_residues_psi   
      a.onclick = load_from_server
      innerDiv.appendChild(a)
      innerDiv.appendChild(p)
      resultDiv.appendChild(innerDiv)
      resultDiv.append(document.createElement('br'))
    }
  })
  .catch(error => {
    console.error(error);
  });

}

function toggle_ctr1(){
   
      left_crtl = true
      document.getElementById("right window").checked = false;
      document.getElementById("left window").checked = true;
    
}
function toggle_ctr2(){
   
    left_crtl = false
    document.getElementById("left window").checked = false;
    document.getElementById("right window").checked = true;

}

function handleWindowSize(){
  
  w =Number( window.innerWidth)
  if(w<880){
    jmolApplet0._resizeApplet(400,400)
    jmolApplet1._resizeApplet(400,400)
    document.getElementById("left_label").textContent="up"
    document.getElementById("right_label").textContent="down"
  }else{
    jmolApplet0._resizeApplet(598,598)
    jmolApplet1._resizeApplet(598,598)
    document.getElementById("left_label").textContent="left"
    document.getElementById("right_label").textContent="right"
  }
}

//bug here highlight loop resets the current color
function HighlightLoop(){
  if(!highted){
    highted=true
  Jmol.script(
    jmolApplet0,
    "select " +current_loop+ "; color lawngreen"
);
  }else{
    highted=false
    Jmol.script(
      jmolApplet0,
      "select * ; color cpk"
  );
  }

}

function get_torsion_angle(seqNum){

  phi= Jmol.getPropertyAsArray(jmolApplet0, "polymerInfo").models[0].polymers[0].monomers[seqNum].phi
  psi= Jmol.getPropertyAsArray(jmolApplet0, "polymerInfo").models[0].polymers[0].monomers[seqNum].psi
  //console.log("phi " +phi + " psi " + psi)
  return {"phi" : phi , "psi": psi}
}
function show_torsion(){
  num=document.getElementById('seqNum').value
  tors = get_torsion_angle(num)
  console.log(psi)
  outDiv=document.getElementById('search_result1')
  p = document.createElement('p');
  p.innerText=`seq ${num}, φ ${tors.phi.toFixed(1)}, ψ ${tors.psi.toFixed(1)}`
  p.onclick = hilight_sgl
  outDiv.appendChild(p)

}
function clear_torsion(){
  document.getElementById('search_result1').innerHTML=''
}
function hilight_sgl(event){
  text=event.target.innerText.match(re1)[0]
  text=text.replace("seq", "")
  text=text.trim()
  //console.log(text)
  Jmol.script(jmolApplet0, "select "+text+ "; color lawngreen")
}



function label_phi_psi_togg(){
  if(showing_labels){
    showing_labels=false
    document.getElementById("show_labels").checked = false;

    //Jmol.script(jmolApplet1,'set animFrameCallback "None"')
   // Jmol.script(jmolApplet1,`select ${start}-${end}.ca ; label ""`)

  }else{
    showing_labels=true
    document.getElementById("show_labels").checked = true;
    Jmol.script(jmolApplet1,'set animFrameCallback "label_phi_psi"')
  }
  console.log(showing_labels)
}

function label_phi_psi(){
  if (showing_labels){
  loop=current_loop.split("-")
  start=parseInt(loop[0])
  end=parseInt(loop[1])
  Jmol.script(jmolApplet1,`select ${start}-${end}.ca ; label φ %.0[phi] ψ %.0[psi]`)
  //for(var i =start; i< end;i++ ){
  //  Jmol.script(jmolApplet1,  ` select ${i} ; label "YO"`)
 // }
}else{
  Jmol.script(jmolApplet1,`select ${start}-${end}.ca ; label ""`)
  
}
  /*
  Jmol.script(jmolApplet1, 
 `select protein;
  measure phiPsiSelected;
  for (var i = 1; i <= _atomCount; i++) {
    if (_atomName[i] == "CA") {
      label %a "Phi:%.1f\nPsi:%.1f" %({phiPsiSelected[i-1][0]}, {phiPsiSelected[i-1][1]})
    }
  }`)
  */

}
async function load_alt(event){
  console.log(event)
  
  altfname=current_loop_fname.replace('.pdb', 'ALT')+'.pdb'
  exsists=await check_file_exsists(altfname)
  if(exsists == false){
    alert("server err that file doesn't exsist but is reference in the database")
  }else{
    Jmol.script(jmolApplet1, "load "+exsists)
  }
}

function show_header(){
  console.log("show modal")
  document.getElementById("modal_text").innerText=jmolApplet0._getPropertyAsString('fileHeader')
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
  span.style.display="block"
  modal.style.display = "block"
}
function close_modal(){
  var modal = document.getElementById("myModal");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  span.style.display="none"
  modal.style.display = "none";
}

function setTheme(event) {
  theme=event.target.id
  console.log(theme)
  switch(theme) {
    case 'original':
      console.log("set og theme")
      document.getElementById("fifth").style.backgroundColor  = 'lightgreen';
      document.getElementById("fifth").style.color = 'black';
      document.getElementById("fourth").style.backgroundColor  = 'lightblue';
      document.getElementById("fourth").style.color = 'black';
      document.getElementById("third").style.backgroundColor  = 'lightgreen';
      document.getElementById("third").style.color = 'black';
      document.body.style.backgroundColor  = 'lightgrey';
      document.getElementById("search_result").style.backgroundColor  ='#82C3EE'
      document.getElementById("search_result1").style.backgroundColor  ='#82C3EE'
      document.getElementById("search_result2").style.backgroundColor  ='#82C3EE'
      document.getElementById("nav").style.backgroundColor  ='#e3f2fd'
    //document.querySelectorAll('nav')[0].style.backgroundColor='#e3f2fd'

      inputs=document.querySelectorAll('input')
      for(var i=0; i< inputs.length;i++){
        inputs[i].style.backgroundColor='white'
      }
      document.getElementById("jmolMenu3").style.backgroundColor='white'
      document.getElementById("jmolMenu4").style.backgroundColor='white'
      document.getElementById("jmolMenu5").style.backgroundColor='white'
      document.getElementById("jmolMenu0").style.backgroundColor='white'
      document.getElementById("jmolMenu1").style.backgroundColor='white'  
      document.getElementById("jmolMenu2").style.backgroundColor='white'
      //document.documentElement.style.setProperty('--text-color', 'black');
      //document.documentElement.style.setProperty('--link-color', '#007bff');
      
      inputs=document.querySelectorAll('.nav-link')
      for(var i=0; i< inputs.length;i++){
        inputs[i].style.color='#839496'
      }
      
      break;
      case 'Solarised Dark':
        console.log("set solar dark theme")
        document.getElementById("fifth").style.backgroundColor  = '#073642';
        document.getElementById("fifth").style.color = '#839496';
        document.getElementById("fourth").style.backgroundColor  = '#073642';
        document.getElementById("fourth").style.color = '#839496';
        document.getElementById("third").style.backgroundColor  = '#073642';
        document.getElementById("third").style.color = '#839496';
        document.body.style.backgroundColor  = '#002b36';
        document.getElementById("search_result").style.backgroundColor  ='#586e75'
        document.getElementById("search_result1").style.backgroundColor  ='#586e75'
        document.getElementById("search_result2").style.backgroundColor  ='#586e75'
        document.getElementById("nav").style.backgroundColor  ='#93a1a1'
       // document.getElementById("nav").style.color='#d30102'
    // document.querySelectorAll('nav')[0].style.backgroundColor='#586e75'
        inputs=document.querySelectorAll('.nav-link')
      for(var i=0; i< inputs.length;i++){
        inputs[i].style.color='#cb4b16'
      }
        document.getElementById("jmolMenu3").style.backgroundColor='#93a1a1'
        document.getElementById("jmolMenu4").style.backgroundColor='#93a1a1'
        document.getElementById("jmolMenu5").style.backgroundColor='#93a1a1'
        document.getElementById("jmolMenu0").style.backgroundColor='#93a1a1'
        document.getElementById("jmolMenu1").style.backgroundColor='#93a1a1'  
        document.getElementById("jmolMenu2").style.backgroundColor='#93a1a1'

     /*   var navitms=document.getElementsByClassName('nav-item')
        for(var i=0;i<navitms.length;i++){
          navitms[i].style.color="#d30102"
        }*/
      break;
      case 'Pastel':
        console.log("set pastal theme")
        document.getElementById("fifth").style.backgroundColor  = '#A6B1E1';
        document.getElementById("fifth").style.color = '#424874';
        document.getElementById("fourth").style.backgroundColor  = '#A6B1E1';
        document.getElementById("fourth").style.color = '#424874';
        document.getElementById("third").style.backgroundColor  = '#A6B1E1';
        document.getElementById("third").style.color = '#424874';
        document.body.style.backgroundColor  = '#DCD6F7';
        document.getElementById("search_result").style.backgroundColor  ='#9BA4B5'
        document.getElementById("search_result1").style.backgroundColor  ='#9BA4B5'
        document.getElementById("search_result2").style.backgroundColor  ='#9BA4B5'
       document.getElementById("nav").style.backgroundColor  ='#9BA4B5'
      // document.querySelectorAll('nav')[0].style.backgroundColor='#9BA4B5'
        inputs=document.querySelectorAll('input')
      for(var i=0; i< inputs.length;i++){
        inputs[i].style.backgroundColor='#A6B1E1'
      }
        document.getElementById("jmolMenu3").style.backgroundColor='#A6B1E1'
        document.getElementById("jmolMenu4").style.backgroundColor='#A6B1E1'
        document.getElementById("jmolMenu5").style.backgroundColor='#A6B1E1'
        document.getElementById("jmolMenu0").style.backgroundColor='#A6B1E1'
        document.getElementById("jmolMenu1").style.backgroundColor='#A6B1E1'  
        document.getElementById("jmolMenu2").style.backgroundColor='#A6B1E1'
        inputs=document.querySelectorAll('.nav-link')
        for(var i=0; i< inputs.length;i++){
          inputs[i].style.color='black'
        }
      break;
  }
}