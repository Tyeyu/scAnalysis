<template>
  <div id="map"></div>
</template>

<script>
import * as mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import * as d3 from "d3";
import * as dsv from "d3-dsv";
import * as d3geoVoronoi from "d3-geo-voronoi";
import hosImg from "../assets/timg.png";
import cImg from "../assets/cimg.png";
import * as turf from "@turf/turf";
import { feature } from "@turf/turf";
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
      populations: [
        { city: "成都", population: 1604.47 },
        { city: "自贡", population: 290.14 },
        { city: "攀枝花", population: 123.61 },
        { city: "泸州", population: 431.72 },
        { city: "德阳", population: 353.16 },
        { city: "绵阳", population: 483.56 },
        { city: "广元", population: 266 },
        { city: "遂宁", population: 323.59 },
        { city: "内江", population: 375.37 },
        { city: "乐山", population: 327.21 },
        { city: "南充", population: 641.79 },
        { city: "眉山", population: 297.48 },
        { city: "宜宾", population: 453 },
        { city: "广安", population: 325.03 },
        { city: "达州", population: 568.95 },
        { city: "雅安", population: 153.78 },
        { city: "巴中", population: 331.67 },
        { city: "资阳", population: 255.31 },
        { city: "阿坝", population: 94.01 },
        { city: "甘孜", population: 118.63 },
        { city: "凉山", population: 483.52 }
      ],
      cityActivity: [
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
      toggleableLayerIds: [
        "region-label",
        "city-outline",
        "dstrc-overlay",
        "dstrc-outline",
        "dstrc-label"
      ],
      counter: 0,
      sc_cityData: null,
      pointIdList: [],
      TCalendarDict: {},
      sourcePatient: 0, //模拟城市感染人数
      animationFrame: 0
    };
  },
  mounted() {
    this.map = "";
    this.mapInit();
    this.loadData();
    let that = this;

    this.map.on("load", function() {
      let res2 = axios.get("./api/sc_city.json").then(res => {
        var optscale = that.DiagnosisScale(that.quezheng);
        var qznest = that.DiagnosisNest(that.quezheng);
        var Pscale = that.PopulationScale();
        var Pnests = that.PopulationNest();
        var CActivScale = that.DiagnosisScale(that.cityActivity);
        var Cnests = that.DiagnosisNest(that.cityActivity);
        for (var i = 0; i < res.data.features.length; i++) {
          var rename = res.data.features[i].properties.name;
          var cname = rename.substring(0, 2);
          if (cname == "攀枝") {
            cname = cname + "花";
          }
          var reopt = optscale(qznest.get(cname)[0].value);
          res.data.features[i].properties["opt"] = reopt;
        }
        for (var i = 0; i < res.data.features.length; i++) {
          var rename = res.data.features[i].properties.name;
          var cname = rename.substring(0, 2);
          if (cname == "攀枝") {
            cname = cname + "花";
          }
          var reopt = Pscale(Pnests.get(cname)[0].population);
          res.data.features[i].properties["popt"] = reopt;
        }

        for (var i = 0; i < res.data.features.length; i++) {
          var rename = res.data.features[i].properties.name;
          var cname = rename.substring(0, 2);
          if (cname == "攀枝") {
            cname = cname + "花";
          }
          var reopt = CActivScale(Cnests.get(cname)[0].value);
          res.data.features[i].properties["copt"] = reopt;
        }

        that.sc_cityData = res.data;
        that.addcity2Map(res.data);
      });
      let res = axios.get("/api/sichuan_district.json").then(res => {
        that.adddistrict2Map(res.data);
        console.log(res.data.features);
      });
      let trackData = axios.get("/api/city_Track.json").then(res => {
        that.addTrack(res.data);
      });

      // let res3 = axios.get("/api/merge_sichuan.json").then(res => {
      //   that.addtown2Map(res.data);
      // });
    });
  },
  methods: {
    mapInit() {
      mapboxgl.accessToken =
        //"pk.eyJ1IjoiaG9uZ3l1amlhbmciLCJhIjoiY2s3N202NDIxMDhkdzNpcGg3djRtdnN4dCJ9.lysys8PBG25SxeHRF-sPvA";
        "pk.eyJ1Ijoid2VpeGluemhhbyIsImEiOiJjazBqYnFwY3owOGV4M25uMXlnc2tweTcxIn0.7Pk6JhKBB-nogxXiNTGnZQ";
      mapboxgl.setRTLTextPlugin(
        "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js"
      );

      this.map = new mapboxgl.Map({
        container: "map",
        //style: "mapbox://styles/mapbox/streets-v9",
        style: "mapbox://styles/weixinzhao/ckb6f7ox902kc1iml8zf1h4no",
        center: [99.031472, 26.515927],
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
        this.popUp("points_layer");
      });
      axios.get("/api/clincInfo.csv").then(clincRes => {
        let clinc_data = dsv.csvParse(clincRes.data);
        this.drawClinc(clinc_data);
        this.popUp("clincImage");
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
            radius: 5,
            description: d.address
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
          paint: {
            //指更精细的渲染样式，如不透明度、颜色和翻译等
            "circle-color": ["get", "color"],
            "circle-opacity": ["get", "opacity"],
            "circle-radius": ["get", "radius"]
          }
        });
      });
    },
    addTrack(data) {
      let that = this,
        routes = {
          type: "FeatureCollection",
          features: []
        },
        points = {
          type: "FeatureCollection",
          features: []
        },
        get_route_rawfeature = function(ori, des) {
          let a = {
            type: "Feature",
            geometry: { type: "LineString", coordinates: [ori, des] }
          };
          return a;
        },
        get_point_rawfeature = function(p) {
          let a = {
            type: "Feature",
            properties: { description: "" },
            geometry: { type: "Point", coordinates: p }
          };
          return a;
        };

      data.features.forEach((d, i) => {
        d.geometry.coordinates.forEach((v, j) => {
          let traj_length = v.length;

          if (v.length > 1) {
            for (let m = 0; m < v.length - 1; m++) {
              routes["features"].push(get_route_rawfeature(v[m], v[m + 1]));
            }
          }
          v.forEach(l => {
            points["features"].push(get_point_rawfeature(l));
          });
        });
      });

      routes["features"].forEach((d, i) => {
        let arc = [],
          lineDistance = turf.lineDistance(routes["features"][i], {
            units: "kilometers"
          }),
          destination =
            d.geometry.coordinates[d["geometry"]["coordinates"].length - 1],
          steps = 20;

        for (let j = 0; j < lineDistance; j += lineDistance / steps) {
          let segment = turf.along(routes["features"][i], j, {
            units: "kilometers"
          });
          arc.push(segment.geometry.coordinates);
        }
        arc.push(destination);

        d.geometry.coordinates = arc;
      });

      this.map.addSource("trac_json", {
        type: "geojson",
        lineMetrics: true,
        data: routes
      });

      that.map.addSource("trac_json_place", {
        type: "geojson",
        data: points
      });

      that.map.addLayer({
        id: "track",
        type: "line",
        source: "trac_json",
        paint: {
          "line-width": 1,
          "line-color": "#FCF9BD",
          "line-gradient": [
            "interpolate",
            ["linear"],
            ["line-progress"],
            0,
            "#B78B4B",
            0.1,
            "#CBA876",
            0.3,
            "#FFFFFF",
            0.5,
            "#FFFFFF",
            0.7,
            "#FFFFFF",
            0.9,
            "#CBA876",
            1,
            "#B78B4B"
          ]
        },
        layout: {
          "line-cap": "round",
          "line-join": "round",
          visibility: "none"
        }
      });

      that.map.addLayer({
        id: "track_place",
        source: "trac_json_place",
        type: "circle",
        paint: {
          "circle-color": "#898915",
          "circle-radius": 3,
          "circle-stroke-color": "#898915",
          "circle-stroke-opacity": 0.5,
          "circle-stroke-width": 1
        },
        layout: {
          visibility: "none"
        }
      });

      /*
      this.map.addSource("trac_json",{
        type:"geojson",
        data:{
          type:"FeatureCollection",
          features:data.features
        }
      });
      this.map.addLayer({
        id: "track",
        type: "line",
        source: "trac_json",
        paint: {
          "line-width": 2,
          "line-color": "red",
          "line-opacity": 0.5
        },
        layout:{
          "visibility": "none"
        }
      });

      */
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
          "text-color": "white"
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
        id: "population",
        type: "fill",
        source: "city_json",
        layout: {
          visibility: "none"
        },
        paint: {
          "fill-color": "#FF9933",
          "fill-opacity": ["get", "popt"]
        },
        maxzoom: 8.5
      });
      this.map.addLayer({
        id: "Activity",
        type: "fill",
        source: "city_json",
        layout: {
          visibility: "none"
        },
        paint: {
          "fill-color": "#77C0F5",
          "fill-opacity": ["get", "copt"]
        },
        maxzoom: 8.5
      });
      this.map.addLayer({
        id: "city-outline",
        type: "line",
        source: "city_json",
        paint: {
          "line-width": 1,
          "line-color": "white",
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
          "text-size": 15
        },
        paint: {
          "text-color": "white"
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
          "line-color": "white",
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
          "text-color": "white"
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
      let clickedLayer3 = "voronoi-overlay";
      let stateOfPOA = data.indexOf("POA");
      let stateOfCon = data.indexOf("contours");
      let stateOfVor = data.indexOf("voronoi-outline");
      let statePopu = data.indexOf("population");
      let stateOfHos = data.indexOf("hospitalImage");
      let stateOfClinc = data.indexOf("clincImage");
      let stateOfAct = data.indexOf("Activity");
      let stateOfTrac = data.indexOf("track");
      // console.log(stateOfCon);

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
        if (stateOfPOA == 2) {
          that.map.setLayoutProperty(clickedLayer1, "visibility", "visible"); // 设置指定layer上名为name的layou属性的值
        } else if (stateOfPOA == -1) {
          that.map.setLayoutProperty(clickedLayer1, "visibility", "none");
        }
        if (stateOfCon != -1) {
          that.map.setLayoutProperty("city-overlay", "visibility", "visible");
          // console.log("可见");
        } else if (stateOfCon == -1) {
          that.map.setLayoutProperty("city-overlay", "visibility", "none");
          // console.log("不可见");
        }
        if (stateOfVor != -1) {
          that.map.setLayoutProperty(clickedLayer2, "visibility", "visible");
          that.map.setLayoutProperty(clickedLayer3, "visibility", "visible");
        } else if (stateOfVor == -1) {
          that.map.setLayoutProperty(clickedLayer2, "visibility", "none");
          that.map.setLayoutProperty(clickedLayer3, "visibility", "none");
        }

        if (statePopu != -1) {
          that.map.setLayoutProperty("population", "visibility", "visible");
          // that.map.setLayoutProperty("city-outline", "visibility", "visible");
          // that.map.setLayoutProperty("region-label", "visibility", "visible");
        } else if (statePopu == -1) {
          that.map.setLayoutProperty("population", "visibility", "none");
          if (stateOfCon == -1 && stateOfAct == -1) {
            // that.map.setLayoutProperty("city-outline", "visibility", "none");
            // that.map.setLayoutProperty("region-label", "visibility", "none");
          }
        }
        if (stateOfHos != -1) {
          that.map.setLayoutProperty("hospitalImage", "visibility", "visible");
        } else if (stateOfHos == -1) {
          that.map.setLayoutProperty("hospitalImage", "visibility", "none");
        }
        if (stateOfClinc != -1) {
          that.map.setLayoutProperty("clincImage", "visibility", "visible");
        } else if (stateOfClinc == -1) {
          that.map.setLayoutProperty("clincImage", "visibility", "none");
        }
        if (stateOfTrac != -1) {
          that.map.setLayoutProperty("track", "visibility", "visible");
          that.map.setLayoutProperty("track_place", "visibility", "visible");
        } else if (stateOfTrac == -1) {
          that.map.setLayoutProperty("track", "visibility", "none");
          that.map.setLayoutProperty("track_place", "visibility", "none");
        }
        if (stateOfAct != -1) {
          that.map.setLayoutProperty("Activity", "visibility", "visible");
          // that.map.setLayoutProperty("city-outline", "visibility", "visible");
          // that.map.setLayoutProperty("region-label", "visibility", "visible");
        } else {
          that.map.setLayoutProperty("Activity", "visibility", "none");
          if (stateOfCon == -1 && statePopu == -1) {
            // that.map.setLayoutProperty("city-outline", "visibility", "none");
            // that.map.setLayoutProperty("region-label", "visibility", "none");
          }
        }
      });
    },
    //确诊比例尺
    DiagnosisScale: function(data) {
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
    },
    DiagnosisNest: function(data) {
      var nests = d3
        .nest()
        .key(function(d) {
          return d.name;
        })
        .map(data);
      return nests;
    },
    //人口比例尺
    PopulationScale: function() {
      var Pscale = d3
        .scaleLinear()
        .domain([
          d3.min(this.populations, function(d) {
            return d.population;
          }),
          d3.max(this.populations, function(d) {
            return d.population;
          })
        ])
        .range([0, 1]);
      return Pscale;
    },
    PopulationNest: function() {
      var Pnests = d3
        .nest()
        .key(function(d) {
          return d.city;
        })
        .map(this.populations);
      return Pnests;
    },
    //加载医院
    hospitalImageLayout: function(featuresdata) {
      let that = this;
      this.map.on("load", function() {
        that.map.loadImage(hosImg, function(error, image) {
          if (error) throw error;
          that.map.addImage("hospital", image);
          that.map.addSource("point", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: featuresdata
            }
          });
          that.map.addLayer({
            id: "hospitalImage",
            type: "symbol",
            source: "point",
            layout: {
              "icon-image": "hospital",
              "icon-size": 0.04,
              visibility: "none"
            }
          });
        });
      });
      this.popUp("hospitalImage");
    },
    //发热门诊
    drawClinc(data) {
      let that = this;
      let clincInfo = [];
      data.forEach(function(d, p, q) {
        d.lng = parseFloat(d.lng);
        d.lat = parseFloat(d.lat);
        clincInfo.push({
          type: "Feature",
          properties: {
            description: d["name"]
          },
          geometry: {
            type: "Point",
            coordinates: [d.lng, d.lat]
          }
        });
      });
      this.map.loadImage(cImg, function(error, image) {
        if (error) throw error;
        that.map.addImage("clinc", image);
        that.map.addSource("clinc_point", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: clincInfo
          }
        });
        that.map.addLayer({
          id: "clincImage",
          type: "symbol",
          source: "clinc_point",
          layout: {
            "icon-image": "clinc",
            "icon-size": 0.04,
            visibility: "none"
          }
        });
      });
    },
    popUp(id) {
      let that = this;
      this.map.on("click", id, function(e) {
        // 改变光标样式
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(that.map);
      });
      this.map.on("mouseenter", id, function() {
        that.map.getCanvas().style.cursor = "pointer";
      });
      this.map.on("mouseleave", id, function() {
        that.map.getCanvas().style.cursor = "";
      });
    },
    drawTrajectLine(linedata) {
      //取消地图浮层，保留地图市区边界线
      //清空轨迹线

      //绘制轨迹线
      //计算轨迹点

      let that = this,
        origin = [+linedata.centercity.lon, +linedata.centercity.lat],
        routes = {
          type: "FeatureCollection",
          features: []
        },
        points = {
          type: "FeatureCollection",
          features: []
        },
        sourceCircleAll = {
          type: "FeatureCollection",
          features: []
        },
        sourceCirclePatient = {
          type: "FeatureCollection",
          features: []
        },
        points_collection = [],
        get_route_rawfeature = function(ori, des) {
          let a = {
            type: "Feature",
            geometry: { type: "LineString", coordinates: [ori, des] }
          };
          return a;
        },
        get_point_rawfeature = function(p, place) {
          let description_text = "<strong>" + place + "</strong>";
          let a = {
            type: "Feature",
            properties: {
              description: description_text,
              place: place,
              strokewidth: 0,
              radius: 0
            },
            geometry: { type: "Point", coordinates: p }
          };
          return a;
        };

      sourceCircleAll["features"].push(
        get_point_rawfeature(origin, linedata.centercity.name)
      );
      sourceCirclePatient["features"].push(
        get_point_rawfeature(origin, linedata.centercity.name)
      );

      //adjust source circle radius - all people
      sourceCircleAll["features"][0]["properties"]["radius"] = (function(
        place
      ) {
        //limit radius to 3 - 15
        let populationDomain = that.populations.map((d, i) => d.population),
          scale = d3
            .scaleLinear()
            .domain([d3.min(populationDomain), d3.max(populationDomain)])
            .range([3, 20]);

        let population = that.populations.filter((d, i) => {
          if (d.city == place) {
            return 1;
          } else {
            return 0;
          }
        });
        return scale(population[0].population);
      })(sourceCircleAll["features"][0]["properties"]["place"]); //place population

      //adjust source circle radius - patient
      let getPatientCircle = function(city, patient) {
        //pow function
        let populationDomain = that.populations.map(
            (d, i) => d.population * 10000
          ),
          scale = d3
            .scalePow()
            .domain([d3.min(populationDomain), d3.max(populationDomain)])
            .range([3, 20])
            .exponent(3);

        return scale(patient);
      };

      // fly point animation data
      let flypoint = [],
        nowCityPatient = {},
        traj_num = 0;

      that.TCalendar.city.forEach((d, i) => {
        nowCityPatient[d.name] = d.value;
      });
      that.TCalendar.province.forEach((d, i) => {
        nowCityPatient[d.name] = d.value;
      });

      linedata.citys.forEach((d, i) => {
        let destination = null,
          route_feature = null,
          lineDistance = null,
          place = d.name,
          arc = [],
          steps = 20;

        destination = [+d.lon, +d.lat];

        // when has patient draw fly and trajectory
        if (nowCityPatient[place] > 0) {
          flypoint.push([origin, destination]);

          routes["features"].push(get_route_rawfeature(origin, destination));
          points["features"].push(get_point_rawfeature(destination, place));

          points_collection.push({
            place: place,
            feature: {
              type: "FeatureCollection",
              features: [get_point_rawfeature(destination, place)]
            }
          });
          that.pointIdList.push("related_place_" + traj_num);

          lineDistance = turf.lineDistance(routes["features"][traj_num], {
            units: "kilometers"
          });

          for (var j = 0; j < lineDistance; j += lineDistance / steps) {
            var segment = turf.along(routes["features"][traj_num], j, {
              units: "kilometers"
            });
            arc.push(segment.geometry.coordinates);
          }

          arc.push(destination);
          routes["features"][traj_num].geometry.coordinates = arc;
          traj_num++;
        }
      });

      //layer status

      if (
        typeof this.map.getLayer("id_related_traj") === "undefined" &&
        typeof this.map.getLayer("id_related_place") === "undefined"
      ) {
        // Remove map layer & source.

        // add popup
        let popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        that.map.addSource("related_traj", {
          type: "geojson",
          lineMetrics: true,
          data: routes
        });

        that.map.addSource("source_circle_all", {
          type: "geojson",
          data: sourceCircleAll
        });

        that.map.addSource("source_circle_patient", {
          type: "geojson",
          data: sourceCirclePatient
        });

        that.map.addLayer({
          id: "id_related_traj",
          source: "related_traj",
          type: "line",
          paint: {
            "line-width": 3,
            "line-color": "#FCF9BD",
            "line-gradient": [
              "interpolate",
              ["linear"],
              ["line-progress"],
              0,
              "#B78B4B",
              0.1,
              "#CBA876",
              0.3,
              "#FFFFFF",
              0.5,
              "#FFFFFF",
              0.7,
              "#FFFFFF",
              0.9,
              "#CBA876",
              1,
              "#B78B4B"
            ]
          },
          layout: {
            "line-cap": "round",
            "line-join": "round"
          }
        });

        //source point all people
        that.map.addLayer({
          id: "id_source_circle_all",
          source: "source_circle_all",
          type: "circle",
          paint: {
            "circle-color": "#4682B4",
            "circle-radius": ["get", "radius"],
            "circle-opacity": 0.8,
            "circle-stroke-color": "#4682B4",
            "circle-stroke-opacity": 0.5,
            "circle-stroke-width": 0
          }
        });

        //source point patient

        that.map.addLayer({
          id: "id_source_circle_patient",
          source: "source_circle_patient",
          type: "circle",
          paint: {
            "circle-color": "red",
            "circle-radius": 0,
            "circle-opacity": 0.7
          }
        });

        //that.map.setPaintProperty('id_source_circle_all', 'circle-radius', sourceCircleAll['features'][0]['properties']['radius'])

        points_collection.forEach((d, i) => {
          that.map.addSource(that.pointIdList[i], {
            type: "geojson",
            data: d["feature"]
          });
          that.map.addLayer({
            id: that.pointIdList[i] + "_layer",
            source: that.pointIdList[i],
            type: "circle",
            paint: {
              "circle-color": "#898915",
              "circle-radius": 5,
              "circle-stroke-color": "#898915",
              "circle-stroke-opacity": 0.5,
              "circle-stroke-width": ["get", "strokewidth"]
            },
            metadata: {
              place: d.place
            }
          });

          that.map.on("mouseenter", that.pointIdList[i] + "_layer", function(
            e
          ) {
            let coordinates = e.features[0].geometry.coordinates.slice();
            let description = e.features[0].properties.description;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            popup
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(that.map);
          });

          that.map.on("mouseleave", that.pointIdList[i] + "_layer", function() {
            that.map.getCanvas().style.cursor = "";
            popup.remove();
          });

          that.map.setLayoutProperty(
            that.pointIdList[i] + "_layer",
            "visibility",
            "visible"
          );
        });

        // origin
        that.map.on("mouseenter", "id_source_circle_all", function(e) {
          let coordinates = e.features[0].geometry.coordinates.slice();
          let description = e.features[0].properties.description;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          popup
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(that.map);
        });

        // origin
        that.map.on("mouseleave", "id_source_circle_all", function() {
          that.map.getCanvas().style.cursor = "";
          popup.remove();
        });

        that.map.setLayoutProperty("id_related_traj", "visibility", "visible");
        that.map.setLayoutProperty(
          "id_source_circle_all",
          "visibility",
          "visible"
        );
        that.map.setLayoutProperty(
          "id_source_circle_patient",
          "visibility",
          "visible"
        );

        animateSourcePlaceStorkeRadius(0);
      }

      function sourcePlaceStorkeRadius(angle) {
        let radius = 15,
          size = Math.sin(angle) * radius;
        size = size > 0 ? size : -size;
        return size;
      }

      function sourcePlaceStorkeRadius_dynamic(place, angle) {
        let radius = that.TCalendarDict[place];
        if (that.TCalendarDict[place] == undefined) {
          radius = 0;
        }

        let size = Math.sin(angle) * Math.sqrt(radius);
        size = size > 0 ? size : -size;
        return size;
      }

      function animateSourcePlaceStorkeRadius(timestamp) {
        points_collection.forEach((d, i) => {
          that.map.setPaintProperty(
            that.pointIdList[i] + "_layer",
            "circle-stroke-width",
            sourcePlaceStorkeRadius_dynamic(
              that.map.getLayer(that.pointIdList[i] + "_layer").metadata.place,
              (timestamp + 500) / 1000
            )
          );
        });
        that.map.setPaintProperty(
          "id_source_circle_patient",
          "circle-radius",
          getPatientCircle(linedata.centercity.name, that.sourcePatient)
        );
        //that.map.setPaintProperty ('id_source_circle_all', 'circle-stroke-width', sourcePlaceStorkeRadius(timestamp / 1000)) //source all person

        //that.map.setPaintProperty ('id_related_place', 'circle-stroke-width', sourcePlaceStorkeRadius((timestamp + 500) / 1000))

        // fly circle animation
        that.animationFrame++;
        if (that.animationFrame > 60 && that.nowTab == "second") {
          that.animationFrame = 0;
          // get origin destination list
          console.log("fly~");
          flypoint.forEach((d, i) => {
            let randomTime = Math.random() * 100;
            setTimeout(that.patientMoveAnimate(d[0], d[1]), randomTime);
          });
        }
        requestAnimationFrame(animateSourcePlaceStorkeRadius);
      }
    },
    patientMoveAnimate(origin, destination) {
      let that = this,
        source_fly = getUniqueId("source_fly_", origin, destination),
        source_route = getUniqueId("source_route_", origin, destination),
        layer_fly = getUniqueId("layer_fly_", origin, destination),
        layer_route = getUniqueId("layer_route_", origin, destination),
        point = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: origin
              }
            }
          ]
        },
        route = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [origin, destination]
              }
            }
          ]
        },
        lineDistance = turf.lineDistance(route.features[0], {
          units: "kilometers"
        }),
        arc = [],
        steps = 60,
        counter = 0;

      for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        let segment = turf.along(route.features[0], i, { units: "kilometers" });
        arc.push(segment.geometry.coordinates);
      }

      arc.push(destination);
      route.features[0].geometry.coordinates = arc;

      this.map.addSource(source_route, {
        type: "geojson",
        data: route
      });

      this.map.addSource(source_fly, {
        type: "geojson",
        data: point
      });

      this.map.addLayer({
        id: layer_fly,
        source: source_fly,
        type: "circle",
        paint: {
          "circle-color": "#E80000",
          "circle-radius": 3,
          "circle-opacity": 1
        }
      });

      function animate() {
        point.features[0].geometry.coordinates =
          route.features[0].geometry.coordinates[counter];
        point.features[0].properties.bearing = turf.bearing(
          turf.point(
            route.features[0].geometry.coordinates[
              counter >= steps ? counter - 1 : counter
            ]
          ),
          turf.point(
            route.features[0].geometry.coordinates[
              counter >= steps ? counter : counter + 1
            ]
          )
        );
        that.map.getSource(source_fly).setData(point);

        if (counter < steps) {
          requestAnimationFrame(animate);
        } else if (counter >= steps) {
          let ent_layer_fly = that.map.getLayer(layer_fly),
            ent_layer_route = that.map.getLayer(layer_route),
            ent_source_fly = that.map.getSource(layer_route),
            ent_source_route = that.map.getSource(source_route);

          if (typeof ent_layer_fly !== "undefined") {
            that.map.removeLayer(layer_fly);
          }

          if (typeof ent_layer_route !== "undefined") {
            that.map.removeLayer(layer_route);
          }

          if (typeof ent_source_fly !== "undefined") {
            that.map.removeSource(source_fly);
          }

          if (typeof ent_source_route !== "undefined") {
            that.map.removeSource(source_route);
          }
        }
        counter = counter + 1;
      }

      function getUniqueId(front, origin, destination) {
        let basic =
          (origin[0] + origin[1] + destination[0] + destination[1]) *
          Math.random();
        return front + String(basic).replace(".", "");
      }
      animate(counter);
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
    },
    timeRange() {
      return this.$store.getters.gettimeRange;
    },
    hosImageData() {
      return this.$store.getters.gethosImageData;
    },
    Activity() {
      return this.$store.getters.getcityActivity;
    },
    mapQXLinedata() {
      return this.$store.getters.getTMapLinedata;
    },
    nowTab() {
      return this.$store.getters.gettabeselect;
    },
    TCalendar() {
      return this.$store.getters.getTCalendar;
    },
    Ttotaldata() {
      return this.$store.getters.getTtotaldata;
    }
  },
  watch: {
    //监听dailydata数据变化
    mapdata: function(newval, oldval) {},
    maptooldata: function(newval, oldval) {
      // console.log(newval);
      this.changeLayer(newval);
    },
    vorfeaters: function(newval, oldval) {
      let that = this;
      var area_arry = [];
      newval.forEach(d => {
        area_arry.push(d.properties.area);
      });
      var Ascale = d3
        .scaleLinear()
        .domain([d3.min(area_arry), d3.max(area_arry)])
        .range([0, 1]);
      newval.forEach(d => {
        d.properties["asc"] = Ascale(d.properties.area);
      });

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
            "line-color": "white",
            "line-opacity": 1
          },
          maxzoom: 10.5
        });
        that.map.addLayer({
          id: "voronoi-overlay",
          type: "fill",
          source: "voronoi",
          layout: {
            visibility: "none"
          }, //指渲染位置和可见性
          paint: {
            "fill-color": "steelblue",
            // "fill-color": "#FF9933",
            "fill-opacity": ["get", "asc"]
          },
          maxzoom: 8.5
        });
      });
    },
    timeRange: function(newval, oldval) {
      var mergerdata = this.$store.getters.getscMergerData;
      var timeRange = [
        new Date(this.$store.getters.gettimeRange[0]),
        new Date(this.$store.getters.gettimeRange[1])
      ];
      this.quezheng = [];
      var citys = [
        "成都",
        "自贡",
        "攀枝花",
        "泸州",
        "德阳",
        "绵阳",
        "广元",
        "遂宁",
        "内江",
        "乐山",
        "南充",
        "宜宾",
        "广安",
        "达州",
        "巴中",
        "雅安",
        "眉山",
        "资阳",
        "阿坝",
        "甘孜",
        "凉山"
      ];
      for (var i = 0; i < mergerdata.length; i++) {
        // console.log(newval[i].city);
        var dates = mergerdata[i].date;
        dates = new Date(
          2020,
          parseInt(dates.split("月")[0]) - 1,
          dates.split("月")[1].split("日")[0]
        );
        // if (dates.getTime() == timeRange[0].getTime()) {
        //   citys.push(mergerdata[i]);
        // }
        var x = new Date("2020-1-20");
        x.getDate();
        if (
          dates.getMonth() == timeRange[1].getMonth() &&
          dates.getDate() == timeRange[1].getDate()
        ) {
          // console.log(mergerdata[i]);
          if (mergerdata[i].city != "") {
            for (var j = 0; j < citys.length; j++) {
              if (citys[j] == mergerdata[i].city) {
                var value = parseInt(mergerdata[i].accumulativeDiagnosis);
                // parseInt(citys[j].accumulativeDiagnosis);
                if (isNaN(value)) {
                  value = 0;
                }
                this.quezheng.push({
                  name: mergerdata[i].city,
                  value: value
                });
                break;
              }
            }
          }
        }
      }
      var optscale = this.DiagnosisScale(this.quezheng);
      var qznest = this.DiagnosisNest(this.quezheng);
      for (var i = 0; i < this.sc_cityData.features.length; i++) {
        var rename = this.sc_cityData.features[i].properties.name;
        var cname = rename.substring(0, 2);
        if (cname == "攀枝") {
          cname = cname + "花";
        }
        if (qznest.get(cname) == undefined) {
          this.sc_cityData.features[i].properties["opt"] = 0;
          continue;
        }
        var reopt = optscale(qznest.get(cname)[0].value);
        if (qznest.get(cname)[0].value == 0) {
          this.sc_cityData.features[i].properties["opt"] = 0;
        } else {
          this.sc_cityData.features[i].properties["opt"] = reopt;
        }
      }
      this.map.getSource("city_json").setData({
        type: "FeatureCollection",
        features: this.sc_cityData.features
      });
    },
    hosImageData: function(newval, oldval) {
      this.hospitalImageLayout(newval);
    },
    Activity: function(newval, oldval) {
      if (this.sc_cityData == null) {
        return;
      }
      var CActivScale = this.DiagnosisScale(newval);
      var Cnests = this.DiagnosisNest(newval);
      for (var i = 0; i < this.sc_cityData.features.length; i++) {
        var rename = this.sc_cityData.features[i].properties.name;
        var cname = rename.substring(0, 2);
        if (cname == "攀枝") {
          cname = cname + "花";
        }
        var reopt = CActivScale(Cnests.get(cname)[0].value);
        this.sc_cityData.features[i].properties["copt"] = reopt;
      }
      this.map.getSource("city_json").setData({
        type: "FeatureCollection",
        features: this.sc_cityData.features
      });
    },
    mapQXLinedata: function(newval, oldval) {
      this.drawTrajectLine(newval);
    },
    nowTab: function(newval, oldval) {
      let that = this;
      if (newval == "first") {
        if (typeof this.map.getLayer("id_related_traj") !== "undefined") {
          that.map.setLayoutProperty("id_related_traj", "visibility", "none");
          that.map.setLayoutProperty(
            "id_source_circle_all",
            "visibility",
            "none"
          );
          that.map.setLayoutProperty(
            "id_source_circle_patient",
            "visibility",
            "none"
          );
          that.pointIdList.forEach((d, i) => {
            that.map.setLayoutProperty(d + "_layer", "visibility", "none");
          });
        }
      } else if (newval == "second") {
        //设置模拟轨迹为可见
        if (typeof this.map.getLayer("id_related_traj") !== "undefined") {
          that.map.setLayoutProperty(
            "id_related_traj",
            "visibility",
            "visible"
          );
          that.map.setLayoutProperty(
            "id_source_circle_all",
            "visibility",
            "visible"
          );
          that.map.setLayoutProperty(
            "id_source_circle_patient",
            "visibility",
            "visible"
          );
          that.pointIdList.forEach((d, i) => {
            that.map.setLayoutProperty(d + "_layer", "visibility", "visible");
          });
        }
      }
    },
    TCalendar: function(newval, oldval) {
      let that = this;
      newval.city.forEach((d, i) => {
        that.TCalendarDict[d.name] = d.value;
      });
      newval.province.forEach((d, i) => {
        that.TCalendarDict[d.name] = d.value;
      });
    },
    Ttotaldata: function(newval, oldval) {
      this.sourcePatient = newval.total[newval["total"].length - 1];
    }
  }
};
</script>

<style>
@import url("../../node_modules/mapbox-gl/dist/mapbox-gl.css");
#map {
  position: absolute;
  top: 5.1%;
  left: 0.3%;
  width: 99.7%;
  height: 94%;
  border: 1px #7a7a7a;
}
/*
map color inverse
canvas.mapboxgl-canvas {
  filter: invert(1);
}
*/
.mapboxgl-popup {
  max-width: 400px;
  font: 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
}
.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right,
.mapboxgl-ctrl-logo {
  display: none;
}
</style>
