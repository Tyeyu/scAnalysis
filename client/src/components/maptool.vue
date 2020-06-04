<template>
  <div>
    <div id="mapcontrl">
      <el-checkbox-group v-model="checkedcontrls" @change="handleCheckedcontrlsChange">
        <el-checkbox v-for="cont in contrls1" :label="cont.id" :key="cont.id">{{ cont.name }}</el-checkbox>
        <el-divider></el-divider>
        <el-checkbox v-for="cont in contrls2" :label="cont.id" :key="cont.id">{{ cont.name }}</el-checkbox>
        <el-divider></el-divider>
        <el-checkbox v-for="cont in contrls3" :label="cont.id" :key="cont.id">{{ cont.name }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div id="ColorCard"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import * as d3 from "d3";
export default {
  data() {
    return {
      contrls1: [
        { name: "累计确诊", id: "contours" },
        // { name: "现有确诊", id: "exist" },
        // { name: "新增确诊", id: "newAdd" },
        { name: "病例停留小区", id: "POA" }
      ],
      contrls2: [
        { name: "定点医院", id: "hospitalImage" },
        { name: "发热门诊", id: "clincImage" },
        { name: "医院覆盖范围", id: "voronoi-outline" }
      ],
      contrls3: [
        { name: "人口基数", id: "population" },
        { name: "迁移活跃度", id: "Activity" }
      ],
      checkedcontrls: ["POA", "contours"],
      popuchoose: false,
      citychoose: false,
      lastchoose: "contours",
      activeIndex: "1"
    };
  },
  mounted() {
    this.drawColorCard();
    d3.select("#mapcontrl").style("opacity", 0.8);
  },
  methods: {
    handleCheckedcontrlsChange: function(val) {
      var pop = val.indexOf("population");
      var con = val.indexOf("contours");
      var cit = val.indexOf("Activity");
      // var exit=val.indexOf("exist")
      // var newA=val.indexOf("newAdd")

      if (this.lastchoose === "contours") {
        if (pop != -1) {
          val.splice(con, 1);
          this.lastchoose = "population";
        } else {
          if (cit != -1) {
            val.splice(con, 1);
            this.lastchoose = "Activity";
          }
        }
      } else {
        if (this.lastchoose === "population") {
          if (con != -1) {
            val.splice(pop, 1);
            this.lastchoose = "contours";
          } else {
            if (cit != -1) {
              val.splice(pop, 1);
              this.lastchoose = "Activity";
            }
          }
        } else {
          if (this.lastchoose === "Activity") {
            if (con != -1) {
              val.splice(cit, 1);
              this.lastchoose = "contours";
            } else {
              if (pop != -1) {
                val.splice(cit, 1);
                this.lastchoose = "population";
              }
            }
          }
        }
      }
      // if (pop != -1 && con == -1 && cit == -1 && !this.popuchoose) {
      //   this.popuchoose = true;
      // } else {
      //   if (con != -1 && this.popuchoose && pop != -1 && cit != -1) {
      //     val.splice(pop, 1);
      //     val.splice(cit, 1);
      //     this.popuchoose = false;
      //   }
      // }

      this.$store.commit("setmaptooldata", val);
    },
    drawColorCard: function() {
      var chart = echarts.init(document.getElementById("ColorCard"));
      var options = {
        visualMap: {
          name: "test",
          type: "continuous",
          min: 1,
          max: 144,
          orient: "vertical",
          precision: 0.1,
          itemHeight: "90%",
          calculable: true,
          inRange: {
            colorLightness: [1, 0.5]
          },
          controller: {
            inRange: {
              color: ["cyan"]
            }
          }
        }
      };
      chart.setOption(options, true);
      chart.dispatchAction({
        type: "selectDataRange",
        // 选取 20 到 40 的值范围
        selected: [1, 144]
      });
      chart.on("datarangeselected", function(params) {
        // 获取点击图例的选中状态
        console.log(params);
      });
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  computed: {
    maptooldata() {
      return this.$store.getters.getmaptooldata;
    },
    tabe() {
      return this.$store.getters.gettabeselect;
    }
  },
  watch: {
    //监听dailydata数据变化
    maptooldata: function(newval, oldval) {
      // console.log(newval)
    },
    tabe: function(newval, oldval) {
      if (newval == "first") {
        d3.select("#mapcontrl").style("opacity", 0.8);
        d3.select("#ColorCard").style("opacity", 1);
      } else {
        d3.select("#mapcontrl").style("opacity", 0.1);
        d3.select("#ColorCard").style("opacity", 0);
      }
    }
  }
};
</script>
<style>
#mapcontrl {
  position: absolute;
  left: 93%;
  padding-left: 5pt;
  padding-top: 0pt;
  top: 5.5%;
  width: 6%;
  height: 23%;
  /* opacity: 80%; */
  /* border: 1px solid white; */
  background-color: #30313a;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: sans-serif;
  font-size: 12;
  z-index: 3;
}

.el-divider--horizontal {
  margin: 5px 0;
}
.el-checkbox {
  color: aliceblue;
}

#ColorCard {
  position: absolute;
  z-index: 100;
  left: 95%;
  padding-left: 5pt;
  padding-right: 5pt;
  padding-top: 10pt;
  top: 35%;
  width: 8.5%;
  height: 20%;
  filter: invert(1);
}
</style>
