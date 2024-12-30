import * as t from "@babel/types";
import { NodePath } from "@babel/traverse";
import { Node } from "@babel/types";

export const inferType = (value: Node, path: NodePath): t.TSType => {
  if (t.isNumericLiteral(value)) {
    return t.tsNumberKeyword();
  }
  if (t.isStringLiteral(value)) {
    return t.tsStringKeyword();
  }
  if (t.isBooleanLiteral(value)) {
    return t.tsBooleanKeyword();
  }
  if (t.isArrayExpression(value)) {
    const elementTypes = value.elements.map((el) => {
      if (!el) return t.tsUnknownKeyword();
      if (t.isSpreadElement(el)) return t.tsUnknownKeyword();
      return inferType(el, path);
    });
    const firstType = elementTypes[0] || t.tsUnknownKeyword();
    const allSameType = elementTypes.every((type) => 
      type.type === firstType.type
    );
    return t.tsArrayType(allSameType ? firstType : t.tsUnknownKeyword());
  }
  if (t.isObjectExpression(value)) {
    const properties = value.properties
      .map((prop) => {
        if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
          return t.tsPropertySignature(
            t.identifier(prop.key.name),
            t.tsTypeAnnotation(inferType(prop.value, path))
          );
        }
        return null;
      })
      .filter((prop): prop is t.TSPropertySignature => prop !== null);
    return t.tsTypeLiteral(properties);
  }
  if (t.isArrowFunctionExpression(value) || t.isFunctionExpression(value)) {
    const params = value.params.map(() => t.identifier("param"));
    return t.tsFunctionType(
      t.tsTypeParameterDeclaration([]),
      params,
      t.tsTypeAnnotation(t.tsUnknownKeyword())
    );
  }
  return t.tsUnknownKeyword();
}; 