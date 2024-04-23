import React from 'react';
import './Notification.css';
import { ReactComponent as Info } from '../../../../assets/loading.svg';

function Notification({ notificationText, responseCode }) {
  return (
    <span className="notification-container">
      <div
        className="text-notification"
        style={
          responseCode
            ? { backgroundColor: '#2489FF' }
            : { backgroundColor: '#ff2424' }
        }
      >
        {notificationText}
        {/* <Info className="info-icon" /> */}
      </div>
    </span>
  );
}

export default Notification;
