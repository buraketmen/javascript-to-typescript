import traverse, { NodePath } from "@babel/traverse";
import { Node, File, Expression } from "@babel/types";
import * as t from "@babel/types";

type TSNodeType = 
  | "TSTypeAnnotation"
  | "TSTypeParameterDeclaration"
  | "TSTypeParameter"
  | "TSPropertySignature"
  | "TSTypeLiteral"
  | "TSInterfaceDeclaration"
  | "TSTypeAliasDeclaration"
  | "TSEnumDeclaration"
  | "TSModuleDeclaration"
  | "TSTypeReference"
  | "TSQualifiedName"
  | "TSCallSignatureDeclaration"
  | "TSConstructSignatureDeclaration"
  | "TSIndexSignature"
  | "TSMethodSignature"
  | "TSTypeParameterInstantiation"
  | "TSTypeQuery"
  | "TSTypePredicate"
  | "TSTypeOperator"
  | "TSIndexedAccessType"
  | "TSMappedType"
  | "TSLiteralType"
  | "TSExpressionWithTypeArguments"
  | "TSImportType"
  | "TSIntersectionType"
  | "TSUnionType"
  | "TSOptionalType"
  | "TSRestType"
  | "TSTupleType"
  | "TSNamedTupleMember";

type TSExpressionNodeType =
  | "TSAsExpression"
  | "TSTypeAssertion"
  | "TSNonNullExpression"
  | "TSInstantiationExpression";

// TypeScript node types that should be removed
const TYPES_TO_REMOVE: readonly TSNodeType[] = [
  "TSTypeAnnotation",
  "TSTypeParameterDeclaration",
  "TSTypeParameter",
  "TSPropertySignature",
  "TSTypeLiteral",
  "TSInterfaceDeclaration",
  "TSTypeAliasDeclaration",
  "TSEnumDeclaration",
  "TSModuleDeclaration",
  "TSTypeReference",
  "TSQualifiedName",
  "TSCallSignatureDeclaration",
  "TSConstructSignatureDeclaration",
  "TSIndexSignature",
  "TSMethodSignature",
  "TSTypeParameterInstantiation",
  "TSTypeQuery",
  "TSTypePredicate",
  "TSTypeOperator",
  "TSIndexedAccessType",
  "TSMappedType",
  "TSLiteralType",
  "TSExpressionWithTypeArguments",
  "TSImportType",
  "TSIntersectionType",
  "TSUnionType",
  "TSOptionalType",
  "TSRestType",
  "TSTupleType",
  "TSNamedTupleMember"
] as const;

// Nodes that should be replaced with their expression
const TYPES_TO_REPLACE_WITH_EXPRESSION: readonly TSExpressionNodeType[] = [
  "TSAsExpression",
  "TSTypeAssertion",
  "TSNonNullExpression",
  "TSInstantiationExpression"
] as const;

type NodeWithExpression = Node & {
  expression: Expression;
};

export const removeTypeAnnotations = (ast: File): void => {
  traverse(ast, {
    enter(path: NodePath<Node>) {
      // Remove type nodes
      if (TYPES_TO_REMOVE.includes(path.node.type as TSNodeType)) {
        path.remove();
        return;
      }

      // Replace nodes with their expression
      if (
        TYPES_TO_REPLACE_WITH_EXPRESSION.includes(path.node.type as TSExpressionNodeType) && 
        'expression' in path.node &&
        t.isExpression((path.node as NodeWithExpression).expression)
      ) {
        path.replaceWith((path.node as NodeWithExpression).expression);
        return;
      }

      // Handle parameter properties in constructor
      if (
        path.node.type === "TSParameterProperty" && 
        'parameter' in path.node && 
        t.isIdentifier(path.node.parameter)
      ) {
        path.replaceWith(path.node.parameter);
        return;
      }

      // Remove declare keywords
      if (path.node.type === "DeclareModule" || path.node.type === "DeclareFunction" || path.node.type === "DeclareClass") {
        path.remove();
      }
    },

    // Clean up empty statements at the end
    Program: {
      exit(path) {
        path.traverse({
          EmptyStatement: innerPath => innerPath.remove()
        });
      }
    }
  });
}; 