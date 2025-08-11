# Contentful Content Type Dependency Graph

This Node.js script generates a Graphviz diagram of the relationships between Contentful content types, based on their fields and links to other content types.

Usage
To run the script, open your terminal or command prompt and navigate to the project directory. Then, run the following command:

```bash
SPACE_ID={CONTENTFUL_SPACE_ID} ENVIRONMENT={CONTENTFUL_ENVIRONMENT_ID} CONTENT_DELIVERY_ACCESS_TOKEN={CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN} npx generate-contentful-graph
```

The script will retrieve the content types from your Contentful space and environment, examine their fields and links, and produce a Graphviz diagram in DOT format. The DOT output will be displayed in the console.

You can save the DOT output to a file by redirecting it to a file, like so:

```bash
SPACE_ID={CONTENTFUL_SPACE_ID} ENVIRONMENT={CONTENTFUL_ENVIRONMENT_ID} CONTENT_DELIVERY_ACCESS_TOKEN={CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN} npx generate-contentful-graph > diagram.dot
```

Alternatively, you can use Graphviz's command-line tools to transform it into an image file, such as a PNG or PDF. For instance, to render the diagram as a PNG file, run the following command:

```bash
SPACE_ID={CONTENTFUL_SPACE_ID} ENVIRONMENT={CONTENTFUL_ENVIRONMENT_ID} CONTENT_DELIVERY_ACCESS_TOKEN={CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN} npx generate-contentful-graph | dot -Tsvg -o diagram.svg
```

## Releasing (Semantic Versioning)

The project uses an automated GitHub Actions workflow to bump the npm package version and publish on pushes to the `main` branch when the latest commit message follows certain Conventional Commit prefixes.

### Triggers

The release logic inspects ONLY the latest commit on `main`:

Commit prefix / pattern -> Bump type:

- `feat!:` or `feat(scope)!:` -> major
- `fix!:` or `fix(scope)!:` -> major
- `feat:` / `feat(scope):` -> minor
- `fix:` / `fix(scope):` -> patch
- Any commit body line starting with `BREAKING CHANGE:` -> major (even without `!`)

If the last commit subject does not start with `feat`, `fix`, or their breaking variants, and there's no `BREAKING CHANGE:` line, the workflow skips versioning & publish.

### Examples

```
feat: add color legend            =>  minor bump (x.Y.z)
feat(parser)!: rewrite to support locales => major bump (X.y.z)
fix: correct null handling        =>  patch bump (x.y.Z)
fix(api)!: remove deprecated endpoint => major
chore: update docs                =>  no release

Commit body including:
BREAKING CHANGE: output format changed => major
```
