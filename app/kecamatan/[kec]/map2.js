"use client";
import "leaflet/dist/leaflet.css";
// import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, WMSTileLayer } from "react-leaflet";

const MapKecamatan = (props) => {
  const [geojsonData, setGeojsonData] = useState(null);
  const center = [-7.6987812, 114.0157606];
  let cql_filter = "kecamatan='" + props.kec + "'";
  /* const pindahHalaman = (kec) => {
    console.debug("kelurahan : " + kec);
    const router = useRouter();
    router.push("/kelurahan/" + kec);
  }; */
  const handleOnEachFeature = (feature, layer) => {
    if (feature.properties) {
      const { kd_kelurah } = feature.properties;
      layer.on("click", () => {
        /* TODO: snub on Thu 30 Mar 2023 14:02:25 : gimana caranya update komponen tanpa refresh halaman */
        console.debug("kelurahan : " + kd_kelurah);
      });
    }
  };

  let layerName = "bapenda:kecamatan";
  let geojsonUrl =
    "http://172.27.0.3:8080/geoserver/bapenda/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
    layerName +
    "&filter=<PropertyIsEqualTo><PropertyName>kecamatan</PropertyName>" +
    "<Literal>" +
    props.kec +
    "</Literal></PropertyIsEqualTo>" +
    "&outputFormat=application%2Fjson";

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(geojsonUrl);
      const data = await response.json();
      setGeojsonData(data);
    };

    fetchData();
  }, []);

  const geoJsonStyle = () => {
    return {
      weight: 0,
    };
  };

  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: "100vh", width: "100vw" }}
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
        CQL_FILTER={cql_filter}
      />
      {geojsonData && (
        <GeoJSON
          key="geojson-layer"
          data={geojsonData}
          eventHandlers={{ click: handleOnEachFeature }}
          style={geoJsonStyle}
        />
      )}
    </MapContainer>
  );
};

export default MapKecamatan;
