{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        packages.default = pkgs.mkYarnPackage {
          name = "thelounge";

          src = ./.;

          distPhase = "true";
        };
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            typescript
            yarn
            nodePackages.nodejs
          ];
        };
      });
}
