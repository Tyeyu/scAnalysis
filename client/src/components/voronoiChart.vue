<template>
  <div id = "voronoiMap"></div>
</template>

<script>

const d3 = require('d3');
const $ = require('jquery');

import * as dsv from 'd3-dsv';
var turf = require('turf');
var geojsonArea = require('geojson-area');
let axios = require("axios");

export default{
    name:"voronoichart",
    mounted:function(){

        axios.get("/api/position.csv").then(PositionRes=>{
            axios.get("/api/sc_city.json").then(MapRes=>{
              
              let HosPosition = dsv.csvParse(PositionRes.data)
              let mapdata = MapRes.data;
              this.map_data = mapdata;
              this.hos_data = HosPosition;
              // console.log(this.hos_data);
              // console.log("features",this.map_data.features);
              this.AddVoronoi(this.map_data,this.hos_data)

            })
      })
      

    },

    watch:{

    },

    methods:{

        AddVoronoi(MapData,HosData){

          var width = window.innerWidth*0.69;
          var height = window.innerHeight*0.6;
          var that = this;

          var zoom = d3.zoom()
              .scaleExtent([0.2, 200])
              .on("zoom", zoomed);

          this.scale = 1
						 
        	function zoomed() {
                that.container.attr("transform", "translate(" + 
								d3.event.transform.x + ","+ 
								d3.event.transform.y +")scale(" + 
                d3.event.transform.k + ")");
                console.log("123")

                d3.selectAll('.location').attr('r', 2 / d3.event.transform.k)
                d3.selectAll('.cell').attr('stroke-width',1/d3.event.transform.k);
                that.scale = d3.event.transform.k; //调用zoomed函数时scale才会有定义
							
        	}

        	var map_container = d3.select('#voronoiMap')
							.append("svg")
							.attr("width", width)
							.attr("height", height)
							.append("g")
              .call(zoom);

              
        	//定义地图投影
        	var projection = d3.geoMercator()
							.center([100, 29])
							.scale(14000)
              // .translate([this.width / 2-200 , this.height / 2 +250]);
              .translate([width / 4-200 , height / 3 +280]);

        	//定义路径
        	var path = d3.geoPath()
        		 	.projection(projection);
				
          this.container = map_container.append("g");
					
			
					//开始加载地图
          var regionGroups = this.container.append("g")
          var voronoiLayer = this.container.append("g")

					regionGroups.selectAll("path")
							.data(MapData.features)
							.enter()
							.append("path")
              .attr("class", "province")
              .style("fill", "steelblue")
              .attr("fill-opacity",0.6)
              .attr("d", path);     
              
          console.log(HosData)

          let positions = [];
          HosData.forEach(function(d,p,q){
            d.lng = parseFloat(d.lng);
            d.lat = parseFloat(d.lat);
            console.log("number",d.number)        
            positions.push(projection([d.lng,d.lat])); 
            positions[p].number = d.number;
          })
          //console.log("positions",positions)

          const _voronoi = d3.voronoi()
            // .extent([[-1, -1],[innerWidth+1,innerHeight+1]])
          
          const polygons = _voronoi(positions).polygons();

          console.log("polygons",polygons)
            
          // let AreaData = []
          // //构造poly1 poly2计算相交的面积
          // polygons.forEach(d => {
          //   let points = [];
          //   points[0] = [];
          //   for (var i = 0; i < d.length; i++) {
          //       points[0][i] = [];
          //       points[0][i]= projection.invert([d[i][0],d[i][1]])
          //   }
          //   points[0][d.length] = projection.invert([d[0][0],d[0][1]])//首尾连接
          //   MapData.geometry.coordinates[0][MapData.geometry.coordinates.length]=MapData.geometry.coordinates[0][0]
          //   let poly1 = turf.polygon(points)
          //   let poly2 = turf.polygon(MapData.geometry.coordinates)
          //   var intersection = turf.intersect(poly1, poly2);
          //   if(intersection){

          //     var area_intersection = turf.area(intersection);
          //     AreaData.push({"key":d.data.key,"area":area_intersection/1000000,"name":d.data.name,"polyg":d})
          //   }
          // })

          // console.log(AreaData)
          // that.$root.$emit('AreaData',AreaData)
          
            var clipPath = this.container
            .append("clipPath")
            .attr("id","myclipPath");

          clipPath.selectAll(".path")
            .data(MapData.features)
            .enter()
            .append("path")
            .attr("d",path)
              
              
            //境界表示
            voronoiLayer.selectAll(".cell")
              .data(polygons)
              .enter()
              .append("path")
              .attr("class", "cell")
              // .attr("id",function(d){
              //   return d.data.key
              // })
              .attr("fill", "blue")
              .attr("fill-opacity",0)
              .attr("stroke", "white")
              .attr("clip-path","url(#myclipPath)")
              .attr("d",function(d){
                if(d!=undefined){
                  return  "M" + d.join("L")+ "Z";
                }
              } )
          
        },
        
        // highLightVoronoi(data){
          
        //     d3.selectAll(".cell")
        //     .attr("fill","steelblue")
        //     .attr("fill-opacity",0.6)

        //     //console.log(d3.select('#' + d))
        

        //   data.forEach(d=>{
        //     d3.select('#' + d)
        //     .attr("fill","#F26101")
        //     .attr("fill-opacity",1)
            

        //   })

        // }
 

    }
}
</script>
<style lang="css">


#voronoiMap{
  
  position: absolute;
  top: 0.1%;
  left: 30.2%;
  width: 69%;
  height: 60%;
  border: 1px solid #ccc;
}

.province {
			stroke: black;
			stroke-width: 1px;
}


</style>