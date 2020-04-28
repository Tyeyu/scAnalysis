<template>
  <div id="app">
    <headers></headers>
    <!-- <madeup></madeup> 
    2020/4/27 cancel
    -->

    <el-tabs v-model="activeTab" :stretch="true">
      <el-tab-pane label="疫情分析" name="first">
        <groupbar></groupbar>
      </el-tab-pane>
      <el-tab-pane label="抗压力分析" name="second">
        抗压力分析
        <pressuretool></pressuretool>
        <seir></seir>
      </el-tab-pane>
    </el-tabs>

    <!-- <voronoichart></voronoichart> -->
    <test></test>
    <mapview></mapview>
    <maptool></maptool>
    <timeline></timeline>
    <!--放下面的三幅图-->
    <AddedDaily />
    <Relationship />
    <PCooordinates />
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
    seir
  },
  mounted: function() {
    /*
    /读取四川轨迹数据
    /*/
    readcsv.readscTrack();
    readcsv.readscMerge();
  }
};
</script>

<style>
body {
  background-color: #13142a;
  opacity: 0.5;
}

#app {
  width: 100%;
  height: 100%;
}
.el-tabs__content {
  overflow: auto !important;
  position: unset !important;
}
.el-tabs__header {
  width: 24%;
  padding-top: 2%;
}
</style>
