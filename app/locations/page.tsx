"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Location } from "@/components/GlobeMap";

export type LocationsApiResponse = {
  data: Location[];
  numOfPages: number;
};

export default function LocationsList() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    page: 0,
  });

  const loadLocations = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get<LocationsApiResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/locations?page=${
          page + 1
        }&limit=10`
      );
      setLocations(response.data.data);
      setTotalRecords(response.data.numOfPages * 10);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations(lazyState.page);
  }, [lazyState]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPage = (event: any) => {
    setLazyState(event);
  };

  const scoreBodyTemplate = (location: Location) => {
    const getSeverity = (score: number) => {
      if (score >= 80) return "success";
      if (score >= 60) return "warning";
      if (score >= 40) return "info";
      return "danger";
    };

    return (
      <Tag
        value={`${location.score}%`}
        severity={getSeverity(location.score)}
      />
    );
  };

  const dateBodyTemplate = (location: Location) => {
    return new Date(location.createdAt).toLocaleDateString();
  };

  return (
    <div className="card">
      <DataTable
        value={locations}
        lazy
        dataKey="_id"
        paginator
        first={lazyState.first}
        rows={lazyState.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
        className="p-datatable-sm"
        stripedRows
        showGridlines
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="name" header="Name" sortable style={{ width: "25%" }} />
        <Column field="address" header="Address" style={{ width: "35%" }} />
        <Column
          field="score"
          header="Score"
          body={scoreBodyTemplate}
          sortable
          style={{ width: "10%" }}
        />
        <Column
          field="createdAt"
          header="Created At"
          body={dateBodyTemplate}
          sortable
          style={{ width: "15%" }}
        />
        <Column
          field="latitude"
          header="Coordinates"
          body={(location) => `${location.latitude}, ${location.longitude}`}
          style={{ width: "15%" }}
        />
      </DataTable>
    </div>
  );
}
