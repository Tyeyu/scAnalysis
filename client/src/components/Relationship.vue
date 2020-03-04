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
      chartSvgheight: null
      // chartXscale: null,
      // chartYscal: null,
      // chartXaxies: null,
      // chartYaxies: null
    };
  },
  methods: {
    Readdata: function() {
      let that = this;
      d3.csv("../../static/countries.csv")
        .then(function(data) {
          // that.chartdata = data;
          // console.log(that.chartdata);
          that.initchartSet();
          that.initchart(data);
        })
        .catch(function(error) {});
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
      console.log(d3.range(data.length));
      var chartXscale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, function(d) {
            return parseInt(d.high);
          })
        ])
        .range([0, that.chartSvgwidth - 30]);

      var chartYscal = d3
        .scaleLinear()
        .domain([
          d3.min(data, function(d) {
            return parseInt(d.value);
          }),
          d3.max(data, function(d) {
            return parseInt(d.value);
          })
        ])
        .range([0, this.chartSVgheight - 30]);
      // console.log(that.chartdata[0].value);
      // console.log(chartYscal(10));
      var chartXaxies = d3.axisTop(chartXscale).ticks(5);
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
        .call(chartYaxies)
        .attr("transform", "translate(30,20)")
        .attr("class", "axis");
      svg
        .append("g")
        .call(chartXaxies)
        .attr("transform", "translate(30,20)")
        .attr("class", "axis");
      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 10)
        .attr("transform", "translate(30,20)")
        .style("fill", "#a6cee3")
        .style("cursor", "pointer")
        .attr("cy", function(d, i) {
          return chartYscal(parseInt(d.value));
        })
        .attr("cx", function(d) {
          return chartXscale(parseInt(d.high));
        });
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
