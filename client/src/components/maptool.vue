<template>
  <div>
    <div id="mapcontrl">
      <el-checkbox-group v-model="checkedcontrls" @change="handleCheckedcontrlsChange">
        <el-menu class="el-menu-vertical" background-color="#545c64" text-color="#fff">
          <el-submenu index="1">
            <template slot="title">确诊</template>
            <el-menu-item-group>
              <el-checkbox v-for="cont in contrls1" :label="cont.id" :key="cont.id">{{ cont.name }}</el-checkbox>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">小区/医院</template>
            <el-menu-item-group>
              <el-checkbox v-for="cont in contrls2" :label="cont.id" :key="cont.id">{{ cont.name }}</el-checkbox>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <span>人口</span>
            </template>
            <el-menu-item-group>
              <el-checkbox v-for="cont in contrls3" :label="cont.id" :key="cont.id">{{ cont.name }}</el-checkbox>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
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
      contrls1: [
        { name: "累计确诊", id: "contours" },
        { name: "现有确诊", id: "exist" },
        { name: "新增确诊", id: "newAdd" }
      ],
      contrls2: [
        { name: "病例小区", id: "POA" },
        { name: "医院定点", id: "hospitalImage" },
        { name: "发热门诊", id: "clinic" },
        { name: "医院覆盖范围", id: "voronoi-outline" }
      ],
      contrls3: [
        { name: "人口基数", id: "population" },
        { name: "迁移活跃度", id: "Activity" }
      ],
      checkedcontrls: ["POA", "contours", "test"],
      popuchoose: false,
      citychoose: false,
      lastchoose: "contours",
      activeIndex: "1"
    };
  },
  mounted() {
    // this.drawColorCard();
  },
  methods: {
    handleCheckedcontrlsChange: function(val) {
      var pop = val.indexOf("population");
      var con = val.indexOf("contours");
      var cit = val.indexOf("Activity");
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
          // outOfRange: {
          //   color: ["red"]
          // },
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
  left: 93%;
  padding-left: 2pt;
  padding-top: 0pt;
  top: 5.5%;
  width: 6%;
  height: 40%;
  /* border: 1px solid white; */
  /* background-color: #30313a; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: sans-serif;
  font-size: 12;
  z-index: 3;
}
/* .el-menu-vertical{
  border: 1px solid white;
} */
.el-checkbox {
  color: aliceblue;
}
.el-menu-item-group__title {
  padding: 0px 0 0px 0px;
}
#ColorCard {
  position: absolute;
  left: 30%;
  padding-left: 5pt;
  padding-top: 10pt;
  top: 5%;
  width: 8.2%;
  height: 20%;
  filter: invert(1);
}
</style>
