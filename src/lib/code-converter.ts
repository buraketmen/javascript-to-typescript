import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { inferType } from "./type-inference";
import { removeTypeAnnotations } from "./type-removal";

export const convertJsToTs = (code: string): string => {
  try {
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx"],
    });

    traverse(ast, {
      VariableDeclarator(path: NodePath<t.VariableDeclarator>) {
        if (path.node.init && t.isIdentifier(path.node.id)) {
          const inferredType = inferType(path.node.init, path);
          path.node.id.typeAnnotation = t.tsTypeAnnotation(inferredType);
        }
      },

      FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
        path.node.params.forEach((param) => {
          if (t.isIdentifier(param)) {
            let paramType: t.TSType = t.tsUnknownKeyword();
            
            path.traverse({
              BinaryExpression(bPath: NodePath<t.BinaryExpression>) {
                if (t.isIdentifier(bPath.node.left) && bPath.node.left.name === param.name) {
                  if (t.isNumericLiteral(bPath.node.right)) {
                    paramType = t.tsNumberKeyword();
                  } else if (t.isStringLiteral(bPath.node.right)) {
                    paramType = t.tsStringKeyword();
                  }
                }
              },
              TemplateLiteral(bPath: NodePath<t.TemplateLiteral>) {
                bPath.node.expressions.forEach((expr) => {
                  if (t.isIdentifier(expr) && expr.name === param.name) {
                    paramType = t.tsStringKeyword();
                  }
                });
              }
            });

            param.typeAnnotation = t.tsTypeAnnotation(paramType);
          }
        });

        let returnType: t.TSType = t.tsUnknownKeyword();
        path.traverse({
          ReturnStatement(rPath: NodePath<t.ReturnStatement>) {
            if (rPath.node.argument) {
              returnType = inferType(rPath.node.argument, rPath);
            }
          },
        });

        path.node.returnType = t.tsTypeAnnotation(returnType);
      },

      ClassDeclaration(path: NodePath<t.ClassDeclaration>) {
        path.traverse({
          ClassProperty(propPath: NodePath<t.ClassProperty>) {
            if (!propPath.node.typeAnnotation && t.isIdentifier(propPath.node.key)) {
              const propertyName = propPath.node.key.name;
              let propertyType: t.TSType = t.tsUnknownKeyword();

              path.traverse({
                AssignmentExpression(assignPath: NodePath<t.AssignmentExpression>) {
                  if (
                    t.isMemberExpression(assignPath.node.left) &&
                    t.isThisExpression(assignPath.node.left.object) &&
                    t.isIdentifier(assignPath.node.left.property) &&
                    assignPath.node.left.property.name === propertyName
                  ) {
                    propertyType = inferType(assignPath.node.right, assignPath);
                  }
                },
              });

              propPath.node.typeAnnotation = t.tsTypeAnnotation(propertyType);
            }
          },
          ClassMethod(methodPath: NodePath<t.ClassMethod>) {
            if (methodPath.node.kind === 'constructor') {
              methodPath.node.params.forEach((param) => {
                if (t.isIdentifier(param)) {
                  let paramType: t.TSType = t.tsUnknownKeyword();
                  methodPath.traverse({
                    AssignmentExpression(assignPath: NodePath<t.AssignmentExpression>) {
                      if (
                        t.isMemberExpression(assignPath.node.left) &&
                        t.isThisExpression(assignPath.node.left.object) &&
                        t.isIdentifier(assignPath.node.right) &&
                        assignPath.node.right.name === param.name
                      ) {
                        paramType = inferType(assignPath.node.right, assignPath);
                      }
                    },
                  });
                  param.typeAnnotation = t.tsTypeAnnotation(paramType);
                }
              });
            } else {
              if (!methodPath.node.returnType) {
                let methodReturnType: t.TSType = t.tsUnknownKeyword();
                methodPath.traverse({
                  ReturnStatement(returnPath: NodePath<t.ReturnStatement>) {
                    if (returnPath.node.argument) {
                      methodReturnType = inferType(returnPath.node.argument, returnPath);
                    }
                  },
                });
                methodPath.node.returnType = t.tsTypeAnnotation(methodReturnType);
              }
            }
          },
        });
      },
    });

    const output = generate(ast, { 
      retainLines: true,
      concise: false,
      jsescOption: { minimal: true } 
    });
    
    return output.code;
  } catch (error) {
    console.error("Error converting to TypeScript:", error);
    throw error;
  }
};

export const convertTsToJs = (code: string): string => {
  try {
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });

    removeTypeAnnotations(ast);

    const output = generate(ast, {
      retainLines: true,
      concise: false,
      jsescOption: { minimal: true }
    });

    return output.code
      .replace(/\/\*\s*:.*?\*\//g, "") // Remove multiline type comments
      .replace(/\/\/\s*:.*$/gm, "") // Remove single line type comments
      .replace(/\n\s*\n\s*\n/g, "\n\n"); // Clean up multiple empty lines
  } catch (error) {
    console.error("Error converting to JavaScript:", error);
    throw error;
  }
}; 