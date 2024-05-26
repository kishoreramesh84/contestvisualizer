const express = require('express');
const app = express();
const bodyParser=require('body-parser');
const request=require('request');

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

function getTIMESTAMP() 
{
  var date = new Date();
  date.setHours(date.getHours()-5);
  date.setMinutes(date.getMinutes()-30)
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).substr(-2);
  var day = ("0" + date.getDate()).substr(-2);
  var hour = ("0" + date.getHours()).substr(-2);
  var minutes = ("0" + date.getMinutes()).substr(-2);
  var seconds = ("0" + date.getSeconds()).substr(-2);

  return year + "-" + month + "-" + day + "T" + hour + ":" + minutes + ":" + seconds;
}

function secondsToDhms(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600*24));
	var h = Math.floor(seconds % (3600*24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);

	var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

function compare(a,b)
{
	var dateA = new Date(a.start).getTime(); 
	var dateB = new Date(b.start).getTime(); 
	return dateA > dateB ? 1 : -1;  
}

function convert(temp)
{
	var d=""+temp.slice(0,10)+" "+temp.slice(11);
	d=new Date(d);
	return d.toString();
}

app.get('/',function(req,res){
	
	var navigate=getTIMESTAMP();


	var options={
		url: "https://clist.by:443/api/v1/contest/?order_by=-start",
		method: "GET",
		qs:{
			username:"kishoreram",
			api_key:"60490b3a0bd629f18b2656d56dfc056dde21cc27",
			resource__id:"102",
			limit:10
		}
	}

	var activeContest=[]
	var upcomingContest=[]
	var pastContest=[]
	request(options,function(error,response,body){
		console.log(error);
		console.log(response.statusCode);
		if(response.statusCode !== 200)
		{
			res.sendFile(__dirname+"/ErrorPage.html");
		}else {
		var jsonType=JSON.parse(body);
		for(var i=0;i<jsonType.objects.length;i++)
		{
			jsonType.objects[i].duration=secondsToDhms(jsonType.objects[i].duration);
			if(jsonType.objects[i].start > navigate)
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				upcomingContest.push(jsonType.objects[i]);
			}
			else if(jsonType.objects[i].start <= navigate && navigate <= jsonType.objects[i].end)
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				activeContest.push(jsonType.objects[i]);
			}
			else
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				pastContest.push(jsonType.objects[i]);
			}
		}
		activeContest.sort(compare);
		upcomingContest.sort(compare);
		res.render('basePage',{AC:activeContest,UC:upcomingContest,PC:pastContest,page_name:'Leetcode',Currentimg:"https://leetcode.com/static/images/LeetCode_logo.png"});
	}});
});



app.get('/codeforces',function(req,res){
	var navigate=getTIMESTAMP();

	var options={
		url: "https://clist.by:443/api/v1/contest/?order_by=-start",
		method: "GET",
		qs:{
			username:"kishoreram",
			api_key:"60490b3a0bd629f18b2656d56dfc056dde21cc27",
			resource__id:"1",
			limit:10
		}
	}

	var activeContest=[]
	var upcomingContest=[]
	var pastContest=[]
	request(options,function(error,response,body){
		if(response.statusCode !== 200)
		{
			res.sendFile(__dirname+"/ErrorPage.html");
		}else {
		var jsonType=JSON.parse(body);
		for(var i=0;i<jsonType.objects.length;i++)
		{
			jsonType.objects[i].duration=secondsToDhms(jsonType.objects[i].duration);
			if(jsonType.objects[i].start > navigate)
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				upcomingContest.push(jsonType.objects[i]);
			}
			else if(jsonType.objects[i].start <= navigate && navigate <= jsonType.objects[i].end)
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				activeContest.push(jsonType.objects[i]);
			}
			else
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				pastContest.push(jsonType.objects[i]);
			}
		}
		activeContest.sort(compare);
		upcomingContest.sort(compare);
		res.render('basePage',{AC:activeContest,UC:upcomingContest,PC:pastContest,page_name:'Codeforces',Currentimg:"https://is3-ssl.mzstatic.com/image/thumb/Purple123/v4/40/e8/23/40e823e3-440c-00d3-9df2-e92c75abe447/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/246x0w.png"});
	}});
});


app.get('/hackerearth',function(req,res){
	var navigate=getTIMESTAMP();
	var options={
		url: "https://clist.by:443/api/v1/contest/?order_by=-start",
		method: "GET",
		qs:{
			username:"kishoreram",
			api_key:"60490b3a0bd629f18b2656d56dfc056dde21cc27",
			resource__id:"73",
			limit:15
		}
	}

	var activeContest=[]
	var upcomingContest=[]
	var pastContest=[]
	request(options,function(error,response,body){
		// console.log(error);
		// console.log(response.statusCode);
		if(response.statusCode !== 200)
		{
			res.sendFile(__dirname+"/ErrorPage.html");
		}else {
		var jsonType=JSON.parse(body);
		for(var i=0;i<jsonType.objects.length;i++)
		{
			jsonType.objects[i].duration=secondsToDhms(jsonType.objects[i].duration);
			if(jsonType.objects[i].start > navigate)
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				upcomingContest.push(jsonType.objects[i]);
			}
			else if(jsonType.objects[i].start <= navigate && navigate <= jsonType.objects[i].end)
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				activeContest.push(jsonType.objects[i]);
			}
			else
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				pastContest.push(jsonType.objects[i]);
			}
		}
		activeContest.sort(compare);
		upcomingContest.sort(compare);
		res.render('basePage',{AC:activeContest,UC:upcomingContest,PC:pastContest,page_name:'Hackerearth',Currentimg:"https://avatars3.githubusercontent.com/u/3033794?s=280&v=4"});
	}});

});

app.get('/codechef',function(req,res){
	var navigate=getTIMESTAMP();

	var options={
		url: "https://clist.by:443/api/v1/contest/?order_by=-start",
		method: "GET",
		qs:{
			username:"kishoreram",
			api_key:"60490b3a0bd629f18b2656d56dfc056dde21cc27",
			resource__id:"2",
			limit:20
		}
	}

	var activeContest=[]
	var upcomingContest=[]
	var pastContest=[]
	request(options,function(error,response,body){
		console.log(error);
		console.log(response.statusCode);
		if(response.statusCode !== 200)
		{
			res.sendFile(__dirname+"/ErrorPage.html");
		}else {
		var jsonType=JSON.parse(body);
		for(var i=0;i<jsonType.objects.length;i++)
		{
			jsonType.objects[i].duration=secondsToDhms(jsonType.objects[i].duration);
			if(jsonType.objects[i].start > navigate)
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				upcomingContest.push(jsonType.objects[i]);
			}
			else if(jsonType.objects[i].start <= navigate && navigate <= jsonType.objects[i].end)
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				activeContest.push(jsonType.objects[i]);
			}
			else
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				pastContest.push(jsonType.objects[i]);
			}
		}
		activeContest.sort(compare);
		upcomingContest.sort(compare);
		res.render('basePage',{AC:activeContest,UC:upcomingContest,PC:pastContest,page_name:'Codechef',Currentimg:"https://is3-ssl.mzstatic.com/image/thumb/Purple123/v4/40/e8/23/40e823e3-440c-00d3-9df2-e92c75abe447/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/246x0w.png"});
	}});
});

app.get('/hackerrank',function(req,res){
	var navigate=getTIMESTAMP();

	var options={
		url: "https://clist.by:443/api/v1/contest/?order_by=-start",
		method: "GET",
		qs:{
			username:"kishoreram",
			api_key:"60490b3a0bd629f18b2656d56dfc056dde21cc27",
			resource__id:"63",
			limit:10
		}
	}

	var activeContest=[]
	var upcomingContest=[]
	var pastContest=[]
	request(options,function(error,response,body){
		// console.log(error);
		// console.log(response.statusCode);
		if(response.statusCode !== 200)
		{
			res.sendFile(__dirname+"/ErrorPage.html");
		}else {
		var jsonType=JSON.parse(body);
		for(var i=0;i<jsonType.objects.length;i++)
		{
			jsonType.objects[i].duration=secondsToDhms(jsonType.objects[i].duration);
			if(jsonType.objects[i].start > navigate)
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				upcomingContest.push(jsonType.objects[i]);
			}
			else if(jsonType.objects[i].start <= navigate && navigate <= jsonType.objects[i].end)
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				activeContest.push(jsonType.objects[i]);
			}
			else
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				pastContest.push(jsonType.objects[i]);
			}
		}
		activeContest.sort(compare);
		upcomingContest.sort(compare);
		res.render('basePage',{AC:activeContest,UC:upcomingContest,PC:pastContest,page_name:'Hackerrank',Currentimg:"https://is3-ssl.mzstatic.com/image/thumb/Purple123/v4/40/e8/23/40e823e3-440c-00d3-9df2-e92c75abe447/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/246x0w.png"});
	}});
});

app.get('/atcoder',function(req,res){
	var navigate=getTIMESTAMP();

	var options={
		url: "https://clist.by:443/api/v1/contest/?order_by=-start",
		method: "GET",
		qs:{
			username:"kishoreram",
			api_key:"60490b3a0bd629f18b2656d56dfc056dde21cc27",
			resource__id:"93",
			limit:10
		}
	}

	var activeContest=[]
	var upcomingContest=[]
	var pastContest=[]
	request(options,function(error,response,body){
		// console.log(error);
		// console.log(response.statusCode);
		if(response.statusCode !== 200)
		{
			res.sendFile(__dirname+"/ErrorPage.html");
		}else {
		var jsonType=JSON.parse(body);
		for(var i=0;i<jsonType.objects.length;i++)
		{
			jsonType.objects[i].duration=secondsToDhms(jsonType.objects[i].duration);
			if(jsonType.objects[i].start > navigate)
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				upcomingContest.push(jsonType.objects[i]);
			}
			else if(jsonType.objects[i].start <= navigate && navigate <= jsonType.objects[i].end)
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				activeContest.push(jsonType.objects[i]);
			}
			else
			{
				jsonType.objects[i].start += " UTC";
				var temp=jsonType.objects[i].start;
				jsonType.objects[i].start=convert(temp);
				var temp1=jsonType.objects[i].end += " UTC";
				jsonType.objects[i].end=convert(temp1);
				pastContest.push(jsonType.objects[i]);
			}
		}
		activeContest.sort(compare);
		upcomingContest.sort(compare);
		res.render('basePage',{AC:activeContest,UC:upcomingContest,PC:pastContest,page_name:'Atcoder',Currentimg:"https://is3-ssl.mzstatic.com/image/thumb/Purple123/v4/40/e8/23/40e823e3-440c-00d3-9df2-e92c75abe447/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/246x0w.png"});
	}});
});


app.listen(process.env.PORT || 3000,function(){
	console.log("server started");
})

//username=kishoreram&api_key=60490b3a0bd629f18b2656d56dfc056dde21cc27