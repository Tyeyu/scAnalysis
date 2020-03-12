<template>
  <div id="mapcontrl">
    <el-checkbox-group
      v-model="checkedcontrls"
      @change="handleCheckedcontrlsChange"
    >
      <el-checkbox v-for="cont in contrls" :label="cont" :key="cont">{{
        cont
      }}</el-checkbox>
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
        "活跃度"
      ],
      checkedcontrls: []
    };
  },
  methods: {
    handleCheckedcontrlsChange: function(val) {}
  }
};
</script>
<style>
#mapcontrl {
  position: absolute;
  left: 88%;
  top: 10%;
  width: 10%;
  height: 20%;
  border: 1px solid white;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: sans-serif;
  font-size: 12;
}
</style>
