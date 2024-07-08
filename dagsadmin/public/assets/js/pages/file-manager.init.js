function getChartColorsArray(e) {
  if (null !== document.getElementById(e)) {
    var t = document.getElementById(e).getAttribute("data-colors");
    if (t)
      return (t = JSON.parse(t)).map(function (e) {
        var t = e.replace(" ", "");
        if (-1 === t.indexOf(",")) {
          var r = getComputedStyle(document.documentElement).getPropertyValue(
            t,
          );
          return r || t;
        }
        var a = e.split(",");
        return 2 != a.length
          ? t
          : "rgba(" +
              getComputedStyle(document.documentElement).getPropertyValue(
                a[0],
              ) +
              "," +
              a[1] +
              ")";
      });
  }
}
var options,
  chart,
  radialChartColors = getChartColorsArray("radial-chart");
radialChartColors &&
  ((options = {
    series: [76],
    chart: { height: 150, type: "radialBar", sparkline: { enabled: !0 } },
    colors: ["#556ee6"],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: { background: "#e7e7e7", strokeWidth: "97%", margin: 5 },
        hollow: { size: "60%" },
        dataLabels: {
          name: { show: !1 },
          value: { offsetY: -2, fontSize: "16px" },
        },
      },
    },
    grid: { padding: { top: -10 } },
    stroke: { dashArray: 3 },
    labels: ["Storage"],
  }),
  (chart = new ApexCharts(
    document.querySelector("#radial-chart"),
    options,
  )).render());
