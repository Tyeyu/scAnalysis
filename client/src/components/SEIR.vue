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
      lostbed: [0],
      citysJWD: null,
      selectCity: null,
      play: null,
      i: 0
    };
  },
  methods: {
    initdata: function() {
      let that = this;
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
            that.sumI[that.i] = that.sumI[that.i - 1] + parseInt(that.I);
            that.sumR[that.i] = that.sumR[that.i - 1] + parseInt(that.R);
          }

          if (that.midu > 1000) {
            that.r = parseInt(that.midu * Math.random() * 0.05);
            that.r2 = parseInt(that.midu * Math.random() * 0.1);
          } else {
            if (that.midu > 500 && that.midu <= 1000) {
              that.r = parseInt(that.midu * Math.random() * 0.1);
              that.r2 = parseInt(that.midu * Math.random() * 0.1);
            } else {
              that.r = parseInt(that.midu * Math.random() * 0.5);
              that.r2 = parseInt(that.midu * Math.random() * 0.5);
            }
          }

          if (that.i >= that.controltime) {
            that.r = parseInt(3 * Math.random());
            that.r2 = parseInt(10 * Math.random());
          }
          var newDia =
            (that.r * that.Beata * that.Sarry[that.i] * that.Iarry[that.i]) /
            that.N; //发病者感染人数
          // if (i == 12) break;
          var newYDia =
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
            that.sumbed += parseInt(that.sumI[that.i] * 0.01); //自由传播阶段，有较低概率病人住院
            if (that.hosbednum - that.sumbed < 0) {
              that.lostbed[that.i] = 0;
              that.sumbed = that.hosbednum;
            } else {
              that.lostbed[that.i] = that.hosbednum - that.sumbed;
            }
          } else {
            that.S = that.Sarry[that.i] - newDia - newYDia;

            that.E =
              that.Earry[that.i] +
              newDia -
              that.a * that.Earry[that.i] +
              newYDia;
            if (that.i == that.controltime) {
              that.sumbed +=
                that.sumI[that.i] - that.sumbed - that.sumR[that.i]; //将发病的病人全部转入住院
              if (that.sumbed < 0) {
                that.sumbed = 0;
              }
            }

            if (that.i - that.controltime < 10) {
              that.I =
                that.Iarry[that.i] +
                that.a * that.Earry[that.i] -
                that.y * 0.1 * that.Iarry[that.i];
              if (that.sumbed < that.hosbednum)
                that.R =
                  that.Rarry[that.i] +
                  ((that.y * that.i) / 1000) * that.Iarry[that.i];
              else {
                that.R =
                  that.Rarry[that.i] +
                  ((that.y * that.i) / 10000) * that.Iarry[that.i];
              }
              that.sumbed +=
                parseInt(that.I * 0.9 * Math.random()) - parseInt(that.R);
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
                that.i - that.controltime >= 10 &&
                that.i - that.controltime <= 20
              ) {
                that.I =
                  that.Iarry[that.i] +
                  that.a * that.Earry[that.i] -
                  that.y * 0.5 * that.Iarry[that.i];
                that.R =
                  that.Rarry[that.i] +
                  ((that.y * that.i) / 1000) * that.Iarry[that.i];

                that.sumbed += parseInt(that.I) - parseInt(that.R);
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
                  that.y * that.Iarry[that.i];
                if (that.sumbed < that.hosbednum)
                  that.R =
                    that.Rarry[that.i] +
                    ((that.y * that.i) / 100) * that.Iarry[that.i];
                else {
                  that.R =
                    that.Rarry[that.i] +
                    ((that.y * that.i) / 1000) * that.Iarry[that.i];
                }

                that.sumbed += parseInt(that.I) - parseInt(that.R);
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
          if (testCalendar != null) {
            for (var j = 0; j < 11; j++) {
              Tcity.get(that.citys.city[j].name)[0].value += parseInt(
                ((that.I + that.E) / that.N) * that.citys.city[j].value
              );
              Tpro.get(that.citys.province[j].name)[0].value += parseInt(
                ((that.I + that.E) / that.N) * that.citys.province[j].value
              );
            }
          }
          that.i++;
        }

        // this.Earry.push(this.E);
        // this.Sarry.push(this.S);
        // this.Iarry.push(this.I);
        // this.Rarry.push(this.R);
        // this.dayarry.push("100天");

        if (testCalendar != null) {
          var TCalendar = { city: [], province: [] }; //关联地区数据
          var mapQXLinedata = {
            centercity: {
              name: that.selectCity,
              lat: that.citysJWD.get(that.selectCity)[0].lat,
              lon: that.citysJWD.get(that.selectCity)[0].lon
            },
            citys: []
          };
          for (var k = 0; k < 11; k++) {
            var x = that.citys.city[k];
            var y = that.citys.province[k];
            x.value = Tcity.get(x.name)[0].value;
            y.value = Tpro.get(y.name)[0].value;
            TCalendar.city.push(x);
            TCalendar.province.push(y);
            mapQXLinedata.citys.push({
              name: x.name,
              lat: that.citysJWD.get(x.name)[0].lat,
              lon: that.citysJWD.get(x.name)[0].lon,
              value: Tcity.get(x.name)[0].value
            });
            mapQXLinedata.citys.push({
              name: y.name,
              lat: that.citysJWD.get(y.name)[0].lat,
              lon: that.citysJWD.get(y.name)[0].lon,
              value: Tpro.get(y.name)[0].value
            });
          }
          // console.log(mapQXLinedata);
          that.$store.commit("setTMapLinedata", mapQXLinedata);
          that.$store.commit("setTCalendar", TCalendar);
        }

        var Tdata = {
          nowBeds: that.lostbed,
          total: that.sumI,
          dayarry: that.dayarry
        };
<<<<<<< HEAD
        for (var k = 0; k < 11; k++) {
          var x = this.citys.city[k];
          var y = this.citys.province[k];
          x.value = Tcity.get(x.name)[0].value;
          y.value = Tpro.get(y.name)[0].value;
          TCalendar.city.push(x);
          TCalendar.province.push(y);
          mapQXLinedata.citys.push({
            name: x.name,
            lat: this.citysJWD.get(x.name)[0].lat,
            lon: this.citysJWD.get(x.name)[0].lon,
            value: Tcity.get(x.name)[0].value
          });
          mapQXLinedata.citys.push({
            name: y.name,
            lat: this.citysJWD.get(y.name)[0].lat,
            lon: this.citysJWD.get(y.name)[0].lon,
            value: Tpro.get(y.name)[0].value
          });
        }
        // console.log(mapQXLinedata);
        console.log('mapQXLinedata', mapQXLinedata)
        
        this.$store.commit("setTMapLinedata", mapQXLinedata);
        this.$store.commit("setTCalendar", TCalendar);
      }

      var Tdata = {
        nowBeds: this.lostbed,
        total: this.sumI,
        dayarry: this.dayarry
      };

      this.$store.commit("setTtotaldata", Tdata);
      
=======

        that.$store.commit("setTtotaldata", Tdata);
        console.log(that.Earry);
        that.initchart();
        if (that.i >= 40) {
          window.clearInterval(that.play);
        }
      }, 2000);
>>>>>>> c572bb8c1a7756972f8dca5f4a1c10be3a6e013c
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
      this.selectCity = newval.cityname;
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

      if (!newval.stop && newval.play) {
        this.initdata();
      } else {
        if (!newval.stop && !newval.play) {
          window.clearInterval(this.play);
        } else {
          window.clearInterval(this.play);
          this.i = 0;
          this.Earry = [];
          this.Iarry = [];
          this.Sarry = [];
          this.Rarry = [];
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
