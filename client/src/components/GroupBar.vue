<template>
  <div id="bar">
    <div id="facet"></div>
  </div>
</template>

<script>
import G2 from "@antv/g2";
import { DataSet } from "@antv/data-set";
import { Chart } from "@antv/g2";

export default {
  name: "groupbar",
    data(){
      return{
          cityData: null,
          chart: null,
      };
    },
  mounted() {},
  methods: {
    chartInit(data) {
      var _ds = new DataSet();
      var _dv = _ds.createView().source(data);
      _dv.transform({
        type: "reverse"
      });
      var ds = new DataSet();
      var dv = ds.createView().source(_dv);
      dv.transform({
        type: "fold",
        fields: ["local", "input"], // 展开字段集
        key: "传染方式", // key字段
        value: "染病数量", // value字段
        retains: ["region"] // 保留字段集，默认为除fields以外的所有字段
      });

      var chart = new G2.Chart({
        container: "bar",
        autoFit: true,
        height: 200,
        width: 400,
        padding: [25, 100, 20, 70]
      });

      chart.source(dv);
      chart.coord().transpose();
      chart.scale("染病数量", { nice: true });

      chart.axis("region", {
        label: {
          offset: -300
        }
      });
      chart.tooltip({
        showMarkers: false
      });
      chart.legend({
        position: "top"
      });
      chart
        .intervalStack()
        .position("region*染病数量")
        .color("传染方式");
      chart.render();
    },
    chartFacet(data) {
      const chart = new G2.Chart({
        container: "facet",
        height: 210,
        padding: [19, 500, 20, 50]
      });
      chart.source(data, {
        percent: {
          formatter: val => {
            val = val * 100 + "%";
            return val;
          }
        }
      });
      chart.legend(false);
      chart.coord("theta", {
        radius: 0.9
      });
      chart.facet("list", {
        fields: ["region"],
        cols: 1,
        padding: 8,
        colTitle: {
          offsetY: -10,
          style: {
            fontSize: 12,
            textAlign: "center",
            fontWeight: 300,
            fill: "#3c8d31"
          }
        },

        eachView(view, facet) {
          view.source(data, {
            percent: {
              formatter: val => {
                val = val * 100 + "%";
                return val;
              }
            }
          });
          view
            .interval()
            .position("percent")
            .color("region")
            .tooltip("region*percent", (region, percent) => {
              percent = percent * 100 + "%";
              return {
                name: "非输入病例",
                value: percent
              };
            });
        }
      });
      chart.render();
    }
  },
  computed: {
    groupbardata() {
      return this.$store.getters.getgroupbardata;
    }
  },
  watch: {
    //监听dailydata数据变化
    groupbardata: function(newval, oldval) {
      //图表数据变化后该执行的操作
    }
  }
};
</script>

<style>
#bar {
  position: absolute;
  top: 32.6%;
  left: 0.1%;
  width: 24.8%;
  height: 32.5%;
  border: 1px solid #dededd;
}
#facet {
  width: 50%;
  height: 40%;
  position: absolute;
}
</style>
