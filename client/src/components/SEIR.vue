<template>
  <div id="Seir" class="dSeir">
    <div id="Seir"></div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
      N: 1119 * 10, //人口总数
      E: 10, //潜伏者数
      I: 1, //传染者数
      S: 1119 * 10 - 1, //易感数
      R: 0, //康复者数
      r: 20, //感染者接触易感人数
      Beata: 0.03, //传染概率
      a: 0.5, //潜伏者转化为感染者概率
      r2: 20, //潜伏者接触易感者的人数
      Beata2: 0.07, //潜伏者传染正常人的概率
      y: 0.8, //康复概率
      Narry: null,
      Sarry: null,
      Iarry: null,
      Earry: null,
      Rarry: null,
      dayarry: [],
      tabechange: false
    };
  },
  methods: {
    initdata: function() {
      this.Earry = [];
      this.Sarry = [];
      this.Iarry = [];
      this.Rarry = [];
      for (var i = 0; i < 40; i++) {
        this.Earry.push(parseInt(this.E));
        this.Sarry.push(parseInt(this.S));
        this.Iarry.push(parseInt(this.I));
        this.Rarry.push(parseInt(this.R));
        this.dayarry[i] = i + 1 + "天";
        // if (i >= 10) {
        //   this.r = 5;
        //   this.r2 = 5;
        // }
        this.S =
          this.Sarry[i] -
          (this.r * this.Beata * this.Sarry[i] * this.Iarry[i]) / this.N -
          (this.r2 * this.Beata2 * this.Sarry[i] * this.Earry[i]) / this.N;
        if (this.S <= 0) this.S = 0;
        this.E =
          this.Earry[i] +
          (this.r * this.Beata * this.Sarry[i] * this.Iarry[i]) / this.N -
          this.a -
          this.Earry[i] +
          (this.r2 * this.Beata2 * this.Sarry[i] * this.Earry[i]) / this.N;
        if (this.E <= 0) this.E = 0;
        this.I =
          this.Iarry[i] + this.a * this.Earry[i] - this.y * this.Iarry[i];
        if (this.I <= 0) this.I = 0;
        this.R = this.Rarry[i] + this.y * this.Iarry[i];
        if (this.R <= 0) this.R = 0;
      }
      this.Earry.push(this.E);
      this.Sarry.push(this.S);
      this.Iarry.push(this.I);
      this.Rarry.push(this.R);
      this.dayarry.push("40天");
    },
    initchart: function() {
      var mychart = echarts.init(document.getElementById("Seir"));
      var option = {
        textStyle: {
          color: "#ffffff"
        },
        title: {
          text: "SEIR",
          textStyle: {
            color: "#ffffff"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["易感数", "潜伏者数", "传染者数", "康复者数"],
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
          {
            name: "易感数",
            type: "line",
            smooth: true,
            data: this.Sarry
          },
          {
            name: "潜伏者数",
            type: "line",
            smooth: true,
            data: this.Earry
          },
          {
            name: "传染者数",
            type: "line",
            smooth: true,
            data: this.Iarry
          },
          {
            name: "康复者数",
            type: "line",
            smooth: true,
            data: this.Rarry
          }
        ]
      };
      mychart.setOption(option, true);
    }
  },
  mounted() {
    this.initdata();
    // this.initchart();
  },
  computed: {
    tabe() {
      return this.$store.getters.gettabeselect;
    }
  },
  watch: {
    // "$store.state.tabeselect": function(newval, oldval) {
    //   console.log("########");
    //   this.initdata();

    //   this.initchart();
    // },
    tabe: function(newval, oldval) {
      if (!this.tabechange) {
        this.initchart();
        this.tabechange = true;
      }
    }
  }
};
</script>
<style>
.dSeir {
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
#Seir {
  position: absolute;
  top: 65.1%;
  left: 0.1%;
  width: 33.2%;
  height: 34%;
  background-color: #30313a;
}
</style>
