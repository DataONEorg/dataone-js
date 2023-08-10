import { CNs } from '../constants.js';
/**
 * Given a CN environment and a version, returns the base URL for that CN.
 * If the CN environment is not recognized, raises an error.
 * @param {string} cn - The CN environment to query.
 * @param {number} [version=2] - The version of the DataONE API to use.
 * @returns {string} - The base URL for the given CN environment.
 */
export function getBaseURL(cn, version = 2) {
  const cnURL = CNs[cn];
  if (cnURL) {
    return `${cnURL}/v${version}`;
  }
  throw new Error(`Unrecognized CN environment: ${cn}`);
}
