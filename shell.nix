{
  mkShell,
  nodejs_24,
  typescript,
  prettier,
}:

mkShell {
  packages = [
    nodejs_24
    typescript
    prettier
  ];
}
