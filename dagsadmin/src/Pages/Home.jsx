import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";

const Home = () => {

  const [currentTime, setCurrentTime] = useState(new Date());
  const [weekOrder, setWeekOrder] = useState([])
  const [incomeDaily, setIncomeDaily] = useState([])
  const [incomeMonthly, setIncomeMonthly] = useState([])
  const [weekName, setWeekName] = useState([]);
  const [monthsName, setMonthName] = useState([]);
  const [monthOrder, setMonthOrder] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);


  useEffect(() => {
    const intervalId = setInterval(() => {
      // Update the current time every second
      setCurrentTime(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures that the effect runs only once

  // Format the time
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  const today = new Date();

  // Define an array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract the date components (year, month, day)
  const year = today.getFullYear();
  const monthIndex = today.getMonth();
  const day = today.getDate();

  // Get the month name from the array
  const monthName = monthNames[monthIndex];

  // Format the date as a string
  const formattedDate = `${monthName} ${day}, ${year}`;

  // Use the toLocaleDateString method with the weekday option to get the day name
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        distributed: true, // Enable distributed mode
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    tooltip:{
      enabled:true,
      followCursor: true,
      onDatasetHover:{
        highlightDataSeries: true
      },
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        return `<div style="height:50px" class="container bg-white"> Orders: ${series[seriesIndex][dataPointIndex]}
        <br/>
        Total Revenue: ₹ ${incomeMonthly[dataPointIndex]}
        </div>`
      }
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: monthsName,
    },
    colors: [
      "#008FFB"
    ],
  };

  const chartSeries = [ //week
    {
      name: "Orders",
      data: monthOrder,
    },
  ];

  const chartSeries2 = [ // month
    {
      name: "orders",
      data: weekOrder,
    },
  ];

  const chartOptions2 = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        distributed: true, // Enable distributed mode
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: weekName,
    },
    yaxis: {
      min: 0,
      max: 10
    },
    tooltip:{
      enabled:true,
      followCursor: true,
      onDatasetHover:{
        highlightDataSeries: true
      },
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        return `<div style="height:50px" class="container bg-white">Total Orders: ${series[seriesIndex][dataPointIndex]}
        <br/>
        Total Revenue: ₹ ${incomeDaily[dataPointIndex]}
        </div>`
      }
    },
    colors: ["#008FFB"],
  };

  const token = localStorage.getItem("token");

  const [todayOrder, setTodayOrder] = useState(null);
  const [totalOrder, setTotalOrder] = useState(null);
  const [todayOrderAmount, setTodayOrderAmount] = useState(null);

  useEffect(() => {
    const dayOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/day`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json()
        if (res.ok) {
          setTodayOrder(data.totalOrders);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    dayOrder();

    const totalOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/totalOrdersCompleted`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        if (res.ok) {
          setTotalOrder(data.totalOrders);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    totalOrders();

    const todayEarning = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/order`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        if (res.ok) {
          setTodayOrderAmount(data.totalAmount);

        }
      } catch (error) {
        console.log(error.message);
      }
    };
    todayEarning();
  }, []);


  useEffect(() => {
    const fetchOrders = async () => {
      const today = new Date()
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);

      const endDate = new Date(today);

      // console.log("startDate", startDate.toISOString())

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/fetchOrdersByDateRange`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              startDate: startDate,
              endDate: endDate,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setWeekOrder(data.orders);
        setWeekName(data.dayNames);
        setIncomeDaily(data.income)
        // console.log(data.orders, "order by date range: week");
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchOrdersMonth = async () => {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999

      const startDate = new Date(today);
      startDate.setFullYear(startDate.getFullYear() - 1); // Set startDate to 1 year before today

      // console.log("startDate", startDate.toISOString());

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/fetchOrdersByMonthRange`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              startMonth: startDate.toISOString(),
              endMonth: endDate.toISOString(),
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMonthOrder(data.orderCounts);
        setMonthName(data.monthNames);
        setIncomeMonthly(data.income)
        // console.log(data.orders, "order by date range: week");
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchMonthlyIncome = async () => {
      const today = new Date();

      // Set endDate to today's date with end time
      const endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);

      // Set startDate to one month before today
      const startDate = new Date(today);
      startDate.setMonth(startDate.getMonth() - 1);

      // Format dates to ISO format with full date and time
      const formatDateToISO = (date) => {
        return date.toISOString();
      };

      const startDateFormatted = formatDateToISO(startDate);
      const endDateFormatted = formatDateToISO(endDate);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/monthlyIncome`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              startDate: startDateFormatted,
              endDate: endDateFormatted,
            }),
          },
        );

        const data = await response.json();
        // console.log("data", data)
        setMonthlyIncome(data.monthly);
        // console.log(data.orders, "order by date range: month");
      } catch (error) {
        console.log(error.message);
      }
    };

    // Example call
    fetchMonthlyIncome();

    fetchOrders();
    fetchOrdersMonth();
  }, []);

  const [week, setWeek] = useState(true)

  return (
    <>
      <div style={{ background: "#F8F8FB" }} className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            {/* <!-- start page title --> */}
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                  <h4 className="mb-sm-0 font-size-18">Dashboard</h4>

                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <Link>Dashboards</Link>
                      </li>
                      <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- end page title --> */}

            <div className="row">
              <div className="col-xl-4">
                <div className="card border-0 pt-3 pb-3">
                  <div className="card-body">
                    <h4 className="card-title pb-2 pt-2">
                      <b>
                        <i>
                          {formattedTime}{" "}
                          {formattedDate / 12 >= 1 ? "am" : "pm"}
                        </i>
                      </b>
                    </h4>
                    <h6 className="card-subtitle mb-2 text-muted">
                      <span style={{ fontSize: "medium" }}>
                        {formattedDate}
                      </span>
                    </h6>
                    <p className="card-text">
                      <span style={{ fontSize: "smaller" }}>{dayName}</span>
                    </p>
                  </div>
                </div>

                <div className="card mb-4 mt-5 border-0">
                  <div className="card-body">
                    <h4 className="card-title mb-4">Monthly Revenue</h4>
                    <div className="row">
                      <div className="col-sm-6">
                        <p className="text-muted">This month</p>
                        <h3>₹{monthlyIncome}</h3>

                      </div>
                      <div className="col-sm-6">
                        <div className="mt-4 mt-sm-0">
                          <div
                            id="radialBar-chart"
                            data-colors='["--bs-primary"]'
                            className="apex-charts"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted mb-0 pt-3">
                      "We engineer clean, crisp, and curated laundry
                      experiences."
                    </p>
                  </div>
                </div>

              </div>

              <div className="col-xl-8">
                <div className="row mb-4">
                  <div className="col-md-4">
                    <div className="card border-0 mini-stats-wid">
                      <div className="card-body">
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted pt-4 fw-medium">
                              Today's Order
                            </p>
                            <h4 className="mb-0">{todayOrder}</h4>
                          </div>

                          <div className="flex-shrink-0 align-self-center ">
                            <div className="avatar-sm rounded-circle bg-primary mini-stat-icon">
                              <span className="avatar-title rounded-circle bg-primary">
                                <i className="bx bx-archive-in font-size-24"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 mini-stats-wid">
                      <div className="card-body">
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted pt-4 fw-medium">
                              Today's Revenue
                            </p>
                            <h4 className="mb-0">₹{todayOrderAmount}</h4>
                          </div>

                          <div className="flex-shrink-0 align-self-center ">
                            <div className="avatar-sm rounded-circle bg-primary mini-stat-icon">
                              <span className="avatar-title rounded-circle bg-primary">
                                <i className="bx bx-archive-in font-size-24"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 mini-stats-wid">
                      <div className="card-body">
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                              Total Orders Completed
                            </p>
                            <h4 className="mb-0">{totalOrder}</h4>
                          </div>

                          <div className="flex-shrink-0 align-self-center">
                            <div className="avatar-sm rounded-circle bg-primary mini-stat-icon">
                              <span className="avatar-title rounded-circle bg-primary">
                                <i className="bx bx-purchase-tag-alt font-size-24"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- end row --> */}

                <div className="card border-0">
                  <div className="card-body">
                    <div className="d-sm-flex flex-wrap">
                      <div className="ms-auto">
                        <ul className="nav nav-pills">
                          <li className="nav-item pr-2">
                            <button
                              className="border-0  p-1 pl-4 pr-4  "
                              onClick={() => setWeek(true)}
                            >
                              Week
                            </button>
                          </li>
                          <li className="nav-item">
                            <button
                              className="border-0 p-1 pl-4 pr-4 "
                              onClick={() => setWeek(false)}
                            >
                              Month
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div
                      id="stacked-column-chart"
                      className="apex-charts r"
                      data-colors='["--bs-primary", "--bs-warning", "--bs-success"]'
                      dir="ltr"
                    >
                      {week ? (
                        <Chart
                          options={chartOptions2}
                          series={chartSeries2}
                          type="bar"
                          height={350}
                        />
                      ) : (
                        <Chart
                          options={chartOptions}
                          series={chartSeries}
                          type="bar"
                          height={350}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
            {/* <!-- end row --> */}

            {/* <!-- end row --> */}

            {/* <!-- end row --> */}
          </div>
          {/* <!-- container-fluid --> */}
        </div>
        {/* <!-- End Page-content --> */}

        {/* <!-- Transaction Modal --> */}
        {/* <!-- end modal --> */}

        {/* <!-- subscribeModal --> */}

        {/* <!-- end modal --> */}
      </div>
    </>
  );
};

export default Home;
