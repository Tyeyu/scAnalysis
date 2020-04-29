<template>
  <div id="testCalendar"></div>
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
  right: 0.1%;
  width: 33.2%;
  height: 34%;
  border: 1pt solid #dededd;
  z-index: 1;
}
</style>