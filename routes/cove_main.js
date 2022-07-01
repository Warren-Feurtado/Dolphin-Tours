var express = require('express');
var router = express.Router();
var conn = require('../lib/db');
var dateTime = require('node-datetime');



/* GET DOLPHIN COVE HOME PAGE. */
router.get('/', (req, res) => {
    conn.query('SELECT * FROM d_cove_locations dcloc;', (err, parks) =>{
        if (err) throw err;
        else{
            res.render('cove_main/coveHome', { title: 'Dolphin Cove | Home', my_session: req.session, prkData: parks});
        }
    });

});

/*------ GET DOLPHIN COVE PARK DETAILS PAGE. --------*/
router.get('/parks/:id', (req, res) => {

    var todayDate = dateTime.create();
    var todayDtFrmtd = todayDate.format('Y-m-d H:M:S');
 

    conn.query('SELECT DISTINCT dcloc.prk_nm, dcloc.prk_img FROM d_cove_locations dcloc, program_location_schedule prk WHERE prk.loc_id = dcloc.id AND prk.loc_id ='+ req.params.id, (err, location) =>{
        if (err) throw err;
        else{
            
            conn.query('SELECT DISTINCT prgms.id, prgms.prg_nm, prgms.prg_des, prgms.prg_prc, prgms.prg_img FROM d_cove_programs prgms, program_location_schedule prk WHERE prk.prog_id = prgms.id AND prk.loc_id ='+ req.params.id, (err, programs) =>{
                if (err) throw err;
                else{

                    conn.query('SELECT DISTINCT sched.id, sched.sched_tm FROM schedule_times sched, program_location_schedule prk WHERE prk.sched_id = sched.id AND prk.loc_id ='+ req.params.id, (err, schedule) =>{
                        if (err) throw err;
                        else{

                            conn.query('SELECT * FROM payment_types pmt WHERE pmt.pmt_typs <> "Cash" AND pmt.pmt_typs <> "Tour Credit"', (err, paymentType) =>{
                                if (err) throw err;
                                else{
        
        
                                    res.render('cove_main/parkDetails', { title: 'Dolphin Cove | Home', my_session: req.session, locaData: location[0], prgmData: programs, schedData: schedule, payTypeData: paymentType, res_dt: todayDtFrmtd, parksId: req.params.id});
                                }
                            });
                        }
                    });
                }
            });
        }   
    });
});


router.post('/reserve', (req, res) => {

    var reqBod = req.body;

    conn.query('INSERT INTO d_cove_bookings (prog_req, prog_dt, gst_amnt, bkn_tp, bkn_dt, gst_fnm, gst_lnm, gst_phn, gst_adrs, pmt_tp) SELECT (SELECT flPrgm.id FROM program_location_schedule flPrgm, d_cove_locations clt, d_cove_programs cpt, schedule_times scht WHERE clt.id = flPrgm.loc_id AND flPrgm.loc_id = "' + reqBod.locId + '" AND cpt.id = flPrgm.prog_id AND flPrgm.prog_id = "' + req.body.prgm + '" AND scht.id = flPrgm.sched_id AND flPrgm.sched_id = "' + req.body.schedTm + '") AS progReqId, "' + req.body.schedDt + '", "' + req.body.gst_amnt +'", "' + req.body.bkn_type +'", "' + req.body.bkn_dt +'", "' + req.body.gstFnm +'", "' + req.body.gstLnm +'", "' + req.body.gstPhn +'", "' + req.body.gstAdrs +'", "' + req.body.pmtType +'";', (err, rows) => {
        if (err) throw err;
        else{
            console.log(rows);
            res.redirect('/')
            console.log(req.body);
        }

    })
});

module.exports = router;
