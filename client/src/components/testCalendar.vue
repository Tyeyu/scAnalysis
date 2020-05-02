<template>
  <div id="testCalendar" class="testCalender-angel">
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
        { name: "南充", value: 0 }
        // { name: "宜宾", value: 0 },
        // { name: "广安", value: 0 },
        // { name: "达州", value: 0 },
        // { name: "巴中", value: 0 },
        // { name: "雅安", value: 0 },
        // { name: "眉山", value: 0 },
        // { name: "资阳", value: 0 },
        // { name: "阿坝", value: 0 },
        // { name: "甘孜", value: 0 },
        // { name: "凉山", value: 0 }
      ],
      outprovinces: [
        { name: "重庆", value: 0 },
        { name: "云南", value: 0 },
        { name: "陕西", value: 0 },
        { name: "贵州", value: 0 },
        { name: "宁夏", value: 0 },
        { name: "西藏", value: 0 },
        { name: "青海", value: 0 },
        { name: "陕西", value: 0 },
        { name: "甘肃", value: 0 },
        { name: "湖南", value: 0 },
        { name: "湖北", value: 0 }
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
      // console.log(height);
      var incityg = svg.append("g");
      incityg
        .selectAll("text")
        .data(this.incity)
        .enter()
        .append("text")
        .attr("fontsize", "8")
        .attr("fill", "white")
        .attr("x", function(d, i) {
          return height * 2 + (i % 11) * height * 8 + (i % 11) * height;
        })
        .attr("y", function(d) {
          return height * 8;
        })
        .text(function(d) {
          return d.name;
        });
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
        .attr("fill", "#181830")
        .attr("stroke", "#898994")
        .attr("troke-width", 1);
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
        .attr("fill", "#181830")
        .attr("stroke", "#898994")
        .attr("troke-width", 1);
      outpg
        .selectAll("text")
        .data(this.outprovinces)
        .enter()
        .append("text")
        .attr("fontsize", "8")
        .attr("fill", "white")
        .attr("x", function(d, i) {
          return height * 2 + i * height * 8 + i * height;
        })
        .attr("y", function(d) {
          return 30 * height;
        })
        .text(function(d) {
          return d.name;
        });
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
  right: 0.5%;
  width: 32%;
  height: 34%;
  background-color: #30313a;
}
.testCalender-angel {
  z-index: 2;
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
  margin: 0.1% 0 0 0.1%;
}
</style>
