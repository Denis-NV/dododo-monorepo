import { Button, Text } from "@radix-ui/themes";

type Props = {};
const StepForm = (props: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <Text>Hello from Radix Themes :)</Text>
      <button>Simlpe Button</button>
      <Button type="button">Radix Button</Button>
    </div>
  );
};
export default StepForm;
