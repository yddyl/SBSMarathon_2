﻿var express = require('express');
var router = express.Router();
var app=express();
var malasong= require('../models/Marathon');
/* GET users listing. */
router.get('/', function(req, res, next) {
    malasong.matchAll(req, res, next);//bisaiAll
});
router.get('/userByID', function(req, res, next) {
    malasong.userByID(req, res, next);//renById
});
router.get('/userByName', function(req, res, next) {
    malasong.userByName(req, res, next);//renByName
});
router.get('/recordByID', function(req, res, next) {
    malasong.recordByID(req, res, next);//chengjiById
});
router.get('/recordByMatch', function(req, res, next) {
    malasong.recordByMatch(req, res, next);//chengjiByMatch
});
router.get('/matchByMatch', function(req, res, next) {
    malasong.matchByMatch(req, res, next);//bisaiById
});
router.get('/recordByMatchInRankOrder', function(req, res, next) {
    malasong.recordByMatchInRankOrder(req, res, next);//chengjiAnRank
});
router.get('/getPaceByIDByMatch', function(req, res, next) {
    malasong.getPaceByIDByMatch(req, res, next);//getPace
});
router.get('/getSpeedByIDByMatch', function(req, res, next) {
    malasong.getSpeedByIDByMatch(req, res, next);//getSpeed
});
router.get('/bestTimeByIDGroupClass', function(req, res, next) {
    malasong.bestTimeByIDGroupClass(req, res, next);//bestTime
});
router.get('/bestRankByIDGroupClass', function(req, res, next) {
    malasong.bestRankByIDGroupClass(req, res, next);//bestRank
});
router.get('/avgBestByMatchGroupClass', function(req, res, next) {
    malasong.avgBestByMatchGroupClass(req, res, next);//avgminByMatch
});
router.get('/avgPaceByIDGroupClass', function(req, res, next) {
    malasong.avgPaceByIDGroupClass(req, res, next);//avgPaceById
});
router.get('/avgRecordByIDGroupClass', function(req, res, next) {
    malasong.avgRecordByIDGroupClass(req, res, next);//avgRecordByID
});
/*router.get('/recordDistFullByMatch', function(req, res, next) {
    malasong.recordDistFullByMatch(req, res, next);//chengjiDistFullByMatch
});*/
router.get('/recordDistByMatchByClass', function(req, res, next) {
    malasong.recordDistByMatchByClass(req, res, next);//chengjiDistHalfByMatch
});
router.get('/rankingByIDByClass', function(req, res, next) {
    malasong.rankingByIDByClass(req, res, next);
});
router.get('/filter', function(req, res, next) {
    malasong.filter(req, res, next);
});
router.get('/segment', function(req, res, next) {
    malasong.segment(req, res, next);
});
router.get('/classByID', function(req, res, next) {
    malasong.classByID(req, res, next);
});
router.get('/medianAge', function(req, res, next) {
    malasong.medianAge(req, res, next);
});
router.get('/medianRecordByGenderByClass', function(req, res, next) {
    malasong.medianRecordByGenderByClass(req, res, next);
});
//networkLocationByMatch
router.get('/networkLocationByMatch', function(req, res, next) {
    malasong.networkLocationByMatch(req, res, next);
});
router.get('/classCountByID', function(req, res, next) {
    malasong.classCountByID(req, res, next);
});
router.get('/fakeComingMatch', function(req, res, next) {
    malasong.fakeComingMatch(req, res, next);
});
router.get('/match', function(req, res, next) {
    malasong.match(req, res, next);
});
router.get('/avgSpeed', function(req, res, next) {
    malasong.avgSpeed(req, res, next);
});
router.get('/nearByRecord', function(req, res, next) {
    malasong.nearByRecord(req, res, next);
});
//phoneauthenticate
router.get('/authenticate', function(req, res, next) {
    malasong.authenticate(req, res, next);
});
router.get('/phoneauthenticate', function(req, res, next) {
    malasong.phoneauthenticate(req, res, next);
});
router.get('/register', function(req, res, next) {
    malasong.register(req, res, next);
});
router.get('/update', function(req, res, next) {
    malasong.update(req, res, next);
});
router.get('/smsvalidation', function(req, res, next) {
    malasong.smsvalidation(req, res, next);
});
router.get('/link', function(req, res, next) {
    malasong.link(req, res, next);
});
//phonenumberexist
router.get('/usernameexist', function(req, res, next) {
    malasong.usernameexist(req, res, next);
});
router.get('/phonenumberexist', function(req, res, next) {
    malasong.phonenumberexist(req, res, next);
});
// images: /course/20140006.png for 路线图， /logo/20140006.png for logo
app.use(express.static('public'));

module.exports = router;