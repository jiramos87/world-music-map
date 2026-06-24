"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { LocaleWithMedia } from "@/lib/locations";
import { primaryFamily } from "@/lib/genre-families";

// On-brand dark vector basemap from MapTiler when a key is present; the keyless
// MapLibre demo style is the dev/no-key fallback. See PRD §5 (Map tiles).
const DEMO_STYLE = "https://demotiles.maplibre.org/style.json";

function styleUrl(mapTilerKey: string | null): string {
  return mapTilerKey
    ? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${mapTilerKey}`
    : DEMO_STYLE;
}

export function WorldMap({
  locations,
  onSelect,
  mapTilerKey,
  dimmedIds,
  selectedId,
}: {
  locations: LocaleWithMedia[];
  onSelect: (locale: LocaleWithMedia) => void;
  mapTilerKey: string | null;
  dimmedIds: Set<string>;
  selectedId: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ id: string; el: HTMLElement }[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl(mapTilerKey),
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

    const markers: { id: string; el: HTMLElement }[] = [];
    for (const locale of locations) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "wmm-marker";
      el.style.setProperty("--marker-color", primaryFamily(locale.genre).color);
      el.setAttribute("aria-label", locale.name);
      el.addEventListener("click", () => onSelect(locale));

      // Name label, revealed when this marker is the selected one.
      const label = document.createElement("span");
      label.className = "wmm-marker__label";
      label.textContent = locale.name;
      el.appendChild(label);

      new maplibregl.Marker({ element: el })
        .setLngLat([locale.lng, locale.lat])
        .addTo(map);
      markers.push({ id: locale.id, el });
    }
    markersRef.current = markers;

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
  }, [locations, onSelect, mapTilerKey]);

  // Toggle the dim class as filters change, without recreating the map.
  useEffect(() => {
    for (const marker of markersRef.current) {
      marker.el.classList.toggle(
        "wmm-marker--dimmed",
        dimmedIds.has(marker.id),
      );
    }
  }, [dimmedIds]);

  // Highlight the selected marker (enlarge + reveal its label).
  useEffect(() => {
    for (const marker of markersRef.current) {
      marker.el.classList.toggle(
        "wmm-marker--selected",
        marker.id === selectedId,
      );
    }
  }, [selectedId]);

  return <div ref={containerRef} className="h-full w-full bg-neutral-900" />;
}
