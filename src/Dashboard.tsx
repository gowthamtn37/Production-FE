import { useState } from "react";
import { API } from "./Api";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import React, { useRef } from "react";
import io from "socket.io-client";
import "./css/Dashboard.css";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { create } from "./features/productSlice";

export function Dashboard() {
  const dispatch = useDispatch();

  const [machine, setMachine] = useState([]);
  const navigate = useNavigate();

  const socket = io(`${API}`);
  socket.on("connect", () => {});

  const [quantity, setQuantity] = useState();
  const [time, setTime] = useState();

  socket.on("send_msg", (res) => {
    setQuantity(res[0].quantity);
    setTime(res[0].time);
  });

  useEffect(() => {
    fetch(`${API}/machine`, {
      headers: { "x-auth-token": localStorage.getItem("token") },
    })
      .then((data) => checkAuth(data))
      .then((data) => setMachine(data))
      .catch((error) => console.log(error));
  }, [quantity]);

  function checkAuth(data: Response) {
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

  useEffect(() => {
    dispatch(create(machine));
  }, [quantity]);

  const product = useSelector((state) => state.product.data);
  // console.log(product);

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

          {product.map(
            (
              data: {
                quantity:
                  | string
                  | number
                  | boolean
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | React.ReactFragment
                  | React.ReactPortal
                  | null
                  | undefined;
                time: string;
              },
              index: number
            ) => (
              <>
                <div>{index + 1}</div>
                <div>{data.quantity}</div>
                <div>{data.time.substring(10)}</div>
                <div>{data.time.substring(0, 9)}</div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
