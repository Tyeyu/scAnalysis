<template>
  <div>
    <div id="Relation" class="Relationship-angel"></div>
    <div id="Rtooltip"></div>
  </div>
</template>
<script>
//传染关系图
import * as d3 from "d3";

export default {
  data() {
    return {
      chartdata: null,
      chartSvgwidth: null,
      chartSvgheight: null,
      xaxiesdata: null
      // chartXscale: null,
      // chartYscal: null,
      // chartXaxies: null,
      // chartYaxies: null
    };
  },
  methods: {
    Readdata: function() {
      let that = this;
      d3.csv("../../static/testdata.csv")
        .then(function(data) {})
        .catch(function(error) {});
    },
    setXaxisdata: function() {
      let that = this;
      var xdmap = d3.map();
      for (var i = 0; i < this.chartdata.length; i++) {
        if (that.chartdata[i].onsetTime != "") {
          xdmap.set(that.chartdata[i].onsetTime, 0);
        }
        if (that.chartdata[i].treatmentTime != "") {
          xdmap.set(that.chartdata[i].treatmentTime);
        }
        if (that.chartdata[i].healingTime != "") {
          xdmap.set(that.chartdata[i].healingTime, 0);
        }
        if (that.chartdata[i].diagnosisTime != "") {
          xdmap.set(that.chartdata[i].diagnosisTime, 0);
        }
        if (that.chartdata[i].relationTime != "") {
          xdmap.set(that.chartdata[i].relationTime, 0);
        }
      }
      this.xaxiesdata = xdmap.keys();
      this.xaxiesdata = this.xaxiesdata.sort(function(a, b) {
        var da = parseInt(a.split("/")[1]);
        var daa = parseInt(a.split("/")[2]);
        var db = parseInt(b.split("/")[1]);
        var dbb = parseInt(b.split("/")[2]);

        return da < db ? -1 : da > db ? 1 : daa < dbb ? -1 : 1;
      });
    },
    //初始化图表基础配置
    initchartSet: function() {
      let that = this;
      this.chartSvgwidth = document.getElementById("Relation").clientWidth - 10;
      this.chartSVgheight =
        document.getElementById("Relation").clientHeight - 10;

      // this.data=
    },
    //初始化图表
    initchart: function(data) {
      let that = this;
      var chartXscale = d3
        .scaleTime()
        .domain([
          new Date(that.xaxiesdata[0]),
          new Date(that.$store.getters.gettimeRange[1])
        ])

        .range([0, that.chartSvgwidth - 30]);
      var chartYscal = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(this.chartdata, function(d, i) {
            return parseInt(i) + 1;
          })
        ])
        .range([this.chartSVgheight - 30, 1]);
      // console.log(that.chartdata[0].value);
      // console.log(chartYscal(10));
      var chartXaxies = d3.axisBottom(chartXscale).ticks(5);
      var chartYaxies = d3.axisLeft(chartYscal).ticks(5);

      var mode = "light";
      const svg = d3
        .select("#Relation")
        .append("svg")
        .attr("width", that.chartSvgwidth)
        .attr("height", that.chartSVgheight);
      //坐标轴
      svg
        .append("g")

        .attr("transform", "translate(30," + (that.chartSVgheight - 20) + ")")
        .attr("class", "axis")
        .attr("stroke", "white")
        .call(chartXaxies);
      svg
        .append("g")
        .attr("transform", "translate(30,10)")
        .attr("class", "axis")
        .attr("stroke", "white")
        .call(chartYaxies);
      //确诊
      svg
        .append("g")
        .attr("class", "qcircle")
        .selectAll("circle")
        .data(that.chartdata)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("transform", "translate(30,10)")
        .style("fill", "#FF0E0E")
        .style("cursor", "pointer")
        .attr("cy", function(d, i) {
          return chartYscal(parseInt(i + 1));
        })
        .attr("cx", function(d) {
          return chartXscale(new Date(d.diagnosisTime));
        })
        .on("mouseover", function(d) {
          d3.select("#Rtooltip")
            .style("display", "inline")
            .html("确诊日期:" + d.diagnosisTime)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - window.innerHeight * 0.07 + "px");
        })
        .on("mouseout", function() {
          d3.select("#Rtooltip").style("display", "none");
        });
      //治愈
      svg
        .append("g")
        .attr("class", "hcircle")
        .selectAll("circle")
        .data(that.chartdata)
        .enter()
        .append("circle")
        .attr("r", function(d) {
          if (d.healingTime != "") {
            return 3;
          }
        })
        .attr("transform", "translate(30,10)")
        .style("fill", "#9DDC9D")
        .style("cursor", "pointer")
        .attr("cy", function(d, i) {
          return chartYscal(parseInt(i + 1));
        })
        .attr("cx", function(d) {
          return chartXscale(new Date(d.healingTime));
        })
        .on("mouseover", function(d) {
          d3.select("#Rtooltip")
            .style("display", "inline")
            .html("治愈日期:" + d.healingTime)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - window.innerHeight * 0.07 + "px");
        })
        .on("mouseout", function() {
          d3.select("#Rtooltip").style("display", "none");
        });
      //就诊
      svg
        .append("g")
        .attr("class", "gcircle")
        .selectAll("circle")
        .data(that.chartdata)
        .enter()
        .append("circle")
        .attr("r", function(d) {
          if (d.treatmentTime != "") {
            return 3;
          }
        })
        .attr("transform", "translate(30,10)")
        .style("fill", "#FF7F00")
        .style("cursor", "pointer")
        .attr("cy", function(d, i) {
          return chartYscal(parseInt(i + 1));
        })
        .attr("cx", function(d) {
          var x = chartXscale(new Date(d.treatmentTime));
          if (x != undefined) {
            return x;
          }
        })
        .on("mouseover", function(d) {
          d3.select("#Rtooltip")
            .style("display", "inline")
            .html("就诊日期:" + d.treatmentTime)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - window.innerHeight * 0.07 + "px");
        })
        .on("mouseout", function() {
          d3.select("#Rtooltip").style("display", "none");
        });
      //发病
      svg
        .append("g")
        .attr("class", "fcircle")
        .selectAll("circle")
        .data(that.chartdata)
        .enter()
        .append("circle")
        .attr("r", function(d) {
          if (d.onsetTime != "") {
            return 3;
          }
        })
        .attr("transform", "translate(30,10)")
        .style("fill", "#DEC494")
        .style("cursor", "pointer")
        .attr("cy", function(d, i) {
          return chartYscal(parseInt(i + 1));
        })
        .attr("cx", function(d) {
          var x = chartXscale(new Date(d.onsetTime));
          if (x != undefined) {
            return x;
          }
        })
        .on("mouseover", function(d) {
          d3.select("#Rtooltip")
            .style("display", "inline")
            .html("发病日期:" + d.onsetTime)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - window.innerHeight * 0.07 + "px");
        })
        .on("mouseout", function() {
          d3.select("#Rtooltip").style("display", "none");
        });
      //接触
      svg
        .append("g")
        .attr("class", "jcircle")
        .selectAll("circle")
        .data(that.chartdata)
        .enter()
        .append("circle")
        .attr("r", function(d) {
          if (d.relationTime != "") {
            return 3;
          }
        })
        .attr("transform", "translate(30,10)")
        .style("fill", "#FFEC8B")
        .style("cursor", "pointer")
        .attr("cy", function(d, i) {
          return chartYscal(parseInt(i + 1));
        })
        .attr("cx", function(d) {
          var x = chartXscale(new Date(d.onsetTime));
          if (x != undefined) {
            return x;
          }
        })
        .on("mouseover", function(d) {
          d3.select("#Rtooltip")
            .style("display", "inline")
            .html("接触日期:" + d.relationTime)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - window.innerHeight * 0.07 + "px");
        })
        .on("mouseout", function() {
          d3.select("#Rtooltip").style("display", "none");
        });

      //接触到发病
      svg
        .append("g")
        .attr("class", "jiechuTofabing")
        .selectAll("bar")
        .data(that.chartdata)
        .enter()
        .append("rect")
        .attr("transform", "translate(30,10)")
        .style("fill", "#FFEC8B")
        .attr("x", function(d) {
          var x = chartXscale(new Date(d.relationTime));
          if (x != undefined || !isNaN(x)) {
            return x;
          }
        })
        .attr("y", function(d, i) {
          return chartYscal(parseInt(i + 1));
        })
        .attr("width", function(d) {
          var x1 = chartXscale(new Date(d.onsetTime));
          var x = chartXscale(new Date(d.relationTime));
          var width = x1 - x;
          if (isNaN(width)) {
            return 0;
          } else {
            return width;
          }
        })
        .attr("height", 2);

      //发病到就诊
      svg
        .append("g")
        .attr("class", "fabingTojiuzheng")
        .selectAll("bar")
        .data(that.chartdata)
        .enter()
        .append("rect")
        .attr("transform", "translate(30,10)")
        .style("fill", "#DEC494")
        .attr("x", function(d) {
          var x1 = chartXscale(new Date(d.onsetTime));

          if (!isNaN(x1) || x1 != undefined) {
            return x1;
          }
        })
        .attr("y", function(d, i) {
          return chartYscal(parseInt(i + 1));
        })
        .attr("width", function(d) {
          var x1 = chartXscale(new Date(d.onsetTime));
          var x2 = chartXscale(new Date(d.treatmentTime));
          var width = x2 - x1;
          if (isNaN(width)) {
            return 0;
          } else {
            return width;
          }
        })
        .attr("height", 2);

      //就诊到确诊
      svg
        .append("g")
        .attr("class", "quezheng")
        .selectAll("bar")
        .data(that.chartdata)
        .enter()
        .append("rect")
        .attr("transform", "translate(30,10)")
        .style("fill", "#FF7F00")
        .attr("x", function(d) {
          var x1 = chartXscale(new Date(d.treatmentTime));
          if (x1 != undefined || !isNaN(x1)) {
            return x1;
          }
        })
        .attr("y", function(d, i) {
          return chartYscal(parseInt(i + 1));
        })
        .attr("width", function(d) {
          var x1 = chartXscale(new Date(d.treatmentTime));

          var x = chartXscale(new Date(d.diagnosisTime));

          var width = x - x1;
          if (isNaN(width)) {
            return 0;
          } else {
            return width;
          }
        })
        .attr("height", 2);

      //确诊到治愈
      svg
        .append("g")
        .attr("class", "zhiyu")
        .selectAll("bar")
        .data(that.chartdata)
        .enter()
        .append("rect")
        .attr("transform", "translate(30,10)")
        .style("fill", "#FF0E0E")
        .attr("x", function(d) {
          var x = chartXscale(new Date(d.diagnosisTime));
          if (!isNaN(x)) {
            return x;
          }
        })
        .attr("y", function(d, i) {
          return chartYscal(parseInt(i + 1));
        })
        .attr("width", function(d) {
          var x = chartXscale(new Date(d.healingTime));
          var x1 = chartXscale(new Date(d.diagnosisTime));
          var width = x - x1;
          if (!isNaN(width)) {
            return width;
          } else {
            return 0;
          }
        })
        .attr("height", 2);
    },
    redrawchart: function() {
      var timeRange = [
        new Date(this.$store.getters.gettimeRange[0]),
        new Date(this.$store.getters.gettimeRange[1])
      ];
      var data = this.$store.getters.getRelationdata;
      var playcheck = this.$store.getters.getplaycheck;
      this.chartdata = [];
      var k = 0;
      var sdate = null;
      for (var i = 0; i < data.length; i++) {
        sdate = data[i].onsetTime;
        if (data[i].onsetTime != "") {
          sdate = new Date(sdate);
        }
        var edate = new Date(data[i].diagnosisTime);

        if (sdate == "" || edate.getTime() <= timeRange[1].getTime()) {
          if (playcheck) {
            if (
              this.$store.getters.getmergerCity == "" ||
              data[i].city == this.$store.getters.getmergerCity
            ) {
              this.chartdata[k] = data[i];
              k++;
            }
          } else {
            if (sdate == "" || sdate.getTime() >= timeRange[0].getTime()) {
              if (
                this.$store.getters.getmergerCity == "" ||
                data[i].city == this.$store.getters.getmergerCity
              ) {
                this.chartdata[k] = data[i];
                k++;
              }
            }
          }
        }
      }
      d3.select("#Relation")
        .select("svg")
        .remove();
      this.setXaxisdata();
      this.initchartSet();
      this.initchart(this.chartdata);
    }
  },
  computed: {
    Relationdata() {
      return this.$store.getters.getRelationdata;
    },
    ScTrackData() {
      return this.$store.getters.getscTrackData;
    },
    selectCity() {
      return this.$store.getters.getmergerCity;
    },
    timeRange() {
      return this.$store.getters.gettimeRange;
    }
  },
  watch: {
    //监听Relationdata数据变化
    Relationdata: function(newval, oldval) {
      // //图表数据变化后该执行的操作
      // var cityname = this.$store.getters.getselectCity;
      // this.chartdata = [];
      // var k = 0;
      // for (var i = 0; i < newval.length; i++) {
      //   if (newval[i].city == cityname) {
      //     this.chartdata[k] = newval[i];
      //     k++;
      //   }
      // }
      this.redrawchart();
    },
    //监听选中的城市
    selectCity: function(newval, oldval) {
      this.redrawchart();
    },
    timeRange: function(newval, oldval) {
      this.redrawchart();
    },
    ScTrackData: function(newval, oldval) {
      var drawdata = [];
      var k = 0;
      for (var i = 0; i < newval.length; i++) {
        var onsetTime = newval[i].onsetTime; //发病时间
        var diagnosisTime = newval[i].diagnosisTime; //确诊时间
        var treatmentTime = newval[i].treatmentTime; //就诊时间
        var healingTime = newval[i].healingTime; //治愈时间
        var relationTime = newval[i]["接触时间"];
        if (onsetTime == "不明") {
          onsetTime = "";
        }
        if (diagnosisTime == "不明") {
          diagnosisTime = "";
        }
        if (treatmentTime == "不明") {
          treatmentTime = "";
        }
        if (healingTime == "不明") {
          healingTime = "";
        }
        if (relationTime == "不明" || relationTime == "NA") {
          relationTime = "";
        }
        drawdata[k] = {
          onsetTime: onsetTime,
          diagnosisTime: diagnosisTime,
          treatmentTime: treatmentTime,
          healingTime: healingTime,
          relationTime: relationTime,
          ID: newval[i].id,
          city: newval[i].city
        };
        k++;
      }
      this.$store.commit("setRelationdata", drawdata);
    }
  }
};
</script>
<style>
#Relation .axis path {
  stroke: white;
}
#Relation {
  position: absolute;
  top: 65.1%;
  left: 33.9%;
  width: 33.0%;
  height: 34%;
  background-color: #30313a;
 //border: 1px solid solid #dededd;
}
#Rtooltip {
  position: absolute;
  display: none;
  border-style: solid;
  border-top-style: solid;
  border-right-style: solid;
  border-bottom-style: solid;
  border-left-style: solid;
  white-space: nowrap;
  z-index: 9999999;
  transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s,
    top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;
  background-color: rgba(50, 50, 50, 0.7);
  border-width: 0px;
  border-color: rgb(51, 51, 51);
  border-radius: 4px;
  color: rgb(255, 255, 255);
  font: 14px / 21px "Microsoft YaHei";
  padding: 5px;
  padding-top: 5px;
  padding-right: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
}
.Relationship-angel {
  background: linear-gradient(#00faff, #00faff) left top,
    linear-gradient(#00faff, #00faff) left top,
    linear-gradient(#00faff, #00faff) right top,
    linear-gradient(#00faff, #00faff) right top,
    linear-gradient(#00faff, #00faff) left bottom,
    linear-gradient(#00faff, #00faff) left bottom,
    linear-gradient(#00faff, #00faff) right bottom,
    linear-gradient(#00faff, #00faff) right bottom;
  background-repeat: no-repeat;
  background-size: 0.15rem 0.6rem, 0.6rem 0.15rem, 0.15rem 0.6rem,
    0.6rem 0.15rem;
  background-color: rgba(255, 255, 255, 0.05);
  white-space: nowrap;
  /* border:3px solid #ffffff; */

  margin: 0.1% 0 0 0.1%;
  z-index: 2;
}
</style>
