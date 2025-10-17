#!/usr/bin/env node

import assert from "node:assert/strict";
import contentful from "contentful";
import graphviz from "graphviz";
import * as dotenv from "dotenv";

dotenv.config();

const {
  SPACE_ID = "",
  ENVIRONMENT = "",
  CONTENT_DELIVERY_ACCESS_TOKEN = "",
} = process.env;

assert(SPACE_ID, "Contentful SPACE_ID is required");
assert(ENVIRONMENT, "Contentful ENVIRONMENT is required");
assert(
  CONTENT_DELIVERY_ACCESS_TOKEN,
  "Contentful CONTENT_DELIVERY_ACCESS_TOKEN is required"
);

function generateColor(index = 0) {
  const colors = [
    "#e6194B",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#42d4f4",
    "#f032e6",
    "#bfef45",
    "#fabebe",
    "#469990",
    "#e6beff",
    "#9A6324",
    "#fffac8",
    "#800000",
    "#aaffc3",
    "#808000",
    "#ffd8b1",
    "#000075",
    "#a9a9a9",
    "#000000",
  ];
  return colors[index % colors.length];
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
          target: field.validations?.find((v) => v.linkContentType)
            ?.linkContentType[0],
          fieldId: field.id,
          fieldName: field.name,
        };
      } else if (field.type === "Array" && field.items.linkType === "Entry") {
        return field.items.validations
          ?.find((v) => v.linkContentType)
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
    if (!targetContentType) {
      console.log(`Could not find content type ${link.target}`);
      return;
    }

    extractLinks(targetContentType, items, links, visited);
  });

  return links;
}

async function fetchContentTypes() {
  const client = contentful.createClient({
    space: SPACE_ID,
    environment: ENVIRONMENT,
    accessToken: CONTENT_DELIVERY_ACCESS_TOKEN,
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

function createDiagram(data) {
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
      fieldColors.set(fieldId, generateColor(fieldColors.size));
    });
  });

  // Add content type nodes
  contentTypes.forEach((contentType) => {
    const label = `${contentType.name}\n ${"-".repeat(
      contentType.name.length
    )} \n${contentType.fields
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
        fontsize: 8,
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
