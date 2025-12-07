```
python3 parse-path-info.py -knarSize <(nix path-info -rsS --json ./result 2>/dev/null) > graph.json
npm run serve
```
