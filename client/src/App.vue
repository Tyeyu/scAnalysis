<template>
  <div id="app">
    <headers></headers>
    <madeup></madeup>
    <groupbar></groupbar>
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
export default {
  name: "App",
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
    test
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
  background-color: #f2f2f1;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
