import { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toast.jsx';
import { useToast } from './use-toast';

export const Toaster = () => {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="right">
      <ToastViewport />
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="flex w-full items-start gap-3">
            <div className="flex flex-1 flex-col gap-1">
              {title ? <ToastTitle>{title}</ToastTitle> : null}
              {description ? <ToastDescription>{description}</ToastDescription> : null}
            </div>
            {action ?? <ToastAction altText="Dismiss">Dismiss</ToastAction>}
          </div>
          <ToastClose />
        </Toast>
      ))}
    </ToastProvider>
  );
};
