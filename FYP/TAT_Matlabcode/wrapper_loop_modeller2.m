function [outputArg1] = wrapper_loop_modeller2(pdbcode_,pdb_outname_,chain_,segbeg_,segend_,target_residues_phi_,target_residues_psi_,constr_residues_phi_,constr_residues_psi_,n_iter_)
%UNTITLED2 Summary of this function goes here
%   Detailed explanation goes here
tic

% ALCOHOL DEHYDROGENASE
pdbcode= pdbcode_;
pdb_outname=pdb_outname_;
chain=chain_

segbeg=segbeg_;
segend=segend_;
% in format [resnum1 phi1; resnum2 phi2; ..]
target_residues_phi=target_residues_phi_;
target_residues_psi=target_residues_psi_;
%in format [resnum1 resnum2 ...]
constr_residues_phi=constr_residues_phi_;
constr_residues_psi=constr_residues_psi_;
%constr_residues_phi=[];
%constr_residues_psi=[];

% specifiy number of iternations
n_iter=n_iter_;

%% Do some checking
err="error\n";

% check not constraining and targeting same torsions
phi_intersect=0;
psi_intersect=0;
if ~isempty(target_residues_phi) 
    phi_intersect=length(intersect(constr_residues_phi,target_residues_phi(:,1)));
end
if ~isempty(target_residues_psi)
    psi_intersect=length(intersect(constr_residues_psi,target_residues_psi(:,1)));
end
if isempty(target_residues_phi) && isempty(target_residues_psi) 
    err = err+'no torsions are being targeted\n'
    return
end
if phi_intersect ~= 0
    err = err+'you are targeting and constraining the same phi torsion\n'
    intersect(constr_residues_phi,target_residues_phi(:,1))
    return
end
if psi_intersect ~= 0
    err = err+'you are targeting and constraining the same psi torsion\n'
    intersect(constr_residues_psi,target_residues_psi(:,1))
    return
end

% call Segment_prep
[segstruct,natseg,nres,npep,nbond,ntors,nphipsi,n_notconstr,nfree,phipsi_index,phipsi_notconstr_index,tors_change_index,tors_change_target,constrset]=Segment_prep(pdbcode,chain,segbeg,segend,target_residues_phi,target_residues_psi,constr_residues_phi,constr_residues_psi);

% stop if nfree is equal to or less than zero
if nfree <= 0
    err = err+ 'zero degrees of freedom, cannot target\n'
    return
end
%% Determine internal coordinates

[xn,yn,zn,xca,yca,zca,xc,yc,zc,xo,yo,zo,nside,xside,yside,zside,atlistN,atlistCA,atlistC,atlistO,atlist_side,lengs,angs,tors_initial]=PDBStruct_to_Internal_func2(nres,segstruct);

%% Set target torsion angles

%set target phi and psi angles at their initial values
%tors_target=tors_initial;
tors_target=zeros(ntors,1);
% set target values
tors_target(tors_change_index)=tors_change_target(tors_change_index)

% tors_target_mask is used to mask torsions that are not targeted
tors_target_mask=zeros(ntors,1);
tors_target_mask(tors_change_index)=1.0;

%% Do targeting and get the torsions trajectory

[n_iterstop,torstraj,tors_final,rmsd_initial,normlamda,delta_targ_final,distfinal]=Loop_Target_func2(n_iter,lengs,angs,constrset,npep,nbond,nphipsi,phipsi_notconstr_index,n_notconstr,nfree,tors_initial,tors_target_mask,tors_target);

delta_phipsi=delta_targ_final(phipsi_index);

[tors_initial(phipsi_index) tors_final(phipsi_index) tors_target(phipsi_index) delta_phipsi]
distfinal

%% Use interpolation on trajectory for output

[nmod,torsmod]=interpol_torstraj_func2(n_iterstop,npep,nphipsi,phipsi_index,tors_initial,tors_final,torstraj);

%% Convert to Cartesian coordinate trajectory

%this function will produce side chain coordinates as well
[segstruct_traj]=Make_PDBstruct_Tortraj_func(nmod,natseg,nres,segstruct,xn,yn,zn,xca,yca,zca,xc,yc,zc,xo,yo,zo,nside,xside,yside,zside,atlistN,atlistCA,atlistC,atlistO,atlist_side,lengs,angs,tors_initial,torsmod);

%% Output structure trajectory

pdbwrite(pdb_outname,segstruct_traj);
outputArg1 = err;
end
%pdbcode='1adg';
%pdb_outname='LADH_loopmovement.pdb';
%chain='A'

%segbeg=290;
%segend=301;
% in format [resnum1 phi1; resnum2 phi2; ..]
%target_residues_phi=[291 -90; 292 -110; 293 -64; 294 -90];
%target_residues_psi=[291 122; 292 -35; 293 147];
%in format [resnum1 resnum2 ...]
%constr_residues_phi=[295 296];
%constr_residues_psi=[294 295];
%constr_residues_phi=[];
%constr_residues_psi=[];

% specifiy number of iternations
%n_iter=10000;