var db_m='SBSMarathon';
var t_user='user';
var t_record='record';
var t_country='countries';
var t_match='match';

var user = {
	//所有比赛信息
    matchAll: "SELECT * FROM "+db_m+"."+t_match+"",

	//个人基本信息 by IDnumber
    userByID: "select * from "+db_m+"."+t_user+" where IDnumber=?",

    //个人基本信息 by 名字
    userByName: "select * from "+db_m+"."+t_user+" where name=?",

    //个人所有参赛成绩 by IDnumber
    recordByID:"select \
		(rank/(select totalNum from "+db_m+"."+t_match+" as mm where r.matchid=mm.matchid)) AS newRank, \
		(time_to_sec(netrecord)/60) as netrecordMins, \
		m.*,r.*\
		from "+db_m+"."+t_record+" as r,"+db_m+"."+t_match+" as m\
		where m.matchid =r.matchid AND r.IDnumber=? \
		order by m.matchdate;",

    //单个比赛 全部信息，包括选手名字
    recordByMatch:"SELECT r.* \
		FROM "+db_m+"."+t_record+" as r\
		WHERE r.matchid=? \
		ORDER BY rank",

    //单个比赛基本信息
    matchByMatch:"SELECT * FROM "+db_m+"."+t_match+" where matchid=? ",

    //单个比赛成绩，Rank排序/200
    recordByMatchInRankOrder:"select * from "+db_m+"."+t_record+" where matchid=? ORDER BY rank limit 200",

    //Pace:分钟/公里；
    getPaceByIDByMatch:"SELECT (time_to_sec(5km)/60)/5 AS '5km', \
		((time_to_sec(10km)-time_to_sec(5km))/60)/5 AS '10km',\
		((time_to_sec(15km)-time_to_sec(10km))/60)/5 AS '15km',\
		((time_to_sec(20km)-time_to_sec(15km))/60)/5 AS '20km',\
		((time_to_sec(25km)-time_to_sec(20km))/60)/5 AS '25km',\
		((time_to_sec(30km)-time_to_sec(25km))/60)/5 AS '30km',\
		((time_to_sec(35km)-time_to_sec(30km))/60)/5 AS '35km',\
		((time_to_sec(40km)-time_to_sec(35km))/60)/5 AS '40km',\
		((time_to_sec(42km)-time_to_sec(40km))/60)/2.195 AS '42.195km' \
		FROM "+db_m+"."+t_record+" \
		where IDnumber=? And matchid=?",
	
	//getSpeed 已有；
	getSpeedByIDByMatch:"",
    //getSpeed:'SELECT (time_to_sec(5km)/60)/5 AS 0to5, ((time_to_sec(10km)-time_to_sec(5km))/60)/5 AS 5to10,((time_to_sec(15km)-time_to_sec(10km))/60)/5 AS 10to15, ((time_to_sec(20km)-time_to_sec(15km))/60)/5 AS 15to20, ((time_to_sec(25km)-time_to_sec(20km))/60)/5 AS 20to25,((time_to_sec(30km)-time_to_sec(25km))/60)/5 AS 25to30, ((time_to_sec(35km)-time_to_sec(30km))/60)/5 AS 30to35, ((time_to_sec(40km)-time_to_sec(35km))/60)/5 AS 35to40, ((time_to_sec(42km)-time_to_sec(40km))/60)/2.195 AS 40to45   FROM "+db_m+"."+t_record+" where IDnumber=? And matchid=?',
    
    //bestTime By ID  GOOD JOB!!!!!!!!!
    bestTimeByIDGroupClass:"select \
    	MIN(netrecord) as minRecord, \
		r.class as class, m.*,r.* \
		from "+db_m+"."+t_record+"  r, "+db_m+"."+t_match+" m \
		where m.matchid =r.matchid  and r.IDnumber=? group by class",
    /*"select m.*,r.* \
		from "+db_m+"."+t_record+" as r, \
			"+db_m+"."+t_match+" as m, \
			(select MIN(netrecord) as min, rr.class as c from "+db_m+"."+t_record+" rr \
				where rr.IDnumber=? group by class) t \
		where m.matchid =r.matchid \
		and netrecord=t.min \
		and class=t.c\
		and r.IDnumber=?",*/

    /*"select m.*,r.* \
		from "+db_m+"."+t_record+" as r,"+db_m+"."+t_match+" as m \
		where m.matchid =r.matchid AND r.IDnumber=? \
		order by netrecord limit 1",*/
    //bestRank By ID
    bestRankByIDGroupClass:"select \
    MIN(rank/(select totalNum \
				from "+db_m+"."+t_match+" as mm \
				where r.matchid=mm.matchid)) AS bestRank, \
		(time_to_sec(netrecord)/60) as netrecordMins,rank,totalNum,m.*,r.* \
	from "+db_m+"."+t_record+"  as r, "+db_m+"."+t_match+" as m \
	where m.matchid =r.matchid AND r.IDnumber=? \
	group by class",
    /*"select \
		(rank/(select totalNum from "+db_m+"."+t_match+" as mm where r.matchid=mm.matchid)) AS newRank,\
		(time_to_sec(netrecord)/60) as netrecordMins,rank,totalNum,m.*,r.*\
		from "+db_m+"."+t_record+" as r,"+db_m+"."+t_match+" as m\
		where m.matchid =r.matchid AND r.IDnumber=? \
		order by newRank limit 10",*/

    avgBestByMatchGroupClass:"select matchid,gender,class,SEC_TO_TIME(std(time_to_sec(netrecord))) as std,\
		SEC_TO_TIME(avg(time_to_sec(netrecord))) as average,\
		SEC_TO_TIME(min(time_to_sec(netrecord))) as minimum \
		from "+db_m+"."+t_record+" \
		where matchid=? \
		group by class, gender",

    avgPaceByIDGroupClass:"SELECT count(IDnumber) counting, sum(time_to_sec(5km))/60/5/count(IDnumber) AS '0-5km',\
		sum(time_to_sec(10km)-time_to_sec(5km))/60/5/count(IDnumber) AS '5-10km',\
		sum(time_to_sec(15km)-time_to_sec(10km))/60/5/count(IDnumber) AS '10-15km',\
		sum(time_to_sec(20km)-time_to_sec(15km))/60/5/count(IDnumber) AS '15-20km',\
		sum(time_to_sec(21km)-time_to_sec(15km))/60/6.1/count(IDnumber) AS '15-21km',\
		sum(time_to_sec(25km)-time_to_sec(20km))/60/5/count(IDnumber) AS '20-25km',\
		sum(time_to_sec(30km)-time_to_sec(25km))/60/5/count(IDnumber) AS '20-30km',\
		sum(time_to_sec(35km)-time_to_sec(30km))/60/5/count(IDnumber) AS '30-35km',\
		sum(time_to_sec(40km)-time_to_sec(35km))/60/5/count(IDnumber) AS '35-40km',\
		sum(time_to_sec(42km)-time_to_sec(40km))/60/2.195/count(IDnumber) AS '40-42.195km',class \
		from "+db_m+"."+t_record+" \
		where IDnumber=? and (5km<>'00:00:00' or 10km<>'00:00:00'or 15km<>'00:00:00' or 20km<>'00:00:00'or 21km<>'00:00:00'or 25km<>'00:00:00'or 30km<>'00:00:00'or 35km<>'00:00:00'or 40km<>'00:00:00'or 42km<>'00:00:00') \
		group by class",


    avgRecordByIDGroupClass:"select count(*) counting, class,\
        sum((rank/(select totalNum from "+db_m+"."+t_match+" where "+t_record+".matchid="+t_match+".matchid)))/count(*) AS avgNewRank,\
        sec_to_time( sum(time_to_sec(netrecord))/count(*)) avgRecord,42.195/(sum(time_to_sec(netrecord))/count(*)/60/60) 'avgSpeed(km/h)',\
        sum(time_to_sec(netrecord))/count(*)/60/42.195 'avgPace(min/km)' \
        from "+db_m+"."+t_record+" \
        where IDnumber=? group by class",
    //recordDistByMatchByClass
    	recordDistFullByMatch:"select gender,count(netrecord) as total,\
        sum(case when netrecord < '02:00:00' then 1 else 0 end) as '肯定bug了',\
        sum(case when netrecord > '02:00:00' and netrecord < '02:30:00' then 1 else 0 end) as '2~2.5hr',\
        sum(case when netrecord > '02:30:00' and netrecord < '03:00:00' then 1 else 0 end) as '2.5~3hr',\
        sum(case when netrecord > '03:00:00' and netrecord < '03:30:00' then 1 else 0 end) as '3~3.5hr',\
        sum(case when netrecord > '03:30:00' and netrecord < '04:00:00' then 1 else 0 end) as '3.5~4hr',\
        sum(case when netrecord > '04:00:00' and netrecord < '04:30:00' then 1 else 0 end) as '4~4.5hr',\
        sum(case when netrecord > '04:30:00' and netrecord < '05:00:00' then 1 else 0 end) as '4.5~5hr',\
        sum(case when netrecord > '05:00:00' and netrecord < '05:30:00' then 1 else 0 end) as '5~5.5hr',\
        sum(case when netrecord > '05:30:00' and netrecord < '06:00:00' then 1 else 0 end) as '5.5~6hr',\
        sum(case when netrecord > '06:00:00'  then 1 else 0 end) as '6hr~'\
        from "+db_m+"."+t_record+" \
		where matchid =? and class='全程' \
		group by gender;",
    	recordDistHalfByMatch:"select gender ,count(netrecord) as total,\
        sum(case when netrecord < '01:00:00' then 1 else 0 end) as '竟然不是bug',\
        sum(case when netrecord > '01:00:00' and netrecord < '01:15:00' then 1 else 0 end) as '1~1.25hr',\
        sum(case when netrecord > '01:15:00' and netrecord < '01:30:00' then 1 else 0 end) as '1.25~1.5hr',\
        sum(case when netrecord > '01:30:00' and netrecord < '01:45:00' then 1 else 0 end) as '1.5~1.75hr',\
        sum(case when netrecord > '01:45:00' and netrecord < '02:00:00' then 1 else 0 end) as '1.75~2hr',\
        sum(case when netrecord > '02:00:00' and netrecord < '02:15:00' then 1 else 0 end) as '2~2.25hr',\
        sum(case when netrecord > '02:15:00' and netrecord < '02:30:00' then 1 else 0 end) as '2.25~2.5hr',\
        sum(case when netrecord > '02:30:00' and netrecord < '02:45:00' then 1 else 0 end) as '2.5~2.75hr',\
        sum(case when netrecord > '02:45:00' and netrecord < '03:00:00' then 1 else 0 end) as '2.75~2hr',\
        sum(case when netrecord > '03:00:00'  then 1 else 0 end) as '3hr~'\
        from "+db_m+"."+t_record+" \
		where matchid =? and class='半程' \
		group by gender;",
	//rankingByIDByClass
	rankingByIDByClass:"",
	filter:"",
	segment:"",
	classByID:"select class from "+db_m+"."+t_record+" where IDnumber=? group by class",
	medianAge:"",
	medianRecordByGenderByClass:"",
	networkLocationByMatch:"select count(u.auto_province) as counts,u.auto_province as location\
		from "+db_m+"."+t_user+" u join "+db_m+"."+t_record+" as r on u.IDnumber=r.IDnumber and r.matchid=? \
		group by u.auto_province order by counts",
	classCountByID:"select class, count(*) as number from "+db_m+"."+t_record+" where IDnumber=? group by class",
	fakeComingMatch:"SELECT * FROM SBSMarathon.2017match",
	finishersByMatch:""//4hr Finishers


};

module.exports = user;