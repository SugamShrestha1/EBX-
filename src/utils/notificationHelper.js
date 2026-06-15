/**
 * Show a notification message to the user
 * @param {string} message - The notification message to display
 * @param {string} type - Type of notification: 'success', 'error', 'warning', 'info' (default: 'info')
 * @param {number} duration - Duration to show the notification in milliseconds (default: 3000)
 */
export const showNotification = (message, type = 'info', duration = 3000) => {
  // Create notification container if it doesn't exist
  let notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `;
    document.body.appendChild(notificationContainer);
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    padding: 12px 16px;
    border-radius: 4px;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease-in-out;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 300px;
  `;

  // Set background and text color based on notification type
  const typeStyles = {
    success: { bg: '#d4edda', text: '#155724', border: '#c3e6cb' },
    error: { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb' },
    warning: { bg: '#fff3cd', text: '#856404', border: '#ffeeba' },
    info: { bg: '#d1ecf1', text: '#0c5460', border: '#bee5eb' }
  };

  const styles = typeStyles[type] || typeStyles.info;
  notification.style.backgroundColor = styles.bg;
  notification.style.color = styles.text;
  notification.style.border = `1px solid ${styles.border}`;

  notification.textContent = message;

  notificationContainer.appendChild(notification);

  // Add animation styles if not already present
  if (!document.getElementById('notification-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'notification-styles';
    styleSheet.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(400px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideOut {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(400px);
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  // Remove notification after duration
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, duration);
};
