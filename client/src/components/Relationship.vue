<template>
  <div>
    <div id="Relation"></div>
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
        if (that.chartdata[i].startdate != "") {
          xdmap.set(that.chartdata[i].startdate, 0);
        }

        xdmap.set(that.chartdata[i].enddate, 0);
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
            return parseInt(i);
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
        .call(chartXaxies);
      svg
        .append("g")
        .attr("transform", "translate(30,10)")
        .attr("class", "axis")
        .call(chartYaxies);

      svg
        .selectAll("circle")
        .data(that.chartdata)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("transform", "translate(30,10)")
        .style("fill", "#a6cee3")
        .style("cursor", "pointer")
        .attr("cy", function(d, i) {
          return chartYscal(parseInt(i)) + 1;
        })
        .attr("cx", function(d) {
          return chartXscale(new Date(d.enddate));
        })
        .on("mouseover", function(d) {
          d3.select("#Rtooltip")
            .style("display", "inline")
            .html("发病日期:" + d.startdate + "</br>确诊日期:" + d.enddate)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - window.innerHeight * 0.07 + "px");
        })
        .on("mouseout", function() {
          d3.select("#Rtooltip").style("display", "none");
        });
      svg
        .selectAll("bar")
        .data(that.chartdata)
        .enter()
        .append("rect")
        .attr("transform", "translate(30,10)")
        .style("fill", "#a6cee3")
        .attr("x", function(d) {
          return chartXscale(new Date(d.startdate));
        })
        .attr("y", function(d, i) {
          return chartYscal(parseInt(i));
        })
        .attr("width", function(d) {
          var width =
            chartXscale(new Date(d.enddate)) -
            chartXscale(new Date(d.startdate));
          if (isNaN(width)) {
            return 0;
          } else {
            return width;
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
        sdate = data[i].startdate;
        if (data[i].startdate != "") {
          sdate = new Date(sdate);
        }
        var edate = new Date(data[i].enddate);

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
        if (newval[i].onsetTime == "不明" || newval[i].onsetTime == "") {
          drawdata[k] = {
            startdate: "",
            enddate: newval[i].diagnosisTime,
            ID: newval[i].id,
            city: newval[i].city
          };
          k++;
          continue;
        }

        drawdata[k] = {
          startdate: newval[i].onsetTime,
          enddate: newval[i].diagnosisTime,
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
#Relation {
  position: absolute;
  top: 65.1%;
  left: 33.4%;
  width: 33.2%;
  height: 34%;
  border: 1px solid solid #dededd;
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
</style>
