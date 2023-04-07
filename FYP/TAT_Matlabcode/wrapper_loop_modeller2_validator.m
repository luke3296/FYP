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
err="";

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

outputArg1 = err;
err
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