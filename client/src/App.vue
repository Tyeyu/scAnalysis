<template>
  <div id="app">
    <headers></headers>
    <!-- <madeup></madeup>
    2020/4/27 cancel
    -->
    <div>
      <el-tabs v-model="activeTab" :stretch="true" class="eltabs">

        <el-tab-pane label="疫情分析" name="first" >
          <groupbar style="background-color: #30313a"></groupbar>
          <!--放下面的三幅图-->
          <AddedDaily />
          <Relationship />
          <PCooordinates />
          <test></test>

          <timeline></timeline>
        </el-tab-pane>

        <el-tab-pane label="抗压力沙盒模拟" name="second">
          <pressuretool></pressuretool>
          <seir></seir>
          <testTotal></testTotal>
          <testcalen></testcalen>

        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- <voronoichart></voronoichart> -->
    <mapview></mapview>
    <maptool></maptool>
  </div>
</template>

<script>
//import mapview from "./components/MapView";
import madeup from "./components/MadeUp";
import groupbar from "./components/GroupBar";
import AddedDaily from "./components/AddedDaily";
import Relationship from "./components/Relationship";
import PCooordinates from "./components/ParallelCoordinates";
import voronoichart from "./components/voronoiChart";
import headers from "./components/Header";
import maptool from "./components/maptool";
import timeline from "./components/TimeLine";
import mapview from "./components/MapView";
import readcsv from "./tool/readcsv";
import test from "./components/test";
import pressuretool from "./components/PressureTool";
import seir from "./components/SEIR";
import testTotal from "./components/testTotal";
import testcalen from "./components/testCalendar";
export default {
  name: "App",
  data() {
    return {
      activeTab: "first"
    };
  },
  components: {
    //mapview,
    madeup,
    groupbar,
    AddedDaily,
    voronoichart,
    Relationship,
    PCooordinates,
    headers,
    maptool,
    timeline,
    mapview,
    test,
    pressuretool,
    seir,
    testTotal,
    testcalen
  },
  mounted: function() {
    /*
    /读取四川轨迹数据
    /*/
    readcsv.readscTrack();
    readcsv.readscMerge();
    readcsv.MNdata();
  },
  watch: {
    activeTab: function(newval, oldval) {
      console.log(this.activeTab);
      this.$store.commit("settabeselect", this.activeTab);
    }
  }
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
.el-tabs__item {
  color: aliceblue;
}
.el-tabs__content {
  overflow: auto !important;
  position: unset !important;
}
.el-tabs__header {
  width: 24%;
  padding-top: 2% !important;
}
.eltabs {
  padding-top: 0.5%;
}
</style>
