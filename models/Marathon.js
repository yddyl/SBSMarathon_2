﻿var mysql = require('mysql');
var $db = require('../db');
var $sql = require('../sqlMapping');

var db_m='SBSMarathon';
var t1_user='user';
var t1_record='record';
var t1_match='match';
var t_country='countries';

// 使用连接池，提升性能
var pool  = mysql.createPool( $db.mysql);

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: 'ret undefined'
        });
    } else {
        res.json(ret);
    }
};
var jtoArrayPace =function (res,ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: 'ret undefined'
        });
    }else {
        var arr = [];
        var data = ret[0];
        var distance;
        var pace;
        for (var i in data) {
            distance = i;
            pace = data[i];
            arr.push({distance, pace});
        }
        res.json(arr);
    }
};
var jtoArraySpeed =function (res,ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: 'ret undefined'
        });
    }else {
        var arr = [];
        var data = ret[0];
        var speed;
        var distance;
        for (var i in data) {
            distance = i;
            speed = 1/data[i]*60;
            arr.push({distance, speed});
        }
        res.json(arr);
    }
};
var jtoArrayAvg =function (res,ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: 'ret undefined'
        });
    }else {
        var arr = [];
        var data;
        for(var t in ret) {
            data=ret[t];
            for (var i in data) {
                title = i;
                content = data[i];
                if (i == "std"||i=="average"||i=="minimum") {
                    var hms = content.split(':');
                    minutes = (+hms[0]) * 60 + (+hms[1]) + ((+hms[2]) / 60);
                    var display = content;
                    var value = minutes;
                    data[i] = {display, value};
                }
            }
            arr.push(data);
        }
        res.json(arr);
    }
};
var jtoArrayDist =function (res,ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: 'ret undefined'
        });
    }else {
        var arr = [];
        var data;
        for(var t in ret) {
            data=ret[t];
            var dist=[];
            var temp=[];
            var Class;
            var total;
            for (var i in data) {
                title = i;
                content = data[i];
                if (i != "class"&& i!="total") {
                    var time = title;
                    var value = content;
                    //data[i] = {time, value};
                    dist.push({time, value});
                }else if(i == "class"){
                    Class=data[i];
                }else if(i == "total"){
                    total=data[i];
                }
            }
            temp.push({Class,total,dist});
            console.log(dist);
            arr.push(temp);
        }
        res.json(arr);
    }
};

module.exports = {
	//matchAll
    matchAll: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.matchAll, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //userByID
    userByID: function (req, res, next) {
        var id = req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.userByID, id, function(err, result) {
                jsonWrite(res, result);
                connection.release();

            });
        });
    },
    //userByName
    userByName: function (req, res, next) {
        var name = req.query.name;
        console.log(id);
        console.log(req.query.id);
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.userByName, name, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //recordByID
    recordByID: function (req, res, next) {
        var id = req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.recordByID, id, function(err, result) {
                jsonWrite(res, result);
                connection.release();

            });
        });
    },
    //recordByMatch
    recordByMatch: function (req, res, next) {
        var match = +req.query.match;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.recordByMatch, match, function(err, result) {
                jsonWrite(res, result);
                connection.release();

            });
        });
    },
    //matchBy matchID
    matchByMatch: function (req, res, next) {
        var match = +req.query.match;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.matchByMatch, match, function(err, result) {
                jsonWrite(res, result);
                connection.release();

            });
        });
    },
    //recordByMatchInRankOrder
    recordByMatchInRankOrder: function (req, res, next) {
        var match = req.query.match;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.recordByMatchInRankOrder, match, function(err, result) {
                jsonWrite(res, result);
                connection.release();

            });
        });
    },
    //getPace
    getPaceByIDByMatch: function (req, res, next) {
        var id = req.query.id;
        var match=+req.query.match;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.getPaceByIDByMatch,[id,match], function(err, result) {
                jtoArrayPace(res,result);
               //jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //getSpeedByIDByMatch
    getSpeedByIDByMatch: function (req, res, next) {
        var id = req.query.id;
        var match=+req.query.match;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.getPaceByIDByMatch,[id,match], function(err, result) {
                jtoArraySpeed(res,result);
                //jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //bestTimeByID
    bestTimeByIDGroupClass: function (req, res, next) {
        var id = req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.bestTimeByIDGroupClass,id, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //bestRankByIDGroupClass
    bestRankByIDGroupClass: function (req, res, next) {
        var id = req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.bestRankByIDGroupClass,id, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //avgBestByMatchGroupClass
    avgBestByMatchGroupClass: function (req, res, next) {
        var match =+req.query.match;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.avgBestByMatchGroupClass,match, function(err, result) {
                jtoArrayAvg(res,result);
                connection.release();
            });
        });
    },
	//avgPaceByIDGroupClass
    avgPaceByIDGroupClass: function (req, res, next) {
        var id =req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.avgPaceByIDGroupClass,id, function(err, result) {
                jsonWrite(res,result);
                connection.release();
            });
        });
    },
    //avgRecordByID
    avgRecordByIDGroupClass: function (req, res, next) {
        var id =req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.avgRecordByIDGroupClass,id, function(err, result) {
                jsonWrite(res,result);
                connection.release();
            });
        });
    },
    //recordDistFullByMatch
    /*recordDistFullByMatch: function (req, res, next) {
        var match =+req.query.match;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.recordDistFullByMatch,match, function(err, result) {
                jtoArrayDist(res,result);
                connection.release();
            });
        });
    },*/
    // recordDistByMatch 更新 ByClass
    recordDistByMatchByClass: function (req, res, next) {
        var match =+req.query.match;
        var runclass=req.query.class;
        if (runclass=='全程'){
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query($sql.recordDistFullByMatch,match, function(err, result) {
                    jtoArrayDist(res,result);
                    connection.release();
                });
            });
        }else if (runclass=='半程'){

            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query($sql.recordDistHalfByMatch,match, function(err, result) {
                    jtoArrayDist(res,result);
                    //jsonWrite(res,result);
                    connection.release();
                });
            });
        } else  console.log("WTF not full or half");    
    },
    /*
    SELECT 
        (select count(*) from user 
        where auto_constellation='水瓶座') as total,
        (SELECT COUNT(*)+1 
            FROM
            (select IDnumber as id from user
            where auto_constellation='水瓶座') as u,
            record
            WHERE
            netrecord<t.min
            and class='半程'
            and record.IDnumber=u.id) as rank,
        t.min as bestTime
    FROM 
        #`record` r, 
        (select MIN(netrecord) min from record rr where rr.IDnumber='530102197011153736' and class='半程') t
    #WHERE IDnumber = '530102197011153736' and class='半程' and netrecord=t.min;

    */    

    //rankingByIDByClass
    rankingByIDByClass:function (req, res, next) {
        var id=req.query.id;
        var group=req.query.class;

        var province = req.query.province;
        var gender = req.query.gender;
        var agelow = req.query.agelow;
        var ageup = req.query.ageup;
        var constellation = req.query.constellation;
        var zodiac = req.query.zodiac;
        var sqlQuery="";
        var sqlUser=db_m+"."+t1_user+" WHERE  1";

        if(province)
            sqlUser+=" and auto_province=\'"+province+"\'";
        if(agelow)
            sqlUser+=" and auto_age>\'"+agelow+"\'";
        if(ageup)
            sqlUser+=" and auto_age<\'"+ageup+"\'";
        if(constellation)
            sqlUser+=" and auto_constellation=\'"+constellation+"\'";
        if(zodiac)
            sqlUser+=" and auto_zodiac=\'"+zodiac+"\'";
        if(gender)
            sqlUser+=" and auto_gender=\'"+gender+"\'";
        if(!province&&!agelow&&!ageup&&!constellation&&!zodiac)
            if(gender)
            sqlQuery=
            "SELECT \
(select count(*) from "+db_m+"."+t1_record+" WHERE gender='"+gender+"' and class='"+group+"') as total, \
(SELECT \
COUNT(*)+1 \
FROM \
"+db_m+"."+t1_record+" as r \
WHERE \
r.netrecord<t.min \
and r.class='"+group+"' \
and r.gender='"+gender+"' \
) as rank, \
t.min as bestTime \
FROM \
(select MIN(netrecord) min from "+db_m+"."+t1_record+" as r where r.IDnumber= '"+id+"' and class= '"+group+"') t";
            else
            sqlQuery=
"SELECT \
(select count(*) from "+db_m+"."+t1_record+" WHERE class='"+group+"') as total, \
(SELECT \
COUNT(*)+1 \
FROM \
"+db_m+"."+t1_record+" as r \
WHERE \
r.netrecord<t.min \
and r.class='"+group+"' \
) as rank, \
t.min as bestTime \
FROM \
(select MIN(netrecord) min from "+db_m+"."+t1_record+" as r where r.IDnumber= '"+id+"' and class= '"+group+"') t";

        else
            sqlQuery="SELECT \
(select count(*) from "+sqlUser+") as total,\
(SELECT \
COUNT(*)+1 \
FROM \
(SELECT IDnumber as id \
 FROM "+sqlUser+" ) as u, \
"+db_m+"."+t1_record+" as r \
WHERE \
r.netrecord<t.min \
and r.class='"+group+"' \
and r.IDnumber=u.id \
) as rank, \
t.min as bestTime \
FROM \
(select MIN(netrecord) min from "+db_m+"."+t1_record+" as r where r.IDnumber= '"+id+"' and class= '"+group+"') t";

        console.log("Ranking Query: ",sqlQuery);
    
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(sqlQuery, [id,group,province,gender,agelow,ageup,constellation,zodiac], function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

	//filter
	filter:function (req, res, next) {
		var province = req.query.province;
		var gender = req.query.gender;
		var agelow = req.query.agelow;
		var ageup = req.query.ageup;
		var constellation = req.query.constellation;
		var zodiac = req.query.zodiac;
		var segment = req.query.segment;
		var sqlQuery="";
		if(segment){
			switch(segment){
				case "gender":
					BY="auto_gender";
					break;
				case "province":
					BY="auto_province";
					break;
				case "age":
					BY="ELT(CEILING(auto_age/10)-1,'11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100')";
					break;
				case "zodiac":
					BY="auto_zodiac";
					break;
				case "constellation":
					BY="auto_constellation";
			}	
			sqlQuery="select a.segment as 'segment', IF(b.number IS NULL , 0, b.number) as number\
			FROM (\
			select "+BY+" as 'segment', count(userid) as number\
			FROM "+db_m+"."+t1_user+" group by segment) a \
			left join (\
			select "+BY+" as 'segment', count(userid) as number\
			FROM "+db_m+"."+t1_user+" where 1 "
		}else
			sqlQuery="select count(*) as number FROM "+db_m+"."+t1_user+" where 1 ";

		if(province)
			sqlQuery+=" and auto_province=\'"+province+"\'";
		if(gender)
			sqlQuery+=" and auto_gender=\'"+gender+"\'";
		if(agelow)
			sqlQuery+=" and auto_age>\'"+agelow+"\'";
		if(ageup)
			sqlQuery+=" and auto_age<\'"+ageup+"\'";
		if(constellation)
			sqlQuery+=" and auto_constellation=\'"+constellation+"\'";
		if(zodiac)
			sqlQuery+=" and auto_zodiac=\'"+zodiac+"\'";
		if(segment)
			sqlQuery+="group by  segment) b on b.segment =a.segment order by segment"
			//sqlQuery+=' group by '+BY;	

		console.log("Filter Query: ",sqlQuery);
	
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(sqlQuery, [segment,province,gender,agelow,ageup,constellation,zodiac], function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
	
	//segment
	segment:function (req, res, next) {
		var dataBy = req.query.by;
		switch(dataBy){
			case "gender":
				BY="auto_gender";
				break;
			case "province":
				BY="auto_province";
				break;
			case "age":
				BY="auto_age";
				break;
			case "zodiac":
				BY="auto_zodiac";
				break;
			case "constellation":
				BY="auto_constellation";
		}
		if(dataBy!="age"){
			var sqlQuery="select "+BY+" as "+dataBy+", count(*) as number FROM "+db_m+"."+t1_user+" group by "+BY;
			//select count(*) as number, auto_gender as gender FROM "+db_m+"."+t1_user+" group by auto_gender
		}else{
			var sqlQuery="SELECT ELT(CEILING("+BY+"/10)-1,'11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100') as 'range', COUNT(*) as 'number' FROM "+db_m+"."+t1_user+" GROUP BY ELT(CEILING("+BY+"/10)-1,'11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100')";
		}
		console.log('Compair Query: ',sqlQuery);
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(sqlQuery,BY, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    //classByID
    classByID: function (req, res, next) {
        var id =req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.classByID,id, function(err, result) {
                jsonWrite(res,result);
                connection.release();
            });
        });
    },

    //medianAge
    medianAge:function (req, res, next) {
        var province = req.query.province;
        var gender = req.query.gender;
        var agelow = req.query.agelow;
        var ageup = req.query.ageup;
        var constellation = req.query.constellation;
        var zodiac = req.query.zodiac;

        var sqlQuery="";
        var sqlFilter="";
        if(province)
            sqlFilter+=" and auto_province=\'"+province+"\'";
        if(gender)
            sqlFilter+=" and auto_gender=\'"+gender+"\'";
        if(agelow)
            sqlFilter+=" and auto_age>\'"+agelow+"\'";
        if(ageup)
            sqlFilter+=" and auto_age<\'"+ageup+"\'";
        if(constellation)
            sqlFilter+=" and auto_constellation=\'"+constellation+"\'";
        if(zodiac)
            sqlFilter+=" and auto_zodiac=\'"+zodiac+"\'";


        sqlQuery="SELECT avg(t1.a) as median FROM ( \
                SELECT @rownum:=@rownum+1 as `row_number`, d.auto_age  as a\
                  FROM "+db_m+"."+t1_user+" d,  (SELECT @rownum:=0) r \
                  WHERE 1 \
                  "+sqlFilter+" \
                  ORDER BY a \
                ) as t1, \
                ( \
                  SELECT count(*) as total_rows \
                  FROM "+db_m+"."+t1_user+" d \
                  WHERE 1 \
                  "+sqlFilter+" \
                ) as t2 \
                WHERE 1 \
                AND t1.row_number in ( floor((total_rows+1)/2), floor((total_rows+2)/2) );";

        console.log("medianAge Query: ",sqlQuery);
    
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(sqlQuery, [province,gender,agelow,ageup,constellation,zodiac], function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //medianRecordByGenderByClass
    medianRecordByGenderByClass:function (req, res, next) {
        var gender = req.query.gender;
        var group= req.query.class;

        var sqlQuery="";
        sqlQuery="SELECT sec_to_time( avg(t1.t)) as median FROM ( \
                SELECT @rownum:=@rownum+1 as `row_number`, time_to_sec(d.netrecord) as t \
                  FROM "+db_m+"."+t1_record+" d,  (SELECT @rownum:=0) r \
                  WHERE 1 \
                  and gender='"+gender+"' \
                  and class='"+group+"' \
                  ORDER BY t \
                ) as t1, \
                ( \
                  SELECT count(*) as total_rows \
                  FROM "+db_m+"."+t1_record+" d \
                  WHERE 1 \
                  and gender='"+gender+"' \
                  and class='"+group+"' \
                ) as t2 \
                WHERE 1 \
                AND t1.row_number in ( floor((total_rows+1)/2), floor((total_rows+2)/2) );";

        console.log("medianRecord Query: ",sqlQuery);
    
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(sqlQuery, [gender,group], function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //networkLocationByMatch
    networkLocationByMatch:function(req,res,next){
        var match=req.query.match;

        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.networkLocationByMatch,match, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });

    }
};