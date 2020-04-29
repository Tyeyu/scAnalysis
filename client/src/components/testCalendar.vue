<template>
  <div id="testCalendar" class="testCalender-angel"></div>
</template>
<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      incity: [1],
      outprovinces: [1],
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
      svg
        .append("g")
        .selectAll("bar")
        .data(this.incity)
        .enter()
        .append("rect")
        .attr("width", 100)
        .attr("height", 100)
        .attr("fill", "red");
      svg
        .append("g")
        .selectAll("rect")
        .data(this.outprovinces)
        .enter()
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
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
#testCalendar {
  position: absolute;
  top: 65.1%;
  right: 0.5%;
  width: 32.0%;
  height: 34%;
  background-color: #30313a;
}
  .testCalender-angel{
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
