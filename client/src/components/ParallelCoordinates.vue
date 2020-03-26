<template>
  <div id="Coordinates"></div>
</template>
<script>
//平行坐标图
import echarts from "echarts";
export default {
  data() {
    return {
      dataBJ: [[1, 55, 9, 56, 100, 18, 6, "低"]],

      dataHB: [[1, 26, 37, 27, 78, 27, 13, "低"]],

      dataSC: [[30, 80, 55, 80, 0, 75, 24, "高"]]
    };
  },
  methods: {
    initchart: function() {
      let that = this;
      var echartDom = document.getElementById("Coordinates");
      //初始化
      var myChart = echarts.init(echartDom);

      var schema = [
        { name: "city", index: 0, text: "城市" },
        { name: "AQIindex", index: 1, text: "疑似病例" },
        { name: "PM25", index: 2, text: "确诊病历" },
        { name: "PM10", index: 3, text: "死亡人数" },
        { name: "CO", index: 4, text: " 入境人数" },
        { name: "NO2", index: 5, text: "出境人数" },
        { name: "SO2", index: 6, text: "医疗资金（百万）" },
        { name: "等级", index: 7, text: "风险等级" }
      ];

      var lineStyle = {
        normal: {
          width: 0.8,
          opacity: 1
        }
      };

      var option = {
        //backgroundColor: "#F0F0EF",

        // dataZoom: {
        //     show: true,
        //     orient: 'vertical',
        //     parallelAxisIndex: [0]
        // },
        parallelAxis: [
          {
            dim: 0,
            name: schema[0].text,
            inverse: true,
            max: 31,
            nameLocation: "start"
          },
          { dim: 1, name: schema[1].text },
          { dim: 2, name: schema[2].text },
          { dim: 3, name: schema[3].text },
          { dim: 4, name: schema[4].text },
          { dim: 5, name: schema[5].text },
          { dim: 6, name: schema[6].text },
          {
            dim: 7,
            name: schema[7].text,
            type: "category",
            data: ["低", "中 ", "高"]
          }
        ],

        parallel: {
          top: "20%",
          left: "5%",
          right: "7%",
          height: "72%",
          bottom: 100,
          parallelAxisDefault: {
            type: "value",
            name: "疫情tu",
            nameLocation: "end",
            nameGap: 20,
            nameTextStyle: {
              color: "black",
              fontSize: 12
            },
            axisLine: {
              lineStyle: {
                color: "black"
              }
            },
            axisTick: {
              lineStyle: {
                color: "black"
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: "black"
            }
          }
        },
        series: [
          {
            name: "北京",
            type: "parallel",
            lineStyle: lineStyle,
            data: that.dataBJ
          },
          {
            name: "湖北",
            type: "parallel",
            lineStyle: lineStyle,
            data: that.dataHB
          },
          {
            name: "四川",
            type: "parallel",
            lineStyle: lineStyle,
            data: that.dataSC
          }
        ]
      };
      myChart.setOption(option);
    }
  },
  mounted() {
    this.initchart();
  },
  computed: {
    Coordinatesdata() {
      return this.$store.getters.getCoordinatesdata;
    },
    ScCoordata() {
      return this.$store.getters.getscCoordata;
    }
  },
  watch: {
    //监听dailydata数据变化
    Coordinatesdata: function(newval, oldval) {
      //图表数据变化后该执行的操作
    },
    ScCoordata: function(newval, oldval) {}
  }
};
</script>
<style>
#Coordinates {
  position: absolute;
  top: 65.1%;
  right: 0.1%;
  width: 33.2%;
  height: 34%;
  border: 1pt solid #dededd;
}
</style>
