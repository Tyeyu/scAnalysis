<template>
  <div id="Seir" class="dSeir">
    <!-- <div id="Seir"></div> -->
  </div>
</template>
<script>
import echarts from "echarts";

import * as d3 from "d3";
export default {
  data() {
    return {
      N: 2119 * 10000, //人口总数
      E: 0, //潜伏者数
      I: 1, //传染者数
      S: 2119 * 10000 - 1, //易感数
      R: 0, //康复者数
      r: 20, //感染者接触易感人数
      Beata: 0.03, //传染概率
      a: 0.5, //潜伏者转化为感染者概率
      r2: 3, //潜伏者接触易感者的人数
      Beata2: 0.03, //潜伏者传染正常人的概率
      y: 0.8, //康复概率
      Narry: null,
      Sarry: null,
      Iarry: null,
      Earry: null,
      Rarry: null,
      dayarry: [],
      tabechange: false,
      hosbednum: 8000,
      hosptialarry: [],
      populationmap: null,
      citys: [],
      controltime: 10,
      midu: 1190,
      sumI: [0],
      sumR: [0],
      sumbed: 0,
      lostI: [0],
      lostbed: [0]
    };
  },
  methods: {
    initdata: function() {
      this.Earry = [];
      this.Sarry = [];
      this.Iarry = [];
      this.Rarry = [];
      var testCalendar = this.$store.getters.getTcalendata;
      var Tcity = null;
      var Tpro = null;
      if (testCalendar != null) {
        Tcity = d3
          .nest()
          .key(function(d) {
            return d.name;
          })
          .map(this.$store.getters.getTcalendata.city);
        Tpro = d3
          .nest()
          .key(function(d) {
            return d.name;
          })
          .map(this.$store.getters.getTcalendata.province);
      }

      for (var i = 0; i < 40; i++) {
        if (this.I <= 0) this.I = 0;
        if (this.R <= 0) this.R = 0;
        if (this.E <= 0) this.E = 0;
        if (this.S <= 0) this.S = 0;
        this.Earry.push(parseInt(this.E));
        this.Sarry.push(parseInt(this.S));
        this.Iarry.push(parseInt(this.I));
        this.Rarry.push(parseInt(this.R));
        this.dayarry[i] = i + 1 + "天";
        if (i > 0) {
          this.sumI[i] = this.sumI[i - 1] + parseInt(this.I);
          this.sumR[i] = this.sumR[i - 1] + parseInt(this.R);
        }

        if (this.midu > 1000) {
          this.r = parseInt(this.midu * Math.random() * 0.05);
          this.r2 = parseInt(this.midu * Math.random() * 0.1);
        } else {
          if (this.midu > 500 && this.midu <= 1000) {
            this.r = parseInt(this.midu * Math.random() * 0.1);
            this.r2 = parseInt(this.midu * Math.random() * 0.1);
          } else {
            this.r = parseInt(this.midu * Math.random() * 0.5);
            this.r2 = parseInt(this.midu * Math.random() * 0.5);
          }
        }

        if (i >= this.controltime) {
          this.r = parseInt(3 * Math.random());
          this.r2 = parseInt(10 * Math.random());
        }
        var newDia =
          (this.r * this.Beata * this.Sarry[i] * this.Iarry[i]) / this.N; //发病者感染人数
        // if (i == 12) break;
        var newYDia =
          (this.r2 * this.Beata2 * this.Sarry[i] * this.Earry[i]) / this.N; //潜伏者感染人数
        if (i < this.controltime) {
          this.S = this.Sarry[i] - newDia - newYDia;
          this.E = this.Earry[i] + newDia - this.a * this.Earry[i] + newYDia;
          this.I = this.Iarry[i] + this.a * this.Earry[i];
          this.R = this.Rarry[i];
          this.sumbed += parseInt(this.sumI[i] * 0.01); //自由传播阶段，有较低概率病人住院
          if (this.hosbednum - this.sumbed < 0) {
            this.lostbed[i] = 0;
            this.sumbed = this.hosbednum;
          } else {
            this.lostbed[i] = this.hosbednum - this.sumbed;
          }
        } else {
          this.S = this.Sarry[i] - newDia - newYDia;

          this.E = this.Earry[i] + newDia - this.a * this.Earry[i] + newYDia;
          if (i == this.controltime) {
            this.sumbed += this.sumI[i] - this.sumbed - this.sumR[i]; //将发病的病人全部转入住院
            if (this.sumbed < 0) {
              this.sumbed = 0;
            }
          }

          if (i - this.controltime < 10) {
            this.I =
              this.Iarry[i] +
              this.a * this.Earry[i] -
              this.y * 0.1 * this.Iarry[i];
            if (this.sumbed < this.hosbednum)
              this.R = this.Rarry[i] + ((this.y * i) / 1000) * this.Iarry[i];
            else {
              this.R = this.Rarry[i] + ((this.y * i) / 10000) * this.Iarry[i];
            }
            this.sumbed +=
              parseInt(this.I * 0.9 * Math.random()) - parseInt(this.R);
            if (this.sumbed < 0) {
              this.sumbed = 0;
            }
            if (this.hosbednum - this.sumbed < 0) {
              this.lostbed[i] = 0;
              this.sumbed = this.hosbednum;
            } else {
              this.lostbed[i] = this.hosbednum - this.sumbed;
            }
          } else {
            if (i - this.controltime >= 10 && i - this.controltime <= 20) {
              this.I =
                this.Iarry[i] +
                this.a * this.Earry[i] -
                this.y * 0.5 * this.Iarry[i];
              this.R = this.Rarry[i] + ((this.y * i) / 1000) * this.Iarry[i];

              this.sumbed += parseInt(this.I) - parseInt(this.R);
              if (this.sumbed < 0) {
                this.sumbed = 0;
              }
              if (this.hosbednum - this.sumbed < 0) {
                this.lostbed[i] = 0;
                this.sumbed = this.hosbednum;
              } else {
                this.lostbed[i] = this.hosbednum - this.sumbed;
              }
            } else {
              this.I =
                this.Iarry[i] + this.a * this.Earry[i] - this.y * this.Iarry[i];
              if (this.sumbed < this.hosbednum)
                this.R = this.Rarry[i] + ((this.y * i) / 100) * this.Iarry[i];
              else {
                this.R = this.Rarry[i] + ((this.y * i) / 1000) * this.Iarry[i];
              }

              this.sumbed += parseInt(this.I) - parseInt(this.R);
              if (this.sumbed < 0) {
                this.sumbed = 0;
              }
              if (this.hosbednum - this.sumbed < 0) {
                this.lostbed[i] = 0;
                this.sumbed = this.hosbednum;
              } else {
                this.lostbed[i] = this.hosbednum - this.sumbed;
              }
            }
          }
        }
        if (testCalendar != null) {
          for (var j = 0; j < 11; j++) {
            Tcity.get(this.citys.city[j].name)[0].value += parseInt(
              (this.I + this.E) * this.citys.city[j].value
            );
            Tpro.get(this.citys.province[j].name)[0].value += parseInt(
              (this.I + this.E) * this.citys.province[j].value
            );
          }
        }
      }
      // this.Earry.push(this.E);
      // this.Sarry.push(this.S);
      // this.Iarry.push(this.I);
      // this.Rarry.push(this.R);
      // this.dayarry.push("100天");

      if (testCalendar != null) {
        var TCalendar = { city: [], province: [] };
        for (var k = 0; k < 11; k++) {
          var x = this.citys.city[k];
          var y = this.citys.province[k];
          x.value = Tcity.get(x.name)[0].value;
          y.value = Tpro.get(y.name)[0].value;
          TCalendar.city.push(x);
          TCalendar.province.push(y);
        }
        this.$store.commit("setTCalendar", TCalendar);
      }

      var Tdata = {
        nowBeds: this.lostbed,
        total: this.sumI,
        dayarry: this.dayarry
      };

      this.$store.commit("setTtotaldata", Tdata);

      // console.log(this.sumI);
      // console.log(this.lostbed);
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
          },
          left: "3%",
          top: "10px"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["潜伏者数", "传染者数", "康复者数"],
          textStyle: {
            color: "#ffffff"
          },
          top: '10px'
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
    },
    populationdata: function(newval) {
      this.populationmap = d3
        .nest()
        .key(function(d) {
          return d.city;
        })
        .map(newval.population);
    }
  },
  mounted() {
    this.initdata();
    // this.initchart();
  },
  computed: {
    tabe() {
      return this.$store.getters.gettabeselect;
    },
    ScCoordata() {
      return this.$store.getters.getscCoordata;
    },
    TseirCity() {
      return this.$store.getters.getTseirCity;
    },
    testparam() {
      return this.$store.getters.gettestparam;
    }
  },
  watch: {
    tabe: function(newval, oldval) {
      if (!this.tabechange) {
        this.initchart();
        this.tabechange = true;
      }
    },
    ScCoordata: function(newval, oldval) {
      this.populationdata(newval);
    },
    TseirCity: function(newval, oldval) {
      this.citys = newval;

      console.log(this.citys);
    },
    testparam: function(newval, oldval) {
      this.N =
        parseInt(this.populationmap.get(newval.cityname)[0].population) * 10000;
      // console.log(this.populationmap.get(newval.cityname), this.N);
      this.Beata = newval.Beata;
      this.I = 1;
      this.R = 0;
      this.S = parseFloat(this.N) - parseFloat(this.I);
      this.y = newval.health;
      this.controltime = newval.controltime;
      this.midu = newval.midu;
      this.hosbednum = newval.hospitalbed;
      this.initdata();

      this.initchart();
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
