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
      P: 0, //疑似被感染但未感染人数
      r3: 0, //接触的疑似被感染但未感染人数
      Beata3: 0.08, //疑似接触率
      x: 0.1, //疑似转移到易感染人数概率
      QE: 0, //被控制的潜伏者人数
      deata1: 0.08, //潜伏者被转移到控制概率
      QI: 0, //被控制的传染者人数
      deata2: 0.8, //发病者转移到被控制的概率
      CE: 0,
      CI: 0,
      Narry: null,
      Sarry: null,
      Iarry: null,
      Earry: null,
      Rarry: null,
      Parry: null,
      QEarry: null,
      QIarry: null,
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
      lostbed: [0],
      citysJWD: null,
      selectCity: null,
      play: null,
      i: 0,
      mapQXLinedata: null,
      TCalendar: null,
      ZT: false,
      Tcity: null,
      Tpro: null,
      testCalendar: null,
      R2: 0
    };
  },
  methods: {
    initdata: function() {
      let that = this;
      if (!this.ZT) {
        this.Earry = [];
        this.Sarry = [];
        this.Iarry = [];
        this.Rarry = [];
        this.Parry = [];
        this.QEarry = [];
        this.QIarry = [];
        that.testCalendar = this.$store.getters.getTcalendata;
        for (var i = 0; i < 11; i++) {
          that.testCalendar.city[i].value = 0;
          that.testCalendar.province[i].value = 0;
        }

        if (that.testCalendar != null) {
          this.Tcity = d3
            .nest()
            .key(function(d) {
              return d.name;
            })
            .map(this.$store.getters.getTcalendata.city);
          this.Tpro = d3
            .nest()
            .key(function(d) {
              return d.name;
            })
            .map(this.$store.getters.getTcalendata.province);
        }
      }
      this.ZT = false;
      var newDia = null;
      var newYDia = null;
      that.sumI[0] = 1;
      this.play = self.setInterval(function() {
        if (that.i < 40) {
          if (that.I <= 0) that.I = 0;
          if (that.R <= 0) that.R = 0;
          if (that.E <= 0) that.E = 0;
          if (that.S <= 0) that.S = 0;
          that.Earry.push(parseInt(that.E));
          that.Sarry.push(parseInt(that.S));
          that.Iarry.push(parseInt(that.I));
          that.Rarry.push(parseInt(that.R));
          that.dayarry[that.i] = that.i + 1 + "天";
          if (that.i > 0) {
            if (that.I - that.Iarry[that.i - 1] >= 0)
              that.sumI[that.i] =
                that.sumI[that.i - 1] +
                parseInt(that.I - that.Iarry[that.i - 1] + that.QI);
            else that.sumI[that.i] = that.sumI[that.i - 1] + parseInt(that.QI);
            that.sumR[that.i] = parseInt(that.R2) + that.sumR[that.i - 1];
          }

          if (that.midu > 1000) {
            that.r = parseInt(that.midu * Math.random() * 0.03);
            that.r2 = parseInt(that.midu * Math.random() * 0.05);
          } else {
            if (that.midu > 500 && that.midu <= 1000) {
              that.r = parseInt(that.midu * Math.random() * 0.05);
              that.r2 = parseInt(that.midu * Math.random() * 0.1);
            } else {
              that.r = parseInt(that.midu * Math.random() * 0.1);
              that.r2 = parseInt(that.midu * Math.random() * 0.2);
            }
          }
          if (that.i < that.controltime) {
            that.Parry.push(0);
            that.QEarry.push(0);
            that.QIarry.push(0);
          } else {
            if (that.P <= 0) that.P = 0;
            if (that.QE <= 0) that.QE = 0;
            if (that.QI <= 0) that.QI = 0;

            that.Parry.push(parseInt(that.P));
            that.QEarry.push(parseInt(that.QE));
            that.QIarry.push(parseInt(that.QI));
            that.r3 = that.r * 2;
          }
          if (that.i >= that.controltime) {
            that.r = 0;
            that.r2 = parseInt(3 * Math.random());
            that.Beata -= (that.i - that.controltime) / 30;
            if (that.Beata <= 0) that.Beata = 0;
            that.Beata2 = that.Beata;
            if (that.i - that.controltime >= 10) {
              that.Beata = 0.08 / that.i;
              that.Beata2 = that.Beata;
            }
          }
          newDia =
            (that.r * that.Beata * that.Sarry[that.i] * that.Iarry[that.i]) /
            that.N; //发病者感染人数
          // if (i == 12) break;
          newYDia =
            (that.r2 * that.Beata2 * that.Sarry[that.i] * that.Earry[that.i]) /
            that.N; //潜伏者感染人数
          if (that.i < that.controltime) {
            that.S = that.Sarry[that.i] - newDia - newYDia;
            that.E =
              that.Earry[that.i] +
              newDia -
              that.a * that.Earry[that.i] +
              newYDia;
            that.I = that.Iarry[that.i] + that.a * that.Earry[that.i];

            that.R = that.Rarry[that.i];
            that.R2 = 0;
            that.sumbed = parseInt(that.sumI[that.i] * 0.01); //自由传播阶段，有较低概率病人住院
            if (that.hosbednum - that.sumbed < 0) {
              that.lostbed[that.i] = 0;
              that.sumbed = that.hosbednum;
            } else {
              that.lostbed[that.i] = that.hosbednum - that.sumbed;
            }
          } else {
            that.S =
              that.Sarry[that.i] -
              newDia -
              newYDia -
              that.r3 * that.Beata3 * (that.I + that.E) +
              that.x * that.P;
            that.P =
              that.Parry[that.i] +
              that.r3 * that.Beata3 * (that.I + that.E) -
              that.x * that.P;

            that.deata1 = 0.2 + (that.i - that.controltime) / 10;
            that.deata2 = 0.5 + (that.i - that.controltime) / 10;

            if (that.deata1 > 1) that.deata1 = 1;
            if (that.deata2 > 1) that.deata2 = 1;
            that.E =
              that.Earry[that.i] +
              newDia -
              that.a * that.Earry[that.i] +
              newYDia -
              that.CE -
              that.E * that.deata1;
            if (that.i == that.controltime) {
              that.sumbed +=
                that.sumI[that.i] - that.sumbed - that.sumR[that.i]; //将发病的病人全部转入住院
              if (that.sumbed < 0) {
                that.sumbed = 0;
              }
            }

            if (that.i - that.controltime < 5) {
              that.I =
                that.Iarry[that.i] +
                that.a * that.Earry[that.i] -
                that.y * 0.1 * that.Iarry[that.i] -
                that.CI -
                that.I * that.deata2;
              if (that.sumbed < that.hosbednum) {
                that.R =
                  that.Rarry[that.i] +
                  ((that.y * that.i) / 100) * that.Iarry[that.i] +
                  that.QI * ((that.y * that.i) / 100);
                that.R2 =
                  (that.sumI[that.i] - that.sumR[that.i]) *
                  ((that.y * that.i) / 100);
                that.QI =
                  that.Iarry[that.i] * that.deata2 -
                  that.QI * ((that.y * that.i) / 100) +
                  (that.i / 40) * that.QE;
                that.sumbed =
                  parseInt(
                    (((that.QI + that.I) * 0.9 * i) / 40) * Math.random()
                  ) - parseInt(that.R);
              } else {
                that.R =
                  that.Rarry[that.i] +
                  ((that.y * that.i) / 1000) * that.Iarry[that.i] +
                  that.QI * ((that.y * that.i) / 1000);
                that.R2 =
                  (that.sumI[that.i] - that.sumR[that.i]) *
                  ((that.y * that.i) / 1000);
                that.QI =
                  that.Iarry[that.i] * that.deata2 -
                  that.QI * ((that.y * that.i) / 1000) +
                  (that.i / 40) * that.QE;
              }

              if (that.sumbed < 0) {
                that.sumbed = 0;
              }
              if (that.hosbednum - that.sumbed < 0) {
                that.lostbed[that.i] = 0;
                that.sumbed = that.hosbednum;
              } else {
                that.lostbed[that.i] = that.hosbednum - that.sumbed;
              }
            } else {
              if (
                that.i - that.controltime >= 5 &&
                that.i - that.controltime <= 20
              ) {
                that.I =
                  that.Iarry[that.i] +
                  that.a * that.Earry[that.i] -
                  that.y * 0.5 * that.Iarry[that.i] -
                  that.CI -
                  that.I * that.deata2;
                that.R =
                  that.Rarry[that.i] +
                  ((that.y * that.i) / 100) * that.Iarry[that.i] +
                  that.QI * ((that.y * that.i) / 100);
                that.R2 =
                  (that.sumI[that.i] - that.sumR[that.i]) *
                  ((that.y * that.i) / 100);
                that.QI =
                  that.Iarry[that.i] * that.deata2 -
                  that.QI * ((that.y * that.i) / 100) +
                  (that.i / 100) * that.QE;
                that.sumbed =
                  parseInt(that.QI) + parseInt(that.I) - parseInt(that.R);
                if (that.sumbed < 0) {
                  that.sumbed = 0;
                }
                if (that.hosbednum - that.sumbed < 0) {
                  that.lostbed[that.i] = 0;
                  that.sumbed = that.hosbednum;
                } else {
                  that.lostbed[that.i] = that.hosbednum - that.sumbed;
                }
              } else {
                that.I =
                  that.Iarry[that.i] +
                  that.a * that.Earry[that.i] -
                  that.y * that.Iarry[that.i] -
                  that.CI -
                  that.I * that.deata2;
                if (that.sumbed < that.hosbednum) {
                  that.R =
                    that.Rarry[that.i] +
                    ((that.y * that.i) / 40) * that.Iarry[that.i] +
                    that.QI * ((that.y * that.i) / 40);
                  that.R2 =
                    (that.sumI[that.i] - that.sumR[that.i]) *
                    ((that.y * that.i) / 40);
                  that.QI =
                    that.Iarry[that.i] * that.deata2 -
                    that.QI * ((that.y * that.i) / 40) +
                    (that.i / 40) * that.QE;
                } else {
                  that.R =
                    that.Rarry[that.i] +
                    ((that.y * that.i) / 40) * that.Iarry[that.i] +
                    that.QI * ((that.y * that.i) / 40);
                  that.R2 =
                    (that.sumI[that.i] - that.sumR[that.i]) *
                    ((that.y * that.i) / 40);
                  that.QI =
                    that.Iarry[that.i] * that.deata2 -
                    that.QI * ((that.y * that.i) / 40) +
                    (that.i / 40) * that.QE;
                }

                that.sumbed =
                  parseInt(that.QI) + parseInt(that.I) - parseInt(that.R);
                if (that.sumbed < 0) {
                  that.sumbed = 0;
                }
                if (that.hosbednum - that.sumbed < 0) {
                  that.lostbed[that.i] = 0;
                  that.sumbed = that.hosbednum;
                } else {
                  that.lostbed[that.i] = that.hosbednum - that.sumbed;
                }
              }
            }
          }
          that.QE = that.Earry[that.i] * that.deata1 - (that.i / 40) * that.QE;

          that.CE = 0;
          that.CI = 0;

          if (that.testCalendar != null) {
            for (var j = 0; j < 11; j++) {
              var cs = 0;
              var ps = 0;
              if (that.E < 0) that.E = 0;
              if (that.i == 0) {
                cs =
                  ((that.sumI[that.i] * that.r + that.E * that.r2) *
                    that.citys.city[j].value) /
                  100;
                ps =
                  ((that.sumI[that.i] * that.r + that.E * that.r2) *
                    that.citys.province[j].value) /
                  100;
              } else {
                cs = cs =
                  (((that.sumI[that.i] - that.sumI[that.i - 1]) * that.r +
                    that.E * that.r2) *
                    that.citys.city[j].value) /
                  (that.i * 100);
                ps =
                  (((that.sumI[that.i] - that.sumI[that.i - 1]) * that.r +
                    that.E * that.r2) *
                    that.citys.province[j].value) /
                  (that.i * 100);
              }
              if (isNaN(cs) || cs < 0) cs = 0;

              if (cs > 100) cs = Math.log10(cs);
              if (ps > 100) ps = Math.log10(ps);
              that.Tcity.get(that.citys.city[j].name)[0].value += parseInt(cs);

              if (isNaN(ps) || cs < 0) ps = 0;
              that.Tpro.get(that.citys.province[j].name)[0].value += parseInt(
                ps
              );
              that.CE =
                parseInt((that.E * that.r * that.citys.city[j].value) / 100) +
                parseInt(
                  (that.E * that.r * that.citys.province[j].value) / 100
                );
              that.CI =
                parseInt(
                  (that.sumI[that.i] * that.r * that.citys.city[j].value) / 100
                ) +
                parseInt(
                  (that.sumI[that.i] * that.r * that.citys.province[j].value) /
                    100
                );
            }
          }

          if (isNaN(that.CE) || that.CE < 0) that.CE = 0;
          if (isNaN(that.CI) || that.CI < 0) that.CI = 0;
          that.i++;
        }

        // this.Earry.push(this.E);
        // this.Sarry.push(this.S);
        // this.Iarry.push(this.I);
        // this.Rarry.push(this.R);
        // this.dayarry.push("100天");

        if (
          that.testCalendar != null &&
          that.mapQXLinedata == null &&
          that.TCalendar == null
        ) {
          that.TCalendar = { city: [], province: [] }; //关联地区数据
          that.mapQXLinedata = {
            centercity: {
              name: that.selectCity,
              lat: that.citysJWD.get(that.selectCity)[0].lat,
              lon: that.citysJWD.get(that.selectCity)[0].lon
            },
            citys: []
          };
          for (var k = 0; k < 11; k++) {
            var xs = that.citys.city[k];
            var ys = that.citys.province[k];
            xs.value = that.Tcity.get(xs.name)[0].value;
            ys.value = that.Tpro.get(ys.name)[0].value;
            that.TCalendar.city.push(xs);
            that.TCalendar.province.push(ys);
            that.mapQXLinedata.citys.push({
              name: xs.name,
              lat: that.citysJWD.get(xs.name)[0].lat,
              lon: that.citysJWD.get(xs.name)[0].lon,
              value: that.Tcity.get(xs.name)[0].value
            });
            that.mapQXLinedata.citys.push({
              name: ys.name,
              lat: that.citysJWD.get(ys.name)[0].lat,
              lon: that.citysJWD.get(ys.name)[0].lon,
              value: that.Tpro.get(ys.name)[0].value
            });
          }
          var lines = that.mapQXLinedata;
          var Tdata = that.TCalendar;
          if (that.i < that.controltime) {
            that.$store.commit("setTMapLinedata", lines);
            that.$store.commit("setTCalendar", Tdata);
          }

          that.mapQXLinedata = null;
          that.TCalendar = null;
        }

        var Tdata = {
          nowBeds: that.lostbed,
          total: that.sumI,
          dayarry: that.dayarry
        };

        that.$store.commit("setTtotaldata", Tdata);
        // console.log(that.Earry);
        that.initchart();
        if (that.i >= 40) {
          window.clearInterval(that.play);
          this.Chongz();
        }
      }, 3000);
      // console.log(this.sumI);
      // console.log(this.lostbed);
    },
    initchart: function() {
      var Iaryys = [];
      var Earrys = [];
      for (var k = 0; k < this.i; k++) {
        Iaryys.push(this.Iarry[k] + this.QIarry[k]);
      }
      for (var k = 0; k < this.i; k++) {
        Earrys.push(this.Earry[k] + this.QEarry[k]);
      }
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
          top: "10px"
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
            data: Earrys
          },
          {
            name: "传染者数",
            type: "line",
            smooth: true,
            data: Iaryys
          },
          {
            name: "康复者数",
            type: "line",
            smooth: true,
            data: this.sumR
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
    },
    Chongz: function() {
      this.i = 0;
      this.Earry = [];
      this.Iarry = [];
      this.Sarry = [];
      this.Rarry = [];
      this.lostI = [0];
      this.lostbed = [0];
      this.sumI = [0];
      this.sumR = [0];
      this.sumbed = 0;
      this.dayarry = [];
      this.I = 1;
      this.R = 0;
      this.mapQXLinedata = null;
      this.TCalendar = null;
      this.mapQXLinedata = null;
      this.TCalendar = null;
      this.ZT = false;
      this.Tcity = null;
      this.Tpro = null;
      this.testCalendar = null;
      this.play = null;
      this.R2 = 0;
    }
  },
  mounted() {
    // this.initdata();
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
    },
    MNactivedata() {
      return this.$store.getters.getMNactivedata;
    }
  },

  watch: {
    MNactivedata: function(newval, oldval) {
      //所有城市的经纬度数据
      this.citysJWD = d3
        .nest()
        .key(function(d) {
          return d.city;
        })
        .map(newval.cityJWDs);
    },
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
    },
    testparam: function(newval, oldval) {
      if (!newval.stop && newval.play) {
        if (!this.ZT) {
          this.I = 1;
          this.R = 0;
          this.selectCity = newval.cityname;
          this.N =
            parseInt(this.populationmap.get(newval.cityname)[0].population) *
            10000;
          // console.log(this.populationmap.get(newval.cityname), this.N);
          this.Beata = newval.Beata;

          this.S = parseFloat(this.N) - parseFloat(this.I);
          this.y = newval.health;
          this.controltime = newval.controltime;
          this.midu = newval.midu;
          this.hosbednum = newval.hospitalbed;
          this.Beata = newval.Beata;
          this.Beata2 = newval.Beata;
        }

        this.initdata();
      } else {
        if (!newval.stop && !newval.play) {
          window.clearInterval(this.play);
          this.ZT = true;
          this.play = null;
        } else {
          window.clearInterval(this.play);
          this.Chongz();
        }
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
