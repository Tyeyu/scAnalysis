<template>
  <div>
    <div id="mapcontrl">
      <el-checkbox-group v-model="checkedcontrls" @change="handleCheckedcontrlsChange">
        <el-checkbox v-for="cont in contrls" :label="cont" :key="cont">{{ cont }}</el-checkbox>
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
        "病例/轨迹",
        "病例小区",
        "医院/发热门诊",
        "人口基数",
        "迁移细节",
        "活跃度",
        "POA",
        "contours",
        "voronoi-outline"
      ],
      checkedcontrls: ["POA", "contours", "test"]
    };
  },
  mounted() {
    this.drawColorCard();
  },
  methods: {
    handleCheckedcontrlsChange: function(val) {
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
  height: 26%;
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
  top: 31.5%;
  width: 8.2%;
  height: 20%;
}
</style>
