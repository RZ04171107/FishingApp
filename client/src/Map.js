// ##########################################################################################

// The author of Map.js is not me.

// This js file is created based on the tutorial "Use Mapbox GL JS in a React app" in mapbox documentation

// Use Mapbox GL JS in a React app url: https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/

// I also refered to https://github.com/mapbox/mapbox-react-examples to modify the code.

// ###########################################################################################

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import "mapbox-gl/dist/mapbox-gl.css";
//import geoJson from "./assets/test-mapboxgl.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWJlbGwyMjE4IiwiYSI6ImNrdWZ2MzQ5eDF4emEyb28zaDdudTgybTkifQ.udxA8TMOwJpmvgffcFER-w";

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-98.73);
  const [lat, setLat] = useState(56.42);
  const [zoom, setZoom] = useState(3);

  const [spots, setSpots] = useState(null);

  // useEffect(() => {
  //   if (map.current) return; // initialize map only once
  //   map.current = new mapboxgl.Map({
  //     container: mapContainer.current,
  //     style: "mapbox://styles/mapbox/streets-v11",
  //     center: [lng, lat],
  //     zoom: zoom,
  //   });
  // });

  // useEffect(() => {
  //   if (!map.current) return; // wait for map to initialize
  //   map.current.on("move", () => {
  //     setLng(map.current.getCenter().lng.toFixed(4));
  //     setLat(map.current.getCenter().lat.toFixed(4));
  //     setZoom(map.current.getZoom().toFixed(2));
  //   });
  // });

  useEffect(() => {
    fetch("/fishingspots")
      .then((res) => res.json())
      .then((json) => {
        setSpots(json);
        console.log("IN MAP", json);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    if (spots) return;
    fetch("/fishingspots")
      .then((res) => res.json())
      .then((json) => {
        setSpots(json);
        console.log("IN MAP", json);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    if (spots === null) return;
    //clusterMapFunc();
    basicMapFunc();
  }, [spots]);

  const basicMapFunc = () => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10", //light-v10/streets-v11/dark-v10/outdoor-v11/satellite-v9
      center: [lng, lat],
      zoom: zoom,
    });

    // add markers
    spots.map((spot) =>
      new mapboxgl.Marker()
        .setLngLat(spot.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div>
                <h5>${spot.title}</h5>
                <p>${spot.location}</p>
                <p>Longitude: ${lng} | Latitude: ${lat} </p>
              </div>`
          )
        )
        .addTo(map)
    );

    // new mapboxgl.Marker()
    //   .setLngLat([-70.937596, 42.350403])
    //   .setPopup(
    //     new mapboxgl.Popup({ offset: 25 }).setHTML(
    //       `<h5>Longitude: ${lng} | Latitude: ${lat} </h5>`
    //     )
    //   )
    //   .addTo(map);

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // Clean up on unmount
    return () => map.remove();
  };

  return (
    <div>
      {/* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
