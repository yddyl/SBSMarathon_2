var mysql = require('mysql');
var $db = require('../db');
var $sql = require('../sqlMapping');

var db_m='SBSMarathon';
var t1_user='user';
var t1_record='record';
var t1_match='match';
var t1_login='login';
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
            var gender
            for (var i in data) {
                title = i;
                content = data[i];
                if (i != "class"&& i!="total"&& i!="gender") {
                    var time = title;
                    var value = content;
                    //data[i] = {time, value};
                    dist.push({time, value});
                }else if(i == "class"){
                    Class=data[i];
                }else if(i == "total"){
                    total=data[i];
                }else if(i == "gender"){
                    gender=data[i];
                }
            }
            temp.push({Class,total,gender,dist});
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
            console.log("quanchenga ");
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
        var netrecordHigher=req.query.netrecordHigher;
        var netrecordLower=req.query.netrecordLower;
        var mclass=req.query.class;
		var segment = req.query.segment;
        var match=req.query.match;
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
					BY="ELT(CEILING(auto_age/10),'0-10','11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100')";
					break;
                case "netrecord":
                    BY="ELT(CEILING(time_to_sec(netrecord)/60/60-0.5),'0-1.5','1.5-2.5','2.5-3.5','3.5-4.5',\
                        '4.5-5.5','5.5-6.5','6.5-7.5','7.5-8.5','8.5-9.5','9.5-10.5','10.5-11.5','11.5-12.5',\
                        '12.5-13.5','13.5-14.5','14.5-15.5','15.5-16.5','16.5-17.5','17.5-18.5','18.5-19.5',\
                        '19.5-20.5','20.5-21.5','21.5-22.5','22.5-23.5','23.5-24.5')";
                    break;
				case "zodiac":
					BY="auto_zodiac";
					break;
				case "constellation":
					BY="auto_constellation";
                    break;
                default:
                    BY="null";
                    console.log('Filter Query: segment=something wrong');
			}	
			/*sqlQuery="select a.segment as 'segment', IF(b.number IS NULL , 0, b.number) as number\
			FROM (\
			select "+BY+" as 'segment', count(userid) as number\
			FROM "+db_m+"."+t1_user+", "+db_m+"."+t1_record+" group by segment) a \
			left join (\*/
			sqlQuery=" select "+BY+" as 'segment', count(userid) as number\
			FROM "+db_m+"."+t1_user+" u, "+db_m+"."+t1_record+" r where 1  and u.IDnumber=r.IDnumber ";
            /*if(match)
                sqlQuery+=", "+db_m+"."+t1_record+" r ";

            sqlQuery+=" where 1 ";*/
		}else
			sqlQuery=" select count(*) as number FROM "+db_m+"."+t1_user+" where 1 ";

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
        if(netrecordHigher)
            sqlQuery+=" and time_to_sec(netrecord)/60/60>\'"+netrecordHigher+"\'";
        if(netrecordLower)
            sqlQuery+=" and time_to_sec(netrecord)/60/60<\'"+netrecordLower+"\'";
        if(mclass)
            sqlQuery+=" and class=\'"+mclass+"\'";
        if(match)
            sqlQuery+=" and matchid=\'"+match+"\' and u.IDnumber=r.IDnumber ";
		if(segment)
			sqlQuery+=" group by  segment";//) b on b.segment =a.segment order by segment";
			//sqlQuery+=' group by '+BY;	

		console.log("Filter Query: ",sqlQuery);
        /* EXAMPLE:
        select a.segment as 'segment', IF(b.number IS NULL , 0, b.number) as number
        FROM (
            select auto_constellation as 'segment', count(userid) as number
            FROM user group by segment) a 
        left join (
                select auto_constellation as 'segment', count(userid) as number
                FROM user u, record r where 1
                and matchid=28
                and u.IDnumber=r.IDnumber
                    and auto_gender='男'
                    group by  segment) b on b.segment =a.segment order by segment
        */
	
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
				BY="ELT(CEILING(auto_age/10),'0-10','11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100')";
				break;
			case "zodiac":
				BY="auto_zodiac";
				break;
            case "netrecord":
                BY="ELT(CEILING(time_to_sec(netrecord)/60/60-0.5),'0-1.5','1.5-2.5','2.5-3.5','3.5-4.5',\
                    '4.5-5.5','5.5-6.5','6.5-7.5','7.5-8.5','8.5-9.5','9.5-10.5','10.5-11.5','11.5-12.5',\
                    '12.5-13.5','13.5-14.5','14.5-15.5','15.5-16.5','16.5-17.5','17.5-18.5','18.5-19.5',\
                    '19.5-20.5','20.5-21.5','21.5-22.5','22.5-23.5','23.5-24.5')";
                break;
			case "constellation":
				BY="auto_constellation";
                break;
            default:
                BY="null";
                console.log('Segment Query: BY=something wrong');
		}
		//if(dataBy!="age"){
			var sqlQuery="select "+BY+" as "+dataBy+", count(*) as number FROM "+db_m+"."+t1_user+" u, "+db_m+"."+t1_record+" r where 1  and u.IDnumber=r.IDnumber group by "+BY;
			//select count(*) as number, auto_gender as gender FROM "+db_m+"."+t1_user+" group by auto_gender
		/*}else{
			var sqlQuery="SELECT ELT(CEILING("+BY+"/10)-1,'11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100') as 'range', COUNT(*) as 'number' FROM "+db_m+"."+t1_user+" GROUP BY ELT(CEILING("+BY+"/10)-1,'11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100')";
		}*/
		console.log('Segment Query: ',sqlQuery);
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
    },
    //classCountByID
    classCountByID:function(req,res,next){
        var id=req.query.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.classCountByID,id, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //fakeComingMatch
    fakeComingMatch:function(req,res,next){
        var id=req.query.id;

        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query($sql.fakeComingMatch,id, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //Match by segment
    match:function (req, res, next) {
        var dataBy = req.query.by;
        switch(dataBy){
            case "year":
                BY="matchyear";
                break;
            case "city":
                BY="matchcity";
                break;
            case "totalNumber":
                BY="ELT(CEILING(totalNum/5000),'0-5k','5k-10k','10k-15k','15k-20k','20k-25k','25k-30k','30k-35k','35k-40k','40k-45k','45k-50k','50k-55k','55k-60k','60k-65k')";
                break;
            default:
                BY="null";
                console.log('match Query: BY=something wrong');
        }
        //if(dataBy!="age"){
            var sqlQuery="select "+BY+" as "+dataBy+", count(*) as number FROM "+db_m+"."+t1_match+" m where 1 group by "+dataBy;
            //select count(*) as number, auto_gender as gender FROM "+db_m+"."+t1_user+" group by auto_gender
        /*}else{
            var sqlQuery="SELECT ELT(CEILING("+BY+"/10)-1,'11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100') as 'range', COUNT(*) as 'number' FROM "+db_m+"."+t1_user+" GROUP BY ELT(CEILING("+BY+"/10)-1,'11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100')";
        }*/
        console.log('match Query: ',sqlQuery);
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(sqlQuery,BY, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    //avgSpeed
    avgSpeed:function (req, res, next) {
        var dataBy = req.query.by;
        var mclass=req.query.class;
        var BY;
        switch(dataBy){
            case "zodiac":
                BY="auto_zodiac";
                break;
            case "constellation":
                BY="auto_constellation";
                break;
            case "province":
                BY="auto_province";
                break;
            case "age":
                BY="ELT(CEILING(auto_age/10),'0-10','11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100')";
                break;
            default:
                BY="null";
                console.log('speed Query: BY=something wrong');
        }
        if(!mclass)
            mclass='全程';

        var sqlQuery="select sec_to_time( sum(time_to_sec( r.netrecord))/count(*)) as avrg,count(*) count, "+BY+" as "+dataBy+" \
                    from "+db_m+"."+t1_user+" u join "+db_m+"."+t1_record+" r on u.IDnumber=r.IDnumber where r.class= '"+mclass+"' group by "+dataBy+" order by avrg"
            
        console.log('match Query: ',sqlQuery);
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(sqlQuery,BY, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    /*
    select sec_to_time( sum(time_to_sec( r.netrecord))/count(*)) as avrg, auto_constellation 
from user u join record r on u.IDnumber=r.IDnumber group by auto_constellation order by avrg
*/
//nearByRecord
    nearByRecord:function (req, res, next) {
            var id=req.query.id;
            var mclass=req.query.class;
            var recordup=req.query.recordup*60;
            var recordlow=req.query.recordlow*60;
            var byAge=req.query.byage;
            var byGender=req.query.bygender;
            var byProvince=req.query.byprovince;
            var byConstellation=req.query.byconstellation;
            var byZodiac=req.query.byzodiac;
            var matchid=req.query.matchid;
            var gender=req.query.gender;
            var SHOW="";
            var BY="";
            var match="";
            if(!mclass)
                mclass='全程';
            if(!recordup)
                recordup=900;
            if(!recordlow)
                recordlow=900;

            if(byAge){
                BY+=" and u.auto_age<CEILING(temp.age/10)*10 and u.auto_age>ceiling((temp.age-10)/10)*10 ";
                SHOW+=",u.auto_age age ";
            }if(byGender){
                BY+=" and u.auto_gender=temp.gender ";
                SHOW+=",u.auto_gender gender ";
            }if(byProvince){
                BY+=" and u.auto_province=temp.province ";
                SHOW+=",u.auto_province province ";
            }if(byConstellation){
                BY+=" and u.auto_constellation=temp.constellation ";
                SHOW+=",u.auto_constellation constellation ";
            }if(byZodiac){
                BY+=" and u.auto_zodiac=temp.zodiac ";
                SHOW+=",u.auto_zodiac zodiac ";
            }if(gender){
                BY+=" and u.auto_gender='"+gender+"' ";
                SHOW+=",u.auto_gender gender ";
            }
            if(matchid)
                match=" and matchid='"+matchid+"'";

            var sqlQuery="select u.IDnumber, sec_to_time( r.avgRecord) avgRecord "+SHOW+" \
                from "+db_m+"."+t1_user+" u, \
                    (select IDnumber, sum(time_to_sec(netrecord))/count(*) avgRecord \
                        from "+db_m+"."+t1_record+" r \
                        where class='"+mclass+"' \
                        "+match+" \
                        group by IDnumber) r, \
                    (select sum(time_to_sec(netrecord))/count(*) baseRecord, \
                        u.auto_age age, \
                        u.auto_gender gender, \
                        u.auto_province province, \
                        u.auto_constellation constellation, \
                        u.auto_zodiac zodiac \
                    from "+db_m+"."+t1_record+" r, "+db_m+"."+t1_user+" u \
                    where r.IDnumber='"+id+"' \
                        and u.IDnumber=r.IDnumber \
                        and class='"+mclass+"') temp \
                where \
                    r.avgRecord-temp.baseRecord<"+recordlow+" \
                    and temp.baseRecord-r.avgRecord<"+recordup+" \
                    and u.IDnumber=r.IDnumber \
                    "+BY+" \
                order by avgRecord ";

            console.log('nearByRecord Query: ',sqlQuery);
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(sqlQuery,BY, function(err, result) {
                    jsonWrite(res, result);
                    connection.release();
                });
            });
        },
            //medianRecordByGenderByClass
    authenticate:function (req, res, next) {
        var username = req.query.username;
        //var group= req.query.class;

        var sqlQuery="";
        sqlQuery="SELECT * FROM "+db_m+"."+t1_login+" l where username=\'"+username+"\';";

        console.log("authenticate Query: ",sqlQuery);
    
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(sqlQuery, username, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    register:function (req, res, next) {
        
        for (var i in req.query){
            if(req.query[i]=='')
                req.query[i]=null;
        }
        time=(new Date()).toISOString().substring(0, 19).replace('T', ' ');//2015-07-23 11:26:00
        
        var sqlQuery="INSERT INTO "+db_m+"."+t1_login+" set ? ";
        var post  = {
            username: req.query.username, 
            password: req.query.password,
            loginemail: req.query.email,
            loginphone: req.query.phone,
            loginlastname: req.query.lastname,
            loginfirstname: req.query.firstname,
            };
            post.registertime=time;
            post.updatetime=time;

        /*
        var sqlInsertNeiRong= "\'"+username+"\', "+"\'"+password+"\'";
        sqlInsertNeiRong+=",";
        if(email)
            sqlInsertNeiRong+=" \'"+email+"\'";
        sqlInsertNeiRong+=",";
        if(phone)
            sqlInsertNeiRong+=" \'"+phone+"\'";
        sqlInsertNeiRong+=",";
        if(lastname)
            sqlInsertNeiRong+=" \'"+lastname+"\'";
        sqlInsertNeiRong+=",";
        if(firstname)
            sqlInsertNeiRong+=" \'"+firstname+"\'";
        */

        //sqlQuery="INSERT INTO "+db_m+"."+t1_login+" l VALUES("+sqlInsertNeiRong+");";

        console.log("authenticate Query: ",sqlQuery);
    
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            console.log("inserted");
    
            connection.query(sqlQuery, post, function(err, result) {
                if (err) {
                    console.log("mylog : facebook connect error");
                    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                        //handle disconnect
                    } else if (err.code === 'ER_DUP_ENTRY') {
                        console.log("mylog : fb ER_DUP_ENTRY detected");
                        // release connection created with pool.getConnection
                        if (connection) connection.release();
                        // req.flash to set flashdata using connect-flash
                        jsonWrite(res, err.message);
                        //return done(err, false, req.flash('loginMessage', 'Facebook ID registered to another user.')); 
                    } 
                }
                else { //continue 
                        jsonWrite(res, 'success insert');
                }
            });
        });
    },
    update:function (req, res, next) {      
        var sqlQuery="UPDATE "+db_m+"."+t1_login+" SET ? WHERE username= \'"+req.query.username+"\'";
                
        var post = {};
        for (var i in req.query){
            if(req.query[i]!=''){
                //var name=req.query[i].name;
                // Object.keys(myVar)[0];
                console.log("hhhh: "+ i);
                if(i=='username')
                    ii='username';
                if(i=='password')
                    ii='password';
                if(i=='email')
                    ii='loginemail';
                if(i=='phone')
                    ii='loginphone';
                if(i=='lastname')
                    ii='loginlastname';
                if(i=='firstname')
                    ii='loginfirstname';
                post[ii]=req.query[i];                
            }
        }
        time=(new Date()).toISOString().substring(0, 19).replace('T', ' ');//2015-07-23 11:26:00;
        post.updatetime=time;
        console.log(post);

        // if(email)
        //     sqlInsertNeiRong+=" \'"+email+"\'";
        // sqlInsertNeiRong+=",";
        // if(phone)
        //     sqlInsertNeiRong+=" \'"+phone+"\'";
        // sqlInsertNeiRong+=",";
        // if(lastname)
        //     sqlInsertNeiRong+=" \'"+lastname+"\'";
        // sqlInsertNeiRong+=",";
        // if(firstname)
        //     sqlInsertNeiRong+=" \'"+firstname+"\'";

        // var post  = {
        //     username: req.query.username, 
        //     password: req.query.password,
        //     //loginemail: null,
        //     loginphone: req.query.phone,
        //     loginlastname: req.query.lastname,
        //     loginfirstname: req.query.firstname
        //     };
        console.log("update Query: ",sqlQuery);
    
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            console.log("updated");
    
            connection.query(sqlQuery, post, function(err, result) {
                if (err) {
                    console.log("mylog : facebook connect error");
                    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                        //handle disconnect
                    } else if (err.code === 'ER_DUP_ENTRY') {
                        console.log("mylog : fb ER_DUP_ENTRY detected");
                        // release connection created with pool.getConnection
                        if (connection) connection.release();
                        // req.flash to set flashdata using connect-flash
                        jsonWrite(res, err.message);
                        //return done(err, false, req.flash('loginMessage', 'Facebook ID registered to another user.')); 
                    } else throw err;
                }else { //continue 
                        jsonWrite(res, 'success update');
                }
                //jsonWrite(res, result);
                /*
                if(err) {
                    if(err=="ER")
                    throw err;
                console.log("1 inserted!")
                connection.release();
                */
            });
        });
    },
/*
select u.IDnumber, sec_to_time( r.avgRecord) avgRecord, u.auto_gender gender #u.auto_age #u.auto_zodiac
from user u,
    (select IDnumber, sum(time_to_sec(netrecord))/count(*) avgRecord
        from record r
        where class='全程' 
        group by IDnumber) r,
        #on r.IDnumber=u.IDnumber

    (select sum(time_to_sec(netrecord))/count(*) baseRecord,
        u.auto_gender gender,
        u.auto_age age,
        u.auto_constellation constellation,
        u.auto_province province,
        u.auto_zodiac zodiac
    from record r, user u
    where r.IDnumber='530102197011153736' 
        and u.IDnumber=r.IDnumber 
        and class='全程') temp
    #user u
where
    r.avgRecord-temp.baseRecord<900 
    and temp.baseRecord-r.avgRecord<900
    and u.IDnumber=r.IDnumber
    #and u.auto_province=temp.province
    #and u.auto_gender=temp.gender
    #and u.auto_age<CEILING(temp.age/10)*10 and u.auto_age>ceiling((temp.age-10)/10)*10
    #and u.auto_zodiac=temp.zodiac
    #and u.auto_constellation=temp.constellation
order by avgRecord

select u.IDnumber, sec_to_time( r.avgRecord) avgRecord, u.auto_age age, u.auto_gender gender, u.auto_province province, u.auto_constellation constellation, u.auto_zodiac zodiac 
from user u, 
    (select IDnumber, sum(time_to_sec(netrecord))/count(*) avgRecord 
        from record r 
        where class='全程' 
        group by IDnumber) r, 
    (select sum(time_to_sec(netrecord))/count(*) baseRecord, 
        u.auto_age age, 
        u.auto_gender gender, 
        u.auto_province province, 
        u.auto_constellation constellation, 
        u.auto_zodiac zodiac 
    from record r, user u 
    where r.IDnumber='530102197011153736' 
        and u.IDnumber=r.IDnumber 
        and class='全程') temp 
where 
    r.avgRecord-temp.baseRecord<900 
    and temp.baseRecord-r.avgRecord<900 
    and u.IDnumber=r.IDnumber 
    #and u.auto_age<CEILING(temp.age/10)*10 and u.auto_age>ceiling((temp.age-10)/10)*10 
    #and u.auto_gender=temp.gender 
    #and u.auto_province=temp.province 
    #and u.auto_constellation=temp.constellation 
    #and u.auto_zodiac=temp.zodiac 
order by avgRecord
*/


};