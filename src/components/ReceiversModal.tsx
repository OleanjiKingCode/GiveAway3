import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export const ReceiversModal = ({
  isOpen,
  onClose,
  data,
}: {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={isOpen} modal onOpenChange={onClose}>
      <DialogContent className="text-black bg-white outline-none">
        <DialogHeader>
          <DialogTitle>Receivers List</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          {data?.map((person: any, i: number) => (
            <p key={i} className="text-base mb-1">
              <span className="font-semibold">{i + 1}</span> {person}
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
