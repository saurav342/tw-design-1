// This file is kept for backward compatibility
// All functions now use the NotificationContext directly
// Import useNotification hook in components instead

let notificationMethods = null;

export const setNotificationMethods = (methods) => {
  notificationMethods = methods;
};

export const sendIntroEmail = ({ investorName, startupName }) => {
  if (notificationMethods) {
    notificationMethods.showSuccess(
      `Introduced ${investorName} to ${startupName}.`,
      'Intro email sent'
    );
  }
};

export const sendFounderDashboard = ({
  recipientName,
  dashboardUrl = 'https://launch-and-lift.demo/founder/dashboard',
}) => {
  if (notificationMethods) {
    notificationMethods.showInfo(
      `We emailed ${recipientName} their personal dashboard link: ${dashboardUrl}`,
      'Dashboard link delivered'
    );
  }
};

export const showSuccess = (message) => {
  if (notificationMethods) {
    notificationMethods.showSuccess(message, 'Success');
  }
};

export const showInfo = (message) => {
  if (notificationMethods) {
    notificationMethods.showInfo(message, 'Info');
  }
};

export const showError = (message) => {
  if (notificationMethods) {
    notificationMethods.showError(message, 'Error');
  }
};

export const showWarning = (message) => {
  if (notificationMethods) {
    notificationMethods.showWarning(message, 'Warning');
  }
};

