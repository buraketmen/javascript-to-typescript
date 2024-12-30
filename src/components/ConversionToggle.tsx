import { motion } from "framer-motion";

interface ConversionToggleProps {
  isJsToTs: boolean;
  onToggle: () => void;
}

export function ConversionToggle({ isJsToTs, onToggle }: ConversionToggleProps) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 
                   rounded-full p-3 shadow-lg transition-colors duration-150"
      >
        <motion.div
          animate={{ rotate: isJsToTs ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </motion.div>
      </motion.button>
    </div>
  );
} 