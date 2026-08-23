/**
 * Free OpenStreetMap iframe embed — no API key, no billing, real map tiles.
 * Shows a single marker at the given coordinates. Good enough for
 * "here's roughly where this pin is" — not a full interactive map SDK.
 */
export default function LocationMap({ latitude, longitude, height = 200 }) {
  if (latitude == null || longitude == null || latitude === '' || longitude === '') {
    return null;
  }

  const lat = Number(latitude);
  const lng = Number(longitude);
  const delta = 0.01;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="overflow-hidden rounded-xl border border-ink-200" style={{ height }}>
      <iframe
        title="Location preview"
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
      />
    </div>
  );
}
