#!/usr/bin/env node

import assert from 'node:assert/strict';
import contentful from "contentful";
import graphviz from "graphviz";

const { SPACE_ID = '', ENVIRONMENT_ID = '', ACCESS_TOKEN = '' } = process.env;

assert(SPACE_ID, "Contentful SPACE_ID is required");
assert(ENVIRONMENT_ID, "Contentful ENVIRONMENT_ID is required");
assert(ACCESS_TOKEN, "Contentful content delivery ACCESS_TOKEN is required");

function generateColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function extractLinks(contentType, items, links = [], visited = new Set()) {
  if (visited.has(contentType.sys.id)) {
    return links;
  }

  visited.add(contentType.sys.id);

  const linkedContentTypes = contentType.fields
    .flatMap((field) => {
      if (field.type === "Link" && field.linkType === "Entry") {
        return {
          source: contentType.sys.id,
          target: field.validations.find((v) => v.linkContentType)
            ?.linkContentType[0],
          fieldId: field.id,
          fieldName: field.name,
        };
      } else if (field.type === "Array" && field.items.linkType === "Entry") {
        return field.items.validations
          .find((v) => v.linkContentType)
          .linkContentType.map((target) => ({
            source: contentType.sys.id,
            target,
            fieldId: field.id,
            fieldName: field.name,
          }));
      }
      return [];
    })
    .filter((link) => link.target);

  links.push(...linkedContentTypes);

  linkedContentTypes.forEach((link) => {
    const targetContentType = items.find((item) => item.sys.id === link.target);
    extractLinks(targetContentType, items, links, visited);
  });

  return links;
}

async function fetchContentTypes() {
  const client = contentful.createClient({
    space: SPACE_ID,
    environment: ENVIRONMENT_ID,
    accessToken: ACCESS_TOKEN,
  });

  const contentTypes = await client.getContentTypes();
  const items = contentTypes.items;

  const links = items
    .flatMap((contentType) => extractLinks(contentType, items))
    .filter((item, index, self) => {
      return (
        index ===
        self.findIndex((t) => JSON.stringify(t) === JSON.stringify(item))
      );
    });

  return { contentTypes: items, links };
}

function createDiagram(data, output) {
  const { contentTypes, links } = data;

  // Create a new directed graph
  const g = graphviz.digraph("G");
  const fieldColors = new Map();

  // Set graph attributes
  g.set("rankdir", "LR");
  g.set("splines", "polyline");

  contentTypes.forEach((contentType) => {
    g.addNode(contentType.sys.id, { label: contentType.name });
    contentType.fields.forEach((field) => {
      const fieldId = `${contentType.sys.id}.${field.id}`;
      fieldColors.set(fieldId, generateColor());
    });
  });

  // Add content type nodes
  contentTypes.forEach((contentType) => {
    const label = `${contentType.name}\n${contentType.fields
      .map((field) => `${field.id} (${field.type})`)
      .join("\n")}`;

    const node = g.addNode(contentType.sys.id, { label: label, shape: "box" });
    node.set("style", "filled");
    node.set("fillcolor", "lightblue");
    node.set("fontsize", 10);
  });

  // Add links between content types
  links.forEach((link) => {
    if (link.target) {
      const color = fieldColors.get(`${link.source}.${link.fieldId}`);
      const fieldLabel = link.fieldName;
      g.addEdge(link.source, link.target, {
        color,
        label: fieldLabel,
        samehead: true,
      });
    }
  });

  // Generate and save the Graphviz DOT file
  return g.to_dot();
}

async function main() {
  const data = await fetchContentTypes();
  const output = createDiagram(data);
  console.log(output);
}

main();