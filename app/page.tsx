"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Chart } from "primereact/chart";
import GlobeMap, { Location } from "@/components/GlobeMap";
import { donutChartOptions, barChartOptions } from "./chartOptions";
import { getChartData } from "./chartData";
import "./page.css";
import { LocationsApiResponse } from "./locations/page";

const Home = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [totalLocations, setTotalLocations] = useState(0);
  const [riskData, setRiskData] = useState({ high: 0, medium: 0, low: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get<LocationsApiResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/locations?noPagination=true`
        );
        const locations = response.data.data;
        setLocations(locations);
        setTotalLocations(locations.length);

        // Calculate risk percentages
        const risks = locations.reduce(
          (acc, location) => {
            if (location.score >= 80) acc.low++;
            else if (location.score >= 50) acc.medium++;
            else acc.high++;
            return acc;
          },
          { high: 0, medium: 0, low: 0 }
        );

        // Convert to percentages
        const total = locations.length;
        setRiskData({
          high: Math.round((risks.high / total) * 100),
          medium: Math.round((risks.medium / total) * 100),
          low: Math.round((risks.low / total) * 100),
        });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch locations");
        } else {
          setError("Failed to fetch locations");
        }
      }
    };

    fetchLocations();
  }, []);

  const chartData = getChartData(riskData);

  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <Link href="/locations" className="stats-card">
          <div className="stats-content">
            <div className="stats-left">
              <div className="stats-number">{totalLocations}</div>
              <span>Total Locations</span>
            </div>
            <div className="stats-right">
              <div className="right-content">
                <h4>All Locations</h4>
                <p>Get access to the results of all your locations</p>
              </div>
              <span className="arrow">→</span>
            </div>
          </div>
        </Link>

        <div className="chart-card">
          <div className="chart-container">
            <Chart
              type="doughnut"
              data={chartData}
              options={donutChartOptions}
            />
          </div>
        </div>

        <div className="action-card">
          <div className="action-buttons">
            <button className="action-button">REPORT</button>
            <button className="action-button">TARGETS</button>
            <button className="action-button">ACTIONS</button>
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="map-card">
          <div className="card-header">
            <h3>Explore</h3>
            <p>
              Move the globe and see all your locations. Click on a location to
              expand the information
            </p>
          </div>
          <div className="map-container">
            {!error ? <GlobeMap locations={locations} /> : <div>{error}</div>}
          </div>
        </div>

        <div className="score-card">
          <h3>Risk Scores</h3>
          <div className="score-chart">
            <Chart
              type="bar"
              data={{
                labels: ["Risk Scores"],
                datasets: [
                  {
                    label: "High Risk",
                    data: [riskData.high],
                    backgroundColor: "#ef4444",
                  },
                  {
                    label: "Medium Risk",
                    data: [riskData.medium],
                    backgroundColor: "#f97316",
                  },
                  {
                    label: "Low Risk",
                    data: [riskData.low],
                    backgroundColor: "#22c55e",
                  },
                ],
              }}
              options={barChartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
