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
    mapToolData: [],
    //轨迹原始数据
    scTrackData: null,
    selectCity: "四川达州",
    //四川Merger原始数据
    scMergerData: null,
    mergerCity: "",
    //平行坐标原始数据包括医院门诊数据，人口迁徙数据
    scCoordata: null,
    //时间轴范围
    timeRange: ["2020-01-10", "2020-03-20"],
    vorfeaters: "",
    //医院门诊的图标的经纬度数据
    hosImageData: null,
    cityActivity: null
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
    },
    setscMergerData: function(state, data) {
      state.scMergerData = data;
    },
    setmergerCity: function(state, cityname) {
      state.mergerCity = cityname;
    },
    setscCoordata: function(state, data) {
      state.scCoordata = data;
    },
    setcheckedcontrls: function(state, data) {
      state.checkedcontrls = data;
    },
    settimeRange: function(state, timeRange) {
      state.timeRange = timeRange;
    },
    setvorfeaters: function(state, data) {
      state.vorfeaters = data;
    },
    sethosImageData: function(state, data) {
      state.hosImageData = data;
    },
    setcityActivity: function(state, data) {
      state.cityActivity = data;
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
    },
    getscMergerData: state => {
      return state.scMergerData;
    },
    getmergerCity: state => {
      return state.mergerCity;
    },
    getscCoordata: state => {
      return state.scCoordata;
    },
    gettimeRange: state => {
      return state.timeRange;
    },
    getvorfeaters: state => {
      return state.vorfeaters;
    },
    gethosImageData: state => {
      return state.hosImageData;
    },
    getcityActivity: state => {
      return state.cityActivity;
    }
  }
});
export default store;
