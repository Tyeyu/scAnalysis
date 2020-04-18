<template>
  <div id="Coordinates"></div>
</template>
<script>
//平行坐标图
import echarts from "echarts";
import * as d3 from "d3";
export default {
  data() {
    return {
      lineStyle: {
        normal: {
          width: 0.8,
          opacity: 1
        }
      },
      seriesdata: null,
      hospitalmap: null,
      migraComputmap: null,
      mergcomputmap: null,
      populationmap: null
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
        { name: "等级", index: 7, text: "发热门诊个数" },
        { name: "P", index: 8, text: "常住人口(万)" }
      ];
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
            type: "category"
          },
          {
            dim: 1,
            name: schema[1].text,
            inverse: true,
            // max: 101,
            nameLocation: "start"
          },
          { dim: 2, name: schema[2].text },
          { dim: 3, name: schema[3].text },
          { dim: 4, name: schema[4].text },
          { dim: 5, name: schema[5].text },
          { dim: 6, name: schema[6].text },
          { dim: 7, name: schema[7].text },
          { dim: 8, name: schema[8].text }
        ],
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
        series: that.seriesdata
      };
      myChart.setOption(option, true);
    },
    hospitaldata: function(newval) {
      this.hospitalmap = d3
        .nest()
        .key(function(d) {
          return d.city;
        })
        .map(newval.hospital);
    },
    migrationdata: function(newval) {
      var migradata = newval.Migration;
      //在给定时间范围内计算迁入迁出平均比例
      var timeRange = [
        new Date(this.$store.getters.gettimeRange[0]),
        new Date(this.$store.getters.gettimeRange[1])
      ];
      let migrations = [];
      for (var i = 0; i < migradata.length; i++) {
        var mdate = new Date(migradata[i].date);
        if (
          mdate.getTime() >= timeRange[0].getTime() &&
          mdate.getTime() <= timeRange[1].getTime()
        ) {
          migrations.push(migradata[i]);
        }
      }
      var migraNetsmap = d3
        .nest()
        .key(function(d) {
          return d.city;
        })
        .map(migrations);
      this.migraComputmap = d3.map();
      var migkeys = migraNetsmap.keys();
      for (var i = 0; i < migkeys.length; i++) {
        var Inmigration_rate = 0;
        var Outmigration_rate = 0;
        var kdata = migraNetsmap.get(migkeys[i]);
        for (var j = 0; j < kdata.length; j++) {
          Inmigration_rate += parseFloat(kdata[j].Inmigration_rate);
          Outmigration_rate += parseFloat(kdata[j].Outmigration_rate);
        }
        //求平均值，保留4位小数
        this.migraComputmap.set(migkeys[i], {
          Inrate: parseFloat(Inmigration_rate / kdata.length).toFixed(4),
          Outrate: parseFloat(Outmigration_rate / kdata.length).toFixed(4)
        });
      }
    },
    populationdata: function(newval) {
      this.populationmap = d3
        .nest()
        .key(function(d) {
          return d.city;
        })
        .map(newval.population);
    },
    mergedata: function() {
      //计算给定日期的确诊、治愈率、死亡率
      var timeRange = [
        new Date(this.$store.getters.gettimeRange[0]),
        new Date(this.$store.getters.gettimeRange[1])
      ];
      var mergerdata = this.$store.getters.getscMergerData;
      let TimerangeMerdata = [];
      for (var i = 0; i < mergerdata.length; i++) {
        var dates = mergerdata[i].date;
        dates = new Date(
          2020,
          parseInt(dates.split("月")[0]) - 1,
          dates.split("月")[1].split("日")[0]
        );
        if (
          dates.getTime() <= timeRange[1].getTime() &&
          mergerdata[i].city != ""
        ) {
          TimerangeMerdata.push(mergerdata[i]);
        }
      }
      var mergNetsmap = d3
        .nest()
        .key(function(d) {
          return d.city;
        })
        .map(TimerangeMerdata);
      this.mergcomputmap = d3.map();
      var merkeys = mergNetsmap.keys();
      for (var i = 0; i < merkeys.length; i++) {
        var kdata = mergNetsmap.get(merkeys[i]);
        var Diagnosis = kdata[kdata.length - 1].accumulativeDiagnosis;
        var healthrate = parseFloat(
          kdata[kdata.length - 1].accumulativeHeath /
            kdata[kdata.length - 1].accumulativeDiagnosis
        ).toFixed(4);
        var deathrate = parseFloat(
          kdata[kdata.length - 1].accumulativeDeath /
            kdata[kdata.length - 1].accumulativeDiagnosis
        ).toFixed(4);
        this.mergcomputmap.set(merkeys[i], {
          Diagnosis: Diagnosis,
          Healthrate: healthrate,
          Deathrate: deathrate
        });
      }
    },
    setserierdata: function() {
      //封装数据
      this.seriesdata = [];
      var citys = this.hospitalmap.keys();
      for (var i = 0; i < citys.length; i++) {
        var mergd = this.mergcomputmap.get(citys[i]);
        var migrd = this.migraComputmap.get(citys[i]);

        var hospd = this.hospitalmap.get(citys[i]);
        var popul = this.populationmap.get(citys[i]);
        var serie = {
          name: citys[i],
          type: "parallel",
          lineStyle: this.lineStyle,
          data: [
            [
              citys[i],
              mergd.Diagnosis,
              mergd.Healthrate,
              mergd.Deathrate,
              migrd.Inrate,
              migrd.Outrate,
              hospd[0].hospital,
              hospd[0].outpatient,
              popul[0].population
            ]
          ]
        };
        this.seriesdata.push(serie);
      }
      // console.log(this.seriesdata);
    }
  },
  mounted() {},
  computed: {
    Coordinatesdata() {
      return this.$store.getters.getCoordinatesdata;
    },
    ScCoordata() {
      return this.$store.getters.getscCoordata;
    },
    timeRange() {
      return this.$store.getters.gettimeRange;
    }
  },
  watch: {
    //监听dailydata数据变化
    Coordinatesdata: function(newval, oldval) {
      //图表数据变化后该执行的操作
    },
    timeRange: function(newval, oldval) {
      this.migrationdata(this.$store.getters.getscCoordata);
      this.mergedata();
      this.setserierdata();
      this.initchart();
    },
    ScCoordata: function(newval, oldval) {
      this.hospitaldata(newval);
      this.migrationdata(newval);
      this.populationdata(newval);
      this.mergedata();
      this.setserierdata();
      this.initchart();
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
