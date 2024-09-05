import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const TextField = ({ id, label, ...props }) => {
  return (
    <>
      <div className="w-1/3 flex flex-col gap-3 my-2">
        {label && <Label htmlFor={id} className="w-full">{label} </Label>}
        <Input id={id} {...props} className="w-full rounded-lg border-mycolor border-2" />
      </div>
    </>
  );
};

export { TextField };
