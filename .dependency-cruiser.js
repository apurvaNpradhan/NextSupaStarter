module.exports = {
  forbidden: [
    {
      name: "no-feature-cross-import",
      from: { path: "^src/features/([^/]+)/" },
      to: { path: "^src/features/(?!\\1)[^/]+/" },
      comment: "Features cannot import from other features",
    },
    {
      name: "no-services-to-components",
      from: { path: "^src/features/.*/services/" },
      to: { path: "^src/features/.*/components/" },
      comment: "Services cannot import from components",
    },
    {
      name: "no-shared-to-features",
      from: { path: "^src/shared/" },
      to: { path: "^src/features/" },
      comment: "Shared cannot import from features",
    },
  ],
  options: { doNotFollow: { path: "node_modules" } },
}
