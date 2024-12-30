"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { CodeEditor } from "@/components/CodeEditor";
import { ConversionToggle } from "@/components/ConversionToggle";
import { convertJsToTs, convertTsToJs } from "@/lib/code-converter";

const DEFAULT_JS_CODE = `function greet(name, age) {
  return "Hello, " + name + "! You are " + age + " years old.";
}

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  sayHello() {
    return \`Hello, I'm \${this.name}\`;
  }
}

const person = new Person("John", 25);
`;

const DEFAULT_TS_CODE = `interface Person {
  name: string;
  age: number;
  sayHello(): string;
}

function greet(name: string, age: number): string {
  return "Hello, " + name + "! You are " + age + " years old.";
}

const numbers: number[] = [1, 2, 3, 4, 5];
const doubled: number[] = numbers.map((n: number): number => n * 2);

class PersonImpl implements Person {
  constructor(public name: string, public age: number) {}

  sayHello(): string {
    return \`Hello, I'm \${this.name}\`;
  }
}

const person: Person = new PersonImpl("John", 25);
`;

export default function Home() {
  const [leftCode, setLeftCode] = useState<string>(DEFAULT_JS_CODE);
  const [rightCode, setRightCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isJsToTs, setIsJsToTs] = useState<boolean>(true);

  const handleConversion = useCallback((code: string) => {
    try {
      setError(null);
      const convertedCode = isJsToTs ? convertJsToTs(code) : convertTsToJs(code);
      setRightCode(convertedCode);
    } catch (error) {
      console.error("Error converting code:", error);
      setError("Error converting code. Please check your syntax.");
      setRightCode("// Conversion error occurred");
    }
  }, [isJsToTs]);

  const handleToggleDirection = useCallback(() => {
    setIsJsToTs(!isJsToTs);
    // Swap the code between editors
    setLeftCode(rightCode);
    setRightCode(leftCode);
  }, [isJsToTs, leftCode, rightCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rightCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setError("Failed to copy to clipboard");
    }
  };

  // Initial conversion
  useEffect(() => {
    handleConversion(leftCode);
  }, [handleConversion, leftCode]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl w-full mx-auto space-y-6 sm:space-y-8">
        <a
          href="https://github.com/buraketmen/javascript-to-typescript"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 text-gray-400 hover:text-gray-300 transition-colors"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </motion.div>
        </a>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-50 mb-3 sm:mb-4">
            {isJsToTs ? "JavaScript to TypeScript" : "TypeScript to JavaScript"} Converter
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
            Write {isJsToTs ? "JavaScript" : "TypeScript"} code on the left, 
            get {isJsToTs ? "TypeScript" : "JavaScript"} code on the right
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-950/30 border border-red-900/30 text-red-400 px-4 py-2 rounded-lg text-sm max-w-2xl mx-auto"
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 relative">
          <CodeEditor
            title={isJsToTs ? "JavaScript" : "TypeScript"}
            code={leftCode}
            language={isJsToTs ? "javascript" : "typescript"}
            onCodeChange={(value) => {
              setLeftCode(value);
              handleConversion(value);
            }}
            actions={
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const defaultCode = isJsToTs ? DEFAULT_JS_CODE : DEFAULT_TS_CODE;
                  setLeftCode(defaultCode);
                  handleConversion(defaultCode);
                }}
                className="text-xs bg-gray-800 hover:bg-gray-700 active:bg-gray-800 text-gray-300 px-2 py-1 rounded transition-all duration-150 ease-in-out"
              >
                Reset Example
              </motion.button>
            }
          />

          <ConversionToggle isJsToTs={isJsToTs} onToggle={handleToggleDirection} />

          <CodeEditor
            title={isJsToTs ? "TypeScript" : "JavaScript"}
            code={rightCode}
            language={isJsToTs ? "typescript" : "javascript"}
            readOnly
            actions={
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="text-xs bg-blue-900 hover:bg-blue-800 active:bg-blue-900 text-blue-100 px-2 py-1 rounded transition-all duration-150 ease-in-out flex items-center gap-1"
              >
                {copySuccess ? (
                  <>
                    <span>Copied!</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                ) : (
                  `Copy ${isJsToTs ? "TypeScript" : "JavaScript"}`
                )}
              </motion.button>
            }
          />
        </div>
      </div>
    </main>
  );
}

