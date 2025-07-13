import { Box } from "@radix-ui/themes";

type ProgressBarProps = {
  /** Current progress value (0-100) */
  progress: number;
};

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <Box
      width="100%"
      height="4px"
      style={{
        backgroundColor: "var(--gray-4)",
        borderRadius: "var(--radius-1)",
        overflow: "hidden",
      }}
    >
      <Box
        height="100%"
        style={{
          width: `${clampedProgress}%`,
          backgroundColor: "var(--secondary-accent)",
          transition: `width var(--transition-slow)`,
        }}
      />
    </Box>
  );
};

export default ProgressBar;
