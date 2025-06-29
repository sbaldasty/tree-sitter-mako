# tree-sitter-mako

Treesitter parser for mako templates. UNDER CONSTRUCTION, DO NOT USE YET!

Here is the bash script I currently use to get this installed into my local Neovim. Tight loop for local development. Sounds like there are better ways to do it I can explore later once it's finished.

```
#!/bin/bash
set -e
cd $HOME/Code/github/sbaldasty/tree-sitter-mako
tspath="$HOME/.local/share/nvim/site/pack/packer/start/nvim-treesitter"

while true; do
  echo "[1] Edit grammar.js [2] Edit highlights.scm [3] Edit injections.scm [4] Quit: "
  read -r choice
  case "$choice" in
    1)
      editpath="grammar.js"
      ;;
    2)
      editpath="queries/highlights.scm"
      ;;
    3)
      editpath="queries/injections.scm"
      ;;
    4)
      exit 0
      ;;
  esac

  nvim $editpath
  tree-sitter generate
  gcc -o $tspath/parser/mako.so -shared -fPIC src/parser.c
  cp queries/highlights.scm $tspath/queries/mako/
  cp queries/injections.scm $tspath/queries/mako/
  nvim $HOME/Code/github/sbaldasty/bitflippin.com/article/membership-inference.mako
done
```
