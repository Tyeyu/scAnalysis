<template>
  <div id="Ptool" class="Ptool-angel">
    <div>
      <span>城市选择:</span>
      <el-select v-model="cityname" placeholder>
        <el-option v-for="(item,i) in citys" :key="i" :label="item" :value="item"></el-option>
      </el-select>
    </div>
    <div>
      <span class="demonstration">传染率:</span>
      <el-slider v-model="Beata" class="myslider" :max="Beatamax" :format-tooltip="formatBeata"></el-slider>
    </div>
    <div>
      <span class="demonstration">治愈率:</span>
      <el-slider v-model="health" class="myslider" :format-tooltip="formatHeath"></el-slider>
    </div>
    <div>
      <span class="demonstration">病床数:</span>
      <el-slider v-model="hospitalbed" class="myslider" v-bind:max="bedmax"></el-slider>
    </div>
    <div>
      <span class="demonstration">活跃度:</span>
      <el-slider v-model="activity" class="myslider"></el-slider>
    </div>
    <div>
      <span class="demonstration">管控时间:</span>
      <el-slider v-model="controltime" class="myslider"></el-slider>
    </div>
    <div>
      <span class="demonstration">人口密度:</span>
      <el-slider v-model="midu" class="myslider" :max="midumax"></el-slider>
    </div>
    <div>
      <span>开始模拟</span>
      <el-button id="Pplay" size="medium" v-bind:icon="playicon" circle @click="startclick"></el-button>
      <el-button class="stopbt" @click="stopclick">结束模拟</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      citys: [
        "成都",
        "自贡",
        "攀枝花",
        "泸州",
        "德阳",
        "绵阳",
        "广元",
        "遂宁",
        "内江",
        "乐山",
        "南充",
        "眉山",
        "宜宾",
        "广安",
        "达州",
        "雅安",
        "巴中",
        "资阳",
        "阿坝",
        "甘孜",
        "凉山"
      ],
      cityname: "成都",
      Beata: 3,
      health: 30,
      hospitalbed: 30,
      activity: 10,
      controltime: 10,
      midu: 400,
      playicon: "el-icon-video-play",
      playcheck: false,
      listen: null,
      bedmax: 1000,
      Beatamax: 10,
      midumax: 1000,
      stop: true
    };
  },
  methods: {
    startclick: function() {
      let that = this;
      if (!this.playcheck) {
        this.playcheck = true;
        this.playicon = "el-icon-video-pause"; //切换图标
        this.stop = false;
        var SEIRparam = {
          Beata: this.Beata / 100,
          hospitalbed: this.hospitalbed,
          stop: this.stop,
          play: this.play,
          controltime: this.controltime,
          health: this.health / 100,
          midu: this.midu
        };
        this.$store.commit("settestparam", SEIRparam);
      } else {
        this.playicon = "el-icon-video-play";
        this.playcheck = false;
      }
    },
    stopclick: function() {
      this.playicon = "el-icon-video-play";
      this.playcheck = false;
      this.stop = true;
    },
    formatBeata: function(val) {
      return val / 100;
    },
    formatHeath: function(val) {
      return val / 100;
    }
  },
  watch: {
    cityname: function(newval, oldval) {
      this.$store.commit("settestcity", newval);
    }
  }
};
</script>
<style >
#Ptool {
  position: absolute;
  top: 14.5%;
  left: 0.5%;
  width: 20%;
  height: 30%;
  z-index: 1;
  background-color: #30313a;
}
#Ptool span {
  color: #ffffff;
}
.stopbt span {
  color: black !important;
}
.el-slider__bar {
  left: 1%;
}
.myslider {
  position: relative;
  width: 75%;
  float: right;
}
.demonstration {
  font-size: 14px;
  /* color: #8492a6; */
  line-height: 44px;
}
.Ptool-angel{
  z-index: 2;
  background: linear-gradient(#00faff, #00faff) left top,
  linear-gradient(#00faff, #00faff) left top,
  linear-gradient(#00faff, #00faff) right top,
  linear-gradient(#00faff, #00faff) right top,
  linear-gradient(#00faff, #00faff) left bottom,
  linear-gradient(#00faff, #00faff) left bottom,
  linear-gradient(#00faff, #00faff) right bottom,
  linear-gradient(#00faff, #00faff) right bottom;
  background-repeat: no-repeat;
  background-size: 0.15rem 0.6rem, 0.6rem 0.15rem, 0.15rem 0.6rem,
  0.6rem 0.15rem;
  background-color: rgba(255, 255, 255, 0.05);
  white-space: nowrap;
  margin: 0.1% 0 0 0.1%;
}
#Pplay .el-icon-video-play,
.el-icon-video-pause {
  font-size: 20px;
}
</style>
