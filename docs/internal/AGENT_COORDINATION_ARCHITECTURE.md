# AGENT COORDINATION ARCHITECTURE

## Hierarchy

- Orchestrator Agent: Coordinates sequence, merges results
- Parser Agents (5): JSX, TS, Tailwind, Token, Import Graph — work in parallel on file list
- Rendering Agent (1): Playwright DOM extraction
- Analysis Agents (6): Typography, Layout, Animation, Cognitive, CTA, Scoring — sequential
- Audit Agent (1): False positive validation

## Isolation

- Each parser agent receives a file list and returns violations[].
- No agent modifies project files.
- No agent communicates with another directly.
- Merge happens in index.js orchestrator only.

## Merge Protocol

1. Collect all violations from all agents
2. Deduplicate by (rule + file + line)
3. Sort by severity (error first)
4. Compute score
5. Return unified report
