# tree-sitter-mako

Treesitter parser for mako templates. There are a few things I'd like to do to
tidy up, but I've been using this in Neovim for a while now.

- There's a highlighting issue with the opening bracket of the first HTML tag
that occurs after a Mako block sometimes. But with scrolling it goes away. So
I'm not sure if the bug is with highlighting, or external to this project.

- For user-defined blocks, I'm not currently checking to make sure the end tag
matches the start tag.

Here is the bash script I currently use to get this installed into my local
Neovim. It's a nice tight loop for local development so I can iterate quickly.
Sounds like there are better ways to distribute it to the general public
though. I needed to `sudo apt install libtree-sitter-dev` to develop locally.
It installs a required header file for `scanner.c` if nothing else.

```
#!/bin/bash
set -e
cd $HOME/Code/github/sbaldasty/tree-sitter-mako
tspath="$HOME/.local/share/nvim/site/pack/packer/start/nvim-treesitter"

while true; do
  echo "[1] Edit grammar.js"
  echo "[2] Edit highlights.scm"
  echo "[3] Edit injections.scm"
  echo "[4] Edit scanner.c"

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
      editpath="src/scanner.c"
      ;;
  esac

  nvim $editpath
  tree-sitter generate
  gcc -o $tspath/parser/mako.so -shared -fPIC src/parser.c src/scanner.c
  cp queries/highlights.scm $tspath/queries/mako/
  cp queries/injections.scm $tspath/queries/mako/
  nvim /path/to/test/file.mako
done
```
