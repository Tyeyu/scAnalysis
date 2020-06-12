<template>
  <div id="voronoiMap">
    <div class="tooltip" style="opaciyt:0"></div>
  </div>
</template>

<script>
import * as dsv from "d3-dsv";
const d3 = require("d3");
const $ = require("jquery");

var turf = require("turf");
var geojsonArea = require("geojson-area");
let axios = require("axios");

export default {
  name: "voronoichart",
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
          // console.log("features",this.map_data.features);
          this.AddVoronoi(this.map_data, this.hos_data, this.cord_data);
        });
      });
    });
  },

  watch: {},

  methods: {
    AddVoronoi(MapData, HosData, CordData) {
      let tooltip = d3.selectAll(".tooltip");

      var width = window.innerWidth * 0.69;
      var height = window.innerHeight * 0.6;
      var that = this;

      var zoom = d3
        .zoom()
        .scaleExtent([0.1, 20])
        .on("zoom", zoomed);

      this.scale = 0.5;

      function zoomed() {
        that.container.attr(
          "transform",
          "translate(" +
            d3.event.transform.x +
            "," +
            d3.event.transform.y +
            ")scale(" +
            d3.event.transform.k +
            ")"
        );

        d3.selectAll(".location").attr("r", 2 / d3.event.transform.k);
        d3.selectAll(".cell").attr("stroke-width", 1 / d3.event.transform.k);
        that.scale = d3.event.transform.k; //调用zoomed函数时scale才会有定义
      }

      var map_container = d3
        .select("#voronoiMap")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .call(zoom);

      //定义地图投影
      var projection = d3
        .geoMercator()
        .center([94, 26])
        .scale(2500)
        // .translate([this.width / 2-200 , this.height / 2 +250]);
        .translate([width / 4 - 200, height / 3 + 280]);

      //定义路径
      var path = d3.geoPath().projection(projection);

      this.container = map_container.append("g");

      //开始加载地图
      var regionGroups = this.container.append("g");
      var voronoiLayer = this.container.append("g");

      regionGroups
        .selectAll("path")
        .data(MapData.features)
        .enter()
        .append("path")
        .attr("class", "province")
        .style("fill", "steelblue")
        .attr("fill-opacity", 0.6)
        .attr("d", path);

      let positions = [];
      let pos = [];
      HosData.forEach(function(d, p, q) {
        d.lng = parseFloat(d.lng);
        d.lat = parseFloat(d.lat);

        positions.push(projection([d.lng, d.lat]));
        positions[p].name = d["机构名称"];
        pos.push(projection(projection.invert([d.lng, d.lat])));
        pos[p].name = d["机构名称"];
      });
      // console.log(pos);
      const _voronoi = d3.voronoi();
      // .extent([[-1, -1],[innerWidth+1,innerHeight+1]])
      // console.log(_voronoi(pos).polygons());
      const polygons = _voronoi(positions).polygons();
      // console.log(polygons);
      let AreaData = [];
      //构造poly1 poly2计算相交的面积
      polygons.forEach(d => {
        if (d != undefined) {
          let points = [];
          for (var i = 0; i < d.length; i++) {
            if (d[i] != undefined) {
              points.push(projection.invert([d[i][0], d[i][1]]));
            }
          }
          points[points.length] = points[0];
          // CordData.geometry.coordinates[0][CordData.geometry.coordinates.length]=CordData.geometry.coordinates[0][0]
          let poly1 = turf.polygon([points]);
          // console.log("coordinates",CordData.geometry.coordinates)
          let poly2 = turf.polygon(CordData.geometry.coordinates);
          // console.log("ploy2",poly2)
          var intersection = turf.intersect(poly1, poly2);
          if (intersection) {
            var area_intersection = turf.area(intersection);
            d.area = area_intersection / 1000;
            //AreaData.push({"number":d.data.number,"area":area_intersection/1000,"polyg":d})
          } else {
            d.area = turf.area(poly1 / 1000);
          }
        }
      });

      // that.$root.$emit('AreaData',AreaData)

      var clipPath = this.container.append("clipPath").attr("id", "myclipPath");

      clipPath
        .selectAll(".path")
        .data(MapData.features)
        .enter()
        .append("path")
        .attr("d", path);

      //境界表示
      voronoiLayer
        .selectAll(".cell")
        .data(polygons)
        .enter()
        .append("path")
        .attr("class", "cell")
        .attr("id", function(d, i) {
          return i;
        })
        .attr("fill", "blue")
        .attr("fill-opacity", 0)
        .attr("stroke", "white")
        .attr("clip-path", "url(#myclipPath)")
        .attr("d", function(d) {
          if (d != undefined) {
            let x = [];
            for (var i = 0; i < d.length; i++) {
              if (d[i] != null) {
                x.push(d[i]);
              }
            }
            return "M" + x.join("L") + "Z";
          }
        })
        .on("mouseover", function(d) {
          tooltip
            .transition()
            .duration(200)
            .style("opacity", 0.9);
          tooltip
            .html(
              d.data.name +
                "：" +
                parseInt(d.area / 1000) 
                
            )
            .style("left", d3.event.pageX - window.innerWidth * 0.31 + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function(d) {
          tooltip
            .transition()
            .duration(500)
            .style("opacity", 0);
        });
    }
  }
};
</script>
<style lang="css">
#voronoiMap {
  position: absolute;
  top: 5.1%;
  left: 34.9%;
  width: 50%;
  height: 59%;
  border: 1px solid #ccc;
  z-index: 999;
}

.province {
  stroke: white;
  stroke-width: 1px;
}

div.tooltip {
  position: absolute;
  text-align: center;
  width: 120px;
  height: 28px;
  padding: 2px;
  font: 12px sans-serif;
  background: lightcoral;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
  opacity: 0;
}
</style>
