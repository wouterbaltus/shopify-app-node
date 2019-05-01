const fs = require('fs');
const parser = require('@babel/parser').parse;
const parseExpression = require('@babel/parser').parseExpression;
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const prettier = require('prettier');
const pathOr = require('ramda/src/pathOr');


const addMiddleware = (filetoWrite, middleware) => {
  const fileLocation = filetoWrite
  const file = fs.readFileSync(fileLocation).toString();
  const ast = parser(file, { sourceType: 'module' });

  let lastServer;

  // Traverse the AST to find the nodes we need.
  traverse(ast, {
    ImportDeclaration(path) {
      lastImport = path;
    },

    ExpressionStatement(path) {
      if (
        path.node.expression &&
        path.node.expression.callee &&
        path.node.expression.callee.object &&
        path.node.expression.callee.property &&
        path.node.expression.callee.object.name == 'server' &&
        path.node.expression.callee.property.name == 'use'
      ) {
        lastServer = path;
      }
    },
  })

  const code = middleware
  lastServer.insertAfter(parseExpression(code));

  const newCode = generate(ast).code

  const prettifiedCode = prettier.format(newCode, { parser: 'babel' })
  fs.writeFile('transformed.js', prettifiedCode, (err) => {
    if (err) throw new Error(`${err}`)
  });
};

module.exports = addMiddleware;
