<template>
  <div id="Daily" class="Daily-angel"></div>
</template>

<script>
import echarts from "echarts";
//每日新增图
export default {
  name: "Daily",
  data() {
    return {
      dates: null,
      diagnosisData: null,
      heathData: null,
      deathData: null,
      myChart: null,
      option: null,
      cityname: "四川省"
    };
  },
  mounted() {},
  methods: {
    ChartInit() {
      let that = this;
      that.myChart = echarts.init(document.getElementById("Daily"));
      that.option = {
        color:['#B34F48','#E7E8D1','#57B37D','#8DC1A9','#EA7E53','#EEDD78','#73A373','#759AA0','#7289AB','#91CA8C','#F49F42','#FFFFFF'],
        textStyle: {
          color: "#ffffff"
        },
        title: {
          text: that.cityname + "每日新增",
          textStyle: {
          color: "#ffffff"
        },
          left: "7%",
          top: "10px"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["确诊", "治愈", "死亡"],
          textStyle: {
          color: "#ffffff"
        },
          right: "9%",
          top: "30px"
        },
        xAxis: {
          type: "category",
          //是否顶格
          boundaryGap: false,
          data: that.dates,
          name: "时间"
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            smooth: true,
            name: "确诊",
            type: "line",
            data: that.diagnosisData,
            symbol: "none"
          },
          {
            smooth: true,
            name: "死亡",
            type: "line",
            data: that.deathData,
            symbol: "none"
          },
          {
            smooth: true,
            name: "治愈",
            type: "line",
            data: that.heathData,
            symbol: "none"
          }
        ]
      };
      that.myChart.setOption(that.option, true);
    },
    dataManger: function(newval) {
      var cityname = this.$store.getters.getmergerCity;
      var dailydata = {
        date: [],
        diagnosis: [],
        accumulativeHeath: [],
        accumulativeDeath: []
      };
      var k = 0;
      var timeRange = [
        new Date(this.$store.getters.gettimeRange[0]),
        new Date(this.$store.getters.gettimeRange[1])
      ];
      var playcheck = this.$store.getters.getplaycheck;
      for (var i = 0; i < newval.length; i++) {
        // console.log(newval[i].city);
        var dates = newval[i].date;
        // console.log(dates);
        // console.log(dates.split("月")[1].split("日")[0]);
        dates = new Date(
          2020,
          parseInt(dates.split("月")[0]) - 1,
          dates.split("月")[1].split("日")[0]
        );
        // console.log(dates);
        // break;
        if (dates.getTime() <= timeRange[1].getTime()) {
          if (playcheck) {
            if (newval[i].city == cityname) {
              dailydata.date[k] = newval[i].date;
              dailydata.diagnosis[k] =
                newval[i].newDiagnosis == "" ? "0" : newval[i].newDiagnosis;
              (dailydata.accumulativeHeath[k] =
                newval[i].newHealth == "" ? "0" : newval[i].newHealth),
                (dailydata.accumulativeDeath[k] =
                  newval[i].newDeath == "" ? "0" : newval[i].newDeath);
              k++;
            }
          } else {
            if (
              timeRange[0].getTime() <= dates.getTime() &&
              newval[i].city == cityname
            ) {
              dailydata.date[k] = newval[i].date;
              dailydata.diagnosis[k] =
                newval[i].newDiagnosis == "" ? "0" : newval[i].newDiagnosis;
              (dailydata.accumulativeHeath[k] =
                newval[i].newHealth == "" ? "0" : newval[i].newHealth),
                (dailydata.accumulativeDeath[k] =
                  newval[i].newDeath == "" ? "0" : newval[i].newDeath);
              k++;
            }
          }
        }
      }
      this.$store.commit("setDailydata", dailydata);
    }
  },
  computed: {
    dailydata() {
      return this.$store.getters.getDailydata;
    },
    scMergerData() {
      return this.$store.getters.getscMergerData;
    },
    timeRange() {
      return this.$store.getters.gettimeRange;
    },
    Cityname() {
      return this.$store.getters.getmergerCity;
    }
  },
  watch: {
    //监听dailydata数据变化
    dailydata: function(newval, oldval) {
      //图表数据变化后该执行的操作
      this.dates = newval.date;
      this.diagnosisData = newval.diagnosis;
      this.deathData = newval.accumulativeDeath;
      this.heathData = newval.accumulativeHeath;
      this.ChartInit();
    },
    scMergerData: function(newval, oldval) {
      this.dataManger(newval);
    },
    timeRange: function(newval, oldval) {
      this.dataManger(this.$store.getters.getscMergerData);
    },
    Cityname: function(newval, oldval) {
      if (newval == "") {
        this.cityname = "四川省";
      } else {
        this.cityname = newval;
      }
      this.dataManger(this.$store.getters.getscMergerData);
    }
  }
};
</script>
<style>
#Daily {
  position: absolute;
  top: 65.1%;
  left: 0.1%;
  width: 33.2%;
  height: 34%;
  background-color: #30313a;
}
.Daily-angel{

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
  z-index: 2;
}
</style>
