import {
  D1Node,
  Service,
  Synchronization,
  NodeReplicationPolicy,
  ServiceMethodRestriction,
} from '../../src/classes.js';
import { parseXML } from '../testUtils';

describe('D1Node from XML', () => {
  test('should return a D1Node object', () => {
    const node = parseXML('<node></node>');
    const d1Node = D1Node.fromXML(node);
    expect(d1Node.constructor.name).toBe('D1Node');
  });

  test('should parse the identifier', () => {
    const node = parseXML('<node><identifier>urn:node:CN</identifier></node>');
    const d1Node = D1Node.fromXML(node);
    expect(d1Node.identifier).toBe('urn:node:CN');
  });

  test('should parse the name', () => {
    const node = parseXML('<node><name>cn</name></node>');
    const d1Node = D1Node.fromXML(node);
    expect(d1Node.name).toBe('cn');
  });

  test('should parse the description', () => {
    const node = parseXML(
      '<node><description>This is a Coordinating Node</description></node>',
    );
    const d1Node = D1Node.fromXML(node);
    expect(d1Node.description).toBe('This is a Coordinating Node');
  });

  test('should parse the baseURL', () => {
    const node = parseXML(
      '<node><baseURL>https://cn.dataone.org/cn</baseURL></node>',
    );
    const d1Node = D1Node.fromXML(node);
    expect(d1Node.baseURL).toBe('https://cn.dataone.org/cn');
  });

  test('should parse the subjects', () => {
    const node = parseXML(
      '<node><subject>CN=urn:node:CN,DC=dataone,DC=org</subject></node>',
    );
    const d1Node = D1Node.fromXML(node);
    expect(d1Node.subjects.length).toBe(1);
    expect(d1Node.subjects[0]).toBe('CN=urn:node:CN,DC=dataone,DC=org');
  });

  test('should parse the contact subjects', () => {
    const node = parseXML(
      '<node><contactSubject>CN=urn:node:CN,DC=dataone,DC=org</contactSubject></node>',
    );
    const d1Node = D1Node.fromXML(node);
    expect(d1Node.contactSubjects.length).toBe(1);
    expect(d1Node.contactSubjects[0]).toBe('CN=urn:node:CN,DC=dataone,DC=org');
  });

  test('should parse the operational status', () => {
    const node = parseXML(
      '<node><property key="CN_operational_status">operational</property></node>',
    );
    const d1Node = D1Node.fromXML(node);
    expect(d1Node.operationalStatus).toBe('operational');
  });

  test('should parse the operational date', () => {
    const node = parseXML(
      '<node><property key="CN_date_operational">2012-07-23T00:00:0.000Z</property></node>',
    );
    const d1Node = D1Node.fromXML(node);
    const opDate = new Date('2012-07-23T00:00:00.000Z');
    expect(d1Node.dateOperational).toEqual(opDate);
  });

  test('should parse read_only_mode', () => {
    const node = parseXML(
      '<node><property key="read_only_mode">false</property></node>',
    );
    const d1Node = D1Node.fromXML(node);
    expect(d1Node.readOnlyMode).toBe(false);
  });

  test('should parse the node attributes', () => {
    const node = parseXML(
      '<node replicate="false" synchronize="true" type="mn" state="up"></node>',
    );
    const d1Node = D1Node.fromXML(node);
    expect(d1Node.replicate).toBe(false);
    expect(d1Node.synchronize).toBe(true);
    expect(d1Node.type).toBe('mn');
    expect(d1Node.state).toBe('up');
  });
});

describe('Service from XML', () => {
  test('should return a Service object', () => {
    const service = parseXML('<service></service>');
    const d1Service = Service.fromXML(service);
    expect(d1Service.constructor.name).toBe('Service');
  });

  // TODO: Add tests for the other Service properties
});

describe('Synchronization from XML', () => {
  test('should return a Synchronization object', () => {
    const sync = parseXML('<synchronization></synchronization>');
    const d1Sync = Synchronization.fromXML(sync);
    expect(d1Sync.constructor.name).toBe('Synchronization');
  });
  // TODO: Add tests for the other Synchronization properties
});

describe('NodeReplicationPolicy from XML', () => {
  test('should return a NodeReplicationPolicy object', () => {
    const nrp = parseXML('<nodeReplicationPolicy></nodeReplicationPolicy>');
    const d1Nrp = NodeReplicationPolicy.fromXML(nrp);
    expect(d1Nrp.constructor.name).toBe('NodeReplicationPolicy');
  });
  // TODO: Add tests for the other NodeReplicationPolicy properties
});

describe('ServiceMethodRestriction from XML', () => {
  test('should return a ServiceMethodRestriction object', () => {
    const smr = parseXML(
      '<serviceMethodRestriction></serviceMethodRestriction>',
    );
    const d1Smr = ServiceMethodRestriction.fromXML(smr);
    expect(d1Smr.constructor.name).toBe('ServiceMethodRestriction');
  });
  // TODO: Add tests for the other ServiceMethodRestriction properties
});
