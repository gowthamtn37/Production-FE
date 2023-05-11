import { useState } from "react";
import { API } from "./Api";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import React, { useRef } from "react";
import io from "socket.io-client";

import "./css/Dashboard.css";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const [machine, setMachine] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/machine`, {
      headers: { "x-auth-token": localStorage.getItem("token") },
    })
      .then((data) => checkAuth(data))
      .then((data) => setMachine(data))
      .catch((error) => console.log(error));
  }, []);
  //console.log(machine);

  function checkAuth(data) {
    if (data.status === 401) {
      throw new Error("protected");
    } else {
      return data.json();
    }
  }

  function print() {
    window.print();
    navigate("/dashboard");
  }

  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Users table",
    sheet: "Users",
  });

  const [realTime, setRealTimeData] = useState([]);

  const socket = io.connect(`${API}`);
  socket.on("send_msg", (data) => {
    console.log(data);
    setRealTimeData(data);
  });
  console.log(realTime);
  // const time = realTime.time.substring(10);
  // const date = realTime.time.substring(10);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="realtime-data">
        <h2>Current Quantity :{realTime.quantity}</h2>
        <h2>Updated @ : {realTime.time}</h2>
      </div>

      <div className="table-container">
        <div className="btn">
          <Button variant="contained" onClick={onDownload}>
            Excel
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              print();
            }}
          >
            Print
          </Button>
        </div>
        <div className="table" ref={tableRef}>
          <div>SL.No</div>
          <div>QUANTITY</div>
          <div>TIME</div>
          <div>DATE</div>

          {machine.map((data, index) => (
            <>
              <div>{index + 1}</div>
              <div>{data.quantity}</div>
              <div>{data.time.substring(10)}</div>
              <div>{data.time.substring(0, 9)}</div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
