{
  lib,
  buildNpmPackage,
  nix-update-script,
  typescript,
}:

buildNpmPackage {
  name = "nix-closure-grapher";

  src = ./.;

  npmDepsHash = "sha256-JhydQaRVw3E2H5DhN8jxs9C8DrFa6msuwLhpU2dz6sk=";

  nativeBuildInputs = [
    typescript
  ];

  installPhase = ''
    mkdir -p "$out"
    cp -r dist/* "$out"
  '';

  passthru.updateScript = nix-update-script { };

  meta = {
    description = "Nix closure grapher";
    homepage = "https://github.com/ttrssreal/nix-closure-grapher";
    maintainers = with lib.maintainers; [ jess ];
  };
}
