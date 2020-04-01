<template>
  <div id="map"></div>
</template>

<script>
import * as mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import * as d3 from "d3";
import * as d3geoVoronoi from "d3-geo-voronoi";

let axios = require("axios");
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
      ],
      toggleableLayerIds: [
        "region-label",
        "city-outline",
        // "county-outline",
        // "county-overlay",
        // "county-label",
        "city-overlay",
        "region-label",
        "dstrc-overlay",
        "dstrc-outline",
        "dstrc-label"
      ],
      counter: 0
    };
  },
  mounted() {
    this.map = "";
    this.mapInit();
    this.loadData();
    let that = this;

    this.map.on("load", function() {
      let res2 = axios.get("./api/sc_city.json").then(res => {
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
          var cname = rename.substring(0, 2);
          if (cname == "攀枝") {
            cname = cname + "花";
          }
          var reopt = optscale(qznest.get(cname)[0].value);
          res.data.features[i].properties["opt"] = reopt;
        }
        that.addcity2Map(res.data);
      });
      let res = axios.get("/api/sichuan_district.json").then(res => {
        that.adddistrict2Map(res.data);
      });
      // let res3 = axios.get("/api/merge_sichuan.json").then(res => {
      //   that.addtown2Map(res.data);
      // });
    });
  },
  methods: {
    mapInit() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiaG9uZ3l1amlhbmciLCJhIjoiY2s3N202NDIxMDhkdzNpcGg3djRtdnN4dCJ9.lysys8PBG25SxeHRF-sPvA";
      mapboxgl.setRTLTextPlugin(
        "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js"
      );

      this.map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v9",
        center: [101.9199, 30.1904],
        zoom: 5
      });
      //修改语言
      var language = new MapboxLanguage({ defaultLanguage: "zh" });
      this.map.addControl(language);
    },
    loadData() {
      axios.get("../static/latlon.json").then(response => {
        let _data = response.data;
        this.addArrestPoint(_data);
      });
    },
    addArrestPoint(data) {
      let drawPoints = [];
      let mapData = data.RECORDS;
      mapData.forEach(d => {
        drawPoints.push({
          type: "Feature",
          properties: {
            color: "red",
            opacity: 0.5,
            radius: 5
          },
          geometry: {
            type: "Point",
            coordinates: [d.lon, d.lat]
          }
        });
      });
      this.map.on("load", () => {
        //load：在所有必要数据源下载完毕、且首个可见的地图渲染完毕后立即触发
        this.map.addSource("points_source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: drawPoints
          }
        });
        this.map.addLayer({
          id: "points_layer",
          source: "points_source",
          type: "circle",
          // layout: {
          //   visibility: "visible"
          // }, //指渲染位置和可见性
          paint: {
            //指更精细的渲染样式，如不透明度、颜色和翻译等
            "circle-color": ["get", "color"],
            "circle-opacity": ["get", "opacity"],
            "circle-radius": ["get", "radius"]
          }
        });
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
      let that = this;
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
      this.map.on("click", "city-overlay", function(e) {
        var citynme = e.features[0].properties.name;
        citynme = citynme.split(/市|藏族羌族自治州|藏族自治州|彝族自治州/)[0];
        that.$store.commit("setmergerCity", citynme);
        // console.log(citynme);
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
    },
    changeLayer(data) {
      let that = this;
      let toggleableLayerIds = that.toggleableLayerIds;
      let clickedLayer1 = "points_layer";
      let clickedLayer2 = "voronoi-outline";
      let stateOfPOA = data.indexOf("POA");
      let stateOfCon = data.indexOf("contours");
      let stateOfVor = data.indexOf("voronoi-outline");
      console.log(stateOfPOA);
      console.log(stateOfCon);
      console.log(stateOfVor);
      data.forEach(item => {
        var visibility1 = that.map.setLayoutProperty(
          clickedLayer1,
          "visibility"
        ); /* getLayoutProperty(layer, name) 返回指定style layer上名为name的layout属性的值*/
        for (var i = 0; i < toggleableLayerIds.length; i++) {
          var clickedLayer = toggleableLayerIds[i];
          var visibility = that.map.setLayoutProperty(
            clickedLayer,
            "visibility"
          );
        }
        if (stateOfPOA == 0) {
          that.map.setLayoutProperty(clickedLayer1, "visibility", "visible"); // 设置指定layer上名为name的layou属性的值
        } else if (stateOfPOA == -1) {
          that.map.setLayoutProperty(clickedLayer1, "visibility", "none");
        }
        if (stateOfCon == 0) {
          for (var i = 0; i < toggleableLayerIds.length; i++) {
            var clickedLayer = toggleableLayerIds[i];
            that.map.setLayoutProperty(clickedLayer, "visibility", "visible");
          }
        } else if (stateOfCon == -1) {
          for (var i = 0; i < toggleableLayerIds.length; i++) {
            var clickedLayer = toggleableLayerIds[i];
            that.map.setLayoutProperty(clickedLayer, "visibility", "none");
          }
        }
        if (stateOfVor !== -1) {
          that.map.setLayoutProperty(clickedLayer2, "visibility", "visible");
        } else if (stateOfVor == -1) {
          that.map.setLayoutProperty(clickedLayer2, "visibility", "none");
        }
      });
    }
  },
  computed: {
    mapdata() {
      return this.$store.getters.getmapdata;
    },
    maptooldata() {
      return this.$store.getters.getmaptooldata;
    },
    vorfeaters() {
      return this.$store.getters.getvorfeaters;
    }
  },
  watch: {
    //监听dailydata数据变化
    mapdata: function(newval, oldval) {},
    maptooldata: function(newval, oldval) {
      console.log(newval);
      this.changeLayer(newval);
    },
    vorfeaters: function(newval, oldval) {
      let that = this;
      this.map.on("load", function() {
        that.map.addSource("voronoi", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: newval
          }
        });
        that.map.addLayer({
          id: "voronoi-outline",
          type: "line",
          source: "voronoi",
          layout: {
            visibility: "none"
          }, //指渲染位置和可见性
          paint: {
            "line-width": 1,
            "line-color": "#000",
            "line-opacity": 1
          },
          maxzoom: 10.5
        });
      });
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
.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right,
.mapboxgl-ctrl-logo {
  display: none;
}
</style>
