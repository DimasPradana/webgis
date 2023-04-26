"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, GeoJSON, WMSTileLayer } from "react-leaflet";

export default function MapRoot() {
  const [geojsonData, setGeojsonData] = useState(null);
  // const center = [-7.6987812, 114.0157606];
  const [koordinatTengah, setKoordinatTengah] = useState(null);

  const handleOnEachFeature = (
    feature: { properties: { kd_kecamat: any } },
    layer: { on: (arg0: string, arg1: () => void) => void }
  ) => {
    if (feature.properties) {
      const { kd_kecamat } = feature.properties;
      layer.on("click", () => {
        /* TODO: snub on Thu 30 Mar 2023 14:02:25 : gimana caranya update komponen tanpa refresh halaman */
        window.location.href = `/kecamatan/${kd_kecamat}`;
      });
    }
  };

  let layerName: string = "bapenda:kabupaten";
  let geojsonUrl: string =
    "http://172.27.0.3:8080/geoserver/bapenda/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
    layerName +
    "&outputFormat=application%2Fjson";

  useEffect(() => {
    const fetchData = async () => {
      // const response = await fetch(geojsonUrl);
      // const data = await response.json();
      // setGeojsonData(data);
      const response = await axios.get(geojsonUrl);
      const data = response.data;
      setGeojsonData(data);

      // calculate the bounds from the GeoJSON
      const layerBounds = L.geoJSON(data).getBounds();
      // console.debug("isi bounds" + JSON.stringify(layerBounds));

      // calculate the center from the bounds
      const layerCenter = layerBounds.getCenter();
      // @ts-ignore
      setKoordinatTengah([layerCenter.lat, layerCenter.lng]);
      // console.debug("isi center: " + JSON.stringify(koordinatTengah))
    };

    fetchData();
  }, []);

  const geoJsonStyle = () => {
    return {
      weight: 0,
    };
  };

  return koordinatTengah ? (
    <MapContainer
      center={koordinatTengah}
      zoom={11}
      //   style={{ height: "100vh", width: "100vw" }}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="BAPENDA Situbondo"
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      />
      <WMSTileLayer
        url="http://172.27.0.3:8080/geoserver/bapenda/wms"
        layers={layerName}
        format="image/png"
        transparent={true}
      />
      {geojsonData && (
        <GeoJSON
          key="geojson-layer"
          data={geojsonData}
          onEachFeature={handleOnEachFeature}
          style={geoJsonStyle}
        />
      )}
    </MapContainer>
  ) : null;
}
