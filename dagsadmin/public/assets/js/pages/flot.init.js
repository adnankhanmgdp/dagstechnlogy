function getChartColorsArray(t) {
  if (null !== document.getElementById(t)) {
    var a = document.getElementById(t).getAttribute("data-colors");
    if (a)
      return (a = JSON.parse(a)).map(function (t) {
        var a = t.replace(" ", "");
        if (-1 === a.indexOf(",")) {
          var o = getComputedStyle(document.documentElement).getPropertyValue(
            a,
          );
          return o || a;
        }
        var e = t.split(",");
        return 2 != e.length
          ? a
          : "rgba(" +
              getComputedStyle(document.documentElement).getPropertyValue(
                e[0],
              ) +
              "," +
              e[1] +
              ")";
      });
    console.warn("data-colors Attribute not found on:", t);
  }
}
!(function (s) {
  "use strict";
  function t() {
    (this.$body = s("body")), (this.$realData = []);
  }
  (t.prototype.createPlotGraph = function (t, a, o, e, r, l, i, n) {
    s.plot(
      s(t),
      [
        { data: a, label: r[0], color: l[0] },
        { data: o, label: r[1], color: l[1] },
        { data: e, label: r[2], color: l[2] },
      ],
      {
        series: {
          lines: {
            show: !0,
            fill: !0,
            lineWidth: 2,
            fillColor: { colors: [{ opacity: 0.5 }, { opacity: 0.5 }] },
          },
          points: { show: !1 },
          shadowSize: 0,
        },
        legend: { position: "nw", backgroundColor: "transparent" },
        grid: {
          hoverable: !0,
          clickable: !0,
          borderColor: i,
          borderWidth: 1,
          labelMargin: 10,
          backgroundColor: n,
        },
        yaxis: {
          min: 0,
          max: 300,
          tickColor: "rgba(166, 176, 207, 0.1)",
          font: { color: "#8791af" },
        },
        xaxis: {
          tickColor: "rgba(166, 176, 207, 0.1)",
          font: { color: "#8791af" },
        },
        tooltip: !0,
        tooltipOpts: {
          content: "%s: Value of %x is %y",
          shifts: { x: -60, y: 25 },
          defaultTheme: !1,
        },
      },
    );
  }),
    (t.prototype.createPieGraph = function (t, a, o, e) {
      var r = [
          { label: a[0], data: o[0] },
          { label: a[1], data: o[1] },
          { label: a[2], data: o[2] },
        ],
        l = {
          series: { pie: { show: !0 } },
          legend: { show: !0, backgroundColor: "transparent" },
          grid: { hoverable: !0, clickable: !0 },
          colors: e,
          tooltip: !0,
          tooltipOpts: { content: "%s, %p.0%" },
        };
      s.plot(s(t), r, l);
    }),
    (t.prototype.randomData = function () {
      for (
        0 < this.$realData.length && (this.$realData = this.$realData.slice(1));
        this.$realData.length < 300;

      ) {
        var t =
          (0 < this.$realData.length
            ? this.$realData[this.$realData.length - 1]
            : 50) +
          10 * Math.random() -
          5;
        t < 0 ? (t = 0) : 100 < t && (t = 100), this.$realData.push(t);
      }
      for (var a = [], o = 0; o < this.$realData.length; ++o)
        a.push([o, this.$realData[o]]);
      return a;
    }),
    (t.prototype.createRealTimeGraph = function (t, a, o) {
      return s.plot(t, [a], {
        colors: o,
        series: {
          lines: {
            show: !0,
            fill: !0,
            lineWidth: 2,
            fillColor: { colors: [{ opacity: 0.45 }, { opacity: 0.45 }] },
          },
          points: { show: !1 },
          shadowSize: 0,
        },
        grid: {
          show: !0,
          aboveData: !1,
          color: "#dcdcdc",
          labelMargin: 15,
          axisMargin: 0,
          borderWidth: 0,
          borderColor: null,
          minBorderMargin: 5,
          clickable: !0,
          hoverable: !0,
          autoHighlight: !1,
          mouseActiveRadius: 20,
        },
        tooltip: !0,
        tooltipOpts: {
          content: "Value is : %y.0%",
          shifts: { x: -30, y: -50 },
        },
        yaxis: {
          min: 0,
          max: 100,
          tickColor: "rgba(166, 176, 207, 0.1)",
          font: { color: "#8791af" },
        },
        xaxis: { show: !1 },
      });
    }),
    (t.prototype.createDonutGraph = function (t, a, o, e) {
      var r = [
          { label: a[0], data: o[0] },
          { label: a[1], data: o[1] },
          { label: a[2], data: o[2] },
          { label: a[3], data: o[3] },
          { label: a[4], data: o[4] },
        ],
        l = {
          series: { pie: { show: !0, innerRadius: 0.7 } },
          legend: {
            show: !0,
            backgroundColor: "transparent",
            labelFormatter: function (t, a) {
              return '<div style="font-size:12px;">&nbsp;' + t + "</div>";
            },
            labelBoxBorderColor: null,
            margin: 50,
            width: 20,
            padding: 1,
          },
          grid: { hoverable: !0, clickable: !0 },
          colors: e,
          tooltip: !0,
          tooltipOpts: { content: "%s, %p.0%" },
        };
      s.plot(s(t), r, l);
    }),
    (t.prototype.init = function () {
      var t = getChartColorsArray("website-stats");
      t &&
        this.createPlotGraph(
          "#website-stats",
          [
            [0, 50],
            [1, 130],
            [2, 80],
            [3, 70],
            [4, 180],
            [5, 105],
            [6, 250],
          ],
          [
            [0, 80],
            [1, 100],
            [2, 60],
            [3, 120],
            [4, 140],
            [5, 100],
            [6, 105],
          ],
          [
            [0, 20],
            [1, 80],
            [2, 70],
            [3, 140],
            [4, 250],
            [5, 80],
            [6, 200],
          ],
          ["Desktops", "Laptops", "Tablets"],
          t,
          "rgba(166, 176, 207, 0.1)",
          "transparent",
        );
      var a = getChartColorsArray("pie-chart-container");
      a &&
        this.createPieGraph(
          "#pie-chart #pie-chart-container",
          ["Desktops", "Laptops", "Tablets"],
          [20, 30, 15],
          a,
        );
      var o,
        e,
        r = getChartColorsArray("flotRealTime");
      r &&
        ((o = this.createRealTimeGraph(
          "#flotRealTime",
          this.randomData(),
          r,
        )).draw(),
        (e = this)),
        (function t() {
          o.setData([e.randomData()]),
            o.draw(),
            setTimeout(t, (s("html").hasClass("mobile-device"), 1e3));
        })(),
        getChartColorsArray("donut-chart-container") &&
          this.createDonutGraph(
            "#donut-chart #donut-chart-container",
            ["Desktops", "Laptops", "Tablets"],
            [29, 20, 18],
            ["#f0f1f4", "#556ee6", "#34c38f"],
          );
    }),
    (s.FlotChart = new t()),
    (s.FlotChart.Constructor = t);
})(window.jQuery),
  (function () {
    "use strict";
    window.jQuery.FlotChart.init();
  })();
