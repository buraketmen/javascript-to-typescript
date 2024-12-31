# JS ⇄ TS Converter

A modern, fast, and easy-to-use online converter that transforms JavaScript code to TypeScript and vice versa. Built with Next.js and powered by AST transformation.

## Features

- [x] Bidirectional conversion between JavaScript and TypeScript
- [x] Smart type inference for JavaScript to TypeScript conversion
- [x] Clean TypeScript to JavaScript conversion with proper type removal
- [x] Modern and responsive UI with dark mode
- [x] Real-time conversion
- [x] One-click code copying

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **AST Transformation**: [@babel/parser](https://babeljs.io/docs/babel-parser)
- **Font**: [Geist](https://vercel.com/font)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/buraketmen/javascript-to-typescript.git
   cd javascript-to-typescript
   ```

2. Install dependencies:

```bash
npm install

# or
yarn install

# or
pnpm install
```

3. Run the development server:

```bash
npm run dev

# or
yarn dev

# or
pnpm dev

```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

- **JS to TS**: The converter analyzes your JavaScript code using Babel's parser and traverses the AST to infer types based on usage patterns and values.
- **TS to JS**: TypeScript code is parsed and all type annotations are carefully removed while preserving the runtime behavior of your code.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.
