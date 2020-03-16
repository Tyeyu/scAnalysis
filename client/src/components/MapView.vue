<template>
  <div id="map"></div>
</template>

<script>
import * as mapboxgl from "mapbox-gl";
let axios = require("axios");
import * as d3 from "d3";
export default {
  name: "mapview",
  data() {
    return {
      quezheng: [
        { name: "成都", value: 144 },
        { name: "自贡", value: 9 },
        { name: "攀枝花", value: 16 },
        { name: "泸州", value: 24 },
        { name: "德阳", value: 18 },
        { name: "绵阳", value: 22 },
        { name: "广元", value: 6 },
        { name: "遂宁", value: 17 },
        { name: "内江", value: 22 },
        { name: "乐山", value: 3 },
        { name: "南充", value: 39 },
        { name: "宜宾", value: 12 },
        { name: "广安", value: 30 },
        { name: "达州", value: 42 },
        { name: "巴中", value: 24 },
        { name: "雅安", value: 7 },
        { name: "眉山", value: 8 },
        { name: "资阳", value: 4 },
        { name: "阿坝", value: 1 },
        { name: "甘孜", value: 78 },
        { name: "凉山", value: 13 }
      ]
    };
  },
  mounted() {
    this.map = "";
    this.mapInit();

    let that = this;

    this.map.on("load", function() {
      let res2 = axios.get("./api/sc_city.json").then(res => {
        console.log(res.data);

        var optscale = d3
          .scaleLinear()
          .domain([
            d3.min(that.quezheng, function(d) {
              return d.value;
            }),
            d3.max(that.quezheng, function(d) {
              return d.value;
            })
          ])
          .range([0, 1]);
        var qznest = d3
          .nest()
          .key(function(d) {
            return d.name;
          })
          .map(that.quezheng);

        for (var i = 0; i < res.data.features.length; i++) {
          var rename = res.data.features[i].properties.name;
          // console.log();
          var cname = rename.substring(0, 2);
          if (cname == "攀枝") {
            cname = cname + "花";
          }
          // console.log(cname);

          var reopt = optscale(qznest.get(cname)[0].value);
          res.data.features[i].properties["opt"] = reopt;
        }
        // console.log(res.data);
        that.addcity2Map(res.data);
      });
      let res = axios.get("/api/sichuan_district.json").then(res => {
        console.log(res.data);
        that.adddistrict2Map(res.data);
      });
      let res3 = axios.get("/api/merge_sichuan.json").then(res => {
        // console.log(res.data);
        that.addtown2Map(res.data);
      });
    });
  },

  methods: {
    mapInit() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiaG9uZ3l1amlhbmciLCJhIjoiY2s3N202NDIxMDhkdzNpcGg3djRtdnN4dCJ9.lysys8PBG25SxeHRF-sPvA";

      this.map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v9",
        center: [101.9199, 30.1904],
        zoom: 5
      });
    },
    addtown2Map(features) {
      this.map.addSource("town_json", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features.features
        }
      });
      this.map.addLayer({
        id: "county-overlay",
        type: "fill",
        source: "town_json",
        paint: {
          "fill-color": "#aca",
          "fill-opacity": 0.1
        },
        minzoom: 8.5
      });

      this.map.addLayer({
        id: "county-outline",
        type: "line",
        source: "town_json",
        paint: {
          "line-width": 1,
          "line-color": "#000",
          "line-opacity": 1
        },
        minzoom: 8.5
      });
      this.map.addLayer({
        id: "county-label",
        type: "symbol",
        source: "town_json",
        layout: {
          "text-field": "{name}",
          "text-size": 10
        },
        paint: {
          "text-color": "#333"
        },
        minzoom: 8.5
      });
    },

    addcity2Map(features) {
      this.map.addSource("city_json", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features.features
        }
      });
      this.map.addLayer({
        id: "city-overlay",
        type: "fill",
        source: "city_json",
        paint: {
          "fill-color": "red",
          "fill-opacity": ["get", "opt"]
        },
        maxzoom: 8.5
      });

      this.map.addLayer({
        id: "city-outline",
        type: "line",
        source: "city_json",
        paint: {
          "line-width": 1,
          "line-color": "#000",
          "line-opacity": 1
        },
        maxzoom: 8.5
      });
      this.map.addLayer({
        id: "region-label",
        type: "symbol",
        source: "city_json",
        layout: {
          "text-field": "{name}",
          "text-size": 12
        },
        paint: {
          "text-color": "#333"
        },
        maxzoom: 8.5
      });
    },
    adddistrict2Map(features) {
      this.map.addSource("dstrc_json", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features.features
        }
      });
      this.map.addLayer({
        id: "dstrc-overlay",
        type: "fill",
        source: "dstrc_json",
        paint: {
          "fill-color": "#aca",
          "fill-opacity": 0.1
        },
        minzoom: 7,
        maxzoom: 8.5
      });

      this.map.addLayer({
        id: "dstrc-outline",
        type: "line",
        source: "dstrc_json",
        paint: {
          "line-width": 1,
          "line-color": "#000",
          "line-opacity": 1
        },
        minzoom: 7,
        maxzoom: 8.5
      });
      this.map.addLayer({
        id: "dstrc-label",
        type: "symbol",
        source: "dstrc_json",
        layout: {
          "text-field": "{name}",
          "text-size": 10
        },
        paint: {
          "text-color": "#333"
        },
        minzoom: 7,
        maxzoom: 8.5
      });
    }
  },
  computed: {
    mapdata() {
      return this.$store.getters.getmapdata;
    }
  },
  watch: {
    //监听dailydata数据变化
    mapdata: function(newval, oldval) {
      //图表数据变化后该执行的操作
    }
  }
};
</script>

<style>
#map {
  position: absolute;
  top: 5.1%;
  left: 24.9%;
  width: 74.9%;
  height: 60%;
  border: 1px #7a7a7a;
}
</style>
