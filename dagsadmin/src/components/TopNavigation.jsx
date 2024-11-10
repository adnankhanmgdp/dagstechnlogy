import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const TopNavigation = ({ onToggleSidebar, subMenuStates }) => {

  const [isFullscreen, setIsFullscreen] = useState(false);
  // const [notification, setNotification] = useState([]);

  const { currentUser } = useSelector((state) => state.user)

  const handleFullscreenToggle = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`,
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // useEffect(() => {
  //   const getNotified = async () => {
  //     try {
  //       const res = await fetch(
  //         `${process.env.REACT_DOMAIN_URL}/getNotifications`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         },
  //       );
  //       console.log(res)
  //       const data = await res.json();
  //       if (res.ok) {
  //         setNotification(data);
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   getNotified();
  // }, [])

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  }
  console.log("helllllo")

  return (
    <>
      <header className="bg-white" id="page-topbar">
        <div class="navbar-header">
          <div class="d-flex">
            {/* <!-- LOGO --> */}
            <div class="navbar-brand-box">
              <Link to="/" class="logo logo-dark">
                <span class="logo-lg">
                  <img src="/assets/Dags.jpg" alt="" height="25" />
                </span>
              </Link>

              <Link class="logo logo-light">
                <span class="logo-sm">
                  <img src="/assets/Dags.jpg" alt="" height="22" />
                </span>
              </Link>
            </div>
            <div className="top-navigation">
              {/* <button
                onClick={onToggleSidebar}
                type="button"
                class="btn btn-sm px-3 font-size-16 header-item waves-effect"
                id="vertical-menu-btn"
              >
                <i class="fa fa-fw fa-bars"></i>
              </button> */}
            </div>

            {/* <!-- App Search--> */}
            {/* <form class="app-search ml-3 d-none d-lg-block">
              <div class="position-relative">
                <input
                  style={{ backgroundColor: "#F8F8FB" }}
                  type="text"
                  class="form-control"
                  placeholder="Search..."
                />
                <span class="bx bx-search-alt"></span>
              </div>
            </form> */ }
          </div>

          <div class="d-flex">
            <div class="dropdown d-inline-block d-lg-none ms-2">
              <button
                type="button"
                class="btn header-item noti-icon waves-effect"
                id="page-header-search-dropdown"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
              >
                <i class="mdi mdi-magnify"></i>
              </button>
              <div
                class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                aria-labelledby="page-header-search-dropdown"
              >
                <form class="p-3">
                  <div class="form-group m-0">
                    <div class="input-group">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Search ..."
                        aria-label="Recipient's username"
                      />
                      <div class="input-group-append">
                        <button class="btn btn-primary" type="submit">
                          <i class="mdi mdi-magnify"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                className="btn header-item noti-icon waves-effect"
                onClick={handleFullscreenToggle}
              >
                <i
                  className={`bx ${isFullscreen ? "bx-exit-fullscreen" : "bx-fullscreen"}`}
                ></i>
              </button>
            </div>

            <div class="dropdown d-inline-block">
              <button
                type="button"
                class="btn header-item waves-effect"
                id="page-header-user-dropdown"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
              >
                <img
                  class="rounded-circle header-profile-user"
                  src="https://th.bing.com/th/id/OIP.AdoJAsiWdwMNG0ZTvUoTUQHaHa?w=217&h=217&c=7&r=0&o=5&dpr=2&pid=1.7"
                  alt="Header Avatar"
                />
                <span
                  class="d-none pl-1 pr-2 d-xl-inline-block ms-1"
                  key="t-henry"
                >
                  {currentUser.name}
                </span>
                <i class="mdi mdi-arrow-down"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-end">
                <Link onClick={handleLogout} class="dropdown-item text-danger">
                  <i class="bx bx-power-off font-size-16 align-middle me-1 text-danger"></i>
                  <span className="text-dark pl-2 align-center">Logout</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default TopNavigation;
