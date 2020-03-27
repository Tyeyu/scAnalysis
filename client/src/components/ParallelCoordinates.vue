<template>
  <div id="Coordinates"></div>
</template>
<script>
//平行坐标图
import echarts from "echarts";
export default {
  data() {
    return {
      dataBJ: [["凉山", 10, 9, 56, 100, 18, 6, 10]],

      dataHB: [["成都", 26, 37, 27, 78, 27, 13, 20]],

      dataSC: [["达州", 15, 55, 80, 0, 75, 24, 33]]
    };
  },
  methods: {
    initchart: function() {
      let that = this;
      var echartDom = document.getElementById("Coordinates");
      //初始化
      var myChart = echarts.init(echartDom);

      var schema = [
        { name: "city", index: 0, text: "地区" },
        { name: "AQIindex", index: 1, text: "确诊人数" },
        { name: "PM25", index: 2, text: "治愈率" },
        { name: "PM10", index: 3, text: "死亡率" },
        { name: "CO", index: 4, text: "迁入" },
        { name: "NO2", index: 5, text: "迁出" },
        { name: "SO2", index: 6, text: "定点医院个数" },
        { name: "等级", index: 7, text: "发热门诊个数" }
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
            type: "category",
            data: [
              "成都",
              "自贡 ",
              "攀枝花",
              "泸州",
              "德阳",
              "绵阳",
              "广元",
              "遂宁",
              "内江",
              "乐山",
              "南充",
              "宜宾",
              "广安",
              "达州",
              "巴中",
              "雅安",
              "眉山",
              "资阳",
              "阿坝",
              "甘孜",
              "凉山"
            ]
          },
          {
            dim: 1,
            name: schema[1].text,
            inverse: true,
            max: 101,
            nameLocation: "start"
          },
          { dim: 2, name: schema[2].text },
          { dim: 3, name: schema[3].text },
          { dim: 4, name: schema[4].text },
          { dim: 5, name: schema[5].text },
          { dim: 6, name: schema[6].text },
          { dim: 7, name: schema[7].text }
        ],
        tooltip: {
          triggerOn: "mousemove",
          formatter: "{b0}: {c0}<br />{b1}: {c1}"
        },
        parallel: {
          top: "20%",
          left: "5%",
          right: "7%",
          height: "76%",
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
