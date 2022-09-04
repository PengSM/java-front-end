var http=require("http");        //网络请求
var fs=require("fs");            //操作文件，读写文件
var cheerio=require("cheerio");  //扩展模块

const wz = "http://www.gd.gov.cn";

var strHtml="";
var results=[];
http.get(wz,function(res){
    res.on("data",function(chunk){
        strHtml+=chunk;
    })
    res.on("end",function(){

        //console.log(strHtml);

        ("#channel-all li").each((iten,i)=>{
            console.log($(i).text());
        })
    });
})