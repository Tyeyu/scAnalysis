<template>
  <div id="app">
    <madeup></madeup>
    <groupbar></groupbar>
    <mapview></mapview>

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

export default {
  name: "App",
  components: {
    mapview,
    madeup,
    groupbar,
    AddedDaily,
    Relationship,
    PCooordinates
  }
};
</script>

<style>
body {
  background-color: #f5f5f6;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
