
var left_crtl = true

window.onload = function() { 
  
  document.getElementById("right window").checked = false;
  document.getElementById("left window").checked = true;

        var JmolInfo = {
            width: 500,
            height: 500,
            //serverURL: "https://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
            use: "HTML5",
            script: "load=1adg"
        }
      
        document.getElementById("appdiv1").innerHTML = Jmol.getAppletHtml(
            "jmolApplet0",
            JmolInfo
        );

        var JmolInfo = {
          width: 500,
          height: 500,
          //serverURL: "https://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
          use: "HTML5",
          script: "load http://localhost:5123/public/OutputPDBS/PDBID_1ADG_CHAIN_A_BEG_290_END_303_PHITARGS_291_-90_292_-110_293_-64_PSITARGS_291_122_292_-35_PHICONSTR_295_296_PSICONSTR_295_296_ITTR_10000.pdb"
      }
    
      document.getElementById("appdiv2").innerHTML = Jmol.getAppletHtml(
          "jmolApplet1",
          JmolInfo
      );

document.getElementById("Rotate").addEventListener("click", rotate_model);
document.getElementById("ResetView").addEventListener("click", reset_view)
document.getElementById("Highlight segment").addEventListener("click", highlight)
document.getElementById("run_cmd").addEventListener("click", run_jmol_script);
document.getElementById("load2model").addEventListener("click", load_pdb);

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
        var cmd = document.getElementById("cmd_str").value;
        if(left_crtl){
        Jmol.script(jmolApplet0, cmd);
        }else{
        Jmol.script(jmolApplet1, cmd);
        }
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


async function load_from_server(event){
  console.log(event)
  parent=event.target.parentNode
  console.log(parent)
  console.log(parent.querySelectorAll('p'))
  
  fname=parent.querySelectorAll('p')[0].innerText
  console.log(parent.querySelectorAll('p')[0].innerText)
  console.log(parent.querySelectorAll('p')[0].innerHTML)
  exsists=await check_file_exsists(fname)
  console.log("exsists")
  console.log(exsists)
  if(exsists == false){
    alert("server err that file doesn't exsist but is reference in the database")
  }else{
    Jmol.script(jmolApplet1, "load "+exsists)
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
  query=document.getElementById("search_q").value
  query="http://localhost:5123/api/v1/pdbs/?pdbid="+query.toUpperCase()
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
      a.textContent = data[i].pdb_id + " " + data[i].segbeg + " " + data[i].segend + " "+ data[i].target_residues_phi 
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