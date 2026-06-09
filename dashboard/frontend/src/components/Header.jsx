import {
  useEffect,
  useState
} from "react";

import API from "../services/api";

function Header() {

  const [lastUpdate,
    setLastUpdate] =
    useState("Loading...");

  const [currentTime,
    setCurrentTime] =
    useState(new Date());

  useEffect(() => {

    API.get("/last-update")
      .then((res) => {

        if (
          res.data &&
          res.data.last_update
        ) {

          setLastUpdate(
            new Date(
              res.data.last_update
            ).toLocaleString("en-IN")
          );

        }

      })
      .catch((err) => {

        console.error(err);

        setLastUpdate(
          "Unavailable"
        );

      });

  }, []);

  useEffect(() => {

    const timer =
      setInterval(() => {

        setCurrentTime(
          new Date()
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, []);

  return (

    <div className="dashboard-title">

      <h1>
        Real-Time Indian Stock Market Dashboard
      </h1>

      <div className="time-info">

        <h3>
          Current Time :
          {" "}
          {
            currentTime.toLocaleString(
              "en-IN"
            )
          }
        </h3>

        <h3>
          Last Market Update :
          {" "}
          {lastUpdate}
        </h3>

      </div>

    </div>

  );

}

export default Header;