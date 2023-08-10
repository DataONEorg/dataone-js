/**
 * @module classes
 * @description Classes that correspond the the DataONE Types defined in the
 * DataONE API documentation.
 * @link https://releases.dataone.org/online/api-documentation-v2.0/apis/Types.html
 */

// TODO: Organize these constants, document as needed

// Nodes that are just simple strings
const simpleNodes = ['identifier', 'name', 'description', 'baseURL'];
// Nodes that are simple strings, but are allowed > 1. This maps the class
// property (an array) to the name of the node that contains the values in the
// XML document.
const repeatedSimpleNodes = {
  subjects: 'subject',
  contactSubjects: 'contactSubject',
};
// The keys for values that are stored in <property> nodes, mapped to the class
// property names they are stored in
const nodePropKeyToClassProp = {
  metacat_version: 'metacatVersion',
  upgrade_status: 'upgradeStatus',
  CN_info_url: 'infoURL',
  CN_date_deprecated: 'dateDeprecated',
  CN_date_upcoming: 'dateUpcoming',
  read_only_mode: 'readOnlyMode',
  CN_logo_url: 'logoURL',
  CN_operational_status: 'operationalStatus',
  CN_date_operational: 'dateOperational',
  CN_location_lonlat: 'location',
};
// Names of <node> attributes that are mapped to class properties
const nodeAttributes = ['replicate', 'synchronize', 'type', 'state'];
// These nodes are handled separately const complexNodes
// Properties that should be booleans
const booleanProps = ['replicate', 'synchronize', 'readOnlyMode'];
// Properties that should be dates
const dateProps = [
  'lastHarvested',
  'lastCompleteHarvest',
  'dateDeprecated',
  'dateUpcoming',
  'dateOperational',
];
// The properties that must be a string from a restricted list of values
const restrictedStringProps = {
  type: ['cn', 'mn'],
  state: ['up', 'down', 'unknown'],
};
// Properties that are required for a valid D1Node
const requiredProps = [
  'identifier',
  'name',
  'description',
  'baseURL',
  'subjects',
  'contactSubjects',
  'replicate',
  'synchronize',
  'type',
  'state',
];
// Properties that are not required but allowed to be included in a D1Node
const optionalProps = [
  'services',
  'synchronization',
  'nodeReplicationPolicy',
  'metacatVersion',
  'upgradeStatus',
  'infoURL',
  'dateDeprecated',
  'dateUpcoming',
  'readOnlyMode',
  'logoURL',
  'operationalStatus',
  'dateOperational',
  'location',
];
// All the properties that are allowed in a D1Node
const allProps = requiredProps.concat(optionalProps);

// TODO: move parseDate to utils? Write tests.
/**
 * Converts a date string, as returned by the DataONE API, into a Date object.
 * The API returns date strings in formats like 2012-07-01T00:00:0.000Z and
 * 2012-07-01T00:00:00.000Z
 * @param {string} dateStr - A date string from the DataONE API.
 * @returns {Date|null} - A Date object representing the date string, or null if
 * the date string is not valid.
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  // Ensure seconds are in correct format
  const fixedDateStr = dateStr.replace(
    /T(\d{2}:\d{2}):(\d{1}\.\d{3}Z)/,
    'T$1:0$2',
  );
  return new Date(fixedDateStr);
}

/**
 * Represents a DataONE member or coordinating node.
 * @property {string} identifier - A unique identifier for the node of the form
 * urn:node:NODEID where NODEID is the node specific identifier. This value MUST
 * NOT change for future implementations of the same node, whereas the baseURL
 * may change in the future.
 * @property {string} name - A human readable name of the Node. This name can be
 * used as a label in many systems to represent the node, and thus should be
 * short, but understandable.
 * @property {string} description - Description of a Node, explaining the
 * community it serves and other relevant information about the node, such as
 * what content is maintained by this node and any other free style notes.
 * @property {string} baseURL - The base URL of the node, indicating the
 * protocol, fully qualified domain name, and path to the implementing service,
 * excluding the version of the API. e.g. https://server.example.edu/app/d1/mn
 * rather than https://server.example.edu/app/d1/mn/v1.
 * @property {Array<Service>} [services] - A list of services that are provided
 * by this node. Used in node descriptions so that nodes can provide metadata
 * about each service they implement and support.
 * @property {Synchronization} [synchronization] - Configuration information for
 * the process by which content is harvested from Member Nodes to Coordinating
 * Nodes.
 * @property {NodeReplicationPolicy} [nodeReplicationPolicy] - The replication
 * policy for this node that expresses constraints on object size, total
 * objects, source nodes, and object format types.
 * @property {Array<string>} [subjects] - The Subject(s) of this node. The
 * Node.subject represents the identifier of the node that would be found in
 * X.509 certificates used to securely communicate with this node.
 * @property {Array<string>} contactSubjects - The appropriate person or group
 * to contact regarding this Member Node.
 * @property {boolean} replicate - Set to true if the node is willing to be a
 * replication target, otherwise false.
 * @property {boolean} synchronize - Set to true if the node should be
 * synchronized by a Coordinating Node, otherwise false.
 * @property {'cn'|'mn'} type - The type of the node (Coordinating, Member).
 * @property {'up'|'down'|'unknown'} state - The state of the node (up, down).
 * @property {string} [metacatVersion] - The version of Metacat that the node is
 * running.
 * @property {string} [upgradeStatus] - The status of the Metacat upgrade.
 * @property {string} [infoURL] - A URL with more information about the node.
 * @property {Date} [dateDeprecated] - The date the node was deprecated.
 * @property {Date} [dateUpcoming] - ?
 * @property {boolean} [readOnlyMode] - Whether the node is in read-only mode.
 * @property {string} [logoURL] - The URL of the node's logo image file.
 * @property {string} [operationalStatus] - The operational status of the node.
 * @property {Date} [dateOperational] - ?
 * @property {string} [location] - The latitude and longitude of the node,
 * represented as a string in the format "lat, lon".
 */
export class D1Node {
  /**
   * Creates a new Node instance.
   * @param {Object} properties - Properties to apply to the new Node instance.
   * Properties parameters can be any of those specified in the typedef for this
   * class.
   */
  constructor(properties) {
    if (!properties) properties = {};
    for (const propName of allProps) {
      if (properties[propName] != null && properties.hasOwnProperty(propName)) {
        this[propName] = properties[propName];
      }
    }
  }

  /**
   * Creates a new D1Node from an XML node.
   * @param {Node} node - The XML node to parse.
   * @returns {D1Node} - A new D1Node object.
   */
  static fromXML(node) {
    if (!node) return new D1Node();

    const params = {};

    // Parse nodes that are just simple strings
    simpleNodes.forEach((nodeName) => {
      const nodeValue = node.querySelector(`:scope > ${nodeName}`)?.textContent;
      if (nodeValue) params[nodeName] = nodeValue;
    });

    // Parse nodes that are simple strings, but may be repeated
    Object.entries(repeatedSimpleNodes).forEach(([propName, nodeName]) => {
      const nodeValues = [];
      const nodeValue = node.querySelector(`:scope > ${nodeName}`)?.textContent;
      if (nodeValue) nodeValues.push(nodeValue);
      if (nodeValues.length) params[propName] = nodeValues;
    });

    // Parse nodes that are stored in <property key="..."> nodes
    const propertyNodes = node.querySelectorAll(':scope > property');
    Array.from(propertyNodes).forEach((propertyNode) => {
      const key = propertyNode.getAttribute('key');
      const value = propertyNode.textContent;
      if (key && value) {
        const classProp = nodePropKeyToClassProp[key];
        if (classProp) params[classProp] = value;
      }
    });

    // Parse the <node> attributes
    nodeAttributes.forEach((attrName) => {
      const attrValue = node.getAttribute(attrName);
      if (attrValue) params[attrName] = attrValue;
    });

    // Convert types
    booleanProps.forEach((propName) => {
      if (params[propName]) params[propName] = params[propName] === 'true';
    });
    dateProps.forEach((propName) => {
      if (params[propName]) params[propName] = parseDate(params[propName]);
    });
    Object.keys(restrictedStringProps).forEach((propName) => {
      if (params[propName]) {
        const allowedValues = restrictedStringProps[propName];
        if (!allowedValues.includes(params[propName])) {
          throw new Error(
            `The value of ${propName} must be one of ${allowedValues.join(
              ', ',
            )}`,
          );
        }
      }
    });

    // Parse the <service> nodes
    const serviceNodes = node.querySelectorAll(':scope > service');
    if (serviceNodes.length > 0) {
      params.services = Array.from(serviceNodes).map((serviceNode) => {
        return Service.fromXML(serviceNode);
      });
    }

    // Parse the <nodeReplicationPolicy> node
    const nodeReplicationPolicyNode = node.querySelector(
      ':scope > nodeReplicationPolicy',
    );
    if (nodeReplicationPolicyNode) {
      params.nodeReplicationPolicy = NodeReplicationPolicy.fromXML(
        nodeReplicationPolicyNode,
      );
    }

    // Parse the <synchronization> node
    const synchronizationNode = node.querySelector(':scope > synchronization');
    if (synchronizationNode) {
      params.synchronization = Synchronization.fromXML(synchronizationNode);
    }

    return new D1Node(params);
  }
}

/**
 * Configuration information for the process by which metadata is harvested from
 * Member Nodes to Coordinating Nodes, including the schedule on which
 * harvesting should occur, and information about the last synchronization
 * attempts for the node. Member Nodes require only schedule. Coordinating Nodes
 * must set values for the lastHarvested and lastCompleteHarvest fields.
 * @link
 * https://releases.dataone.org/online/api-documentation-v2.0/apis/Types.html?highlight=service%20restriction#Types.Synchronization
 * @property {string} schedule - An entry set by the Member Node indicating the
 * frequency for which synchronization should occur. This setting will be
 * influenced by the frequency with which content is updated on the Member Node
 * and the acceptable latency for detection and subsequent processing of new
 * content. Represented as a cron expression.
 * @property {Date} lastHarvested - The most recent modification date (UTC) of
 * objects checked during the last harvest of the node.
 * @property {Date} lastCompleteHarvest - The last time (UTC) all the data from
 * a node was pulled from a member node during a complete synchronization
 * process.
 */
export class Synchronization {
  /**
   * Creates a new Synchronization object.
   * @param {Object} properties - Properties to apply to the new Synchronization
   * instance. Properties parameters can be any of those specified in the
   * typedef for this class.
   */
  constructor(properties) {
    if (!properties) properties = {};
    this.schedule = properties.schedule;
    this.lastHarvested = properties.lastHarvested;
    this.lastCompleteHarvest = properties.lastCompleteHarvest;
  }

  /**
   * Parses a Schedule xml node into a cron expression string.
   * @link
   * https://releases.dataone.org/online/api-documentation-v2.0/apis/Types.html?highlight=service%20restriction#Types.Schedule
   * @param {Node} node - The node to parse.
   * @returns {string} - A cron expression string.
   */
  static parseXMLSchedule(node) {
    if (!node) return '';
    const parts = [];
    const attributes = ['sec', 'min', 'hour', 'mday', 'mon', 'wday', 'year'];
    attributes.forEach((attr) => {
      const value = node.getAttribute(attr);
      if (value) {
        parts.push(value);
      } else {
        parts.push('*');
      }
    });
    return parts.join(' ');
  }

  /**
   * Creates a new Synchronization from an XML node.
   * @param {Node} node - The XML node to parse.
   * @returns {Synchronization} - A new Synchronization object.
   */
  static fromXML(node) {
    if (!node) return new Synchronization();

    const scheduleNode = node.querySelector('schedule');
    const schedule = Synchronization.parseXMLSchedule(scheduleNode);
    let strLH = node.querySelector('lastHarvested')?.textContent;
    let stLCH = node.querySelector('lastCompleteHarvest')?.textContent;
    const lastHarvested = strLH ? parseDate(strLH) : undefined;
    const lastCompleteHarvest = stLCH ? parseDate(stLCH) : undefined;
    return new Synchronization({
      schedule,
      lastHarvested,
      lastCompleteHarvest,
    });
  }
}

/**
 * A NodeReplicationPolicy is used for a node that is available to store
 * replicas of data from around the network. The replication policy indicates
 * constraints on object size, total replication space available, source nodes,
 * and object format types that a node will replicate. This class does not yet
 * support <allowedNode> or <allowedObjectFormat>.
 * @link
 * https://releases.dataone.org/online/api-documentation-v1.2.0/design/ReplicationOverview.html#node-replication-policy
 * @property {number} maxObjectSize - The maximum allowable size of an object to
 * be replicated in bytes.
 * @property {number} spaceAllocated - An upper limit on space usage for replica
 * storage on the given node.
 */
export class NodeReplicationPolicy {
  /**
   * Creates a new NodeReplicationPolicy object.
   * @param {Object} properties - Properties to apply to the new
   * NodeReplicationPolicy instance. Properties parameters can be any of those
   * specified in the typedef for this class.
   */
  constructor(properties) {
    if (!properties) properties = {};
    this.maxObjectSize = parseInt(properties.maxObjectSize);
    this.spaceAllocated = parseInt(properties.spaceAllocated);
  }

  /**
   * Creates a new NodeReplicationPolicy from an XML node.
   * @param {Node} node - The XML node to parse.
   * @returns {NodeReplicationPolicy} - A new NodeReplicationPolicy object.
   */
  static fromXML(node) {
    if (!node) return new NodeReplicationPolicy();
    const props = {};
    const maxOS = node.querySelector('maxObjectSize')?.textContent;
    const spaceA = node.querySelector('spaceAllocated')?.textContent;
    if (maxOS) props.maxObjectSize = parseInt(maxOS);
    if (spaceA) props.spaceAllocated = parseInt(spaceA);
    return new NodeReplicationPolicy(props);
  }
}

/**
 * Describes an optional restriction policy for a given method. If this element
 * exists for a service method, its use is restricted, and only Subjects listed
 * in the list are allowed to invoke the method named in the methodName
 * attribute.
 * @link https://releases.dataone.org/online/api-documentation-v2.0/apis/Types.html?highlight=service%20restriction#Types.ServiceMethodRestriction
 * @property {string} methodName - The name of the method that is restricted.
 * @property {Array<string>} subjects - The list of subjects that are allowed to
 * invoke the method.
 */
export class ServiceMethodRestriction {
  /**
   * Creates a new ServiceMethodRestriction object.
   * @param {Object} properties - Properties to apply to the new
   * ServiceMethodRestriction instance. Properties parameters can be any of those
   * specified in the typedef for this class.
   */
  constructor(properties) {
    if (!properties) properties = {};
    this.methodName = properties.methodName;
    this.subjects = properties.subjects;
  }

  /**
   * Creates a new ServiceMethodRestriction from an XML node.
   * @param {Node} node - The XML node to parse
   * @returns {ServiceMethodRestriction} - A new ServiceMethodRestriction object.
   */
  static fromXML(node) {
    if (!node) return new ServiceMethodRestriction();
    return new ServiceMethodRestriction({
      methodName: node.getAttribute('methodName'),
      subjects: Array.from(node.querySelectorAll('subject')).map(
        (subjectNode) => subjectNode.textContent,
      ),
    });
  }
}

/**
 * A DataONE Service API that is exposed on a Node
 * @link https://releases.dataone.org/online/api-documentation-v2.0/apis/Types.html?highlight=service%20restriction#Types.Service
 * @property {Array<ServiceMethodRestriction>} [restrictions] - A list of method
 * names and Subjects with permission to invoke those methods.
 * @property {string} name - The name of the service. The valid list of entries
 * for Member Nodes includes: MNCore, MNRead, MNAuthorization, MNStorage, and
 * MNReplication. The valid list of entries for Coordinating Nodes includes:
 * CNCore, CNRead, CNAuthorization, CNIdentity, CNReplication, and CNRegister.
 * @property {string} version - Version of the service supported by the node.
 * Version is expressed in whole steps, no minor version identifiers are used.
 * For example, the version 1.0.0 API would be indicated by the value “v1”
 * @property {boolean} [available] - A boolean flag indicating if the service is
 * available (true, default) or otherwise (false).
 */
export class Service {
  /**
   * Creates a new Service object.
   * @param {Object} properties - Properties to apply to the new Service
   * instance. Properties parameters can be any of those specified in the typedef
   * for this class.
   */
  constructor(properties) {
    if (!properties) properties = {};
    this.restrictions = properties.restrictions;
    this.name = properties.name;
    this.version = properties.version;
    this.available = properties.available;
  }

  /**
   * Creates a new Service from an XML node.
   * @param {Node} node - The XML node to parse.
   * @returns {Service} - A new Service object.
   */
  static fromXML(node) {
    if (!node) return new Service();
    return new Service({
      restrictions: Array.from(node.querySelectorAll('restriction')).map(
        (restrictionNode) => ServiceMethodRestriction.fromXML(restrictionNode),
      ),
      name: node.getAttribute('name'),
      version: node.getAttribute('version'),
      available: node.getAttribute('available') === 'true',
    });
  }
}
