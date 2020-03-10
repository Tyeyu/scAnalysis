<template>
  <div id="pie">


  <div id="in-pie">

  </div>
  <div id="in-bar">

  </div>

</div>

</template>

<script>
    let echarts = require('echarts');
    export default{
        name:'madeup',
        mounted() {
            var data=[
                {"value": 75, "name": '男性'},
                {"value": 25, "name": '女性'},
            ];
            var dataBar= [10, 52, 200, 334, 390, 330, 220];
            console.log(data);
            this.drawpie(data);
            this.drawbar(dataBar);
        },

        methods: {
            drawpie(data) {
                var myChart = echarts.init(document.getElementById('in-pie'));
                var option = {
                    title: {
                        text: '性别占比',
                        top: '10px',
                    },
                    tooltip: {
                      trigger: 'item',
                    },
                    series: [{
                        name: '感染者性别',
                        type: 'pie',
                        center: ['24%','70%'],
                        radius: '50%',
                        data:data
                    }],

                };
                myChart.setOption(option);

            },
            drawbar(dataBar){
                var myChart = echarts.init(document.getElementById('in-bar'));
                var option ={
                    color: ['#3398DB'],
                    title: {
                      text: "年龄组成",

                      left: '65%',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '50%',
                        right: '1%',
                        bottom: '5%',
                        top: '20%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            name: '年龄段',
                            data: ['10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '患病人数',
                            type: 'bar',
                            barWidth: '30%',
                            data: dataBar
                        }
                    ]
                };
                myChart.setOption(option);
            },

        }


    };
</script>

<style>
#pie {
  position: absolute;
  top: 5.1%;
  left: 0.1%;
  width: 30%;
  height: 27.5%;
  border: 1px solid white;
}

#in-pie{
  height: 75%;
  width: 90%;

}
#in-bar{
  bottom: 5%;
  height: 80%;
  width: 90%;
  position: absolute;
}
</style>
