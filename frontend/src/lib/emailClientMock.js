import { toast } from '../components/ui/use-toast';

export const sendIntroEmailMock = ({ investorName, startupName }) => {
  toast({
    title: 'Intro email sent (mock)',
    description: `Introduced ${investorName} to ${startupName}.`,
    variant: 'success',
  });
};

export const sendFounderDashboardMock = ({
  recipientName,
  dashboardUrl = 'https://launch-and-lift.demo/founder/dashboard',
}) => {
  toast({
    title: 'Dashboard link delivered (mock)',
    description: `We emailed ${recipientName} their personal dashboard link: ${dashboardUrl}`,
  });
};

export const showGenericSuccess = (message) => {
  toast({
    title: 'Success',
    description: message,
    variant: 'success',
  });
};

export const showGenericInfo = (message) => {
  toast({
    title: 'Heads up',
    description: message,
  });
};
