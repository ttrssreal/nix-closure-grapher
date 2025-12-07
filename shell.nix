{
  mkShell,
  nodejs_24,
  typescript,
  prettier,
  python3,
}:

mkShell {
  packages = [
    nodejs_24
    typescript
    prettier
    (python3.withPackages (pkgs: with pkgs; [
      humanize
    ]))
  ];
}
