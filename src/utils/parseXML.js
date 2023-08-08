/**
 * Parses a given XML string and returns a DOM object.
 * @param {string} xmlString - The XML string to be parsed.
 * @returns {Document} - The parsed XML as a DOM object.
 * @throws {Error} - Throws an error if parsing fails.
 */
function parseXML(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  // Check for XML parsing errors
  const parseError = xmlDoc.getElementsByTagName("parsererror");
  if (parseError.length) {
    throw new Error("Error parsing XML", parseError);
  }

  return xmlDoc;
}

export default parseXML;
