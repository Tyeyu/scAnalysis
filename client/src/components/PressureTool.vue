<template>
  <div id="Ptool" class="Ptool-angel">
    <div>
      <span>城市选择:</span>
      <el-select v-model="cityname" placeholder>
        <el-option v-for="(item,i) in citys" :key="i" :label="item" :value="item"></el-option>
      </el-select>
    </div>
    <div id="myslider">
      <div>
        <span class="demonstration">传染率:</span>
        <el-slider v-model="Beata" class="myslider" :max="Beatamax" :format-tooltip="formatBeata"></el-slider>
      </div>
      <div>
        <span class="demonstration">治愈率:</span>
        <el-slider v-model="health" class="myslider" :format-tooltip="formatHeath"></el-slider>
      </div>
      <div id="hosbedsliedr">
        <span class="demonstration">病床数:</span>
        <el-slider v-model="hospitalbed" class="myslider" v-bind:max="bedmax"></el-slider>
      </div>
      <div id="activesliedr">
        <span class="demonstration">活跃度:</span>
        <el-slider v-model="activity" class="myslider"></el-slider>
      </div>
      <div>
        <span class="demonstration">管控时间:</span>
        <el-slider v-model="controltime" class="myslider" :max="maxTime"></el-slider>
      </div>
      <div id="miduslider">
        <span class="demonstration">人口密度:</span>
        <el-slider v-model="midu" class="myslider" :max="midumax"></el-slider>
      </div>
    </div>
    <div class="button-angel">
      <span>开始模拟</span>
      <el-button id="Pplay" size="medium" v-bind:icon="playicon" circle @click="startclick"></el-button>
      <div style="float: right">
        <el-button class="stopbt" @click="stopclick">结束</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import * as d3 from "d3";
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
      miduarry: [
        { name: "成都", value: 1119 },
        { name: "自贡", value: 662 },
        { name: "攀枝花", value: 167 },
        { name: "泸州", value: 353 },
        { name: "德阳", value: 598 },
        { name: "绵阳", value: 239 },
        { name: "广元", value: 163 },
        { name: "遂宁", value: 608 },
        { name: "内江", value: 697 },
        { name: "乐山", value: 257 },
        { name: "南充", value: 514 },
        { name: "宜宾", value: 417 },
        { name: "广安", value: 342 },
        { name: "达州", value: 513 },
        { name: "巴中", value: 343 },
        { name: "雅安", value: 102 },
        { name: "眉山", value: 270 },
        { name: "资阳", value: 445 },
        { name: "阿坝", value: 11 },
        { name: "甘孜", value: 8 },
        { name: "凉山", value: 80 }
      ],
      cityname: "成都",
      Beata: 3,
      health: 93,
      hospitalbed: 8000,
      activity: 100,
      controltime: 10,
      midu: 1119,
      playicon: "el-icon-video-play",
      playcheck: false,
      listen: null,
      maxTime: 40,
      bedmax: 10000,
      Beatamax: 10,
      midumax: 1500,
      stop: true,
      active: null,
      hospitalmap: null
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
          play: this.playcheck,
          controltime: this.controltime,
          health: this.health / 100,
          midu: this.midu,
          controltime: this.controltime,
          activity: this.activity,
          cityname: this.cityname
        };
        this.$store.commit("settestparam", SEIRparam);
      } else {
        this.playicon = "el-icon-video-play";
        this.playcheck = false;
        var SEIRparams = {
          Beata: this.Beata / 100,
          hospitalbed: this.hospitalbed,
          stop: this.stop,
          play: this.playcheck,
          controltime: this.controltime,
          health: this.health / 100,
          midu: this.midu,
          controltime: this.controltime,
          activity: this.activity,
          cityname: this.cityname
        };
        this.$store.commit("settestparam", SEIRparams);
      }
    },
    stopclick: function() {
      this.playicon = "el-icon-video-play";
      this.playcheck = false;
      this.stop = true;
      var SEIRparam = {
        Beata: this.Beata / 100,
        hospitalbed: this.hospitalbed,
        stop: this.stop,
        play: this.playcheck,
        controltime: this.controltime,
        health: this.health / 100,
        midu: this.midu,
        controltime: this.controltime,
        activity: this.activity,
        cityname: this.cityname
      };
      this.$store.commit("settestparam", SEIRparam);
    },
    formatBeata: function(val) {
      return val / 100;
    },
    formatHeath: function(val) {
      return val / 100;
    },
    pusharry: function(jdata) {
      var arry = [];
      for (var key in jdata) {
        arry.push({ name: key, value: jdata[key] });
      }
      return arry;
    },
    computedData: function(newval) {
      var incity = this.pusharry(newval["inrates"]["city"][this.cityname]);
      var inprovince = this.pusharry(
        newval["inrates"]["province"][this.cityname]
      );
      var outcity = this.pusharry(newval["outrates"]["city"][this.cityname]);
      var outprovince = this.pusharry(
        newval["outrates"]["province"][this.cityname]
      );
      incity = incity.sort(function(a, b) {
        return a.value > b.value ? -1 : 1;
      });
      inprovince = inprovince.sort(function(a, b) {
        return a.value > b.value ? -1 : 1;
      });
      outcity = outcity.sort(function(a, b) {
        return a.value > b.value ? -1 : 1;
      });
      outprovince = outprovince.sort(function(a, b) {
        return a.value > b.value ? -1 : 1;
      });
      var testCalendar = { city: [], province: [] };
      var seircitydata = { city: [], province: [] };
      for (var i = 0; i < 11; i++) {
        testCalendar.city.push({
          name: outcity[i].name,
          value: 0
        });
        testCalendar.province.push({
          name: outprovince[i].name,
          value: 0
        });
        seircitydata.city.push({
          name: outcity[i].name,
          value: outcity[i].value
        });
        seircitydata.province.push({
          name: outprovince[i].name,
          value: outprovince[i].value
        });
      }
      this.$store.commit("setTcalendata", testCalendar);
      this.$store.commit("setTseirCity", seircitydata);
    },
    activedata: function(newval) {
      var outcity = newval["outrates"]["city"];
      var outractive = newval["outrates"]["city"]["成都"];
      var inractive = newval["inrates"]["city"]["成都"];
      var incity = newval["inrates"]["city"];
      this.active = [{ name: "成都", value: 100 }];
      for (var key in inractive) {
        var inact = (100 * outractive[key]) / incity[key]["成都"];
        var outact = (100 * inractive[key]) / outcity[key]["成都"];
        this.active.push({ name: key, value: (inact + outact) / 2 });
      }
    },
    activenum: function() {
      for (var i = 0; i < this.active.length; i++) {
        if (this.active[i].name == this.cityname) {
          this.activity = parseInt(this.active[i].value);
          break;
        }
      }
    },
    midunum: function() {
      for (var i = 0; i < this.miduarry.length; i++) {
        if (this.miduarry[i].name == this.cityname) {
          this.midu = this.miduarry[i].value;
          break;
        }
      }
    }
  },
  computed: {
    MNactivedata() {
      return this.$store.getters.getMNactivedata;
    },
    ScCoordata() {
      return this.$store.getters.getscCoordata;
    }
  },
  watch: {
    cityname: function(newval, oldval) {
      this.$store.commit("settestcity", newval);
      this.computedData(this.$store.getters.getMNactivedata);
      this.activedata(this.$store.getters.getMNactivedata);
      this.activenum();
      this.midunum();
      this.hospitalbed = this.hospitalmap.get(newval)[0].hospital * 400;
    },
    MNactivedata: function(newval, oldval) {
      this.computedData(newval);
      this.activedata(newval);
    },
    ScCoordata: function(newval, oldval) {
      this.hospitalmap = d3
        .nest()
        .key(function(d) {
          return d.city;
        })
        .map(newval.hospital);
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
  height: 32%;
  z-index: 1;
  background-color: #30313a;
}
#Ptool span {
  color: #ffffff;
}
.stopbt span {
  color: black !important;
}
#hosbedsliedr .el-slider__bar #miduslider .el-slider__bar,
#activesliedr .el-slider__bar,
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
.Ptool-angel {
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
.button-angel {
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
</style>
