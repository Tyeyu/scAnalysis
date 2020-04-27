<template>
  <div id="pie">
    <div id="in-pie"></div>
    <div id="in-bar"></div>
  </div>
</template>

<script>
let echarts = require("echarts");
export default {
  name: "madeup",
  data() {
    return {
      sexData: null,
      ageData: null,
      series: null,
      myChart: null,
        cityname: "四川省",
      option: null
    };
  },
  mounted() {},
  methods: {
    drawpie() {
      let that = this;
      console.log(that.sexData);
      that.myChart = echarts.init(document.getElementById("in-pie"));
      that.option = {
        title: {
          text: "性别占比",
          top: "15px",
          left: "19%"
        },
        tooltip: {
          trigger: "item",
          position: "right"
        },
        series: [
          {
            name: "感染者性别",
            type: "pie",
            center: ["60%", "60%"],
            radius: ["40%", "60%"],
            bottom: "1%",
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },

            data: that.sexData
          }
        ]
      };
      that.myChart.setOption(that.option);
    },
    drawbar() {
      let that = this;
      that.myChart = echarts.init(document.getElementById("in-bar"));
      that.option = {
        color: ["#3398DB"],
        title: {
          text: "年龄组成",
          left: "40%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "15%",
          right: "15%",
          bottom: "1%",
          top: "15%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            name: "年龄段",
            data: [
              "0-10",
              "10-20",
              "20-30",
              "30-40",
              "40-50",
              "50-60",
              "60-70",
              "70-80"
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "患病人数",
            type: "bar",
            barWidth: "50%",
            data: that.ageData
          }
        ]
      };
      that.myChart.setOption(that.option, true);
    },
    changedata: function(newval) {
        var cityname = this.$store.getters.getmergerCity;
        console.log(cityname);
      var madeupdata = {
        sex: [
          { name: "", value: 0 },
          { name: "", value: 0 }
        ],

        age: [],
        seriesData: { confirmed: 0, health: 0, death: 0 }
      };
      var j = 0;

      var timerange = [
        new Date(this.$store.getters.gettimeRange[0]),
        new Date(this.$store.getters.gettimeRange[1])
      ];
      var playcheck = this.$store.getters.getplaycheck;
      for (var i = 0; i < newval.length; i++) {
        var times = new Date(newval[i].diagnosisTime);
        if (times.getTime() <= timerange[1].getTime()) {
            //console.log(newval[i]);
          if (playcheck) {
            if (newval[i].sex == "男") {
              madeupdata.sex[0].value += 1;
              madeupdata.sex[0].name = "男";
            } else if (newval[i].sex == "女") {
              madeupdata.sex[1].value += 1;
              madeupdata.sex[1].name = "女";
            }

            madeupdata.age[j] = newval[i].age;
            j++;
          } else {
              console.log(cityname == "");
              if (times.getTime() >= timerange[0].getTime() && cityname == "")
              {
                  if (newval[i].sex == "男") {
                      madeupdata.sex[0].value += 1;
                      madeupdata.sex[0].name = "男";
                  } else if (newval[i].sex == "女") {
                      madeupdata.sex[1].value += 1;
                      madeupdata.sex[1].name = "女";
                  }

                  madeupdata.age[j] = newval[i].age;
                  j++;
              }

            if(times.getTime() >= timerange[0].getTime() && newval[i].city == cityname) {
              if (newval[i].sex == "男") {
                madeupdata.sex[0].value += 1;
                madeupdata.sex[0].name = "男";
              } else if (newval[i].sex == "女") {
                madeupdata.sex[1].value += 1;
                madeupdata.sex[1].name = "女";
              }

              madeupdata.age[j] = newval[i].age;
              j++;
            }

          }
        }
      }

      this.$store.commit("setmadeupdata", madeupdata);
    },
    mergeData: function(newval) {
      var seriesData = {
        confirmed: 0,
        health: 0,
        death: 0
      };
      var timeRange = [
        new Date(this.$store.getters.gettimeRange[0]),
        new Date(this.$store.getters.gettimeRange[1])
      ];
      for (var k = 0; k < newval.length; k++) {
        var dates = newval[k].date;
        // console.log(dates);
        // console.log(dates.split("月")[1].split("日")[0]);
        dates = new Date(
          2020,
          parseInt(dates.split("月")[0]) - 1,
          dates.split("月")[1].split("日")[0]
        );

        if (
          timeRange[0].getTime() <= dates.getTime() &&
          dates.getTime() <= timeRange[1].getTime()
        ) {
          if (newval[k].newDiagnosis != "") {
            seriesData.confirmed += newval[k].newDiagnosis;
          } else if (newval[k].newHealth != "") {
            seriesData.health += newval[k].newHealth;
          } else if (newval[k].newDeath != "") {
            seriesData.death += newval[k].newDeath;
          }
        }
      }
      this.$store.commit("setmadeupdata", seriesData);
    }
  },
  computed: {
    madeupdata() {
      return this.$store.getters.getmadeupdata;
    },

    ScTrackData() {
      return this.$store.getters.getscTrackData;
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
    //监听madeupdata数据变化
    madeupdata: function(newval, oldval) {
      //图表数据变化后该执行的操作
      this.sexData = newval.sex;
      this.ageData = newval.age;
      this.series = newval.seriesData;
      this.drawpie();
      this.drawbar();
    },
    timeRange: function(newval, oldval) {
      this.changedata(this.$store.getters.getscTrackData);
    },
    scMergerData: function(newval, oldval) {
      // this.mergeData(newval);
    },
    ScTrackData: function(newval, oldval) {
      this.changedata(newval);
    },
      Cityname: function(newval, oldval) {
        this.cityname = newval;
        this.changedata(this.$store.getters.getscTrackData);
      }
  }
};
</script>

<style>
#pie {
  position: absolute;
  top: 5.1%;
  left: 0.1%;
  width: 24.8%;
  height: 27.5%;
  border: 1px solid #dededd;
}

#in-pie {
  height: 70%;
  width: 30%;
  bottom: 0.1%;
  top: 30%;
  float: left;
}
#in-bar {
  height: 95%;
  width: 70%;
  float: right;
}
#in-content {
  height: 90%;
  width: 30%;
  top: 10%;
}
</style>
