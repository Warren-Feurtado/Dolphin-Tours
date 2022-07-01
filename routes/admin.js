var express = require('express');
var router = express.Router();
var conn = require('../lib/db');
var dateTime = require('node-datetime');



router.get('/', (req, res) => {
    if(req.session.loggedin == true && req.session.pos == 'Super Admin' || req.session.loggedin == true && req.session.pos == 'Cove Admin' || req.session.loggedin == true && req.session.pos == 'Tour Admin'){
        res.render('admin/admin_dash', {title: 'Dolphin Cove | Admin Dashboard', my_session: req.session});
    }else{
        res.redirect('/login/admin')
    }
    
});


//--------------- GET DOLPHIN COVE ADMIN BOOKINGS PAGE  ----------------- //
router.get('/dolphin-cove-bookings', (req, res) => {

    var todayDate = dateTime.create();
    var todayDtFrmtd = todayDate.format('Y-m-d H:M:S');

    conn.query('SELECT dcloc.id, dcloc.prk_nm FROM d_cove_locations dcloc', (err, location) =>{
        if (err) throw err;
        else{
            
            conn.query('SELECT prgms.id, prgms.prg_nm, prgms.prg_prc FROM d_cove_programs prgms', (err, programs) =>{
                if (err) throw err;
                else{

                    conn.query('SELECT DISTINCT sched.id, sched.sched_tm FROM schedule_times sched, program_location_schedule prk', (err, schedule) =>{
                        if (err) throw err;
                        else{

                            conn.query('SELECT * FROM payment_types pmt WHERE pmt.pmt_typs <> "Tour Credit"', (err, paymentType) =>{
                                if (err) throw err;
                                else{
        
                                    conn.query('SELECT (SELECT plst.req_dets FROM program_location_schedule plst WHERE dcbk.prog_req = plst.id) AS reqPrg, dcbk.inv_num, dcbk.prog_dt, dcbk.gst_amnt, (SELECT bkt.bk_typ FROM booking_types bkt WHERE bkt.id = dcbk.bkn_tp) AS bkTyp, dcbk.bkn_dt, dcbk.gst_fnm, dcbk.gst_lnm, dcbk.gst_phn, dcbk.gst_adrs, dcbk.pmt_tp FROM d_cove_bookings dcbk', (err, bookings) => {
                                        if (err) throw err;
                                        else{

                                            res.render('admin/cove_admin_bookings', { title: 'Dolphin Cove | Admin Bookings', my_session: req.session, locaData: location, prgmData: programs, schedData: schedule, payTypeData: paymentType, res_dt: todayDtFrmtd, coveBookData: bookings});
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }   
    });
});

//--------------- POST ADMIN GUEST RESERVATION  ----------------- //
router.post('/cove-reserve', (req, res) => {

    var reqBod = req.body;

    conn.query('INSERT INTO d_cove_bookings (prog_req, prog_dt, gst_amnt, bkn_tp, bkn_dt, gst_fnm, gst_lnm, gst_phn, gst_adrs, pmt_tp) SELECT (SELECT flPrgm.id FROM program_location_schedule flPrgm, d_cove_locations clt, d_cove_programs cpt, schedule_times scht WHERE clt.id = flPrgm.loc_id AND flPrgm.loc_id = "' + reqBod.locId + '" AND cpt.id = flPrgm.prog_id AND flPrgm.prog_id = "' + req.body.prgm + '" AND scht.id = flPrgm.sched_id AND flPrgm.sched_id = "' + req.body.schedTm + '") AS progReqId, "' + req.body.schedDt + '", "' + req.body.gst_amnt +'", "' + req.body.bkn_type +'", "' + req.body.bkn_dt +'", "' + req.body.gstFnm +'", "' + req.body.gstLnm +'", "' + req.body.gstPhn +'", "' + req.body.gstAdrs +'", "' + req.body.pmtType +'";', (err, rows) => {
        if (err) throw err;
        else{
            res.redirect('/admin/dolphin-cove-bookings')
            console.log(req.body);
        }

    })
});


//--------------- GET DOLPHIN TOUR ADMIN BOOKINGS PAGE  ----------------- //
router.get('/dolphin-tour-bookings', (req, res) => {

    conn.query('SELECT * FROM tour_reservations', (err, reservations) => {
        if (err) throw err;
        else{
            res.render('admin/tour_admin_bookings', {title: 'Dolphin Tours | Admin Bookings', my_session: req.session, tourResData: reservations});
        }
    });
});

//------------- GET DOLPHIN COVE ADMIN PROGRAMS PAGE  --------------- //
router.get('/dolphin-cove-programs', (req, res) => {

    conn.query('SELECT cpt.id, cpt.prg_nm, cpt.prg_des, cpt.prg_prc, cpt.prg_img FROM d_cove_programs cpt', (err, programs) => {
        if (err) throw err;
        else{
            res.render('admin/cove_admin_programs', {title: 'Dolphin Cove | Admin Programs', my_session: req.session, admPrgmData: programs});
        }
    });
});

module.exports = router;