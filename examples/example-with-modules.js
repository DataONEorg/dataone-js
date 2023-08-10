import * as d1 from '../src/index.js';

const nodesDiv = document.getElementById('nodes');

d1.listNodes('PROD').then((nodes) => {
  for (const node of nodes) {
    const nodeDiv = document.createElement('div');
    nodeDiv.classList.add('node');
    nodeDiv.innerHTML = `
      <h2>${node.name} (${node.identifier})</h2>
      <p>${node.description}</p>
      <ul>
        <li><b>Base URL:</b><a href="${node.baseURL}">${node.baseURL}</a></li>
        <li><b>Info URL:</b><a href="${node.infoURL}">${node.infoURL}</a></li>
        <li>Replicate: ${node.replicate}</li>
        <li>Synchronize: ${node.synchronize}</li>
        <li>Type: ${node.type}</li>
        <li>State: ${node.state}</li>
        <li>Location: ${node.location}</li>
      </ul>
    `;
    // Insert the logo if it exists.
    if (node.logoURL) {
      const logo = document.createElement('img');
      logo.src = node.logoURL;
      logo.style.maxHeight = '100px';
      nodeDiv.querySelector('h2').after(logo);
    }

    nodesDiv.appendChild(nodeDiv);
  }
});
