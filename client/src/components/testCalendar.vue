<template>
  <div id="testCalendar" class="testCalender-angel">
    <div style="padding-top:1%">
      <span style="padding-left: 5%">关联地区风险</span>
    </div>
  </div>
</template>
<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      incity: [],
      outprovinces: [],
      svgwidth: null,
      svgheight: null,
      tabechange: false
    };
  },
  methods: {
    drawchart: function() {
      this.incity = this.$store.getters.getTcalendata.city;
      this.outprovinces = this.$store.getters.getTcalendata.province;
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
          return height * 2 + (i % 11) * height * 8 + (i % 11) * height + 4;
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
            return 19 * height;
          } else {
            return 9 * height;
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
        .attr("y", 31 * height)
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
          return height * 2 + i * height * 8 + i * height + 4;
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
    },
    Tcalendata() {
      return this.$store.getters.getTcalendata;
    }
  },
  watch: {
    tabe: function(newval, oldval) {
      if (!this.tabechange) {
        d3.select("#testCalendar")
          .selectAll("svg")
          .remove();
        this.drawchart();
        this.tabechange = true;
      }
    },
    Tcalendata: function(newval, oldval) {
      d3.select("#testCalendar")
        .selectAll("svg")
        .remove();
      this.drawchart();
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
