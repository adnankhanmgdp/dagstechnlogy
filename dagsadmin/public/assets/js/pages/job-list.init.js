var url = "assets/json/",
  allJobList = "",
  getJSON = function (t, a) {
    var e = new XMLHttpRequest();
    e.open("GET", url + t, !0),
      (e.responseType = "json"),
      (e.onload = function () {
        var t = e.status;
        a(200 === t ? null : t, e.response);
      }),
      e.send();
  };
function loadJobListData(t) {
  $("#job-list").DataTable({
    data: t,
    bLengthChange: !1,
    order: [[0, "desc"]],
    language: {
      oPaginate: {
        sNext: '<i class="mdi mdi-chevron-right"></i>',
        sPrevious: '<i class="mdi mdi-chevron-left"></i>',
      },
    },
    columns: [
      { data: "id" },
      { data: "jobTitle" },
      { data: "companyName" },
      { data: "location" },
      { data: "experience" },
      { data: "positions" },
      {
        data: "type",
        render: function (t, a, e) {
          return isType(e.type);
        },
      },
      { data: "postDate" },
      { data: "updateDate" },
      {
        data: "status",
        render: function (t, a, e) {
          return isStatus(e.status);
        },
      },
      {
        data: null,
        bSortable: !1,
        render: function (t, a, e) {
          return '<ul class="list-unstyled hstack gap-1 mb-0">                    <li data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="View">                        <a href="#" class="btn btn-sm btn-soft-primary"><i class="mdi mdi-eye-outline"></i></a>                    </li>                    <li data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit">                        <a href="#" class="btn btn-sm btn-soft-info"><i class="mdi mdi-pencil-outline"></i></a>                    </li>                    <li data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">                        <a href="#jobDelete" data-bs-toggle="modal" class="btn btn-sm btn-soft-danger"><i class="mdi mdi-delete-outline"></i></a>                    </li>                </ul>';
        },
      },
    ],
  }),
    $("#searchTableList").keyup(function () {
      $("#job-list").DataTable().search($(this).val()).draw();
    }),
    $(".dataTables_paginate").addClass("pagination-rounded"),
    $(".dataTables_filter").hide();
}
function isType(t) {
  switch (t) {
    case "Full Time":
      return '<span class="badge badge-soft-success">' + t + "</span>";
    case "Part Time":
      return '<span class="badge badge-soft-danger">' + t + "</span>";
  }
}
function isStatus(t) {
  switch (t) {
    case "Active":
      return '<span class="badge bg-success">' + t + "</span>";
    case "New":
      return '<span class="badge bg-info">' + t + "</span>";
    case "Close":
      return '<span class="badge bg-danger">' + t + "</span>";
  }
}
getJSON("job-list.json", function (t, a) {
  null !== t
    ? console.log("Something went wrong: " + t)
    : loadJobListData((allJobList = a));
});
var date = new Date(),
  today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
function filterData() {
  var l = document.getElementById("idStatus").value,
    i = document.getElementById("idType").value,
    o = document.querySelector("#datepicker1 input").value,
    t = allJobList.filter(function (t) {
      var a = t.status,
        e = !1,
        s = !1,
        n = !1,
        e = "all" == a || "all" == l || a == l,
        s = "all" == t.type || "all" == i || t.type == i,
        n = new Date(t.postDate) <= new Date(o);
      if (e && s && n) return e && s && n;
    });
  $.fn.DataTable.isDataTable("#job-list") &&
    $("#job-list").DataTable().destroy(),
    loadJobListData(t);
}
document.querySelector("#datepicker1 input") &&
  $("#datepicker1 input").datepicker("setDate", today);
