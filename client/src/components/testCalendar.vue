<template>
  <div id="testCalendar">
    <div>
      <span>关联地区风险</span>
    </div>
  </div>
</template>
<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      incity: [
        { name: "成都", value: 0 },
        { name: "自贡", value: 0 },
        { name: "攀枝花", value: 0 },
        { name: "泸州", value: 0 },
        { name: "德阳", value: 0 },
        { name: "绵阳", value: 0 },
        { name: "广元", value: 0 },
        { name: "遂宁", value: 0 },
        { name: "内江", value: 0 },
        { name: "乐山", value: 0 },
        { name: "南充", value: 0 },
        { name: "宜宾", value: 0 },
        { name: "广安", value: 0 },
        { name: "达州", value: 0 },
        { name: "巴中", value: 0 },
        { name: "雅安", value: 0 },
        { name: "眉山", value: 0 },
        { name: "资阳", value: 0 },
        { name: "阿坝", value: 0 },
        { name: "甘孜", value: 0 },
        { name: "凉山", value: 0 }
      ],
      outprovinces: [
        { cityname: "重庆", value: 0 },
        { cityname: "云南", value: 0 },
        { cityname: "陕西", value: 0 },
        { cityname: "贵州", value: 0 },
        { cityname: "宁夏", value: 0 },
        { cityname: "西藏", value: 0 },
        { cityname: "青海", value: 0 },
        { cityname: "陕西", value: 0 },
        { cityname: "甘肃", value: 0 },
        { cityname: "湖南", value: 0 },
        { cityname: "湖北", value: 0 }
      ],
      svgwidth: null,
      svgheight: null,
      tabechange: false
    };
  },
  methods: {
    drawchart: function() {
      this.svgwidth = document.getElementById("testCalendar").clientWidth - 10;
      this.svgheight =
        document.getElementById("testCalendar").clientHeight - 10;
      var svg = d3
        .select("#testCalendar")
        .append("svg")
        .attr("width", this.svgwidth)
        .attr("height", this.svgheight);
      var height = this.svgwidth / 100;
      console.log(height);
      var incityg = svg.append("g");
      incityg
        .selectAll("bar")
        .data(this.incity)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
          return height * 2 + (i % 11) * height * 8 + (i % 11) * height;
        })
        .attr("y", function(d, i) {
          if (i >= 11) {
            return 18 * height;
          } else {
            return 8 * height;
          }
        })
        .attr("width", height * 8)
        .attr("height", height * 8)
        .attr("fill", "red");
      var outpg = svg.append("g");
      outpg
        .selectAll("rect")
        .data(this.outprovinces)
        .enter()
        .append("rect")
        .attr("y", 30 * height)
        .attr("x", function(d, i) {
          return height * 2 + i * height * 8 + i * height;
        })
        .attr("width", height * 8)
        .attr("height", height * 8)
        .attr("fill", "green");
    }
  },
  computed: {
    tabe() {
      return this.$store.getters.gettabeselect;
    }
  },
  watch: {
    tabe: function(newval, oldval) {
      if (!this.tabechange) {
        this.drawchart();
        this.tabechange = true;
      }
    }
  }
};
</script>
<style>
#testCalendar span {
  color: white;
  font: 18px "Microsoft YaHei";
}
#testCalendar {
  position: absolute;
  top: 65.1%;
  right: 0.1%;
  width: 33.2%;
  height: 34%;
  border: 1pt solid #dededd;
  z-index: 1;
}
</style>