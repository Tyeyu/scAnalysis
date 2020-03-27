<template>
  <div id="bar">
    <div id="gpbar"></div>
    <div id="facet"></div>
  </div>
</template>

<script>
import G2 from "@antv/g2";
import { DataSet } from "@antv/data-set";
import { Chart } from "@antv/g2";
let echarts = require("echarts");

export default {
  name: "groupbar",
    data(){
      return{
          regionData: null,
          localData: null,
          inputData: null,
          percentData: null,
      };
    },
  mounted() {},
  methods: {
    chartInit() {
        let that=this;
        console.log(that.regionData);
        var myChart = echarts.init(document.getElementById("gpbar"));
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['本地', '输入'],
                right: '20%',
                itemHeight: 20,
            },
            grid: {
                left: '20%',
                right: '3%',
                bottom: '3%',
                top: '15%',
                height: '86%',
                containLabel: true
            },
            xAxis: {
                type: 'value'
            },
            yAxis: {
                type: 'category',

                data: ['四川达州','四川德阳','四川绵阳','四川遂宁','四川巴中','成都']
            },
            series: [
                {
                    name: '本地',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        show: true,
                        position: 'insideRight'
                    },
                    data: that.localData
                },
                {
                    name: '输入',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        show: true,
                        position: 'insideRight'
                    },
                    data: that.inputData
                },

            ]
        };
        myChart.setOption(option,true);
    },
      chartFacet() {
          var data = [
              {region: "成都", type: 'local',count: 27},
              {region: "成都", type: 'input',count: 35},
              {region: "四川巴中", type: 'local',count: 3},
              {region: "四川巴中", type: 'input',count: 21},
              {region: "四川遂宁", type: 'local',count: 8},
              {region: "四川遂宁", type: 'input',count: 3},
              {region: "四川绵阳", type: 'local',count: 3},
              {region: "四川绵阳", type: 'input',count: 2},
              {region: "四川德阳", type: 'local',count: 9},
              {region: "四川德阳", type: 'input',count: 3},
              {region: "四川达州", type: 'local',count: 6},
              {region: "四川达州", type: 'input',count: 12},

          ];
          const chart = new G2.Chart({
              container: "facet",
              forceFit: true,
              height: 210,
              top: '10%',
              padding: [19, 50, 20, 5]
          });
          chart.source(data);
          chart.legend(false);
          chart.coord("theta", {
              radius: 0.8
          });
          chart.facet("list", {
              fields: ["region"],
              cols: 1,
              padding: 8,
              colTitle: {
                  offsetY: -10,
                  style: {
                      fontSize: 12,
                      textAlign: "center",
                      fontWeight: 300,
                      fill: "#89398d"
                  }
              },
              eachView(view, facet) {
                  var ds = new DataSet();
                  var dv = ds.createView().source(data);
                  dv.transform({
                      type: 'percent',
                      field: 'count',
                      dimension: 'type',
                      as: 'percent'
                  });

                  view
                      .interval()
                      .position("percent")
                      .color("region")
                      .adjust('stack')

              }
          });
          chart.render();
      }

  },
  computed: {
    groupbardata() {
      return this.$store.getters.getgroupbardata;
    },
      ScTrackData() {
          return this.$store.getters.getscTrackData;
      },
  },
  watch: {
    //监听dailydata数据变化
    groupbardata: function(newval, oldval) {
      //图表数据变化后该执行的操作
        this.regionData=newval.region;
        this.localData=newval.local;
        this.inputData=newval.input;
        this.percentData=newval.percent;
        this.chartInit();
        this.chartFacet();
    },
      ScTrackData: function (newval, oldval) {
          var citydata={
              region: ['四川达州','四川德阳','四川绵阳','四川遂宁','四川巴中','成都'],
              local: [0,0,0,0,0,0],
              input: [0,0,0,0,0,0],
              percent: [0,0,0,0,0,0],
          };

          for(var i=0;i<newval.length;i++){
              for(var k=0;k<citydata.region.length;k++){
                  if(newval[i].city==citydata.region[k]&&(newval[i].InfectionType=='二代'||newval[i].InfectionType=='第二代'||newval[i].InfectionType=='第三代'))
                  {
                      citydata.local[k]++;
                  }
                  else if(newval[i].city==citydata.region[k]&&(newval[i].InfectionType=='一代'||newval[i].InfectionType=='第一代'))
                  {
                      citydata.input[k]++;
                  }
                  citydata.percent[k]=citydata.local[k]/(citydata.local[k]+citydata.input[k]);
              }
          }
          console.log(citydata);
          this.$store.commit("setgroupbardata", citydata);
      }
  }
};
</script>

<style>
#bar {
  position: absolute;
  top: 32.6%;
  left: 0.1%;
  width: 24.8%;
  height: 32.5%;
  border: 1px solid #dededd;
}
#gpbar {
  height: 90%;
  width: 90%;
  bottom: 1%;
}
#facet {
  bottom: 10%;
  height: 80%;
  width: 100px;
  top: 5%;
  position: absolute;
}
</style>
