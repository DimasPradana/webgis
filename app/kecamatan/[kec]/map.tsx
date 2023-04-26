"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React, { useState, useEffect } from "react";
// import axios from "axios";
import { MapContainer, TileLayer, GeoJSON, WMSTileLayer } from "react-leaflet";

const MapKecamatan = (props: { kec: string }) => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [koordinatTengah, setKoordinatTengah] = useState(null);

  let cql_filter = "kecamatan='" + props.kec + "'";

  // const handleOnEachFeature = (
  //   feature: { properties: { kd_kelurah: any } },
  //   layer: { on: (arg0: string, arg1: () => void) => void }
  // ) => {
  //   if (feature.properties) {
  //     const { kd_kelurah } = feature.properties;
  //     layer.on("click", () => {
  //       /* TODO: snub on Thu 30 Mar 2023 14:02:25 : gimana caranya update komponen tanpa refresh halaman */
  //       window.location.href = `/kelurahan/${kd_kelurah}`;
  //       // <Link href={`/kelurahan/${kd_kelurah}`}></Link>;
  //       // router.push(`/kelurahan/${kd_kelurah}`);
  //       // pindahHalaman(kd_kelurah);
  //     });
  //   }
  // };

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
      const response = await fetch(geojsonUrl, { next: { revalidate: 10 } });
      const data = await response.json();
      setGeojsonData(data);
      // const response = await axios.get(geojsonUrl);
      // const data = await response.data;
      // setGeojsonData(data);

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
      zoom={12}
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
        cql_filter={cql_filter}
      />
      {geojsonData && (
        <GeoJSON
          key="geojson-layer"
          data={geojsonData}
          onEachFeature={(feature, layer) => {
            if (feature.properties) {
              const { kd_kelurah } = feature.properties;
              layer.on("click", () => {
                /* TODO: snub on Thu 30 Mar 2023 14:02:25 : gimana caranya update komponen tanpa refresh halaman */
                window.location.href = `/kelurahan/${kd_kelurah}`;
                // router.push(`/kelurahan/${kd_kelurah}`);
              });
            }
          }}
          style={geoJsonStyle}
        />
      )}
    </MapContainer>
  ) : null;
};

export default MapKecamatan;
