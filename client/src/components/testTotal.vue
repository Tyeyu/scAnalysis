<template>
  <div id="testTotal" class="testTotal-angel">
    <!-- <div ></div> -->
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
      nowBeds: [100, 99, 89, 80],
      nowDia: [0, 1, 11, 20],
      total: [0, 1, 11, 20],
      dayarry: [1, 2, 3, 4],
      tabechange: false
    };
  },
  methods: {
    drawchart: function() {
      var mychart = echarts.init(document.getElementById("testTotal"));
      var option = {
        textStyle: {
          color: "#ffffff"
        },
        title: {
          text: "医疗资源",
          textStyle: {
            color: "#ffffff"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["剩余病床", "累计确诊"],
          textStyle: {
            color: "#ffffff"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {}
        },
        xAxis: {
          type: "category",
          data: this.dayarry,
          axisLine: {
            lineStyle: { color: "#ffffff" }
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: { color: "#ffffff" }
          }
        },
        series: [
          // {
          //   name: "现有确诊",
          //   type: "line",
          //   smooth: true,
          //   data: this.nowDia
          // },
          {
            name: "剩余病床",
            type: "line",
            smooth: true,
            data: this.nowBeds
          },
          {
            name: "累计确诊",
            type: "line",
            smooth: true,
            data: this.total
          }
        ]
      };
      mychart.setOption(option, true);
    }
  },
  mounted() {},
  computed: {
    tabe() {
      return this.$store.getters.gettabeselect;
    },
    Ttotaldata() {
      return this.$store.getters.getTtotaldata;
    }
  },
  watch: {
    tabe: function(newval, oldval) {
      if (!this.tabechange) {
        this.drawchart();
        this.tabechange = true;
      }
    },
    Ttotaldata: function(newval, oldval) {
      this.dayarry = newval.dayarry;
      this.nowBeds = newval.nowBeds;
      this.total = newval.total;
      if (this.tabechange) this.drawchart();
      // console.log(newval);
    }
  }
};
</script>
<style>
#testTotal {
  position: absolute;
  top: 65.1%;
  left: 33.9%;
  width: 33%;
  height: 34%;
  background-color: #30313a;
  z-index: 3;
}
.testTotal-angel {
  z-index: 2;
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
  margin: 0.1% 0 0 0.1%;
}
</style>
