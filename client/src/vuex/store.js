import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    //存储地图数据
    mapdata: null,
    //每日新增图数据
    Dailydata: null,
    //groupbar数据
    groupbardata: null,
    //madeup数据
    madeupdata: null,
    //平行坐标数据
    Coordinatesdata: null,
    //关系图数据
    Relationdata: null,
    //maptool选择数据
    maptooldata: null
  },
  mutations: {
    setmapdata: function(state, data) {
      state.mapdata = data;
    },
    setDailydata: function(state, data) {
      state.Dailydata = data;
    },
    setgroupbardata: function(state, data) {
      state.groupbardata = data;
    },
    setmadeupdata: function(state, data) {
      state.madeupdata = data;
    },
    setCoordinatesdata: function(state, data) {
      state.Coordinatesdata = data;
    },
    setRelationdata: function(state, data) {
      state.Relationdata = datta;
    },
    setmaptooldata: function(state, data) {
      state.maptooldata = data;
    }
  },
  getters: {
    getmapdata: state => {
      return state.mapdata;
    },
    getDailydata: state => {
      return state.Dailydata;
    },
    getgroupbardata: state => {
      return state.groupbardata;
    },
    getmadeupdata: state => {
      return state.madeupdata;
    },
    getCoordinatesdata: state => {
      return state.Coordinatesdata;
    },
    getRelationdata: state => {
      return state.Relationdata;
    },
    getmaptooldata: state => {
      return state.maptooldata;
    }
  }
});
export default store;
