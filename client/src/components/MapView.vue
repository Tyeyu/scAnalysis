<template>
  <div id="map">
    <div id="menu"></div>
  </div>
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
      ],
      toggleableLayerIds:[
         "region-label",
        "city-outline",
        "county-outline",
        "county-overlay",
        "county-label",
        "city-overlay",
        "region-label",
        "dstrc-overlay",
        "dstrc-outline",
        "dstrc-label",
      ],
      counter:0,
    };
  },
  mounted() {
    this.map = "";
    this.mapInit();
    this.loadData();
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
      // let res3 = axios.get("/api/merge_sichuan.json").then(res => {
      //   // console.log(res.data);
      //   that.addtown2Map(res.data);
      // });
    });
    this.visLayer();
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
    loadData() {
      axios.get("../static/latlon.json").then(response => {
        let _data = response.data;
        // console.log(_data);
        this.addArrestPoint(_data);
      });
    },
    addArrestPoint(data) {
      let drawPoints = [];
      let mapData = data.RECORDS;
      //   console.log(mapData);
      mapData.forEach(d => {
        // console.log(d.lon,d.lat)
        drawPoints.push({
          type: "Feature",
          properties: {
            color: "red",
            opacity: 0.8,
            radius: 10
          },
          geometry: {
            type: "Point",
            coordinates: [d.lon, d.lat]
          }
        });
      });
      //   console.log(drawPoints)
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
    },
    visLayer() {
      let that = this;
      var link1 = document.createElement("a"); /* 创建a标签 */
      var link2 = document.createElement("a"); /* 创建a标签 */
      link1.href = "#";
      link1.className = "active";
      link1.textContent = "POA";
      link2.href = "#";
      link2.className = "active";
      link2.textContent = "contours";
      let counter1 = that.counter
      let counter2 = that.counter
      link1.onclick = function(e) {
        /* 设置onclick事件回调函数 */
        counter1 = counter1 + 1;
        var clickedLayer = this.textContent; /* textContent 属性设置或返回指定节点的文本内容，以及它的所有后代 */
        var clickedLayer = "points_layer";
        e.preventDefault();
        e.stopPropagation();
        if(counter1 == 1){
          that.map.setLayoutProperty(clickedLayer, "visibility", "visible");
        }
        var visibility = that.map.getLayoutProperty(clickedLayer,"visibility"); /* getLayoutProperty(layer, name) 返回指定style layer上名为name的layout属性的值*/
        console.log(visibility);
        if (visibility === "visible") {
          that.map.setLayoutProperty(clickedLayer, "visibility", "none");// 设置指定layer上名为name的layou属性的值
          console.log("ghdkjhgdkjhfkj")
          this.className = "";
        } else {
          this.className = "active";
          console.log("jinlaimy")
          that.map.setLayoutProperty(clickedLayer, "visibility", "visible");
        }
      };
      let toggleableLayerIds =  that.toggleableLayerIds;
      link2.onclick = function(e) {
        counter2 = counter2 + 1;
        for (var i = 0; i < toggleableLayerIds.length; i++) {
          /* 设置onclick事件回调函数 */
          var clickedLayer =
            toggleableLayerIds[
              i
            ]; /* textContent 属性设置或返回指定节点的文本内容，以及它的所有后代 */
          e.preventDefault();
          e.stopPropagation();
          console.log(clickedLayer);
          if(counter2 == 1){
          that.map.setLayoutProperty(clickedLayer, "visibility", "visible");
        }
          var visibility = that.map.getLayoutProperty(
            clickedLayer,
            "visibility"
          ); /* getLayoutProperty(layer, name) 返回指定style layer上名为name的layout属性的值*/
          console.log(visibility);
          if (visibility === "visible") {
            that.map.setLayoutProperty(clickedLayer, "visibility", "none");
             /* setLayoutProperty(layer, name, value)设置指定layer上名为name的layou属性的值 */
            this.className = "";
          } else {
            this.className = "active";
            console.log("jinlaimy")
            that.map.setLayoutProperty(clickedLayer, "visibility", "visible");
          }
        }
      };

      var layers = document.getElementById("menu");

      layers.appendChild(link1);
      layers.appendChild(
        link2
      ); /* appendChild() 方法向节点添加最后一个子节点,此处即向menu后面添加link节点 */
      //   }
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
#menu {
        background: #fff;
        position: absolute;
        z-index: 1;
        top: 10px;
        left: 10px;
        border-radius: 3px;
        width: 120px;
        border: 1px solid rgba(0,0,0,0.4);
        font-family: 'Open Sans', sans-serif;
    }
 
    #menu a {
        font-size: 13px;
        color: #404040;
        display: block;
        margin: 0;
        padding: 0;
        padding: 10px;
        text-decoration: none;
        border-bottom: 1px solid rgba(0,0,0,0.25);
        opacity: 0.5;
        text-align: center;
    }
     #menu a:hover {
        background-color: #f8f8f8;
        opacity: 0.5;
        color: #404040;
    }
 
    #menu a.active {
        background-color: #30313a;
        opacity: 0.5;
        color: #ffffff;
    }
 
    #menu a.active:hover {
        background: #3074a4;
        opacity: 0.5;
    }
    #menu a:last-child {
        border: none;
    }
</style>
