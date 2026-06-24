"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { LocaleWithMedia } from "@/lib/locations";

// Keyless MapLibre demo style for the skeleton. Swapped for MapTiler tiles
// (domain-restricted key) in the map slice; see PRD §5 (Dependencies).
const STYLE_URL = "https://demotiles.maplibre.org/style.json";

export function WorldMap({
  locations,
  onSelect,
}: {
  locations: LocaleWithMedia[];
  onSelect: (locale: LocaleWithMedia) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: [8, 22],
      zoom: 1.4,
      attributionControl: { compact: true },
    });
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "bottom-right",
    );
    mapRef.current = map;

    // maplibre reads the container size once at construction; if layout has not
    // settled yet the canvas locks to its 400x300 default. Observe the
    // container so the canvas tracks the real (and responsive) size.
    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(containerRef.current);

    for (const locale of locations) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "wmm-marker";
      el.setAttribute("aria-label", locale.name);
      el.addEventListener("click", () => onSelect(locale));
      new maplibregl.Marker({ element: el })
        .setLngLat([locale.lng, locale.lat])
        .addTo(map);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, [locations, onSelect]);

  return <div ref={containerRef} className="h-full w-full bg-neutral-900" />;
}
