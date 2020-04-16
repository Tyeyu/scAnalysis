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
  data() {
    return {
      regionData: null,
      localData: null,
      inputData: null,
      percentData: null,
      unknownData: null,
        chart: null,
    };
  },
  mounted() {this.chartFacet()},
  methods: {
    chartInit() {
      let that = this;
      console.log(that.localData);
      var myChart = echarts.init(document.getElementById("gpbar"));
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["本地", "输入", "不明"],
          right: "20%",
          itemHeight: 20
        },
        grid: {
          left: "20%",
          right: "3%",
          bottom: "3%",
          top: "15%",
          height: "98%",
          containLabel: true
        },
        xAxis: {
          show: false,
        },
        yAxis: {
          type: "category",

          data: [
            "达州",
            "德阳",
            "绵阳",
            "遂宁",
            "巴中",
            "成都"
          ]
        },
        series: [
          {
            name: "本地",
            type: "bar",
            stack: "总量",
              barWidth: "90%",
            label: {
              show: true,
              position: "insideRight"
            },
            data: that.localData
          },
          {
            name: "输入",
            type: "bar",
            stack: "总量",
              barWidth: "90%",
            label: {
              show: true,
              position: "insideRight"
            },
            data: that.inputData
          },
            {
                name: "不明",
                type: "bar",
                stack: "总量",
                barWidth: "90%",
                label: {
                    show: true,
                    position: "insideRight"
                },
                data: that.unknownData
            }
        ]
      };
      myChart.setOption(option, true);
    },
    chartFacet() {
        let that = this;
            if(that.chart){     // 如果存在的话就删除图表再重新生成
                that.chart.destroy()
            }
      var data = [
        { region: "成都", type: "local", count: 27 },
        { region: "成都", type: "input", count: 35 },
        { region: "四川巴中", type: "local", count: 3 },
        { region: "四川巴中", type: "input", count: 21 },
        { region: "四川遂宁", type: "local", count: 8 },
        { region: "四川遂宁", type: "input", count: 3 },
        { region: "四川绵阳", type: "local", count: 3 },
        { region: "四川绵阳", type: "input", count: 2 },
        { region: "四川德阳", type: "local", count: 9 },
        { region: "四川德阳", type: "input", count: 3 },
        { region: "四川达州", type: "local", count: 6 },
        { region: "四川达州", type: "input", count: 12 }
      ];
      that.chart = new G2.Chart({
        container: "facet",
        forceFit: true,
        height: 250,
        top: "10%",

        padding: [10, 50, 50, 5]
      });


      that.chart.source(data);
      that.chart.legend(false);
        that.chart.tooltip({
            showTitle: false
        });
      that.chart.coord("theta", {
        radius: 0.9
      });
      that.chart.facet("list", {
        fields: ["region"],
        cols: 1,
        padding: 5,
          line: {
              stroke: '#00a3d7'
          },
        showTitle: false,

        eachView(view, facet) {
            const data = facet.data;
          const dv = new DataSet.View();
          dv.source(data).transform({
            type: "percent",
            field: "count",
            dimension: "type",
            as: "percent"
          });
            view.source(dv, {
                percent: {
                    formatter(val) {
                        return (val * 100).toFixed(2) + '%';
                    }
                }
            });
          view
            .interval()
            .position("percent")
            .color("type")
            .adjust("stack");
        }
      });
      that.chart.render();
    },
    datachange: function(newval) {
      var citydata = {
        region: [
          "达州",
          "德阳",
          "绵阳",
          "遂宁",
          "巴中",
          "成都"
        ],
        local: [0, 0, 0, 0, 0, 0],
        input: [0, 0, 0, 0, 0, 0],
        percent: [0, 0, 0, 0, 0, 0],
        unknown: [0, 0, 0, 0, 0, 0]
      };
      var timerange = [
        new Date(this.$store.getters.gettimeRange[0]),
        new Date(this.$store.getters.gettimeRange[1])
      ];
      for (var i = 0; i < newval.length; i++) {
        var times = new Date(newval[i].diagnosisTime);
        if (
          times.getTime() >= timerange[0].getTime() &&
          times.getTime() <= timerange[1].getTime()
        ) {
          for (var k = 0; k < citydata.region.length; k++) {
            if (
              newval[i].city == citydata.region[k] &&
              (newval[i].InfectionType == "二代" ||
                newval[i].InfectionType == "第二代" ||
                newval[i].InfectionType == "第三代")
            ) {
              citydata.local[k]++;
            } else if (
              newval[i].city == citydata.region[k] &&
              (newval[i].InfectionType == "一代" ||
                newval[i].InfectionType == "第一代")
            ) {
              citydata.input[k]++;
            }
            else if (newval[i].city == citydata.region[k] && newval[i].InfectionType == "不明"){
                citydata.unknown[k]++;
            }
            citydata.percent[k] =
              citydata.local[k] / (citydata.local[k] + citydata.input[k]);
          }
        }
      }
      this.$store.commit("setgroupbardata", citydata);
    }
  },
  computed: {
    groupbardata() {
      return this.$store.getters.getgroupbardata;
    },
    ScTrackData() {
      return this.$store.getters.getscTrackData;
    },
    timeRange() {
      return this.$store.getters.gettimeRange;
    }
  },
  watch: {
    //监听dailydata数据变化
    groupbardata: function(newval, oldval) {
      //图表数据变化后该执行的操作
      this.regionData = newval.region;
      this.localData = newval.local;
      this.inputData = newval.input;
      this.percentData = newval.percent;
      this.unknownData = newval.unknown;
      this.chartInit();
      this.chartFacet();
    },
    timeRange: function(newval, oldval) {
      this.datachange(this.$store.getters.getscTrackData);
    },
    ScTrackData: function(newval, oldval) {
      this.datachange(newval);
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
