#include <tree_sitter/parser.h>
#include <wctype.h>

enum TokenType {
  PYTHON_CODE,
};

void *tree_sitter_mako_external_scanner_create() {
  return NULL;
}

void tree_sitter_mako_external_scanner_destroy(void *payload) {
  // Nothing to destroy
}

unsigned tree_sitter_mako_external_scanner_serialize(
  void *payload,
  char *buffer
) {
  return 0; // No state to serialize
}

void tree_sitter_mako_external_scanner_deserialize(
  void *payload,
  const char *buffer,
  unsigned length
) {
  // No state to deserialize
}

bool tree_sitter_mako_external_scanner_scan(
  void *payload,
  TSLexer *lexer,
  const bool *valid_symbols
) {
  if (valid_symbols[PYTHON_CODE]) {
    // Scan for content until we hit "%>"
    while (lexer->lookahead != 0) {
      if (lexer->lookahead == '%') {
        // Mark current position in case we need to backtrack
        lexer->mark_end(lexer);
        lexer->advance(lexer, false);
        
        if (lexer->lookahead == '>') {
          // Found "%>" - end of Python content
          // The mark_end() call above marked the position before the '%'
          lexer->result_symbol = PYTHON_CODE;
          return true;
        }
        // If not '>', continue scanning (the '%' becomes part of content)
      } else {
        lexer->advance(lexer, false);
      }
    }
    
    // Reached EOF - return whatever content we found
    lexer->mark_end(lexer);
    lexer->result_symbol = PYTHON_CODE;
    return true;
  }
  
  return false;
}
