<template>
  <div>
    <div id="mapcontrl">
      <el-checkbox-group v-model="checkedcontrls" @change="handleCheckedcontrlsChange">
        <el-checkbox v-for="cont in contrls" :label="cont.id" :key="cont.id">{{ cont.name }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div id="ColorCard"></div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
      contrls: [
        { name: "病例/轨迹", id: "patient" },
        { name: "病例小区", id: "CaseCell" },
        { name: "医院/发热门诊", id: "hospitalImage" },
        { name: "人口基数", id: "population" },
        { name: "迁移细节", id: "daily" },
        { name: "活跃度", id: "Activity" },
        { name: "POA", id: "POA" },
        { name: "contours", id: "contours" },
        { name: "维诺图", id: "voronoi-outline" }
      ],
      checkedcontrls: ["POA", "contours", "test"],
      popuchoose: false
    };
  },
  mounted() {
    this.drawColorCard();
  },
  methods: {
    handleCheckedcontrlsChange: function(val) {
      var pop = val.indexOf("population");
      var con = val.indexOf("contours");
      if (pop != -1 && !this.popuchoose && con != -1) {
        val.splice(con, 1);
        this.popuchoose = true;
      } else {
        if (con != -1 && this.popuchoose && pop != -1) {
          val.splice(pop, 1);
          this.popuchoose = false;
        }
      }

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
          // outOfRange: {
          //   color: ["red"]
          // },
          controller: {
            inRange: {
              color: ["red"]
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
    }
  },
  computed: {
    maptooldata() {
      return this.$store.getters.getmaptooldata;
    }
  },
  watch: {
    //监听dailydata数据变化
    maptooldata: function(newval, oldval) {
      // console.log(newval)
    }
  }
};
</script>
<style>
#mapcontrl {
  position: absolute;
  left: 91%;
  padding-left: 5pt;
  padding-top: 10pt;
  top: 5.5%;
  width: 8.2%;
  height: 27%;
  border: 1px solid white;
  background-color: #30313a;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: sans-serif;
  font-size: 12;
}
#ColorCard {
  position: absolute;
  left: 91%;
  padding-left: 5pt;
  padding-top: 10pt;
  top: 32.5%;
  width: 8.2%;
  height: 20%;
}
</style>
