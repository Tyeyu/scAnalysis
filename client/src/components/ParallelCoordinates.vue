<template>
  <div id="Coordinates" class="Coordinates-angel">
    <div>
      <span>相关因素</span>
      <p>确诊人数排序</p>
      <div style="transform: translate(120%, 20%); float:left"> 
        <el-button 
          size="mini" 
          icon="el-icon-caret-top" 
          circle 
          @click="seriesdata_sort_ascend()" 
          style="background:#212232; color:white; border: 0px"></el-button>
        <el-button 
          size="mini" 
          icon="el-icon-caret-bottom" 
          circle 
          @click="seriesdata_sort_desascend()" 
          style="background:#212232; color:white; border: 0px"></el-button>
      </div>
    </div>
    <div id="CoorEcharts"></div>
  </div>
</template>
<script>
//平行坐标图
import echarts from "echarts";
import * as d3 from "d3";
export default {
  data() {
    return {
      lineStyle: {
        normal: {
          width: 0.8,
          opacity: 1
        }
      },
      seriesdata: null,
      seriesdataStore: null,
      sortedNum: 10,
      hospitalmap: null,
      migraComputmap: null,
      mergcomputmap: null,
      populationmap: null,
      citys: []
    };
  },
  methods: {
    initchart: function() {
      let that = this;
      var echartDom = document.getElementById("CoorEcharts");
      //初始化
      var myChart = echarts.init(echartDom);

      var schema = [
        { name: "city", index: 0, text: "地区" },
        { name: "AQIindex", index: 1, text: "确诊人数" },
        { name: "PM25", index: 2, text: "治愈率" },
        { name: "PM10", index: 3, text: "死亡率" },
        { name: "CO", index: 4, text: "活跃度" },
        { name: "SO2", index: 5, text: "医院数" },
        { name: "等级", index: 6, text: "门诊数" },
        { name: "P", index: 7, text: "人口(万)" }
      ];
      var option = {
        textStyle: {
          color: "#ffffff"
        },
        // color:['#dd6b66','#73B9BC','#E69D87','#8DC1A9','#EA7E53','#EEDD78','#73A373','#759AA0','#7289AB','#91CA8C','#F49F42','#FFFFFF'],
        color: [
          "#F78BA9",
          "#29B357",
          "#eeb8c3",
          "#11659a",
          "#96c24e",
          "#d2b116",
          "#f2481b",
          "#77D4BC",
          "#8AF3F6",
          "#A28EF5",
          "#C2F3E6",
          "#7B9ED6"
        ],
        parallelAxis: [
          {
            dim: 0,
            name: schema[0].text,
            textStyle: {
              color: "#ffffff"
            },
            type: "category"
          },
          {
            dim: 1,
            name: schema[1].text
          },
          { dim: 2, name: schema[2].text },
          { dim: 3, name: schema[3].text },
          { dim: 4, name: schema[4].text },
          { dim: 5, name: schema[5].text },
          { dim: 6, name: schema[6].text },
          { dim: 7, name: schema[7].text }
        ],
        parallel: {
          top: "20%",
          left: "3%",
          right: "10%",
          height: "76%",
          bottom: 100,
          parallelAxisDefault: {
            type: "value",
            name: "疫情tu",
            nameLocation: "end",
            nameGap: 20,
            nameTextStyle: {
              color: "white",
              fontSize: 12
            },
            axisLine: {
              lineStyle: {
                color: "white"
              }
            },
            axisTick: {
              lineStyle: {
                color: "white"
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: "white"
            }
          }
        },
        series: that.seriesdata
      };
      myChart.setOption(option, true);
    },
    hospitaldata: function(newval) {
      this.hospitalmap = d3
        .nest()
        .key(function(d) {
          return d.city;
        })
        .map(newval.hospital);
    },
    migrationdata: function(newval) {
      var migradata = newval.Migration;
      //在给定时间范围内计算迁入迁出平均比例
      var timeRange = [
        new Date(this.$store.getters.gettimeRange[0]),
        new Date(this.$store.getters.gettimeRange[1])
      ];
      var playcheck = this.$store.getters.getplaycheck;
      let migrations = [];
      for (var i = 0; i < migradata.length; i++) {
        var mdate = new Date(migradata[i].date);
        if (
          mdate.getMonth() <= timeRange[1].getMonth() &&
          mdate.getDate() <= timeRange[1].getDate()
        ) {
          if (playcheck) {
            migrations.push(migradata[i]);
          } else {
            if (
              mdate.getMonth() <= timeRange[0].getMonth() &&
              mdate.getDate() <= timeRange[0].getDate()
            ) {
              migrations.push(migradata[i]);
            }
          }
        }
      }
      var migraNetsmap = d3
        .nest()
        .key(function(d) {
          return d.city;
        })
        .map(migrations);
      this.migraComputmap = d3.map();
      var migkeys = migraNetsmap.keys();
      for (var i = 0; i < migkeys.length; i++) {
        var Inmigration_rate = 0;
        var Outmigration_rate = 0;
        var kdata = migraNetsmap.get(migkeys[i]);
        for (var j = 0; j < kdata.length; j++) {
          Inmigration_rate += parseFloat(kdata[j].Inmigration_rate);
          Outmigration_rate += parseFloat(kdata[j].Outmigration_rate);
        }
        if (Inmigration_rate > Outmigration_rate) {
          var min = Outmigration_rate;
          var max = Inmigration_rate;
        } else {
          var max = Outmigration_rate;
          var min = Inmigration_rate;
        }
        //求平均值，保留4位小数
        this.migraComputmap.set(migkeys[i], {
          allrate:
            parseFloat(min / kdata.length).toFixed(4) +
            parseFloat(max / kdata.length).toFixed(4)
        });
      }
    },
    populationdata: function(newval) {
      this.populationmap = d3
        .nest()
        .key(function(d) {
          return d.city;
        })
        .map(newval.population);
    },
    mergedata: function() {
      //计算给定日期的确诊、治愈率、死亡率
      var timeRange = [
        new Date(this.$store.getters.gettimeRange[0]),
        new Date(this.$store.getters.gettimeRange[1])
      ];
      var mergerdata = this.$store.getters.getscMergerData;
      let TimerangeMerdata = [];
      for (var i = 0; i < mergerdata.length; i++) {
        var dates = mergerdata[i].date;
        dates = new Date(
          2020,
          parseInt(dates.split("月")[0]) - 1,
          dates.split("月")[1].split("日")[0]
        );
        if (
          dates.getMonth() <= timeRange[1].getMonth() &&
          dates.getDate() < timeRange[1].getDate() &&
          mergerdata[i].city != ""
        ) {
          TimerangeMerdata.push(mergerdata[i]);
        }
      }
      var mergNetsmap = d3
        .nest()
        .key(function(d) {
          return d.city;
        })
        .map(TimerangeMerdata);
      this.mergcomputmap = d3.map();
      var merkeys = mergNetsmap.keys();
      var arry = [];
      for (var i = 0; i < merkeys.length; i++) {
        var kdata = mergNetsmap.get(merkeys[i]);

        arry.push({
          City: merkeys[i],
          Diagnosis: kdata[kdata.length - 1].accumulativeDiagnosis,
          Healthrate: parseFloat(
            kdata[kdata.length - 1].accumulativeHeath /
              kdata[kdata.length - 1].accumulativeDiagnosis
          ).toFixed(4),
          Deathrate: parseFloat(
            kdata[kdata.length - 1].accumulativeDeath /
              kdata[kdata.length - 1].accumulativeDiagnosis
          ).toFixed(4)
        });
      }
      arry = arry.sort(function(a, b) {
        return parseInt(a.Diagnosis) > parseInt(b.Diagnosis) ? 1 : -1;
      });
      for (var i = 0; i < arry.length; i++) {
        if (arry[i].City != "") this.citys.push(arry[i].City);
        this.mergcomputmap.set(arry[i].City, arry[i]);
      }
    },
    setserierdata: function() {
      //封装数据
      this.seriesdata = [];
      this.seriesdataStore = [];
      var citys = this.citys;
      var cActivity = []; //活跃度数据
      for (var i = 0; i < citys.length; i++) {
        if (citys[i] == "境外输入" || citys[i] == "地区待确认") continue;
        var mergd = this.mergcomputmap.get(citys[i]);
        var migrd = this.migraComputmap.get(citys[i]);
        var hospd = this.hospitalmap.get(citys[i]);
        var popul = this.populationmap.get(citys[i]);
        cActivity.push({
          name: citys[i],
          value: parseFloat(migrd.allrate) / 2
        });
        if (mergd == null || migrd == null) continue;
        var serie = {
          name: citys[i],
          type: "parallel",
          lineStyle: this.lineStyle,
          data: [
            [
              citys[i],
              mergd.Diagnosis,
              mergd.Healthrate,
              mergd.Deathrate,
              parseFloat(migrd.allrate),
              hospd[0].hospital,
              hospd[0].outpatient,
              popul[0].population
            ]
          ],
          diagnosis: +mergd.Diagnosis
        };
        this.seriesdata.push(serie);
        this.seriesdataStore.push(serie);
      }
      
      this.$store.commit("setcityActivity", cActivity);
      
      // console.log(this.seriesdata);
    },
    seriesdata_sort_ascend: function() {
      let that = this;
      this.seriesdataStore.sort(function(a,b){
        return a.diagnosis - b.diagnosis
      })
      this.seriesdata = []
      this.seriesdata = this.seriesdataStore.filter(function(d,i){
        if(i <= that.sortedNum){
          return 1;
        } else if(i > that.sortedNum){
          return 0;
        }
      }).reverse()
      this.initchart()
    },
    seriesdata_sort_desascend: function() {
      let that = this;
      this.seriesdataStore.sort(function(a,b){
        return b.diagnosis - a.diagnosis
      })
      this.seriesdata = []
      this.seriesdata = this.seriesdataStore.filter(function(d,i){
        if(i <= that.sortedNum){
          return 1;
        } else if(i > that.sortedNum){
          return 0;
        }
      })
      this.initchart()
    }
  },
  mounted() {},
  computed: {
    Coordinatesdata() {
      return this.$store.getters.getCoordinatesdata;
    },
    ScCoordata() {
      return this.$store.getters.getscCoordata;
    },
    timeRange() {
      return this.$store.getters.gettimeRange;
    }
  },
  watch: {
    //监听dailydata数据变化
    Coordinatesdata: function(newval, oldval) {
      //图表数据变化后该执行的操作
    },
    timeRange: function(newval, oldval) {
      this.migrationdata(this.$store.getters.getscCoordata);
      this.mergedata();
      this.setserierdata();
      this.initchart();
    },
    ScCoordata: function(newval, oldval) {
      this.hospitaldata(newval);
      this.migrationdata(newval);
      this.populationdata(newval);
      this.mergedata();
      this.setserierdata();
      this.initchart();
    }
  }
};
</script>
<style>
#Coordinates span {
  color: white;
  font: 18px "Microsoft YaHei";
  float: left;
}
#Coordinates {
  position: absolute;
  top: 65.1%;
  right: 0.5%;
  width: 32%;
  height: 34%;
  background-color: #30313a;
}
#Coordinates p {
  color: white;
  font: 12px "Microsoft YaHei";
  float: left;
  transform: translate(100%, -10%)
}
#CoorEcharts {
  width: 100%;
  height: 90%;
  padding-top: 5%;
}
.Coordinates-angel {
  background: linear-gradient(#00faff, #00faff) left top,
    linear-gradient(#00faff, #00faff) left top,
    linear-gradient(#00faff, #00faff) right top,
    linear-gradient(#00faff, #00faff) right top,
    linear-gradient(#00faff, #00faff) left bottom,
    linear-gradient(#00faff, #00faff) left bottom,
    linear-gradient(#00faff, #00faff) right bottom,
    linear-gradient(#00faff, #00faff) right bottom;
  background-repeat: no-repeat;
  background-size: 0.15rem 0.6rem, 0.6rem 0.15rem, 0.15rem 0.6rem,
    0.6rem 0.15rem;
  background-color: rgba(255, 255, 255, 0.05);
  white-space: nowrap;
  /* border:3px solid #ffffff; */

  margin: 0.1% 0 0 0.1%;
  z-index: 5;
}
</style>
