import React, { useContext } from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { NotificationContext } from "../../context/notificationContext";

export default function NotificationAlerts() {
  const { notifications, removeNotification } = useContext(NotificationContext);

  return (
    <Stack
      sx={{
        width: "auto",
        position: "fixed",
        top: 100,
        right: 10,
        zIndex: 1200,
      }}
      spacing={2}
    >
      {notifications.map((notification, index) => (
        <Alert
          key={index}
          severity={notification.severity}
          onClose={() => removeNotification(index)}
        >
          {notification.message}
        </Alert>
      ))}
    </Stack>
  );
}
