# Contentful Content Type Dependency Graph
This Node.js script generates a Graphviz diagram of the relationships between Contentful content types, based on their fields and links to other content types.

Usage
To run the script, open your terminal or command prompt and navigate to the project directory. Then, run the following command:

```bash
SPACE_ID={CONTENTFUL_SPACE_ID} ENVIRONMENT_ID={CONTENTFUL_ENVIRONMENT_ID} ACCESS_TOKEN={CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN} npx generate-contentful-graph
```

The script will retrieve the content types from your Contentful space and environment, examine their fields and links, and produce a Graphviz diagram in DOT format. The DOT output will be displayed in the console.

You can save the DOT output to a file by redirecting it to a file, like so:

```bash
SPACE_ID={CONTENTFUL_SPACE_ID} ENVIRONMENT_ID={CONTENTFUL_ENVIRONMENT_ID} ACCESS_TOKEN={CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN} npx generate-contentful-graph > diagram.dot
```

Alternatively, you can use Graphviz's command-line tools to transform it into an image file, such as a PNG or PDF. For instance, to render the diagram as a PNG file, run the following command:

```bash
SPACE_ID={CONTENTFUL_SPACE_ID} ENVIRONMENT_ID={CONTENTFUL_ENVIRONMENT_ID} ACCESS_TOKEN={CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN} npx generate-contentful-graph | dot -Tsvg -o diagram.svg
```