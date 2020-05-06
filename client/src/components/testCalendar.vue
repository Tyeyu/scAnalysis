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
      incity: [],
      outprovinces: [],
      svgwidth: null,
      svgheight: null,
      tabechange: false,
      cityScale: null,
      prScale: null
    };
  },
  methods: {
    drawchart: function() {
      let that = this;
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
        .attr("fill", function(d) {
          if (d.value == 0) {
            return "#181830";
          } else {
            return "orange";
          }
        })
        .attr("opacity", function(d) {
          if (d.value == 0) {
            return 1;
          } else return that.cityScale(d.value);
        })
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
        .attr("fill", function(d) {
          if (d.value == 0) {
            return "#181830";
          } else {
            return "yellow";
          }
        })
        .attr("opacity", function(d) {
          if (d.value == 0) {
            return 1;
          } else return that.prScale(d.value);
        })
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
    },
    OptScale: function(data) {
      var Qscale = d3
        .scaleLinear()
        .domain([
          d3.min(data, function(d) {
            return d.value;
          }),
          d3.max(data, function(d) {
            return d.value;
          })
        ])
        .range([0, 1]);
      return Qscale;
    }
  },
  computed: {
    tabe() {
      return this.$store.getters.gettabeselect;
    },
    Tcalendata() {
      return this.$store.getters.getTcalendata;
    },
    TCalendar() {
      return this.$store.getters.getTCalendar;
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
      this.incity = this.$store.getters.getTcalendata.city;
      this.outprovinces = this.$store.getters.getTcalendata.province;
      this.cityScale = this.OptScale(this.incity);
      this.prScale = this.OptScale(this.outprovinces);
      this.drawchart();
    },
    TCalendar: function(newval, oldval) {
      d3.select("#testCalendar")
        .selectAll("svg")
        .remove();
      this.incity = this.$store.getters.getTCalendar.city;
      this.outprovinces = this.$store.getters.getTCalendar.province;
      this.cityScale = this.OptScale(this.incity);
      this.prScale = this.OptScale(this.outprovinces);
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
