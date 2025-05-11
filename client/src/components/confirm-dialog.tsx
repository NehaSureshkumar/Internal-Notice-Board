import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface GlobalConfirmProps {
  open?: boolean;
  props?: ConfirmDialogProps;
}

// Create a global event system for the confirm dialog
let globalConfirmProps: GlobalConfirmProps = {};
const subscribers: ((props: GlobalConfirmProps) => void)[] = [];

export function confirmDialog(props: ConfirmDialogProps): Promise<boolean> {
  return new Promise((resolve) => {
    const onConfirm = () => {
      props.onConfirm();
      resolve(true);
    };
    
    const onCancel = () => {
      props.onCancel();
      resolve(false);
    };
    
    globalConfirmProps = {
      open: true,
      props: { ...props, onConfirm, onCancel },
    };
    
    subscribers.forEach((subscriber) => subscriber(globalConfirmProps));
  });
}

export function ConfirmDialog(props?: ConfirmDialogProps) {
  const [dialogProps, setDialogProps] = useState<ConfirmDialogProps | undefined>(props);
  const [open, setOpen] = useState(false);

  // Subscribe to global confirm dialog events
  useEffect(() => {
    const handleConfirmDialog = (props: GlobalConfirmProps) => {
      if (props.open && props.props) {
        setDialogProps(props.props);
        setOpen(true);
      }
    };

    subscribers.push(handleConfirmDialog);
    return () => {
      const index = subscribers.indexOf(handleConfirmDialog);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  }, []);

  if (!dialogProps) return null;

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && dialogProps.onCancel) {
      dialogProps.onCancel();
    }
  };

  const {
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
  } = dialogProps;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
