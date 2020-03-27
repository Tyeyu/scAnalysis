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
      myChart: null,
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
          top: "25px",
          left: "15%"
        },
        tooltip: {
          trigger: "item"
        },
        series: [
          {
            name: "感染者性别",
            type: "pie",
            center: ["60%", "60%"],
            radius: "60%",
            data: that.sexData
          }
        ]
      };
      that.myChart.setOption(that.option, true);
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
            barWidth: "30%",
            data: that.ageData
          }
        ]
      };
      that.myChart.setOption(that.option, true);
    },
    changedata: function(newval) {
      var madeupdata = {
        sex: [
          { name: "", value: 0 },
          { name: "", value: 0 }
        ],
        age: []
      };
      var j = 0;
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
      this.$store.commit("setmadeupdata", madeupdata);
    }
  },
  computed: {
    madeupdata() {
      return this.$store.getters.getmadeupdata;
    },
    ScTrackData() {
      return this.$store.getters.getscTrackData;
    },
    timeRange() {
      return this.$store.getters.gettimeRange;
    }
  },
  watch: {
    //监听madeupdata数据变化
    madeupdata: function(newval, oldval) {
      //图表数据变化后该执行的操作
      this.sexData = newval.sex;
      this.ageData = newval.age;
      this.drawpie();
      this.drawbar();
    },
    timeRange: function(newval, oldval) {
      this.changedata(this.$store.getters.getscTrackData);
    },
    ScTrackData: function(newval, oldval) {
      this.changedata(newval);
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
  height: 95%;
  width: 30%;
  float: left;
}
#in-bar {
  height: 95%;
  width: 70%;
  float: right;
}
</style>
