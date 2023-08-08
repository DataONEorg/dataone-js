import parseXML from '@/utils/parseXML';

describe('parseXML function', () => {
  test('should parse valid XML string correctly', () => {
    const xmlString = `
            <root>
                <child>Text</child>
            </root>
        `;

    const xmlDoc = parseXML(xmlString);
    const childNode = xmlDoc.getElementsByTagName('child')[0];

    expect(childNode.textContent).toBe('Text');
  });

  test('should throw an error for invalid XML string', () => {
    const invalidXmlString = `
            <root>
                <child>Text
            </root>
        `; // missing closing tag for <child>

    expect(() => {
      parseXML(invalidXmlString);
    }).toThrow('Error parsing XML');
  });
});
