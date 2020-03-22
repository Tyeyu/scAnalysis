import * as d3 from "d3";
import store from "../vuex/store";
const readcsv = {
  readscTrack: function() {
    d3.csv("../../static/四川轨迹.csv")
      .then(function(data) {
        store.commit("setscTrackData", data);
      })
      .catch(function(error) {});
  },
  readscMerge: function() {
    d3.csv("../../static/四川merger.csv")
      .then(function(data) {
        store.commit("setscMergerData", data);
      })
      .catch(function(error) {});
  }
};
export default readcsv;
