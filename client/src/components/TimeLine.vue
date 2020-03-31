<template>
  <div>
    <div id="timeLine"></div>
    <div id="timeLineText"></div>
  </div>
</template>
<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      svgWidth: null,
      svgHeight: null,
      timeLineSvg: null,
      xscale: null,
      interval: null,
      bush: null,
      xAxis: null
    };
  },
  methods: {
    //初始化基本配置
    initsvg: function() {
      this.svgWidth = document.getElementById("timeLine").clientWidth - 10;
      this.svgHeight = document.getElementById("timeLine").clientHeight - 5;
      this.interval = d3.timeDay.every(1);
      this.xscale = d3
        .scaleTime()
        .domain([
          new Date(this.$store.getters.gettimeRange[0]),
          new Date(this.$store.getters.gettimeRange[1])
        ])
        .rangeRound([0, this.svgWidth]);

      this.xAxis = d3.axisBottom(this.xscale).ticks(5);
    },
    drawtimeLine: function() {
      let that = this;
      this.timeLineSvg = d3
        .select("#timeLine")
        .append("svg")
        .attr("width", this.svgWidth)
        .attr("height", this.svgHeight)
        .attr("transform", "translate(5," + 2.5 + ")");

      this.brush = d3
        .brushX()
        .extent([
          [0, 5],
          [that.svgWidth, that.svgHeight]
        ])
        .on("end", that.brushend)
        .on("brush", that.brushmove);
      this.timeLineSvg
        .append("g")
        .attr("transform", "translate(0," + -that.svgHeight / 3 + ")")
        .attr("class", "brush")
        .on("mouseover", function() {
          var selectrage = d3.brushSelection(this);
          var selectTimerange = selectrage.map(d => that.xscale.invert(d));
          var Sdate = that.dateFormat("YYYY-mm-dd", selectTimerange[0]);
          var Edate = that.dateFormat("YYYY-mm-dd", selectTimerange[1]);

          d3.select("#timeLineText")
            .style("display", "inline")
            .html(Sdate + "-" + Edate)
            .style("left", d3.event.pageX - window.innerWidth * 0.13 + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function() {
          d3.select("#timeLineText").style("display", "none");
        })
        .call(that.brush)
        .call(
          that.brush.move,
          [
            new Date(this.$store.getters.gettimeRange[0]),
            new Date(this.$store.getters.gettimeRange[1])
          ].map(that.xscale)
        );
      this.timeLineSvg
        .append("g")
        .attr("transform", "translate(0," + 10 + ")")
        .call(this.xAxis);
    },
    brushend: function() {
      let that = this;
      const selection = d3.event.selection;
      var x = d3.event.target.extent;

      if (!d3.event.sourceEvent || !selection) return;
      const [x0, x1] = selection.map(d =>
        that.interval.round(that.xscale.invert(d))
      );
      that.$store.commit("settimeRange", [x0, x1]);
      //确保绘制的矩形区域的最小单位为1天的宽度
      d3.select(".brush")
        .transition()
        .call(that.brush.move, x1 > x0 ? [x0, x1].map(that.xscale) : null);
    },
    brushmove: function() {
      let that = this;
      const selection = d3.event.selection;
      const [x0, x1] = selection.map(d =>
        that.interval.round(that.xscale.invert(d))
      );

      // console.log([x0, x1]);
    },
    dateFormat: function(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    }
  },
  mounted() {
    this.initsvg();
    this.drawtimeLine();
  }
};
</script>
<style>
#timeLine {
  position: absolute;
  left: 25.9%;
  top: 56%;
  width: 70%;
  height: 5%;
  /* border: 1px solid black; */
}
#timeLine .selection {
  fill: aqua;
}
#timeLineText {
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