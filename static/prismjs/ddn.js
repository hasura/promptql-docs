Prism.languages.ddn = {
  comment: {
    pattern: /#.*/,
    greedy: true,
    alias: 'comment',
  },
  'shell-command': {
    // Common bash/sh command patterns like echo, mkdir, cat, grep, etc.
    pattern:
      /\b(?:echo|cat|ls|cd|mkdir|rm|cp|mv|grep|find|sed|awk|curl|wget|ssh|tar|git|docker|npm|yarn|export|source|sudo|touch|chmod|chown)\b/,
    alias: 'keyword',
  },
  cli: {
    pattern: /\bddn\b/,
    alias: 'keyword',
  },
  flag: {
    pattern: /--?[\w-]+/,
    alias: 'attr-name',
  },
  // Specific argument types first
  path: {
    // Optional ./ ../ / prefix, segments with word chars/hyphens, optional extension
    pattern: /(?:\.\.?\/|\/)?(?:[\w-]+(?:\/[\w-]+)*)(?:\.\w+)?/,
    greedy: true, // Match longest path first
    alias: 'string',
  },
  'connector-type': {
    pattern: /\b\w+\/\w+\b/, // e.g., hasura/postgres
    alias: 'class-name',
  },
  'versioned-name': {
    // e.g., globals:c15b0b4031 or subgraph:version
    pattern: /\b[a-zA-Z_][\w-]*:[a-zA-Z0-9][\w-]*\b/,
    alias: 'namespace',
  },
  'key-value': {
    // e.g. key=value used in --env flag
    pattern: /\b\w+=\S+/,
    alias: 'property',
  },
  number: {
    pattern: /\b\d+\b/,
    alias: 'number',
  },
  // Subcommands before general arguments
  subcommand: {
    // List all known subcommand parts from filenames + common ones
    pattern:
      /\b(?:project|command|connector|connector-link|model|relationship|subgraph|supergraph|auth|codemod|changelog|completion|console|context|help|plugins|run|update-cli|version|init|add|list|remove|show|update|bash|fish|powershell|zsh|generate-promptql-secret-key|login|upgrade-context-v2-to-v3|upgrade-graphqlconfig-aggregate|upgrade-graphqlconfig-subscriptions|upgrade-model-v1-to-v2|upgrade-object-boolean-expression-types|upgrade-project-config-v2-to-v3|upgrade-supergraph-config-v1-to-v2|create-context|get-context|get-current-context|get|set-current-context|set|unset|doctor|build|delete|diff|local|set-self-hosted-engine-url|prune|apply|create|env|introspect|plugin|setenv|show-resources|add-resources|install|uninstall|upgrade|set-api-access-mode|logs)\b/,
    alias: 'function',
  },
  // General argument should be last
  argument: {
    pattern: /\b[a-zA-Z_][\w-]*\b/, // Allows leading underscore
    alias: 'variable',
  },
};
