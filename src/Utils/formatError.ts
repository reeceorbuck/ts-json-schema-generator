import * as path from "https://deno.land/std@0.138.0/path/mod.ts";
import ts from "../tsAdapter.ts";

import { BaseError } from "../Error/BaseError.ts";
import { DiagnosticError } from "../Error/DiagnosticError.ts";
import { UnknownNodeError } from "../Error/UnknownNodeError.ts";

function getNodeLocation(node: ts.Node): [string, number, number] {
  const sourceFile = node.getSourceFile();
  if (!sourceFile) {
    return ["<unknown file>", 0, 0];
  }

  const lineAndChar: ts.LineAndCharacter = ts.getLineAndCharacterOfPosition(
    sourceFile,
    node.getStart(sourceFile),
  );
  return [sourceFile.fileName, lineAndChar.line + 1, lineAndChar.character];
}

export function formatError(error: BaseError): string {
  if (error instanceof DiagnosticError) {
    const rootDir: string = Deno.cwd().split(path.sep)[0] || "/";
    return ts.formatDiagnostics(error.getDiagnostics(), {
      getCanonicalFileName: (fileName: string) => fileName,
      getCurrentDirectory: () => rootDir,
      getNewLine: () => "\n",
    });
  } else if (error instanceof UnknownNodeError) {
    const unknownNode: ts.Node = error.getReference() || error.getNode();
    const nodeFullText: string = unknownNode.getFullText().trim().split("\n")[0]
      .trim();
    const [sourceFile, lineNumber, charPos]: [string, number, number] =
      getNodeLocation(unknownNode);
    return (
      `${error.name}: Unknown node "${nodeFullText}" (ts.SyntaxKind = ${error.getNode().kind}) ` +
      `at ${sourceFile}(${lineNumber},${charPos})\n`
    );
  }

  return `${error.name}: ${error.message}\n`;
}
