<template>
  <div id="app">
    <div id="upper">
       <div id="left">
        <madeup id="pie"></madeup>
        <groupbar id="bar"></groupbar>

       </div>

        <div id="right">
          <mapview id='map'></mapview>
        </div>
    </div>

    <!--放下面的三幅图-->
    <div id="bottom">

    </div>


  </div>


</template>

<script>
import mapview from './components/MapView';
import madeup from './components/MadeUp';
import groupbar from './components/GroupBar';

export default {
  name: 'App',
  components:{
    mapview,
    madeup,
    groupbar
  }
}
</script>

<style>
	*{
		padding: 0;
		margin: 0;
	}
  #app{
    width: 100%;
    height: 100%;
  }
  #upper{
    width: 100%;
    height: 60%;
  }
  #bottom{
    width: 100%;
    height: 40%;
  }
 #left{
    width: 35%;
    height: 100%;
    float: left;
  }
  #right{
    width: 65%;
    height: 100%;
    float: left;
  }
  #map{
    width: 100%;
    height: 100%;
  }
  #pie{
    width: 100%;
    height: 40%;
    border: 1px solid black;
  }
  #bar{
    width: 100%;
    height: 60%;
    border: 1px solid darkorange;
  }



</style>
