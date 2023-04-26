"use client";
import "leaflet/dist/leaflet.css";
import L, { Layer } from "leaflet";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  WMSTileLayer,
  useMapEvent,
} from "react-leaflet";
import PacmanLoader from "react-spinners/PacmanLoader";
import "./MapKelurahan.css";

// TODO: kurang zoom to fit bounds
// TODO: kurang higlight

// untuk panning ketika di klik
function SetViewOnClick({ animateRef }) {
  const map = useMapEvent("click", (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: animateRef.current || false,
    });
  });

  return null;
}

const MapKelurahan = (props: { kel: string }) => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [koordinatTengah, setKoordinatTengah] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [zoomLevel, setZoomLevel] = useState(0);
  const animateRef = useRef(true);
  // const highlightedLayerRef = useRef(null);

  const layerName = "bapenda:kelurahan";
  const geojsonUrl =
    "http://172.27.0.3:8080/geoserver/bapenda/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
    layerName +
    "&filter=<PropertyIsEqualTo><PropertyName>kelurahan</PropertyName>" +
    "<Literal>" +
    props.kel +
    "</Literal></PropertyIsEqualTo>" +
    "&outputFormat=application%2Fjson";

  const geoJsonStyle = () => {
    return {
      weight: 0,
    };
  };

  // const highlightStyle = {
  //   color: "#3388ff",
  //   weight: 3,
  //   fillOpacity: 0.5,
  // };

  // function ClearHighlightOnClick(): null {
  //   const map = useMapEvent("click", (e) => {
  //     if (highlightedLayerRef.current) {
  //       highlightedLayerRef.current.setStyle(geoJsonStyle());
  //       highlightedLayerRef.current = null;
  //     }
  //   });

  //   return null;
  // }

  const fetchDataFromDatabase = async (nop: any) => {
    try {
      // Ganti ini dengan URL dan parameter yang diperlukan untuk mengakses data Anda
      const databaseUrl = `/api/sppt/${nop}`;
      setLoading(true);
      const response = await axios.get(databaseUrl);
      const data = response.data;
      setLoading(false);
      // console.log("Data fetched from database:", data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      // Anda bisa mengembalikan nilai default atau menangani kesalahan lebih lanjut di sini
      return null;
    }
  };

  let cql_filter = "kelurahan='" + props.kel + "'";

  const handleOnEachFeature = (
    feature: { properties: { nop_peta: any } },
    layer: {
      on: (arg0: string, arg1: () => Promise<void>) => void;
      bindPopup: (arg0: string) => {
        (): any;
        new (): any;
        openPopup: { (): void; new (): any };
      };
    }
  ) => {
    if (feature.properties) {
      const { nop_peta } = feature.properties;
      // layer.bindPopup(
      //   `<div><b>NOP:</b> ${nop_peta}</div><div><b>Kecamatan:</b> ${kecamatan}</div><div><b>Kelurahan:</b> ${kelurahan}</div>`
      // );
      layer.on("click", async () => {
        // console.debug("isinya: " + nop_peta);

        setLoading(true);
        const hasil = await fetchDataFromDatabase(nop_peta);
        // console.debug("hasil: " + JSON.stringify(hasil));
        setLoading(false);

        // Jika ada lapisan yang sebelumnya di-highlight, kembalikan gaya asli
        // if (highlightedLayerRef.current) {
        //   highlightedLayerRef.current.setStyle(geoJsonStyle());
        // }

        // // Atur lapisan yang diklik sebagai lapisan yang di-highlight dan ubah gayanya
        // highlightedLayerRef.current = layer;
        // layer.setStyle(highlightStyle);

        if (hasil && hasil.sppt) {
          const {
            WP_NAMA,
            SPPT_PBB_HARUS_DIBAYAR,
            OP_LUAS_BUMI,
            OP_LUAS_BANGUNAN,
            OP_NJOP_BUMI,
            OP_NJOP_BANGUNAN,
          } = hasil.sppt;
          const popupContent = `
            <div><b>NOP:</b> ${nop_peta}</div>
            <div><b>Nama:</b> ${WP_NAMA}</div>
            <div><b>Tagihan:</b> ${SPPT_PBB_HARUS_DIBAYAR}</div>
            <div><b>Luas Tanah:</b> ${OP_LUAS_BUMI}</div>
            <div><b>Luas Bangunan:</b> ${OP_LUAS_BANGUNAN}</div>
            <div><b>NJOP Tanah:</b> ${OP_NJOP_BUMI}</div>
            <div><b>NJOP Bangunan:</b> ${OP_NJOP_BANGUNAN}</div>
          `;
          layer.bindPopup(popupContent).openPopup();
        } else {
          const date = new Date().getFullYear().toString();
          alert("Data tidak ditemukan untuk tahun " + date);
        }
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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

      // calculate the appropriate zoom level from the bounds
      // const dummyDiv = document.createElement("div");
      // const map = L.map(dummyDiv, {
      //   center: [0,0],
      //   zoom: 12,
      // });
      // const zoomLevel = map.getBoundsZoom(layerBounds, false, L.point(50, 50));
      // setZoomLevel(zoomLevel);
      // console.debug("zoomlevel: " + zoomLevel);

      setLoading(false);
    };

    fetchData().then(() => console.debug("load selesai"));
  }, []);

  // @ts-ignore
  return (
    <>
      {koordinatTengah && (
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
          <SetViewOnClick animateRef={animateRef} />
          {/* <ClearHighlightOnClick /> */}
          <WMSTileLayer
            url="http://172.27.0.3:8080/geoserver/bapenda/wms"
            layers={layerName}
            format="image/png"
            transparent={true}
            opacity={0.3}
            CQL_FILTER={cql_filter}
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
      )}
      {loading && (
        <div className="spinner-container">
          <PacmanLoader color="#007bff" loading={loading} size={10} />
        </div>
      )}
    </>
  );
};

export default MapKelurahan;
