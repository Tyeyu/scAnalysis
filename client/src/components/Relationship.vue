<template>
  <div id="Relation"></div>
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
        .then(function(data) {
          that.chartdata = data;
          that.setXaxisdata();
          that.initchartSet();
          that.initchart(data);
        })
        .catch(function(error) {});
    },
    setXaxisdata: function() {
      let that = this;
      var xdmap = d3.map();
      for (var i = 0; i < this.chartdata.length; i++) {
        xdmap.set(that.chartdata[i].startdate, 0);
        xdmap.set(that.chartdata[i].enddate, 0);
      }
      this.xaxiesdata = xdmap.keys();
      this.xaxiesdata = this.xaxiesdata.sort(function(a, b) {
        var da = parseInt(a.split("月")[0]);
        var daa = parseInt(a.split("月")[1].split("日")[0]);
        var db = parseInt(b.split("月")[0]);
        var dbb = parseInt(b.split("月")[1].split("日")[0]);

        return da < db ? -1 : da > db ? 1 : daa < dbb ? -1 : 1;
      });
    },
    //初始化图表基础配置
    initchartSet: function() {
      let that = this;
      // //序数比例尺
      var s = d3.scaleBand(["2月1日", "2月2日", "2月3日"], d3.range(3));
      // .domain(d3.range(3))
      // .range(["2月1日", "2月2日", "2月3日"]);
      console.log(s("2月2日"));
      this.chartSvgwidth = document.getElementById("Relation").clientWidth - 10;
      this.chartSVgheight =
        document.getElementById("Relation").clientHeight - 10;

      // this.data=
    },
    //初始化图表
    initchart: function(data) {
      let that = this;
      var chartXscale = d3.scaleBand(that.xaxiesdata, [
        0,
        that.chartSvgwidth - 30
      ]);

      var chartYscal = d3
        .scaleLinear()
        .domain([0, that.chartdata.length])
        .range([this.chartSVgheight - 30, 0]);
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
        .attr("r", 10)
        .attr("transform", "translate(30,10)")
        .style("fill", "#a6cee3")
        .style("cursor", "pointer")
        .attr("cy", function(d, i) {
          return chartYscal(i);
        })
        .attr("cx", function(d) {
          return chartXscale(d.enddate);
        });
      svg
        .selectAll("bar")
        .data(that.chartdata)
        .enter()
        .append("rect")
        .attr("transform", "translate(30,10)")
        .style("fill", "#a6cee3")
        .attr("x", function(d) {
          return chartXscale(d.startdate);
        })
        .attr("y", function(d, i) {
          return chartYscal(i);
        })
        .attr("width", function(d) {
          return chartXscale(d.enddate) - chartXscale(d.startdate);
        })
        .attr("height", 4);
    },
    redrawchart: function() {}
  },
  mounted: function() {
    this.Readdata();
  }
};
</script>
<style>
#Relation {
  position: absolute;
  top: 60.1%;
  left: 24.9%;
  width: 24.9%;
  height: 39%;
  border: 1px solid #ccc;
}
</style>
