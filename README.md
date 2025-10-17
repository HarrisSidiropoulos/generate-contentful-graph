# Contentful Content Type Dependency Graph

This Node.js script generates a Graphviz diagram of the relationships between Contentful content types, based on their fields and links to other content types.

## Installation

Install globally via npm:

```bash
npm install -g generate-contentful-graph
```

## Usage

To run the script, set your Contentful credentials as environment variables and execute the command:

```bash
SPACE_ID={CONTENTFUL_SPACE_ID} ENVIRONMENT={CONTENTFUL_ENVIRONMENT_ID} CONTENT_DELIVERY_ACCESS_TOKEN={CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN} npx generate-contentful-graph
```

> **Tip**: You can also use a `.env` file to store your credentials. The script will automatically load environment variables from a `.env` file in your project root.

The script will retrieve the content types from your Contentful space and environment, examine their fields and links, and produce a Graphviz diagram in DOT format. The DOT output will be displayed in the console.

You can save the DOT output to a file by redirecting it to a file, like so:

```bash
SPACE_ID={CONTENTFUL_SPACE_ID} ENVIRONMENT={CONTENTFUL_ENVIRONMENT_ID} CONTENT_DELIVERY_ACCESS_TOKEN={CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN} npx generate-contentful-graph > diagram.dot
```

Alternatively, you can use Graphviz's command-line tools to transform it into an image file, such as a PNG or PDF. For instance, to render the diagram as a PNG file, run the following command:

```bash
SPACE_ID={CONTENTFUL_SPACE_ID} ENVIRONMENT={CONTENTFUL_ENVIRONMENT_ID} CONTENT_DELIVERY_ACCESS_TOKEN={CONTENTFUL_CONTENT_DELIVERY_API_ACCESS_TOKEN} npx generate-contentful-graph | dot -Tsvg -o diagram.svg
```

## Releasing (Automated with Release Please)

The project uses [Release Please](https://github.com/googleapis/release-please) to automate releases and semantic versioning. This provides a more robust release process with automatic changelog generation and better conventional commit support.

### How it works

1. **Conventional Commits**: When you push commits to `main` that follow [Conventional Commits](https://www.conventionalcommits.org/), Release Please will automatically create or update a release pull request.

2. **Release PR**: The release PR will:

   - Update the version in `package.json` based on the conventional commits
   - Generate or update the `CHANGELOG.md` with all changes since the last release
   - Show exactly what will be released

3. **Automatic Publishing**: When you merge the release PR, the package will be automatically published to npm.

### Conventional Commit Examples

```
feat: add color legend                    =>  minor bump (x.Y.z)
feat(parser): rewrite to support locale   =>  minor bump (x.Y.z)
feat!: rewrite parser with breaking API   =>  major bump (X.y.z)
feat(api)!: change response format        =>  major bump (X.y.z)
fix: correct null handling                =>  patch bump (x.y.Z)
fix(parser): handle locale edge cases     =>  patch bump (x.y.Z)
fix!: remove deprecated endpoint          =>  major bump (X.y.z)
chore: update documentation               =>  no release
chore(deps): update dependencies          =>  no release
docs: fix typo in README                  =>  no release

# Breaking changes can also be indicated in the body:
feat(parser): add locale support

BREAKING CHANGE: This changes the output format
```

### Release Process

1. Make changes using conventional commit messages
2. Push to `main` branch
3. Release Please will create/update a release PR automatically
4. Review the generated changelog and version bump in the PR
5. Merge the release PR to trigger the actual release and npm publish

No manual version bumping or changelog maintenance required!
