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
    timeRange: ["2020-01-21", "2020-03-15"],
    vorfeaters: "",
    //医院门诊的图标的经纬度数据
    hosImageData: null,
    cityActivity: null,
    playcheck: false,
    //压力测试参数
    testparam: null,
    //压力测试选择城市
    testcity: "成都",
    tabeselect: "first",
    //模拟的活跃度数据
    MNactivedata: null,
    //压力测试关联地区数据
    Tcalendata: null,
    TseirCity: null,
    Ttotaldata: null,
    TCalendar: null,
    Outpatient: null,
    //压力测试地图关联地区传染数据
    TMapLinedata: null
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
    },
    setplaycheck: function(state, data) {
      state.playcheck = data;
    },
    settestparam: function(state, param) {
      state.testparam = param;
    },
    settestcity: function(state, city) {
      state.testcity = city;
    },
    settabeselect: function(state, selected) {
      state.tabeselect = selected;
    },
    setMNactivedata: function(state, data) {
      state.MNactivedata = data;
    },
    setTcalendata: function(state, data) {
      state.Tcalendata = data;
    },
    setTseirCity: function(state, data) {
      state.TseirCity = data;
    },
    setTtotaldata: function(state, data) {
      state.Ttotaldata = data;
    },
    setTCalendar: function(state, data) {
      state.TCalendar = data;
    },
    setOutpatient: function(state, data) {
      state.Outpatient = data;
    },
    setTMapLinedata: function(state, data) {
      state.TMapLinedata = data;
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
    },
    getplaycheck: state => {
      return state.playcheck;
    },
    gettestparam: state => {
      return state.testparam;
    },
    gettestcity: state => {
      return state.testcity;
    },
    gettabeselect: state => {
      return state.tabeselect;
    },
    getMNactivedata: state => {
      return state.MNactivedata;
    },
    getTcalendata: state => {
      return state.Tcalendata;
    },
    getTseirCity: state => {
      return state.TseirCity;
    },
    getTtotaldata: state => {
      return state.Ttotaldata;
    },
    getTCalendar: state => {
      return state.TCalendar;
    },
    getOutpatient: state => {
      return state.Outpatient;
    },
    getTMapLinedata: state => {
      return state.TMapLinedata;
    }
  }
});
export default store;
