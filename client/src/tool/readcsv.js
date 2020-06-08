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
      .then(mergerData => {
        d3.csv("../../static/hospitalnum.csv").then(hospitalData => {
          d3.csv("../../static/scMigration.csv").then(scMigrationData => {
            d3.csv("../../static/population.csv").then(populationData => {
              store.commit("setscMergerData", mergerData);
              store.commit("setscCoordata", {
                hospital: hospitalData,
                Migration: scMigrationData,
                population: populationData
              });
            });
          });
        });
      })
      .catch(function(error) {});
  },
  MNdata: function() {
    d3.json("../../static/四川平均迁入率.json")
      .then(inrate => {
        d3.json("../../static/四川平均迁出率.json").then(outrate => {
          d3.csv("../../static/各城市经纬度.csv").then(cityJWD => {
            store.commit("setMNactivedata", {
              inrates: inrate,
              outrates: outrate,
              cityJWDs: cityJWD
            });
          });
        });
      })
      .catch(function(error) {});
  },
  ReadOutpatient: function() {
    d3.csv("../../static/发热门诊信息.csv")
      .then(Outpatients => {
        store.commit("setOutpatient", Outpatients);
      })
      .catch(function(err) {});
  },
  readCoordata: function() {}
};
export default readcsv;
