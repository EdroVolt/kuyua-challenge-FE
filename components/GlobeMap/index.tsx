"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "mapbox-gl/dist/mapbox-gl.css";
import "./globeMap.css";

export type Location = {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
  score: number;
  address: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  locations: Location[];
};

const RADIUS_KM = 1000;

// Helper function to calculate distance between two points
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Helper function to create popup content with proper accessibility
const createAccessiblePopup = (location: Location) => {
  const popupContent = document.createElement("div");
  popupContent.setAttribute("role", "dialog");
  popupContent.setAttribute(
    "aria-label",
    `Location details for ${location.name}`
  );

  popupContent.innerHTML = `
    <div class="p-card p-3">
      <h3 class="p-card-title">${location.name}</h3>
      <div class="p-card-content">
        <p class="p-tag p-tag-success">Score: ${location.score}/100</p>
        <div class="address-container">
          <p class="p-text-secondary">${location.address}</p>
        </div>
      </div>
    </div>
  `;

  return popupContent;
};

export default function GlobeMap({ locations }: Props) {
  const mapRef = useRef<mapboxgl.Map | undefined>(undefined);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filterLocationsByDistance = (
    locations: Location[],
    centerLat: number,
    centerLon: number
  ) => {
    return locations.filter((location) => {
      const distance = getDistanceFromLatLonInKm(
        centerLat,
        centerLon,
        location.latitude,
        location.longitude
      );
      return distance <= RADIUS_KM;
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        const map = new mapboxgl.Map({
          container: mapContainerRef.current!,
          center: [longitude, latitude],
          style: "mapbox://styles/mapbox/dark-v11",
          zoom: 1,
          dragRotate: false,
          attributionControl: false,
        });

        mapRef.current = map;

        // Filter locations within radius
        const nearbyLocations = filterLocationsByDistance(
          locations,
          latitude,
          longitude
        );

        // Add markers for nearby locations
        nearbyLocations.forEach((location) => {
          const el = document.createElement("div");
          el.className = "marker";
          el.setAttribute("role", "button");
          el.setAttribute("aria-label", `Location marker for ${location.name}`);
          el.setAttribute("tabindex", "0");

          new mapboxgl.Marker({
            element: el,
            anchor: "center",
          })
            .setLngLat([location.longitude, location.latitude])
            .setPopup(
              new mapboxgl.Popup({
                focusAfterOpen: true,
                closeButton: true,
                closeOnClick: false,
              }).setDOMContent(createAccessiblePopup(location))
            )
            .addTo(map);
        });

        // Update markers when map moves
        map.on("moveend", () => {
          const center = map.getCenter();
          const nearbyLocations = filterLocationsByDistance(
            locations,
            center.lat,
            center.lng
          );

          // Remove existing markers
          const markers = document.getElementsByClassName("marker");
          while (markers[0]) {
            markers[0].parentNode?.removeChild(markers[0]);
          }

          // Add new markers
          nearbyLocations.forEach((location) => {
            const el = document.createElement("div");
            el.className = "marker";
            el.setAttribute("role", "button");
            el.setAttribute(
              "aria-label",
              `Location marker for ${location.name}`
            );
            el.setAttribute("tabindex", "0");

            new mapboxgl.Marker({
              element: el,
              anchor: "center",
            })
              .setLngLat([location.longitude, location.latitude])
              .setPopup(
                new mapboxgl.Popup({
                  focusAfterOpen: true,
                  closeButton: true,
                  closeOnClick: false,
                }).setDOMContent(createAccessiblePopup(location))
              )
              .addTo(map);
          });
        });
      },
      (err) => {
        setError(err.message);
      }
    );

    return () => {
      mapRef.current?.remove();
    };
  }, [locations]);

  if (error) return <div>{error}</div>;

  return <div id="map-container" ref={mapContainerRef} />;
}
