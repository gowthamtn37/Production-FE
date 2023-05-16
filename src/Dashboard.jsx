import { useState } from "react";
import { API } from "./Api";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import React, { useRef } from "react";
import io from "socket.io-client";

import "./css/Dashboard.css";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "./redux/reducer/counterSlice";

export function Dashboard() {
  const [machine, setMachine] = useState([]);
  const navigate = useNavigate();

  // const [realTime, setRealTimeData] = useState([]);

  const socket = io.connect(`${API}`);
  socket.on("connect", () => {});

  const [quantity, setQuantity] = useState();
  const [time, setTime] = useState();

  socket.on("send_msg", (res) => {
    setQuantity(res[0].quantity);
    setTime(res[0].time);
  });

  //console.log(quantity, time);

  useEffect(() => {
    fetch(`${API}/machine`, {
      headers: { "x-auth-token": localStorage.getItem("token") },
    })
      .then((data) => checkAuth(data))
      .then((data) => setMachine(data))
      .catch((error) => console.log(error));
  }, [quantity]);
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

  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="table-container">
        <div className="realtime-data">
          <h2>Current Quantity :{quantity}</h2>
          <h2>Updated @ : {time}</h2>
        </div>

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
      <div>
        <div className="redux">
          <h1> React Redux </h1>
        </div>
        <div>
          <button
            aria-label="Increment value"
            onClick={() => dispatch(increment())}
          >
            Increment
          </button>
          <span>{count}</span>
          <button
            aria-label="Decrement value"
            onClick={() => dispatch(decrement())}
          >
            Decrement
          </button>
        </div>
      </div>
    </div>
  );
}
