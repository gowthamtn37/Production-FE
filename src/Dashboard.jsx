import { useState } from "react";
import { API } from "./Api";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import React, { useRef } from "react";

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
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

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
        <table className="table table-striped" ref={tableRef}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Quantity</th>
              <th scope="col">Time</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {machine.map((machine, index) => (
              <tr key={machine._id}>
                <th scope="row">{index + 1}</th>
                <td>{machine.prod}</td>
                <td>{machine.time}</td>
                <td>{machine.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
