import { toast } from '../components/ui/use-toast';

export const sendIntroEmail = ({ investorName, startupName }) => {
  toast({
    title: 'Intro email sent',
    description: `Introduced ${investorName} to ${startupName}.`,
    variant: 'success',
  });
};

export const sendFounderDashboard = ({
  recipientName,
  dashboardUrl = 'https://launch-and-lift.demo/founder/dashboard',
}) => {
  toast({
    title: 'Dashboard link delivered',
    description: `We emailed ${recipientName} their personal dashboard link: ${dashboardUrl}`,
  });
};

export const showSuccess = (message) => {
  toast({
    title: 'Success',
    description: message,
    variant: 'success',
  });
};

export const showInfo = (message) => {
  toast({
    title: 'Heads up',
    description: message,
  });
};

