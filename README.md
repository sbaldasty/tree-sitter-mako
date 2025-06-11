# tree-sitter-mako

Treesitter parser for mako templates. UNDER CONSTRUCTION, DO NOT USE YET!

Here is the bash script I currently use to get this installed into my local Neovim. Sounds like there are better ways to do it I can explore later once it's finished.

```
#!/bin/bash
set -e
cd $HOME/Code/github/sbaldasty/tree-sitter-mako
tree-sitter generate
gcc -o $HOME/.local/share/nvim/site/pack/packer/start/nvim-treesitter/parser/mako.so -shared -fPIC src/parser.c
cp queries/highlights.scm $HOME/.config/nvim/queries/mako/
```
