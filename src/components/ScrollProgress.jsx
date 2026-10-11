/**
 * Thin reading-progress bar pinned to the top of the viewport.
 *
 * Width is driven by the `--scroll-progress` custom property written by
 * useScrollProgress, so this component does not re-render while scrolling.
 */
export default function ScrollProgress() {
  return (
    <div className="progress" aria-hidden="true">
      <div className="progressbar" />
    </div>
  );
}