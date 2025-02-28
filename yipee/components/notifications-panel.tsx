"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, TrendingUp, CheckCircle, Info, X } from "lucide-react"

// Mock notifications data
const initialNotifications = [
  {
    id: 1,
    type: "critical",
    title: "Low Stock Alert",
    message: "Your stock of PASTA is running out. Current level: 5 boxes.",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Demand Forecast",
    message: "Anticipated high demand for tomato sauce in the coming 2 weeks of 12/15/2023.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Price Change",
    message: "Supplier has increased the price of Olive Oil by 5%.",
    time: "Yesterday",
    read: false,
  },
  {
    id: 4,
    type: "success",
    title: "Order Delivered",
    message: "Your order #12345 has been delivered and received.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 5,
    type: "warning",
    title: "Expiration Alert",
    message: "5 items in your inventory will expire within the next week.",
    time: "3 days ago",
    read: true,
  },
  {
    id: 6,
    type: "info",
    title: "System Update",
    message: "The system will undergo maintenance on 12/10/2023.",
    time: "1 week ago",
    read: true,
  },
]

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.type === filter
  })

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "warning":
        return <TrendingUp className="h-5 w-5 text-amber-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
        <CardDescription>Stay updated with important alerts</CardDescription>
        <div className="flex gap-2 pt-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All
          </Button>
          <Button variant={filter === "unread" ? "default" : "outline"} size="sm" onClick={() => setFilter("unread")}>
            Unread
          </Button>
          <Button
            variant={filter === "critical" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("critical")}
          >
            Critical
          </Button>
        </div>
      </CardHeader>
      <CardContent className="max-h-[calc(100vh-300px)] overflow-auto">
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative p-4 rounded-lg border ${notification.read ? "bg-background" : "bg-muted/50"}`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mt-1 -mr-1"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Dismiss</span>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="text-sm font-medium">No notifications</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {filter !== "all" ? `No ${filter} notifications found` : "You're all caught up!"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}