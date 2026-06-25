"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { LocaleWithMedia } from "@/lib/locations";
import type { InfluenceLinkData } from "@/lib/influence";
import { primaryFamily } from "@/lib/genre-families";

const SVG_NS = "http://www.w3.org/2000/svg";

/** One influence arc's DOM + the endpoints needed to re-project it each frame. */
type Arc = {
  fromId: string;
  toId: string;
  from: [number, number];
  to: [number, number];
  group: SVGGElement;
  paths: SVGPathElement[];
};

/** Quadratic-bezier arc between two projected pixel points, bowed toward the top
 *  (flight-map style) so overlapping connections fan out instead of stacking. */
function arcPath(x0: number, y0: number, x1: number, y1: number): string {
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const k = 0.22;
  // Perpendicular offset; pick the sign that lifts the control point upward.
  let cx = mx - dy * k;
  let cy = my + dx * k;
  if (cy > my) {
    cx = mx + dy * k;
    cy = my - dx * k;
  }
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(
    1,
  )} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

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
  influenceLinks,
  onSelect,
  mapTilerKey,
  dimmedIds,
  selectedId,
}: {
  locations: LocaleWithMedia[];
  influenceLinks: InfluenceLinkData[];
  onSelect: (locale: LocaleWithMedia) => void;
  mapTilerKey: string | null;
  dimmedIds: Set<string>;
  selectedId: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ id: string; el: HTMLElement }[]>([]);
  const arcsRef = useRef<Arc[]>([]);

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

    // Influence arcs live in an SVG overlay above the basemap. Each link is a
    // faint base line + a "comet" path (a short dash that travels via CSS), both
    // colored by the source locale's family. The geometry is re-projected on
    // every map `render` (fires for each frame of a pan/zoom), so the arcs stay
    // pinned to their endpoints. Drawn imperatively to avoid re-rendering React
    // every animation frame.
    const overlay = overlayRef.current;
    const arcs: Arc[] = [];
    if (overlay) {
      for (let i = 0; i < influenceLinks.length; i++) {
        const link = influenceLinks[i];
        const color = primaryFamily(link.from.genre).color;

        const group = document.createElementNS(SVG_NS, "g");
        group.setAttribute("class", "wmm-arc");

        const base = document.createElementNS(SVG_NS, "path");
        base.setAttribute("class", "wmm-arc__line");
        base.setAttribute("stroke", color);

        const comet = document.createElementNS(SVG_NS, "path");
        comet.setAttribute("class", "wmm-arc__comet");
        comet.setAttribute("stroke", color);
        comet.setAttribute("pathLength", "100");
        comet.style.color = color; // currentColor drives the glow
        comet.style.animationDelay = `${(i * -0.6).toFixed(2)}s`;

        group.append(base, comet);
        overlay.append(group);
        arcs.push({
          fromId: link.from.id,
          toId: link.to.id,
          from: [link.from.lng, link.from.lat],
          to: [link.to.lng, link.to.lat],
          group,
          paths: [base, comet],
        });
      }
    }
    arcsRef.current = arcs;

    const syncArcs = () => {
      for (const arc of arcs) {
        const a = map.project(arc.from);
        const b = map.project(arc.to);
        const d = arcPath(a.x, a.y, b.x, b.y);
        for (const path of arc.paths) path.setAttribute("d", d);
      }
    };
    syncArcs();
    map.on("render", syncArcs);

    return () => {
      resizeObserver.disconnect();
      map.off("render", syncArcs);
      map.remove();
      overlay?.replaceChildren();
      mapRef.current = null;
      markersRef.current = [];
      arcsRef.current = [];
    };
  }, [locations, influenceLinks, onSelect, mapTilerKey]);

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

  // When a locale is selected, spotlight the arcs touching it and mute the rest,
  // so the map echoes the drawer's "Connected sounds" list. No selection -> all
  // arcs sit at their resting opacity.
  useEffect(() => {
    for (const arc of arcsRef.current) {
      const touches =
        selectedId != null &&
        (arc.fromId === selectedId || arc.toId === selectedId);
      arc.group.classList.toggle("wmm-arc--active", touches);
      arc.group.classList.toggle(
        "wmm-arc--muted",
        selectedId != null && !touches,
      );
    }
  }, [selectedId]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full bg-neutral-900" />
      <svg
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      />
    </div>
  );
}
