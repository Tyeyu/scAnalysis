<template>
  <div id="Daily"></div>
</template>

<script>
    import echarts from "echarts";
    //每日新增图
    export default {
        name: "Daily",
        data() {
            return {
                dates: null,
                diagnosisData: null,
                heathData: null,
                deathData: null,
                myChart: null,
                option: null
            };
        },
        mounted() {},
        methods: {
            ChartInit() {
                let that = this;
                that.myChart = echarts.init(document.getElementById("Daily"));
                that.option = {
                    title: {
                        text: " 患病数      每日新增",
                        left: "7%",
                        top: "10px"
                    },
                    tooltip: {
                        trigger: "axis"
                    },
                    legend: {
                        data: ["新增确诊", "死亡", "治愈"],
                        right: "9%",
                        top: "30px"
                    },
                    xAxis: {
                        type: "category",
                        //是否顶格
                        boundaryGap: false,
                        data: that.dates,
                        name: "t"
                    },
                    yAxis: {
                        type: "value"
                    },
                    series: [
                        {
                            smooth: true,
                            name: "新增确诊",
                            type: "line",

                            data: that.diagnosisData
                        },
                        {
                            smooth: true,
                            name: "死亡",
                            type: "line",

                            data: that.deathData
                        },
                        {
                            smooth: true,
                            name: "治愈",
                            type: "line",

                            data: that.heathData
                        }
                    ]
                };
                that.myChart.setOption(that.option, true);
            }
        },
        computed: {
            dailydata() {
                return this.$store.getters.getDailydata;
            },
            scMergerData() {
                return this.$store.getters.getscMergerData;
            }
        },
        watch: {
            //监听dailydata数据变化
            dailydata: function(newval, oldval) {
                //图表数据变化后该执行的操作
                this.dates = newval.date;
                this.diagnosisData = newval.diagnosis;
                this.deathData = newval.newDeath;
                this.heathData = newval.newHealth;
                this.ChartInit();
            },
            scMergerData: function(newval, oldval) {
                var cityname = this.$store.getters.getmergerCity;
                var dailydata = {
                    date: [],
                    diagnosis: [],
                    newHealth: [],
                    newDeath: []
                };
                var k = 0;
                for (var i = 0; i < newval.length; i++) {
                    // console.log(newval[i].city);
                    if (newval[i].city == cityname) {
                        dailydata.date[k] = newval[i].date;
                        dailydata.diagnosis[k] =
                            newval[i].newDiagnosis == "" ? "0" : newval[i].newDiagnosis;
                        (dailydata.newHealth[k] =
                            newval[i].newHealth == "" ? "0" : newval[i].newHealth),
                            (dailydata.newDeath[k] =
                                newval[i].newDeath == "" ? "0" : newval[i].newDeath);
                        k++;
                    }
                }
                this.$store.commit("setDailydata", dailydata);
            }
        }
    };
</script>
<style>
  #Daily {
    position: absolute;
    top: 65.1%;
    left: 0.1%;
    width: 33.2%;
    height: 34%;
    border: 1px solid #dededd;
  }
</style>
