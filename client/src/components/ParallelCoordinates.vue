<template>
  <div id="Coordinates"></div>
</template>
<script>
//平行坐标图
import echarts from "echarts";
export default {
  data() {
    return {
      dataBJ: [
        [1, 55, 9, 56, 100, 18, 6, "低"],
        [3, 25, 11, 21, 123, 34, 9, "低"],
        [7, 56, 7, 63, 144, 14, 5, "低"],
        [10, 33, 7, 29, 156, 16, 6, "低"],
        [12, 42, 24, 44, 366, 40, 16, "低"],
        [17, 82, 58, 90, 344, 68, 33, "中"],
        [18, 74, 49, 77, 234, 48, 27, "中"],
        [20, 78, 55, 80, 11, 59, 29, "中"],
        [22, 267, 216, 34, 0, 108, 64, "中"],
        [30, 185, 127, 77, 0, 61, 27, "中"]
      ],

      dataHB: [
        [1, 26, 37, 27, 78, 27, 13, "低"],
        [3, 85, 62, 71, 144, 60, 8, "低"],
        [7, 78, 38, 74, 155, 37, 7, "低"],
        [10, 21, 21, 36, 66, 40, 9, "中"],
        [12, 41, 42, 46, 888, 81, 13, "中"],
        [17, 56, 52, 69, 965, 92, 16, "中"],
        [18, 64, 30, 28, 100, 51, 2, "高"],
        [20, 55, 48, 74, 33, 75, 26, "高"],
        [22, 76, 85, 113, 0, 114, 27, "高"],
        [30, 91, 81, 104, 0, 56, 40, "高"]
      ],

      dataSC: [
        [1, 91, 45, 125, 566, 34, 23, "低"],
        [3, 65, 27, 78, 333, 45, 29, "低"],
        [7, 83, 60, 84, 234, 73, 27, "低"],
        [10, 109, 81, 121, 11, 68, 51, "低"],
        [12, 106, 77, 114, 111, 55, 51, "中"],
        [17, 109, 81, 121, 228, 68, 51, "中"],
        [18, 106, 77, 114, 133, 55, 51, "中"],
        [20, 89, 65, 78, 56, 51, 26, "中"],
        [22, 53, 33, 47, 0, 50, 17, "高"],
        [30, 80, 55, 80, 0, 75, 24, "高"]
      ]
    };
  },
  methods: {
    initchart: function() {
      let that = this;
      var echartDom = document.getElementById("Coordinates");
      //初始化
      var myChart = echarts.init(echartDom);

      var schema = [
        { name: "date", index: 0, text: "日期" },
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
          width: 1,
          opacity: 0.5
        }
      };

      var option = {
        //backgroundColor: "#F0F0EF",
        legend: {
          bottom: 30,
          data: ["北京", "湖北", "四川"],
          itemGap: 20,
          textStyle: {
            color: "#fff",
            fontSize: 14
          }
        },
        tooltip: {
          padding: 10,
          backgroundColor: "#000",
          borderColor: "#777",
          borderWidth: 1,
          formatter: function(obj) {
            var value = obj[0].value;
            return (
              '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
              obj[0].seriesName +
              " " +
              value[0] +
              "日期：" +
              value[7] +
              "</div>" +
              schema[1].text +
              "：" +
              value[1] +
              "<br>" +
              schema[2].text +
              "：" +
              value[2] +
              "<br>" +
              schema[3].text +
              "：" +
              value[3] +
              "<br>" +
              schema[4].text +
              "：" +
              value[4] +
              "<br>" +
              schema[5].text +
              "：" +
              value[5] +
              "<br>" +
              schema[6].text +
              "：" +
              value[6] +
              "<br>"
            );
          }
        },
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
        visualMap: {
          show: true,
          min: 0,
          max: 150,
          dimension: 2,
          inRange: {
            color: ["#d94e5d", "#eac736", "#50a3ba"].reverse()
            // colorAlpha: [0, 1]
          }
        },
        parallel: {
          left: "5%",
          right: "18%",
          bottom: 100,
          parallelAxisDefault: {
            type: "value",
            name: "AQI指数",
            nameLocation: "end",
            nameGap: 20,
            nameTextStyle: {
              color: "#fff",
              fontSize: 12
            },
            axisLine: {
              lineStyle: {
                color: "#aaa"
              }
            },
            axisTick: {
              lineStyle: {
                color: "#777"
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: "#fff"
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
    }
  },
  watch: {
    //监听dailydata数据变化
    Coordinatesdata: function(newval, oldval) {
      //图表数据变化后该执行的操作
    }
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
