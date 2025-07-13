import { Box, Flex, Text } from "@radix-ui/themes";
import { ProgressBar } from "../progressBar";

type StepIndicatorProps = {
  /** Current step (1-based index) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Label for the current step indicator */
  stepLabel?: string;
  /** Label for the completion percentage */
  completionLabel?: string;
  /** Show percentage completion */
  showPercentage?: boolean;
  /** Show step counter */
  showStepCounter?: boolean;
  /** Margin bottom for the entire component */
  mb?: string;
};

export const StepIndicator = ({
  currentStep,
  totalSteps,
  stepLabel = "Question",
  completionLabel = "Complete",
  showPercentage = true,
  showStepCounter = true,
  mb = "6",
}: StepIndicatorProps) => {
  const progress = (currentStep / totalSteps) * 100;
  const roundedProgress = Math.round(progress);

  return (
    <Box mb={mb}>
      {(showStepCounter || showPercentage) && (
        <Flex justify="between" align="center" mb="2">
          {showStepCounter && (
            <Text size="2" color="gray">
              {stepLabel} {currentStep} of {totalSteps}
            </Text>
          )}
          {showPercentage && (
            <Text size="2" color="gray">
              {roundedProgress}% {completionLabel}
            </Text>
          )}
        </Flex>
      )}
      <ProgressBar progress={progress} />
    </Box>
  );
};

export default StepIndicator;
