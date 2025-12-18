```
python3 parse-path-info.py -knarSize <(nix path-info -rsS --json ./result 2>/dev/null) > graph.json
npm run serve
```

Re-implemented from:
 - https://github.com/lf-/dotfiles/tree/main/programs/nix-closure-graph
 - https://mercurytechnologies.github.io/looking-glass-viewer/
