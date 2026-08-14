export function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`brand-mark ${inverse ? "inverse" : ""}`} aria-label="Youngkeke Air">
      <span className="air-emblem" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="air-wordmark">
        <strong>YOUNGKEKE</strong>
        <small>AIR</small>
      </span>
    </span>
  );
}
