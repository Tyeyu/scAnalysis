<template>
  <div id="map"></div>
</template>

<script>
  import * as mapboxgl from 'mapbox-gl';
  let axios = require('axios')
  export default{
    name:'mapview',

    mounted(){
      this.map = ''
      this.mapInit();

      let that = this

      this.map.on('load', function() {
		  let res2 = axios.get('./api/sc_city.json').then(res => {
            console.log(res.data)
            that.addcity2Map(res.data)
          })
          let res = axios.get('/api/merge_sichuan.json').then(res => {
            console.log(res.data)
            that.addtown2Map(res.data)
          })

      })
    },

    methods:{
      mapInit(){
        mapboxgl.accessToken = 'pk.eyJ1IjoiaG9uZ3l1amlhbmciLCJhIjoiY2s3N202NDIxMDhkdzNpcGg3djRtdnN4dCJ9.lysys8PBG25SxeHRF-sPvA'

        this.map = new mapboxgl.Map({
          container:'map',
          style: 'mapbox://styles/mapbox/light-v9',
          center:[101.9199,30.1904],
          zoom:6,
        })


      },
      addtown2Map(features){
            this.map.addSource("town_json", {
              "type": "geojson",
              "data": {
                  "type": "FeatureCollection",
                  "features": features.features
              },
            })
            this.map.addLayer({
              "id": "county-overlay",
              "type": "fill",
              "source": "town_json",
              "paint": {
                  "fill-color": "#aca",
                  "fill-opacity": 0.1
              },
              minzoom:8.5,
            });

            this.map.addLayer({
             "id": "county-outline",
             "type": "line",
              "source": "town_json",
              "paint": {
                  'line-width': 1,
                  'line-color': "#000",
                  'line-opacity': 1,
              },
              minzoom:8.5
            });
            this.map.addLayer({
                    "id": "county-label",
                    "type": "symbol",
                    "source": "town_json",
                    "layout": {
                      "text-field": "{name}",
                      "text-size": 10,

                    },
                    "paint": {
                       "text-color": '#333'
                    },
                    minzoom:8.5
                });
          },


          addcity2Map(features){
                this.map.addSource("city_json", {
                  "type": "geojson",
                  "data": {
                      "type": "FeatureCollection",
                      "features": features.features
                  },
                })
                this.map.addLayer({
                  "id": "city-overlay",
                  "type": "fill",
                  "source": "city_json",
                  "paint": {
                      "fill-color": "#aca",
                      "fill-opacity": 0.1
                  },
                  maxzoom:8.5

                });

                this.map.addLayer({
                 "id": "city-outline",
                 "type": "line",
                  "source": "city_json",
                  "paint": {
                      'line-width': 1,
                      'line-color': "#000",
                      'line-opacity': 1,
                  },
                  maxzoom:8.5
                });
                this.map.addLayer({
                        "id": "region-label",
                        "type": "symbol",
                        "source": "city_json",
                        "layout": {
                          "text-field": "{name}",
                          "text-size": 12,

                        },
                        "paint": {
                           "text-color": '#333'
                        },
                        maxzoom:8.5
                    });

              }

    }



  }

</script>

<style>
 #map{
   width: 100%;
   height: 600px;
 }
</style>
