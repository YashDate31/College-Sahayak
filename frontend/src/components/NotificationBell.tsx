import { useState, useEffect, useRef } from 'react';
import { Bell, MessageSquare, AlertCircle, X } from 'lucide-react';
import { API_URL } from '../utils/api';
import './NotificationBell.css';

interface NotificationItem {
  id: string;
  type: 'notice' | 'feedback_reply';
  title: string;
  content: string;
  originalFeedback?: string;
  date: string;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const getAuthToken = () => localStorage.getItem('auth_token') || '';

  const fetchNotifications = async () => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const [noticesRes, feedbackRes] = await Promise.all([
        fetch(`${API_URL}/api/notices`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/feedback/my`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const noticesData = noticesRes.ok ? await noticesRes.json() : [];
      const feedbackData = feedbackRes.ok ? await feedbackRes.json() : [];

      let combined: NotificationItem[] = [];

      if (Array.isArray(noticesData)) {
        noticesData.forEach(n => {
          combined.push({
            id: `notice-${n.id}`,
            type: 'notice',
            title: n.title,
            content: n.content,
            date: n.created_at
          });
        });
      }

      if (Array.isArray(feedbackData)) {
        feedbackData.forEach(f => {
          if (f.status === 'replied' && f.reply) {
            combined.push({
              id: `feedback-${f.id}`,
              type: 'feedback_reply',
              title: `Reply to your ${f.type} feedback`,
              content: f.reply,
              originalFeedback: f.message,
              date: f.replied_at || f.created_at
            });
          }
        });
      }

      combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setNotifications(combined);

      // Check for unread notifications
      if (combined.length > 0) {
        const lastRead = localStorage.getItem('last_notification_read');
        if (!lastRead || new Date(combined[0].date).getTime() > new Date(lastRead).getTime()) {
          setHasUnread(true);
        }
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount to check for unread
  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      // Mark as read
      if (notifications.length > 0) {
        localStorage.setItem('last_notification_read', notifications[0].date);
      }
      setHasUnread(false);
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  if (!getAuthToken()) return null;

  return (
    <div className="notification-bell-container" ref={bellRef}>
      <button className="nav-link notification-trigger" onClick={handleToggle}>
        <Bell size={18} />
        {hasUnread && <span className="notification-red-dot"></span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button className="notification-close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="notification-body">
            {loading ? (
              <div className="notification-empty">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <Bell size={24} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className={`notification-item ${item.type}`}>
                  <div className="notification-icon">
                    {item.type === 'notice' ? <AlertCircle size={16} /> : <MessageSquare size={16} />}
                  </div>
                  <div className="notification-content">
                    <h4>{item.title}</h4>
                    {item.originalFeedback && (
                      <div className="original-feedback">
                        <span className="feedback-label">Your feedback:</span>
                        <p className="feedback-text">"{item.originalFeedback}"</p>
                      </div>
                    )}
                    <p className="reply-text">{item.content}</p>
                    <span className="notification-date">{new Date(item.date).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
