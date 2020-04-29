<template>
  <div id="bar" class="bar-angel">
    <div id="groupbar_title">

      <!--       
      <div id='panel_time'>
        <p style="padding-left: 6%; padding-top: 5%; font-weight: 500; margin-bottom: 1px">{{infopanel_title}}</p>
      </div> -->

    <el-row :gutter="20" class="panelinfo" >
      <el-col :span="6">
        <div class="grid-content ">
          <p class="panelinfofont">{{now_confirmed}}</p>
          <p style="color:#F74C30; font-size:smaller">现存确诊</p>

        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content ">
          <p class="panelinfofont">{{acc_confirmed}}</p>
          <p style="color:#B0202C; font-size:smaller">累计确诊</p>

        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <p class="panelinfofont">{{acc_dead}}</p>
          <p style="color:#5D6F96; font-size:smaller">累计死亡</p>

        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content ">
          <p class="panelinfofont">{{acc_cure}}</p>
          <p style="color:#28B8AB; font-size:smaller">累计治愈</p>

        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chartinfo" >

      <el-col :span="12">

          <div style="padding-left:25%">

            <div>
              <p class="panelinfofont">地区输入比</p>
            </div>

            <div style="transform:translate(50%, -150%)">
              <el-button size="mini" icon="el-icon-caret-top" circle @click="piechart_sort_ascend()" style="background:#212232; color:white; border: 0px"></el-button>
              <el-button size="mini" icon="el-icon-caret-bottom" circle @click="piechart_sort_desascend()" style="background:#212232; color:white; border: 0px; transform:translate(-50%, 0)"></el-button>
            </div>
          <!--  -->
          </div>

      </el-col>

      <el-col :span="12">

          <div style="padding-left:25%">

            <div>
              <p class="panelinfofont">地区人数统计</p>
            </div>

            <div style="transform:translate(60%, -150%)">
              <el-button size="mini" icon="el-icon-caret-top" circle @click="barchart_sort_ascend()" style="background:#212232; color:white; border: 0px"></el-button>
              <el-button size="mini" icon="el-icon-caret-bottom" circle @click="barchart_sort_desascend()" style="background:#212232; color:white; border: 0px; transform:translate(-50%, 0)"></el-button>
            </div>

          </div>

      </el-col>
    </el-row>
    </div>

    <div id="facet"></div>
    <div id="gpbar"></div>

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
      now_confirmed: null,
      acc_confirmed: null,
      acc_dead: null,
      acc_cure: null,
      infopanel_title: '四川省截止至 ',
      panel_info: {},
      chart_data: {},
      datastore:[], //sort data container
      placesort:[],
    };
  },
  mounted() {
    //this.updateInfoPanel()
    //this.chartFacet();
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
          data: ["本地发展阶段", "输入阶段", "境外输入阶段"],
          left: 'right',
          top: 'bottom',
          orient: 'vertical',
          textStyle: {
            color: '#FFF'
          }
        },
        grid: {
          left: "0%",
          right: "10%",
          bottom: "0%",
          top:"0%",
          height: "180%",
          containLabel: true
        },
        xAxis: {
          show: false
        },
        yAxis: {
          type: "category",
          data: that.chart_data.region,
          axisLabel: {
            margin: 20
          },
          nameTextStyle: {
            color: '#13142A'
          },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: "本地发展阶段",
            type: "bar",
            stack: "总量",
            barWidth: "90%",
            label: {
              show: false,
              position: "insideRight",
            },
            data: that.chart_data.local
          },
          {
            name: "输入阶段",
            type: "bar",
            stack: "总量",
            barWidth: "90%",
            label: {
              show: false,
              position: "insideRight",
            },
            data: that.chart_data.input
          },
          {
            name: "境外输入阶段",
            type: "bar",
            stack: "总量",
            barWidth: "90%",
            label: {
              show: false,
              position: "insideRight"
            },
            data: that.chart_data.unknown
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
      let data = []

      for(let i = this.chart_data.region.length-1; i>=0 ; i--){
        data.push({'region': this.chart_data.region[i], type: 'local', count: that.chart_data.local[i]})
        data.push({'region': this.chart_data.region[i], type: 'input', count: that.chart_data.input[i]})
      }

      that.chart = new G2.Chart({
        container: "facet",
        padding: [0,0,0,0],
        height: (1.7 * document.getElementById('facet').offsetHeight),
        width: document.getElementById('facet').offsetWidth
      });

      that.chart.source(data);
      that.chart.legend(false);
      that.chart.tooltip({
        showTitle: false
      });
      that.chart.coord("theta", {
        radius: 0.8
      });

      that.chart.facet("list", {
        fields: ["region"],
        cols: 1,
        padding: 0.3,
        line: {
          stroke: "#00a3d7"
        },
        showTitle: false,

        eachView(view, facet) {
          const _data = facet.data;
          const dv = new DataSet.View();
          dv.source(_data).transform({
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
    create_raw_paneldata(scmergedata){
      let that = this
      scmergedata.forEach((d,i) => {
          if(d.type == '省级'){
            let year = '2020',
              month = d.date.split('月')[0],
              day = d.date.split('月')[1].split('日')[0],
              date = yyyymmdd(year+'-'+month+'-'+day)

              let accumulativeDiagnosis = +d.accumulativeDiagnosis,
                accumulativeHeath = +d.accumulativeHeath,
                accumulativeDeath = +d.accumulativeDeath,
                nowDiagnosis = accumulativeDiagnosis - accumulativeHeath - accumulativeDeath
              if(!(date in that.panel_info)){
                that.panel_info[date] = {}
                that.panel_info[date]['now_confirmed'] = nowDiagnosis
                that.panel_info[date]['acc_confirmed'] = accumulativeDiagnosis
                that.panel_info[date]['acc_dead'] = accumulativeHeath
                that.panel_info[date]['acc_cure'] = accumulativeDeath
              }
          }
      })

      this.updateInfoPanel()
      function yyyymmdd(str) {
          var x = new Date(str);
          var y = x.getFullYear().toString();
          var m = (x.getMonth() + 1).toString();
          var d = x.getDate().toString();
          (d.length == 1) && (d = '0' + d);
          (m.length == 1) && (m = '0' + m);
          var yyyymmdd = y + '-' + m + '-' + d;
          return yyyymmdd;
      }
    },
    create_raw_chartdata(scmergedata){

    },
    updateInfoPanel(){
      this.now_confirmed = this.panel_info[this.timeRange[1]].now_confirmed,
      this.acc_confirmed = this.panel_info[this.timeRange[1]].acc_confirmed,
      this.acc_dead = this.panel_info[this.timeRange[1]].acc_dead,
      this.acc_cure = this.panel_info[this.timeRange[1]].acc_cure
      this.infopanel_title = '四川省截止至 ' + this.timeRange[1]
    },
    datachange: function(newval) {
      let _region = Array.from(new Set(newval.map((d,i)=> {return d.city})))
        this.placesort = _region

      var citydata = {
        region: _region,
        local: Array.apply(null, Array(_region.length)).map(() => 0),
        input: Array.apply(null, Array(_region.length)).map(() => 0),
        percent: Array.apply(null, Array(_region.length)).map(() => 0),
        unknown: Array.apply(null, Array(_region.length)).map(() => 0)
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
    dispatchdata: function(){
      let that = this
        //init

        this.chart_data.region = []
        this.chart_data.local = []
        this.chart_data.input = []
        this.chart_data.percent = []
        this.chart_data.unknown = []

        that.placesort = []

        this.datastore.forEach(function(d,i){

          that.chart_data.region.push(d['regionData'])
          that.chart_data.local.push(d['localData'])
          that.chart_data.input.push(d['inputData'])
          that.chart_data.percent.push(d['percentData'])
          that.chart_data.unknown.push(d['unknownData'])

          that.placesort.push(d['regionData'])
        })

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
    },
    scMergerData() {
      return this.$store.getters.getscMergerData;
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
      this.placesort = newval.region

      this.chart_data = {
        'region': newval.region,
        'local': newval.local,
        'input': newval.input,
        'percent': newval.percent,
        'unknown': newval.unknown
      }


      this.chartInit();
      this.chartFacet();
      this.datastore = [];

      for (let i = 0; i < newval.region.length; i++) {
        let patientsum =
          newval["local"][i] + newval["input"][i] + newval["unknown"][i];
        this.datastore.push({
          'regionData': newval['region'][i],
          'localData': newval['local'][i],
          'inputData': newval['input'][i],
          'percentData': newval['percent'][i],
          'unknownData': newval['unknown'][i],
          'local': newval['local'][i],
          'input': newval['input'][i],
          'patientsum': patientsum
        })
      }
    },
    timeRange: function(newval, oldval) {
      this.updateInfoPanel()
      this.datachange(this.$store.getters.getscTrackData);
    },
    ScTrackData: function(newval, oldval) {
      this.datachange(newval);
    },
    scMergerData: function(newval, oldVal){
      this.create_raw_paneldata(newval)
      this.create_raw_chartdata(newval)
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
  height: 56%;
  border: 1px solid #dededd;
  background-color: #30313a;
}
.bar-angel{
  padding-top: 2%
}
#gpbar {
  height: 68%;
  width: 80%;
  float: left;
}
#facet {
  height: 72%;
  width: 20%;
  float: left;
  position: relative;
  overflow: hidden;
}

  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 20px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

.panelinfo{
  margin-left:5% !important;
  margin-right: 0 !important;
  width:90%;
  float:left;
  border:2px solid #00000002;
  border-radius:8px;
  box-shadow:2px 2px 2px #00000020;
  text-align:center
}
.panelinfofont{
  color: #FFF
}
.bar-angel{

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
  z-index: 1;
}

</style>
