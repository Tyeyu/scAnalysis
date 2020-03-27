<template>
  <div id="mapcontrl">
    <el-checkbox-group v-model="checkedcontrls" @change="handleCheckedcontrlsChange">
      <el-checkbox v-for="cont in contrls" :label="cont" :key="cont">
        {{
        cont
        }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
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
        "contours"
      ],
      checkedcontrls: ["POA",
        "contours"]
    };
  },
  methods: {
    handleCheckedcontrlsChange: function(val) {
      this.$store.commit("setmaptooldata", val);

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
    },
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
  height: 23%;
  border: 1px solid white;
  background-color: #30313a;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: sans-serif;
  font-size: 12;
}
</style>
