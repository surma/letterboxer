// Rollup currently relies on `document.baseURI` for asset resolution in its AMD output.
self.document = {
  baseURI: `${location.protocol}//${location.host}/`
};
