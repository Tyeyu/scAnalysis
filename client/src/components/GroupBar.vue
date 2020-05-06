<template>
  <div id="bar" class="bar-angel">
    <div id="groupbar_title">
      <!--
      <div id='panel_time'>
        <p style="padding-left: 6%; padding-top: 5%; font-weight: 500; margin-bottom: 1px">{{infopanel_title}}</p>
      </div>-->

      <el-row :gutter="20" class="panelinfo">
        <el-col :span="6">
          <div class="grid-content">
            <p class="panelinfofont">{{now_confirmed}}</p>
            <p style="color:#F74C30; font-size:smaller">现存确诊</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
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
          <div class="grid-content">
            <p class="panelinfofont">{{acc_cure}}</p>
            <p style="color:#28B8AB; font-size:smaller">累计治愈</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div id="groupbar_mark">
      <span>地区排名</span>
    </div>
    <div id="facet"></div>
    <div id="gpbar"></div>
    <div id="groupby_sort">
      <el-row :gutter="20" class="chartinfo">
        <el-col :span="12">
          <div style="padding-left:25%">
            <div>
              <p class="panelinfofont">地区输入比</p>
            </div>

            <div style="transform:translate(50%, -150%)">
              <el-button
                size="mini"
                icon="el-icon-caret-bottom"
                circle
                @click="piechart_sort_ascend()"
                style="background:#212232; color:white; border: 0px;"
              ></el-button>
              <el-button
                size="mini"
                icon="el-icon-caret-top"
                circle
                @click="piechart_sort_desascend()"
                style="background:#212232; color:white; border: 0px; transform:translate(-50%, 0)"
              ></el-button>
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
              <el-button
                size="mini"
                icon="el-icon-caret-bottom"
                circle
                @click="barchart_sort_ascend()"
                style="background:#212232; color:white; border: 0px"
              ></el-button>

              <el-button
                size="mini"
                icon="el-icon-caret-top"
                circle
                @click="barchart_sort_desascend()"
                style="background:#212232; color:white; border: 0px; transform:translate(-50%, 0)"
              ></el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
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
      region: null,
      stage1: null,
      stage2: null,
      percent: null,

      chart: null,
      now_confirmed: null,
      acc_confirmed: null,
      acc_dead: null,
      acc_cure: null,
      infopanel_title: "四川省截止至 ",
      panel_info: {},
      chart_data: {},
      datastore: [], //sort data container
      placesort: [],
      construct_citydaily_data: {},
      is_construct_citydaily_data: 0,
      limit_draw_item: 10
    };
  },
  mounted() {
    //this.updateInfoPanel()
    //this.chartFacet();
  },
  methods: {
    chartInit() {
      let that = this;
      let myChart = echarts.init(document.getElementById("gpbar"));

      let _chart_data = {
        'region': that.chart_data.region.filter((d,i) => {if(i <= that.limit_draw_item){return 1;} else if (i > that.limit_draw_item){return 0;}}).reverse(),
        'stage1': that.chart_data.stage1.filter((d,i) => {if(i <= that.limit_draw_item){return 1;} else if (i > that.limit_draw_item){return 0;}}).reverse(),
        'stage2': that.chart_data.stage2.filter((d,i) => {if(i <= that.limit_draw_item){return 1;} else if (i > that.limit_draw_item){return 0;}}).reverse()
      }

      let option = {
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
          data: ["本地发展期", "输入期"],
          left: "right",
          top: "bottom",
          orient: "vertical",
          textStyle: {
            color: "#FFF"
          }
        },
        grid: {
          left: "0%",
          right: "30%",
          bottom: "0%",
          top: "0%",
          height: "100%",
          containLabel: true
        },
        xAxis: {
          show: false
        },
        yAxis: {
          type: "category",
          data: _chart_data.region,
          position: 'right',
          offset: -10,
          axisLabel: {
            margin: 20
          },
          nameTextStyle: {
            color: "#13142A"
          },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: "输入期",
            type: "bar",
            stack: "总量",
            barWidth: "90%",
            itemStyle: {
              color: 'grey'
            },
            label: {
              show: false,
              position: "insideRight"
            },
            data: _chart_data.stage1
          },
          {
            name: "本地发展期",
            type: "bar",
            stack: "总量",
            barWidth: "90%",
            itemStyle: {
              color: 'white'
            },
            label: {
              show: false,
              position: "insideRight"
            },
            data: _chart_data.stage2
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

      for (let i = 0; i <= this.limit_draw_item; i++) {
        data.push({
          region: this.chart_data.region[i],
          type: "输入期",
          count: that.chart_data.stage1[i]
        });
        data.push({
          region: this.chart_data.region[i],
          type: "本地发展期",
          count: that.chart_data.stage2[i]
        });
      }

      that.chart = new G2.Chart({
        container: "facet",
        padding: [0, 0, 0, 0],
        height: document.getElementById("facet").offsetHeight,
        width: document.getElementById("facet").offsetWidth
      });

      that.chart.source(data);
      that.chart.legend(false);
      that.chart.tooltip({
        showTitle: false
      });
      that.chart.coord("theta", {
        radius: 0.7
      });

      that.chart.facet("list", {
        fields: ["region"],
        cols: 1,
        padding: 0,
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
            .color("type", ["grey", "white"])
            .adjust("stack");
        }
      });

      that.chart.render();
    },
    create_raw_paneldata(scmergedata) {
      let that = this;
      scmergedata.forEach((d, i) => {

          let year = "2020",
            month = d.date.split("月")[0],
            day = d.date.split("月")[1].split("日")[0],
            date = that.yyyymmdd(year + "-" + month + "-" + day),
            city = d.type == '地区级' ? d.city : d.type

          let accumulativeDiagnosis = +d.accumulativeDiagnosis,
            accumulativeHeath = +d.accumulativeHeath,
            accumulativeDeath = +d.accumulativeDeath,
            nowDiagnosis = (accumulativeDiagnosis - accumulativeHeath - accumulativeDeath) < 0 ? 0 : (accumulativeDiagnosis - accumulativeHeath - accumulativeDeath);
          if (!(date in that.panel_info)) {
            that.panel_info[date] = {};
              that.panel_info[date][city] = {};
              that.panel_info[date][city]["now_confirmed"] = nowDiagnosis;
              that.panel_info[date][city]["acc_confirmed"] = accumulativeDiagnosis;
              that.panel_info[date][city]["acc_dead"] = accumulativeDeath;
              that.panel_info[date][city]["acc_cure"] = accumulativeHeath;
          } else {
              that.panel_info[date][city] = {};
              that.panel_info[date][city]["now_confirmed"] = nowDiagnosis;
              that.panel_info[date][city]["acc_confirmed"] = accumulativeDiagnosis;
              that.panel_info[date][city]["acc_dead"] = accumulativeDeath;
              that.panel_info[date][city]["acc_cure"] = accumulativeHeath;
          }
      });

      this.updateInfoPanel('省级');
    },
    yyyymmdd(str){
      let x = ''
      if(typeof str == 'object'){
        x = str
      } else {
        x = new Date(str)
      }

      let y = x.getFullYear().toString();
      let m = (x.getMonth() + 1).toString();
      let d = x.getDate().toString();
      d.length == 1 && (d = "0" + d);
      m.length == 1 && (m = "0" + m);
      let yyyymmdd = y + "-" + m + "-" + d;
      return yyyymmdd;
    },
    create_raw_chartdata(scmergedata) {},
    updateInfoPanel(city) {
      
      if(city in this.panel_info[this.timeRange[1]]){
        this.now_confirmed = this.panel_info[this.timeRange[1]][city].now_confirmed
        this.acc_confirmed = this.panel_info[this.timeRange[1]][city].acc_confirmed
        this.acc_dead = this.panel_info[this.timeRange[1]][city].acc_dead
        this.acc_cure = this.panel_info[this.timeRange[1]][city].acc_cure
      } else {
        this.now_confirmed = 0
        this.acc_confirmed = 0
        this.acc_dead = 0
        this.acc_cure = 0
      }

      this.infopanel_title = "四川省截止至 " + this.timeRange[1];
    },
    datachange: function(newval) {
      let that = this;
      let _region = Array.from(
        new Set(
          newval.map((d, i) => {
            return d.city;
          })
        )
      );

      this.placesort = _region;


      var timerange = [
        new Date(this.$store.getters.gettimeRange[0]),
        new Date(this.$store.getters.gettimeRange[1])
      ];

      var playcheck = this.$store.getters.getplaycheck;
      
      if(this.is_construct_citydaily_data == 0){
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }
        
        let generate_timecircle_mark = 1,
          start_time = timerange[0],
          end_time = timerange[1],
          circle_time = timerange[0]

        //construct container structure
        while(generate_timecircle_mark){
          if(circle_time.getTime() == end_time.getTime()){
            generate_timecircle_mark = 0
          }
          
          let year = '2020',
            month = circle_time.getMonth(),
            day = circle_time.getDate(),
            date = that.yyyymmdd(year + '-' + month + '-' + day)
            if(!(date in that.construct_citydaily_data)){
              that.construct_citydaily_data[date] = {}
            }
          circle_time = circle_time.addDays(1)
        }
        //filter useless city '' & '境外输入'
        let new_val = newval.filter((d,i) => {
          if(d.city == '' || d.city == '境外输入'){
            return 0;
          }else{
            return 1;
            }
        })

        //fill the container with cycle
        let last_accmulativeDiagnosis = {},
          divide_time = new Date('2020-02-06'),
          divide_city_time_stage1 = {}

        new_val.forEach(function(d,i){
          let _date = function(){return new Date('2020-' + d.date.split('月')[0] + '-' + d.date.split('月')[1].split('日')[0])}(),
            _date_str = that.yyyymmdd(_date),
            _city = d.city
          //划分时间 以2月7日(不包括2月7日)为界限，2月7日以前的是输入期，2月7日后为本地发展阶段
            if(!(_date_str in last_accmulativeDiagnosis)){
              last_accmulativeDiagnosis[_date_str] = {}
            }
            last_accmulativeDiagnosis[_date_str][_city] = {}

          if (that.yyyymmdd(_date) == that.yyyymmdd(divide_time)){
            // 2020-02-06 -> 
            // store the accmulativeDiagnosis
              last_accmulativeDiagnosis[_date_str][_city]['stage1'] = +d.accumulativeDiagnosis
              last_accmulativeDiagnosis[_date_str][_city]['stage2'] = 0
              divide_city_time_stage1[_city] = +d.accumulativeDiagnosis              
          }

          if(_date.getTime() < divide_time.getTime()){
              last_accmulativeDiagnosis[_date_str][_city]['stage1'] = +d.accumulativeDiagnosis
              // input period
              last_accmulativeDiagnosis[_date_str][_city]['stage2'] = 0
              // local development period
          } 
          else if (_date.getTime() > divide_time.getTime()){
            // after 2020-02-06
              last_accmulativeDiagnosis[_date_str][_city]['stage1'] = divide_city_time_stage1[_city]
              last_accmulativeDiagnosis[_date_str][_city]['stage2'] = +d.accumulativeDiagnosis - divide_city_time_stage1[_city]
          }
        })
        that.construct_citydaily_data = last_accmulativeDiagnosis
        console.log('construct_citydaily_data', that.construct_citydaily_data)
      }

      //todo fill the stage1, stage2, percent

      let _regionlist = Array.from(new Set(Object.keys(that.construct_citydaily_data[that.yyyymmdd(timerange[1])])))  

      let citydata = {
        region: _regionlist,
        stage1: _regionlist.map((d,i) => {return that.construct_citydaily_data[that.yyyymmdd(timerange[1])][d]['stage1']}),
        stage2: _regionlist.map((d,i) => {return that.construct_citydaily_data[that.yyyymmdd(timerange[1])][d]['stage2']}),
        percent: _regionlist.map((d,i) => {
          if(that.construct_citydaily_data[that.yyyymmdd(timerange[1])][d]['stage2'] == 0){
            return 0;
          }
          else{
            return that.construct_citydaily_data[that.yyyymmdd(timerange[1])][d]['stage2'] / (that.construct_citydaily_data[that.yyyymmdd(timerange[1])][d]['stage1'] + that.construct_citydaily_data[that.yyyymmdd(timerange[1])][d]['stage2'] )
            }
          })
      };

      this.$store.commit("setgroupbardata", citydata);
      
    },
    dispatchdata: function() {
      let that = this;
      //init
      this.chart_data.region = [];
      this.chart_data.stage1 = [];
      this.chart_data.stage2 = [];
      this.percent = [];

      that.placesort = [];

      this.datastore.forEach(function(d, i) {
        that.chart_data.region.push(d['region'])
        that.chart_data.stage1.push(d['stage1'])
        that.chart_data.stage2.push(d['stage2'])
        that.chart_data.percent.push(d['percent'])
        that.placesort.push(d['region'])
      });

      this.chartInit();
      this.chartFacet();
    },
    barchart_sort_ascend() {
      this.datastore = this.datastore.sort((a, b) =>
        +a.patientsum < +b.patientsum
          ? 1
          : +b.patientsum < +a.patientsum
          ? -1
          : 0
      );
      this.dispatchdata();
    },
    barchart_sort_desascend() {
      this.datastore = this.datastore.sort((a, b) =>
        +a.patientsum > +b.patientsum
          ? 1
          : +b.patientsum > +a.patientsum
          ? -1
          : 0
      );
      this.dispatchdata();
    },
    piechart_sort_ascend() {
      this.datastore = this.datastore.sort((a, b) =>
        +a.percent < +b.percent
          ? -1
          : +b.percent < +a.percent
          ? 1
          : 0
      );
      this.dispatchdata();
    },
    piechart_sort_desascend() {
      this.datastore = this.datastore.sort((a, b) =>
        +a.percent > +b.percent
          ? -1
          : +b.percent > +a.percent
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
    timeRange() {
      let temp_timeRange = this.$store.getters.gettimeRange;
      if(typeof temp_timeRange[0] == 'object'){
        let time0 = this.yyyymmdd(temp_timeRange[0]),
          time1 = this.yyyymmdd(temp_timeRange[1]),
          timelist = [time0, time1]
          return timelist
      } else {
        return temp_timeRange
      }
    },
    scMergerData() {
      return this.$store.getters.getscMergerData;
    },
    selectedCity() {
      return this.$store.getters.getmergerCity;
    }
  },
  watch: {
    //监听dailydata数据变化
    groupbardata: function(newval, oldval) {
      //图表数据变化后该执行的操作
      let that = this;
      this.region = newval.region;
      this.stage1 = newval.stage1;
      this.stage2 = newval.stage2;
      this.percent = newval.percent;

      this.chart_data = {
        region: newval.region,
        stage1: newval.stage1,
        stage2: newval.stage2,
        percent: newval.percent
      }
      

      this.chartInit();
      this.chartFacet();
      this.datastore = [];

      for (let i = 0; i < newval.region.length; i++) {
        let patientsum = newval['stage1'][i] + newval['stage2'][i];
        this.datastore.push({
          region: newval['region'][i],
          stage1: newval['stage1'][i],
          stage2: newval['stage2'][i],
          percent: newval['percent'][i],
          patientsum: patientsum
        });
      }
    },

    timeRange: function(newval, oldval) {
      this.updateInfoPanel('省级');
      this.datachange(this.$store.getters.getscMergerData);
    },

    scMergerData: function(newval, oldVal) {
      this.datachange(newval)
      this.create_raw_paneldata(newval);
      this.create_raw_chartdata(newval);
    },

    selectedCity: function(newval, oldVal){
      this.updateInfoPanel(newval);
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
  /* //border: 1px solid #dededd; */
}
#groupbar_title{
  height: 15%;
}
#groupbar_mark {
  height: 8%;
}
#groupby_sort {
  height: 10%;
  padding-top: 83%;
}
#groupbar_mark span{
  color: white;
  font: 18px "Microsoft YaHei";
  float: left;
  padding-left: 5%;
}
.bar-angel {
  padding-top: 2%;
}
#gpbar {
  height: 67%;
  width: 80%;
  float: left;
}
#facet {
  height: 65%;
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

.panelinfo {
  margin-left: 5% !important;
  margin-right: 0 !important;
  width: 90%;
  float: left;
  border: 2px solid #00000002;
  border-radius: 8px;
  box-shadow: 2px 2px 2px #00000020;
  text-align: center;
}
.panelinfofont {
  color: #fff;
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
  /* border:3px solid #ffffff; */

  margin: 0.1% 0 0 0.1%;
  z-index: 1;
}
</style>
