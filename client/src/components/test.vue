<template>
  <div></div>
</template>
<script>
import * as dsv from "d3-dsv";
import * as greinerHormann from "greiner-hormann";
const d3 = require("d3");
const $ = require("jquery");

var turf = require("turf");
var geojsonArea = require("geojson-area");
let axios = require("axios");
import * as mapboxgl from "mapbox-gl";
export default {
  data() {
    return {
      mapfeaters: [],
      map: null
    };
  },
  mounted: function() {
    axios.get("/api/position.csv").then(PositionRes => {
      axios.get("/api/sc_city.json").then(MapRes => {
        axios.get("/api/sichuan.json").then(CordRes => {
          let HosPosition = dsv.csvParse(PositionRes.data);
          let mapdata = MapRes.data;
          let corddata = CordRes.data;
          this.cord_data = corddata;
          this.map_data = mapdata;
          this.hos_data = HosPosition;
          this.AddVoronoi(this.map_data, this.hos_data, this.cord_data);
        });
      });
    });
  },
  methods: {
    AddVoronoi(MapData, HosData, CordData) {
      let that = this;
      // var width = window.innerWidth * 0.69;
      // var height = window.innerHeight * 0.6;
      //定义地图投影
      // var projection = d3
      //   .geoMercator()
      //   .center([94, 26])
      //   .scale(2500)
      //   // .translate([this.width / 2-200 , this.height / 2 +250]);
      //   .translate([width / 4 - 200, height / 3 + 280]);
      // let positions = [];
      let hospitals = [];
      let pos = [];
      HosData.forEach(function(d, p, q) {
        d.lng = parseFloat(d.lng);
        d.lat = parseFloat(d.lat);

        // positions.push(projection([d.lng, d.lat]));
        // positions[p].name = d["机构名称"];
        pos.push([d.lng, d.lat]);
        pos[p].name = d["机构名称"];
        hospitals.push({
          type: "Feature",
          properties: {
            name: d["机构名称"]
          },
          geometry: {
            type: "Point",
            coordinates: [d.lng, d.lat]
          }
        });
      });
      const _voronoi = d3.voronoi();
      var posvor = _voronoi(pos).polygons();
      var scmapdata = CordData.geometry.coordinates[0];
      // var testmapd = [];
      // for (var i = 0; i < scmapdata.length; i++) {
      //   // console.log(scmapdata[i]);
      //   testmapd.push(projection(scmapdata[i]));
      // }
      // var svg = d3
      //   .select("#testmap")
      //   .append("svg")
      //   .attr("width", 1000)
      //   .attr("height", 700);
      for (var i = 0; i < posvor.length; i++) {
        if (posvor[i] != null) {
          let x = [];
          for (var j = 0; j < posvor[i].length; j++) {
            if (posvor[i][j] != null) {
              x.push(posvor[i][j]);
            }
          }
          // console.log(x);
          // console.log(scmapdata);
          var gs = greinerHormann.intersection(scmapdata, x);
          if (gs != null) {
            var feature = {
              type: "Feature",
              properties: {
                name: posvor[i].data.name,
                cp: [posvor[i].data[0], posvor[i].data[1]]
              },
              geometry: {
                type: "Polygon",
                coordinates: gs
              }
            };
            that.mapfeaters.push(feature);
            // svg
            //   .append("g")
            //   .selectAll("path")
            //   .data(gs)
            //   .enter()
            //   .append("path")
            //   .attr("d", function(it) {
            //     return "M" + it.join("L") + "Z";
            //   })
            //   .style("fill", "none")
            //   .style("stroke", "black");
          }
        }
      }
      this.$store.commit("setvorfeaters", that.mapfeaters);
      console.log(hospitals);
      this.$store.commit("sethosImageData", hospitals);
    },
    loadsourse() {}
  }
};
</script>
<style>
/* #testmap {
  position: absolute;
  top: 5.1%;
  left: 34.9%;
  width: 50%;
  height: 59%;
  border: 1px solid #ccc;
  z-index: 1;
} */
</style>
