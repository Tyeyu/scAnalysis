<template>
  <div id="app">
    <headers></headers>
    <madeup></madeup>
    <groupbar></groupbar>
    <mapview></mapview>
    <maptool></maptool>
    <!--放下面的三幅图-->
    <AddedDaily />
    <Relationship />
    <PCooordinates />
  </div>
</template>

<script>
import mapview from "./components/MapView";
import madeup from "./components/MadeUp";
import groupbar from "./components/GroupBar";
import AddedDaily from "./components/AddedDaily";
import Relationship from "./components/Relationship";
import PCooordinates from "./components/ParallelCoordinates";
import headers from "./components/Header";
import maptool from "./components/maptool";
export default {
  name: "App",
  components: {
    mapview,
    madeup,
    groupbar,
    AddedDaily,
    Relationship,
    PCooordinates,
    headers,
    maptool
  }
};
</script>

<style>
body {
  background-color: #f0f0ef;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
