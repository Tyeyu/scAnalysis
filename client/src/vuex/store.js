import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    //存储地图数据
    mapData: null,
    //每日新增图数据
    dailyData: null,
    //groupbar数据
    groupBarData: null,
    //madeup数据
    madeupData: null,
    //平行坐标数据
    coordinatesData: null,
    //关系图数据
    relationData: null,
    //maptool选择数据
    mapToolData: null,
    //轨迹原始数据
    scTrackData: null,
    selectCity: "四川达州"
  },
  mutations: {
    setmapdata: function(state, data) {
      state.mapData = data;
    },
    setDailydata: function(state, data) {
      state.dailyData = data;
    },
    setgroupbardata: function(state, data) {
      state.groupBarData = data;
    },
    setmadeupdata: function(state, data) {
      state.madeupData = data;
    },
    setCoordinatesdata: function(state, data) {
      state.coordinatesData = data;
    },
    setRelationdata: function(state, data) {
      state.relationData = data;
    },
    setmaptooldata: function(state, data) {
      state.mapToolData = data;
    },
    setscTrackData: function(state, data) {
      state.scTrackData = data;
    },
    setselectCity: function(state, cityname) {
      state.selectCity = cityname;
    }
  },
  getters: {
    getmapdata: state => {
      return state.mapData;
    },
    getDailydata: state => {
      return state.dailyData;
    },
    getgroupbardata: state => {
      return state.groupBarData;
    },
    getmadeupdata: state => {
      return state.madeupData;
    },
    getCoordinatesdata: state => {
      return state.coordinatesData;
    },
    getRelationdata: state => {
      return state.relationData;
    },
    getmaptooldata: state => {
      return state.mapToolData;
    },
    getscTrackData: state => {
      return state.scTrackData;
    },
    getselectCity: state => {
      return state.selectCity;
    }
  }
});
export default store;
