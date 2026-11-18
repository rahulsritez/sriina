// Shared helpers for product / category images.
// Registered in index.js on app.locals (for every view) and on global (for routes).

// placeholder shown when a product has no image or the image fails to load
const NO_IMAGE_URL = "/assets/images/404.jpg";

// add to an <img> tag so a missing S3 file shows the placeholder instead of a broken icon:
//   <img src="<%= imageUrl(list.image) %>" <%- imageFallback %>>
const imageFallback = `onerror="this.onerror=null;this.src='${NO_IMAGE_URL}'"`;

/**
 * Safe url for an image saved in the db.
 * - full links (http/https) are used as they are, only made url-safe
 * - file names get the image server url (IMAGE_URL) and are url-encoded,
 *   old uploads kept spaces/commas/brackets in the name (e.g. "1792083112582image (1).jpg"),
 *   which broke the image wherever it was used in srcset
 * - no image returns `fallback` ("" by default, pass NO_IMAGE_URL to get the placeholder)
 */
function imageUrl(image, fallback = "") {
  if (!image) return fallback;
  image = String(image).trim();
  if (!image) return fallback;

  if (/^https?:\/\//i.test(image)) {
    try {
      image = decodeURI(image); // don't double-encode links that are already encoded
    } catch (e) {}
    return encodeURI(image).replace(/,/g, "%2C");
  }
  return (process.env.IMAGE_URL || "") + encodeURIComponent(image);
}

module.exports = { NO_IMAGE_URL, imageFallback, imageUrl };
