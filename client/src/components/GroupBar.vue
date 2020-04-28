<template>
  <div id="bar" class="bar-angel">
    <div id="groupbar_title">
      <div style="float:left; padding-left:10%">
        <h3 style="color:white">地区人数统计</h3>
        <el-button type="info" icon="el-icon-caret-top" circle @click="barchart_sort_ascend()"></el-button>
        <el-button
          type="info"
          icon="el-icon-caret-bottom"
          circle
          @click="barchart_sort_desascend()"
        ></el-button>
      </div>

      <div style="float:left; padding-left:30%">
        <h3 style="color:white">地区输入比</h3>
        <el-button type="info" icon="el-icon-caret-top" circle @click="piechart_sort_ascend()"></el-button>
        <el-button
          type="info"
          icon="el-icon-caret-bottom"
          circle
          @click="piechart_sort_desascend()"
        ></el-button>
      </div>
    </div>

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
      datastore: [], //sort data container
      placesort: ["成都", "巴中", "遂宁", "绵阳", "德阳", "达州"],
      facetdata: {
        成都: { local: 27, input: 35 },
        巴中: { local: 3, input: 21 },
        遂宁: { local: 8, input: 3 },
        绵阳: { local: 3, input: 2 },
        德阳: { local: 9, input: 3 },
        达州: { local: 6, input: 12 }
      }
    };
  },
  mounted() {
    this.chartFacet();
  },
  methods: {
    chartInit() {
      let that = this;
      var myChart = echarts.init(document.getElementById("gpbar"));
      var option = {
        // color:['#5b7fa7','#508da3','#a5def1','ffffff'],
        color: [
          "#d21222",
          "#dd6b66",
          "#73B9BC",
          "#E69D87",
          "#8DC1A9",
          "#EA7E53",
          "#EEDD78",
          "#73A373",
          "#759AA0",
          "#7289AB",
          "#91CA8C",
          "#F49F42",
          "#FFFFFF"
        ],
        textStyle: {
          color: "#ffffff"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["本地", "输入", "不明"],
          textStyle: {
        color: '#fff'
    },
          right: "20%",
          itemHeight: 20,
          padding: [24, 0, 0, 0]
        },
        grid: {
          left: "10%",
          right: "3%",
          bottom: "10%",
          top: "15%",
          height: "80%",
          containLabel: true
        },
        xAxis: {
          show: false
        },
        yAxis: {
          type: "category",
          color: "white",
          data: that.regionData
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
      if (that.chart) {
        that.chart.destroy();
      }
      let data = [];
      this.placesort.forEach(function(d, i) {
        data.push({
          region: d,
          type: "local",
          count: that.facetdata[d]["local"]
        });
        data.push({
          region: d,
          type: "input",
          count: that.facetdata[d]["input"]
        });
      });

      that.chart = new G2.Chart({
        container: "facet",
        forceFit: true,
        height: 510,
        top: "20%",

        padding: [80, 50, 50, 5]
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
          stroke: "#00a3d7"
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
                return (val * 100).toFixed(2) + "%";
              }
            }
          });
          view
            .interval()
            .position("percent")
            .color("type", ["#d21222","#dd6b66"])
            .adjust("stack");
        }
      });
      that.chart.render();
    },
    datachange: function(newval) {
      var citydata = {
        region: ["达州", "德阳", "绵阳", "遂宁", "巴中", "成都"],
        color: "white",
        local: [0, 0, 0, 0, 0, 0],
        input: [0, 0, 0, 0, 0, 0],
        percent: [0, 0, 0, 0, 0, 0],
        unknown: [0, 0, 0, 0, 0, 0]
      };
      var timerange = [
        new Date(this.$store.getters.gettimeRange[0]),
        new Date(this.$store.getters.gettimeRange[1])
      ];
      var playcheck = this.$store.getters.getplaycheck;
      for (var i = 0; i < newval.length; i++) {
        var times = new Date(newval[i].diagnosisTime);
        if (times.getTime() <= timerange[1].getTime()) {
          if (playcheck) {
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
              } else if (
                newval[i].city == citydata.region[k] &&
                newval[i].InfectionType == "不明"
              ) {
                citydata.unknown[k]++;
              }
              citydata.percent[k] =
                citydata.local[k] / (citydata.local[k] + citydata.input[k]);
            }
          } else {
            if (times.getTime() >= timerange[0].getTime()) {
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
                } else if (
                  newval[i].city == citydata.region[k] &&
                  newval[i].InfectionType == "不明"
                ) {
                  citydata.unknown[k]++;
                }
                citydata.percent[k] =
                  citydata.local[k] / (citydata.local[k] + citydata.input[k]);
              }
            }
          }
        }
      }
      this.$store.commit("setgroupbardata", citydata);
    },
    dispatchdata: function() {
      let that = this,
        _regionData = [],
        _localData = [],
        _inputData = [],
        _percentData = [],
        _unknownData = [];

      that.placesort = [];

      this.datastore.forEach(function(d, i) {
        _regionData.push(d["regionData"]);
        _localData.push(d["localData"]);
        _inputData.push(d["inputData"]);
        _percentData.push(d["percentData"]);
        _unknownData.push(d["unknownData"]);
        that.placesort.push(d["regionData"]);
        that.facetdata[d["regionData"]]["local"] = d["localData"];
        that.facetdata[d["regionData"]]["input"] = d["inputData"];
      });

      this.regionData = _regionData;
      this.localData = _localData;
      this.inputData = _inputData;
      this.percentData = _percentData;
      this.unknownData = _unknownData;

      this.chartInit();
      this.chartFacet();
    },
    barchart_sort_ascend() {
      this.datastore.sort((a, b) =>
        +a.patientsum > +b.patientsum
          ? 1
          : +b.patientsum > +a.patientsum
          ? -1
          : 0
      );
      this.dispatchdata();
    },
    barchart_sort_desascend() {
      this.datastore = this.datastore.sort((a, b) =>
        +a.patientsum < +b.patientsum
          ? 1
          : +b.patientsum < +a.patientsum
          ? -1
          : 0
      );
      this.dispatchdata();
    },
    piechart_sort_ascend() {
      this.datastore = this.datastore.sort((a, b) =>
        +a.percentData > +b.percentData
          ? -1
          : +b.percentData > +a.percentData
          ? 1
          : 0
      );
      this.dispatchdata();
    },
    piechart_sort_desascend() {
      this.datastore = this.datastore.sort((a, b) =>
        +a.percentData < +b.percentData
          ? -1
          : +b.percentData < +a.percentData
          ? 1
          : 0
      );
      this.dispatchdata();
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
      let that = this;
      this.regionData = newval.region;
      this.localData = newval.local;
      this.inputData = newval.input;
      this.percentData = newval.percent;
      this.unknownData = newval.unknown;
      this.chartInit();
      this.chartFacet();
      this.datastore = [];

      for (let i = 0; i < newval.region.length; i++) {
        let patientsum =
          newval["local"][i] + newval["input"][i] + newval["unknown"][i];
        this.datastore.push({
          regionData: newval["region"][i],
          localData: newval["local"][i],
          inputData: newval["input"][i],
          percentData: newval["percent"][i],
          unknownData: newval["unknown"][i],
          local: that.facetdata[newval["region"][i]]["local"],
          input: that.facetdata[newval["region"][i]]["input"],
          patientsum: patientsum
        });
      }
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
  top: 5.5%;
  left: 0.1%;
  width: 24.8%;
  height: 59%;
  border: 1px solid #dededd;
}
#gpbar {
  height: 80%;
  width: 60%;
  float: left;
}
#facet {
  height: 80%;
  width: 30%;
  float: left;
  position: relative;
}
.bar-angel {
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
