const fs = require('fs');

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