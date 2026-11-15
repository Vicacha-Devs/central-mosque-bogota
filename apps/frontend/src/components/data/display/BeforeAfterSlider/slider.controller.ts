/**
 * Registers the `<img-comparison-slider>` custom element in the browser.
 *
 * The package touches `HTMLElement`/`customElements` at import time, so it is
 * loaded dynamically from the client script instead of the server frontmatter.
 */
export async function registerSlider(): Promise<void> {
  await import("img-comparison-slider");
}
