import { parseXML } from '../utils/parseXML.js';
import { getBaseURL } from './cnUtils.js';
import { D1Node } from '../classes.js';
/**
 * Returns a list of nodes that have been registered with the DataONE
 * infrastructure.
 * @param {string} cn - The Coordinating Node environment to query.
 * @returns {Promise<Array<D1Node>>} - A list of nodes that have been registered
 * with the DataONE Coordinating Node.
 * @throws {Error} - Throws an error if the DataONE API cannot be reached.
 */
export async function listNodes(cn) {
  const baseUrl = getBaseURL(cn);
  const restUrl = `${baseUrl}/node`;
  const method = 'GET';
  const headers = {
    Accept: 'application/xml',
  };
  const response = await fetch(restUrl, { method, headers });
  const xmlString = await response.text();
  const xmlDoc = parseXML(xmlString);
  const nodeElements = xmlDoc.getElementsByTagName('node');
  return Array.from(nodeElements).map((nodeElement) => {
    return D1Node.fromXML(nodeElement);
  });
}
