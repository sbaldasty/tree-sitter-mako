import XCTest
import SwiftTreeSitter
import TreeSitterMako

final class TreeSitterMakoTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_mako())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Mako grammar")
    }
}
