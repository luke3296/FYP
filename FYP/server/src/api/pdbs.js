//author luke
// last update : 9/12/22 
const express = require('express')
const monk = require("monk");
const db = monk(process.env.MONGO_URI);
const Joi = require('@hapi/joi');
const pdbs = db.get('pdbs');

//for running matlab
const { exec } = require("child_process");

//schmea example '1adg','LADH_loopmovement.pdb','A',290,301,[291 , -90; 292 , -110; 293 , -64; 294 , -90],[291 122; 292 -35; 293 147],[295 296],[295 296] ,10000
const schema = Joi.object({
    pdb_id: Joi.string().trim().required(),
    fname: Joi.string().trim().required(),
    chain: Joi.string().trim().required(),
    segbeg: Joi.number().required(),
    segend: Joi.number().required(),
    chain: Joi.string().trim().required(),
    target_residues_phi: Joi.string().trim().required(),
    target_residues_psi: Joi.string().trim().required(),
    constr_residues_phi: Joi.string().trim().required(),
    constr_residues_psi: Joi.string().trim().required(),

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
        console.log(req.body)
        const value = await schema.validateAsync(req.body);
        const inserted = await pdbs.insert(value);
        res.json(inserted);
    } catch (error) {
        next(error);
    }
});




module.exports = router;