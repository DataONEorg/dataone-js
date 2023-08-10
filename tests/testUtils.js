/**
 * @fileoverview This file contains utility functions for use in tests.
 */

import fs from 'fs/promises';
import path from 'path';
import { enableFetchMocks } from 'jest-fetch-mock';

/**
 * A DOMParser instance.
 * @type {DOMParser}
 * @private
 * @ignore
 */
const parser = new DOMParser();

/**
 * The directory containing the mock data files.
 * @type {string}
 */
const mockDataDir = 'tests/mocks';

/**
 * A map of codes to mock data filenames that exist in the mock data directory.
 * @type {Object<string, string>}
 */
const filenames = {
  NODELIST: 'nodeList.xml',
};

/**
 * Reads the mock data file with the given name and returns its contents.
 * @param {string} file The name of the mock data file to read.
 * @returns {Promise<string>} The contents of the mock data file.
 */
const readMockXMLData = async (file) => {
  if (!Object.keys(filenames).includes(file)) {
    throw new Error(`Unrecognized mock data file: ${file}`);
  }
  const filePath = path.resolve(mockDataDir, filenames[file]);
  const data = await fs.readFile(filePath, 'utf-8');
  return data;
};

/**
 * Sets up the fetch mock to return the mock data for the given file.
 * @param {string} file The name of the mock data file to return.
 */
export const setupFetchMock = async (file) => {
  enableFetchMocks();
  const mockResponse = await readMockXMLData(file);
  global.fetch.mockResponseOnce(mockResponse);
};

/**
 * Resets the fetch mock.
 */
export const teardownFetchMock = () => {
  global.fetch.resetMocks();
};

// /**
//  * Returns the first <node> XML element from the NODELIST mock data.
//  * @returns {Promise<DOMElement>} The first <node> XML element from the NODELIST
//  * mock data.
//  */
// export const getMockNode = async () => {
//   const parser = new DOMParser();
//   const node = await readMockXMLData('NODELIST')
//     .then((data) => parser.parseFromString(data, 'text/xml'))
//     .then((xmlDoc) => xmlDoc.getElementsByTagName('node')[0]);
//   return node;
// };

/**
 * Parse an XML string into a DOM element, then extract the first element in the
 * document.
 * @param {string} xmlString The XML string to parse.
 * @returns {DOMElement} The first element in the XML document.
 */
export const parseXML = (xmlString) => {
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  return xmlDoc.documentElement;
};
