<template>
  <div id="Daily"></div>
</template>

<script>
import echarts from "echarts";
//每日新增图
export default {
  name: "Daily",
  data() {
    return {};
  },
  mounted() {
    this.ChartInit();
  },
  methods: {
    ChartInit() {
      var myChart = echarts.init(document.getElementById("Daily"));
      var option = {
        title: {
          text: " 患病数      每日新增",
          left: "7%",
          top: "10px"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["新增确诊", "死亡", "治愈"],
          right: "9%",
          top: "30px"
        },
        xAxis: {
          type: "category",
          //是否顶格
          boundaryGap: false,
          data: [
            "1月10号",
            "1月11号",
            "1月12号",
            "1月13号",
            "1月14号",
            "1月15号",
            "1月16号",
            "1月17号",
            "1月18号",
            "1月19号",
            "1月20号",
            "1月21号",
            "1月22号",
            "1月23号",
            "1月24号",
            "1月25号",
            "1月26号",
            "1月27号",
            "1月28号",
            "1月29号",
            "1月30号",
            "1月31号",
            "2月1号",
            "2月2号",
            "2月3号",
            "2月4号",
            "2月5号",
            "2月6号",
            "2月7号",
            "2月8号",
            "2月9号",
            "2月10号",
            "2月11号",
            "2月12号",
            "2月13号",
            "2月14号",
            "2月15号",
            "2月16号",
            "2月17号",
            "2月18号",
            "2月19号",
            "2月20号",
            "2月21号",
            "2月22号",
            "2月23号",
            "2月24号",
            "2月25号",
            "2月26号",
            "2月27号",
            "2月28号"
          ],
          name: "t"
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            smooth: true,
            name: "新增确诊",
            type: "line",

            data: [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              2,
              6,
              7,
              13,
              16,
              25,
              21,
              18,
              34,
              36,
              30,
              24,
              23,
              28,
              19,
              20,
              23,
              19,
              23,
              19,
              12,
              19,
              15,
              12,
              7,
              11,
              14,
              13,
              6,
              6,
              5,
              1,
              0,
              1,
              2,
              2,
              3,
              4,
              0
            ]
          },
          {
            smooth: true,
            name: "死亡",
            type: "line",

            data: [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              2,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ]
          },
          {
            smooth: true,
            name: "治愈",
            type: "line",

            data: [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              0,
              2,
              0,
              9,
              2,
              9,
              4,
              10,
              13,
              10,
              16,
              6,
              3,
              8,
              12,
              10,
              12,
              9,
              27,
              14,
              21,
              24,
              20,
              14,
              7,
              15,
              14,
              18,
              16,
              24
            ]
          }
        ]
      };
      myChart.setOption(option);
    }
  }
};
</script>
<style>
#Daily {
  position: absolute;
  top: 60.1%;
  left: 0.1%;
  width: 24.8%;
  height: 39%;
  border: 1px solid white;
}
</style>
