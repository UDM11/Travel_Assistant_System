import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  MapPin, 
  BarChart3, 
  Settings, 
  Bell,
  Search,
  Calendar,
  TrendingUp,
  Mail,
  Phone,
  Globe,
  DollarSign,
  Shield,
  Database,
  FileText,
  Activity,
  Zap,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Target,
  Briefcase,
  PieChart,
  LineChart,
  MoreHorizontal,
  Menu
} from 'lucide-react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  category: string;
  subject: string;
  message: string;
  priority: string;
  created_at: string;
  status: string;
}

const MessagesComponent = ({ onMessageCountUpdate }: { onMessageCountUpdate?: (count: number) => void }) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
    // Auto-refresh messages every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/contact/messages");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const messagesList = data.success && data.data ? data.data.messages || [] : data.messages || [];
      setMessages(messagesList);
      // Update parent component with message count
      if (onMessageCountUpdate) {
        onMessageCountUpdate(messagesList.length);
      }
    } catch (err) {
      setError("Failed to fetch messages. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchMessages} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
          <p className="text-sm text-gray-600 mt-1">Real-time updates every 10 seconds</p>
        </div>
        <button 
          onClick={fetchMessages} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>
      {messages.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No messages found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="border border-gray-200 rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 space-y-2 lg:space-y-0">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{message.subject}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 space-y-1 sm:space-y-0">
                    <span className="font-medium">{message.name}</span>
                    <span>{message.email}</span>
                    {message.phone && <span>{message.phone}</span>}
                  </div>
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-sm text-gray-500 mb-2">{formatDate(message.created_at)}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      message.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      message.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      message.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {message.priority.toUpperCase()}
                    </span>
                    <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      {message.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                  {message.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 text-center text-sm text-gray-500">
        Total messages: {messages.length}
      </div>
    </div>
  );
};

const UsersComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, premium: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/users");
      if (response.ok) {
        const data = await response.json();
        const usersList = data.success ? data.data.users : [];
        setUsers(usersList);
        setStats({
          total: usersList.length,
          active: usersList.filter(u => u.status === 'active').length,
          premium: usersList.filter(u => u.plan === 'premium').length
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button onClick={fetchUsers} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-sm text-blue-700">Total Users</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-green-700">Active Users</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-orange-600">{stats.premium}</p>
          <p className="text-sm text-orange-700">Premium Users</p>
        </div>
      </div>
      {users.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No users found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.plan === 'premium' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.plan}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TripsComponent = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/trips");
      if (response.ok) {
        const data = await response.json();
        setTrips(data.success ? data.data.trips : []);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Trip Management</h2>
        <button onClick={fetchTrips} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Refresh
        </button>
      </div>
      {trips.length === 0 ? (
        <div className="text-center py-8">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No trips found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.slice(0, 10).map((trip, index) => (
            <div key={trip.id || index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{trip.destination}</h3>
                  <p className="text-gray-600">{trip.start_date} - {trip.end_date}</p>
                  <p className="text-sm text-gray-500">Budget: ${trip.budget}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  {trip.travelers} travelers
                </span>
              </div>
            </div>
          ))}
          <div className="text-center text-sm text-gray-500">
            Total trips: {trips.length}
          </div>
        </div>
      )}
    </div>
  );
};

const BookingsComponent = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, revenue: 0 });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/trips");
      if (response.ok) {
        const data = await response.json();
        const tripsList = data.success ? data.data.trips : [];
        setBookings(tripsList);
        
        const revenue = tripsList.reduce((sum, trip) => sum + (trip.cost_breakdown?.total || trip.budget || 0), 0);
        setStats({ total: tripsList.length, revenue });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
        <button onClick={fetchBookings} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{stats.total}</p>
          <p className="text-sm text-green-700">Total Bookings</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">${stats.revenue.toLocaleString()}</p>
          <p className="text-sm text-purple-700">Total Revenue</p>
        </div>
      </div>
      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No bookings found.</p>
        </div>
      ) : (
        <div className="text-center text-sm text-gray-500">
          Total bookings: {bookings.length}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [tripsCount, setTripsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [previousMessageCount, setPreviousMessageCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Fetch real-time data
  const fetchDashboardData = async () => {
    try {
      // Fetch messages count
      const messagesResponse = await fetch("http://127.0.0.1:8000/api/v1/contact/messages");
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        const totalMessages = messagesData.success && messagesData.data ? messagesData.data.total || 0 : 0;
        
        // Show notification if message count increased
        if (totalMessages > previousMessageCount && previousMessageCount > 0) {
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 5000);
        }
        
        setPreviousMessageCount(messageCount);
        setMessageCount(totalMessages);
        setLastUpdated(new Date().toLocaleTimeString());
      }

      // Fetch trips count (from trips.json)
      try {
        const tripsResponse = await fetch('/trips.json');
        if (tripsResponse.ok) {
          const tripsData = await tripsResponse.json();
          setTripsCount(Array.isArray(tripsData) ? tripsData.length : 0);
        }
      } catch (error) {
        // If trips.json is not accessible, use default
        setTripsCount(5);
      }

      // Fetch users count (from users.json)
      try {
        const usersResponse = await fetch('/users.json');
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsersCount(Array.isArray(usersData) ? usersData.length : 0);
        }
      } catch (error) {
        // If users.json is not accessible, use default
        setUsersCount(3247);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3, badge: null },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: messageCount > 0 ? messageCount.toString() : null },
    { id: 'users', label: 'User Management', icon: Users, badge: null },
    { id: 'trips', label: 'Trip Management', icon: MapPin, badge: tripsCount > 0 ? tripsCount.toString() : null },
    { id: 'bookings', label: 'Bookings', icon: Calendar, badge: tripsCount > 0 ? tripsCount.toString() : null },
    { id: 'payments', label: 'Payments', icon: DollarSign, badge: null },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, badge: null },
    { id: 'reports', label: 'Reports', icon: FileText, badge: null },
    { id: 'security', label: 'Security', icon: Shield, badge: '2' },
    { id: 'database', label: 'Database', icon: Database, badge: null },
    { id: 'api', label: 'API Management', icon: Zap, badge: null },
    { id: 'logs', label: 'System Logs', icon: Activity, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: '$127,450', change: '+23.5%', trend: 'up', icon: DollarSign, color: 'green' },
    { label: 'Active Users', value: usersCount.toLocaleString(), change: '+12.3%', trend: 'up', icon: Users, color: 'blue' },
    { label: 'Trips Booked', value: tripsCount.toLocaleString(), change: '+18.7%', trend: 'up', icon: MapPin, color: 'purple' },
    { label: 'Messages', value: messageCount.toLocaleString(), change: messageCount > 0 ? '+100%' : '0%', trend: messageCount > 0 ? 'up' : 'neutral', icon: MessageSquare, color: 'orange' },
    { label: 'Conversion Rate', value: '4.2%', change: '+0.8%', trend: 'up', icon: Target, color: 'indigo' },
    { label: 'Avg. Trip Value', value: '$2,340', change: '+15.2%', trend: 'up', icon: Star, color: 'pink' },
  ]);

  // Update stats when counts change
  useEffect(() => {
    setStats([
      { label: 'Total Revenue', value: '$127,450', change: '+23.5%', trend: 'up', icon: DollarSign, color: 'green' },
      { label: 'Active Users', value: usersCount.toLocaleString(), change: '+12.3%', trend: 'up', icon: Users, color: 'blue' },
      { label: 'Trips Booked', value: tripsCount.toLocaleString(), change: '+18.7%', trend: 'up', icon: MapPin, color: 'purple' },
      { label: 'Messages', value: messageCount.toLocaleString(), change: messageCount > 0 ? '+100%' : '0%', trend: messageCount > 0 ? 'up' : 'neutral', icon: MessageSquare, color: 'orange' },
      { label: 'Conversion Rate', value: '4.2%', change: '+0.8%', trend: 'up', icon: Target, color: 'indigo' },
      { label: 'Avg. Trip Value', value: '$2,340', change: '+15.2%', trend: 'up', icon: Star, color: 'pink' },
    ]);
  }, [messageCount, tripsCount, usersCount]);

  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy',
    uptime: '99.9%',
    responseTime: '120ms',
    activeConnections: 1247,
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78
  });

  const [recentActivity, setRecentActivity] = useState([
    { type: 'payment', content: 'Payment of $2,450 received from John Smith', time: '2 min ago', status: 'success' },
    { type: 'booking', content: 'New booking: Tokyo Adventure Package', time: '5 min ago', status: 'info' },
    { type: 'user', content: 'Premium user upgrade: sarah@example.com', time: '12 min ago', status: 'success' },
    { type: 'alert', content: 'High server load detected on API-02', time: '18 min ago', status: 'warning' },
    { type: 'trip', content: 'Trip to Bali completed by Mike Johnson', time: '25 min ago', status: 'success' },
    { type: 'security', content: 'Failed login attempt blocked', time: '32 min ago', status: 'error' },
    { type: 'message', content: `${messageCount} contact messages received`, time: 'Live data', status: 'info' },
    { type: 'system', content: 'Database backup completed successfully', time: '1 hour ago', status: 'success' },
  ]);

  // Update recent activity when message count changes
  useEffect(() => {
    setRecentActivity(prev => [
      ...prev.slice(0, 6),
      { type: 'message', content: `${messageCount} contact messages received`, time: 'Live data', status: 'info' },
      ...prev.slice(7)
    ]);
  }, [messageCount]);

  const [quickActions] = useState([
    { id: 'new-user', label: 'Add User', icon: Plus, color: 'blue', action: () => {} },
    { id: 'export-data', label: 'Export Data', icon: Download, color: 'green', action: () => {} },
    { id: 'system-backup', label: 'Backup System', icon: Database, color: 'purple', action: () => {} },
    { id: 'send-notification', label: 'Send Alert', icon: Bell, color: 'orange', action: () => {} },
    { id: 'view-logs', label: 'View Logs', icon: Eye, color: 'gray', action: () => {} },
    { id: 'refresh-cache', label: 'Clear Cache', icon: RefreshCw, color: 'red', action: () => {} },
  ]);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-50 group-hover:bg-${stat.color}-100 transition-colors`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${
                    stat.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">System Health</h3>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            systemHealth.status === 'healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              systemHealth.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="capitalize">{systemHealth.status}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{systemHealth.uptime}</p>
            <p className="text-sm text-gray-600">Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{systemHealth.responseTime}</p>
            <p className="text-sm text-gray-600">Response Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{systemHealth.activeConnections}</p>
            <p className="text-sm text-gray-600">Active Connections</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-1 ${
                  systemHealth.cpuUsage < 70 ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  <span className={`text-sm font-bold ${
                    systemHealth.cpuUsage < 70 ? 'text-green-600' : 'text-orange-600'
                  }`}>{systemHealth.cpuUsage}%</span>
                </div>
                <p className="text-xs text-gray-600">CPU</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <button 
              onClick={fetchDashboardData}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivity.map((activity, index) => {
              const getIcon = () => {
                switch (activity.type) {
                  case 'payment': return DollarSign;
                  case 'booking': return Calendar;
                  case 'user': return Users;
                  case 'alert': return AlertTriangle;
                  case 'trip': return MapPin;
                  case 'security': return Shield;
                  case 'message': return MessageSquare;
                  case 'system': return Activity;
                  default: return Bell;
                }
              };
              const Icon = getIcon();
              return (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'success' ? 'bg-green-100 text-green-600' :
                    activity.status === 'warning' ? 'bg-orange-100 text-orange-600' :
                    activity.status === 'error' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">{activity.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`flex items-center space-x-2 p-3 bg-${action.color}-50 hover:bg-${action.color}-100 rounded-lg transition-all duration-200 group hover:shadow-md`}
                >
                  <Icon className={`w-5 h-5 text-${action.color}-600 group-hover:scale-110 transition-transform`} />
                  <span className={`text-sm font-medium text-${action.color}-700`}>{action.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Performance Metrics */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-bold text-gray-900 mb-4">Performance Metrics</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Memory Usage</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{width: `${systemHealth.memoryUsage}%`}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{systemHealth.memoryUsage}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Disk Usage</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{width: `${systemHealth.diskUsage}%`}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{systemHealth.diskUsage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'messages':
        return <MessagesComponent onMessageCountUpdate={setMessageCount} />;
      case 'users':
        return <UsersComponent />;
      case 'bookings':
        return <BookingsComponent />;
      case 'trips':
        return <TripsComponent />;
      case 'payments':
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Calendar className="w-4 h-4" />
                  <span>Date Range</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-green-600">$127K</p>
                <p className="text-sm text-green-700">Total Revenue</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">1,234</p>
                <p className="text-sm text-blue-700">Transactions</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">23</p>
                <p className="text-sm text-orange-700">Pending</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-red-600">5</p>
                <p className="text-sm text-red-700">Failed</p>
              </div>
            </div>
            <p className="text-gray-600">Advanced payment management features coming soon...</p>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Revenue Report', icon: DollarSign, color: 'green' },
                { title: 'User Analytics', icon: Users, color: 'blue' },
                { title: 'Booking Trends', icon: TrendingUp, color: 'purple' },
                { title: 'Performance Report', icon: BarChart3, color: 'orange' },
                { title: 'Security Audit', icon: Shield, color: 'red' },
                { title: 'System Health', icon: Activity, color: 'indigo' },
              ].map((report) => {
                const Icon = report.icon;
                return (
                  <div key={report.title} className={`p-6 bg-${report.color}-50 rounded-lg hover:bg-${report.color}-100 transition-colors cursor-pointer group`}>
                    <Icon className={`w-8 h-8 text-${report.color}-600 mb-3 group-hover:scale-110 transition-transform`} />
                    <h3 className={`font-bold text-${report.color}-900 mb-2`}>{report.title}</h3>
                    <p className={`text-sm text-${report.color}-700`}>Generate detailed report</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Security Center</h2>
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                <span>Secure</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900">Security Alerts</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-red-900">2 Failed Login Attempts</p>
                      <p className="text-xs text-red-700">Last 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">SSL Certificate Expires Soon</p>
                      <p className="text-xs text-orange-700">In 30 days</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900">Security Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Two-Factor Auth</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SSL Encryption</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Firewall</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'database':
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Database Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">2.4GB</p>
                <p className="text-sm text-blue-700">Database Size</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-green-600">99.9%</p>
                <p className="text-sm text-green-700">Uptime</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">1,247</p>
                <p className="text-sm text-purple-700">Active Connections</p>
              </div>
            </div>
            <p className="text-gray-600">Database management tools coming soon...</p>
          </div>
        );
      case 'api':
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">API Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-green-600">12,456</p>
                <p className="text-sm text-green-700">API Calls Today</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">120ms</p>
                <p className="text-sm text-blue-700">Avg Response</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">99.8%</p>
                <p className="text-sm text-purple-700">Success Rate</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">24</p>
                <p className="text-sm text-orange-700">Active Keys</p>
              </div>
            </div>
            <p className="text-gray-600">API management features coming soon...</p>
          </div>
        );
      case 'logs':
        return (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Logs</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <div>[2024-01-15 10:30:15] INFO: User authentication successful</div>
              <div>[2024-01-15 10:30:12] INFO: Database connection established</div>
              <div>[2024-01-15 10:30:10] WARN: High memory usage detected</div>
              <div>[2024-01-15 10:30:08] INFO: API request processed successfully</div>
              <div>[2024-01-15 10:30:05] ERROR: Failed to connect to external service</div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                  <PieChart className="w-8 h-8 mb-3" />
                  <p className="text-2xl font-bold">4.2%</p>
                  <p className="text-sm opacity-90">Conversion Rate</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                  <LineChart className="w-8 h-8 mb-3" />
                  <p className="text-2xl font-bold">$2,340</p>
                  <p className="text-sm opacity-90">Avg Order Value</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                  <Users className="w-8 h-8 mb-3" />
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-sm opacity-90">Customer Satisfaction</p>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                  <TrendingUp className="w-8 h-8 mb-3" />
                  <p className="text-2xl font-bold">+23%</p>
                  <p className="text-sm opacity-90">Growth Rate</p>
                </div>
              </div>
              <p className="text-gray-600">Advanced analytics features coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">General Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Maintenance Mode</span>
                      <button className="w-12 h-6 bg-gray-200 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Email Notifications</span>
                      <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Security Settings</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                      <span className="text-sm font-medium">Change Password</span>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                      <span className="text-sm font-medium">Two-Factor Authentication</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -100, x: '-50%' }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium">New message received!</span>
            <button 
              onClick={() => setShowNotification(false)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 lg:h-16">
            <div className="flex items-center space-x-2 lg:space-x-4">
              <h1 className="text-lg lg:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              {lastUpdated && (
                <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Last updated: {lastUpdated}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="relative hidden sm:block">
                <Search className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 absolute left-2 lg:left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-8 lg:pl-10 pr-3 lg:pr-4 py-1.5 lg:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32 lg:w-auto"
                />
              </div>
              <button className="relative p-1.5 lg:p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
                {messageCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {messageCount > 99 ? '99+' : messageCount}
                  </span>
                )}
              </button>
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs lg:text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Mobile Menu Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200"
            >
              <Menu className="w-5 h-5" />
              <span className="font-medium">Menu</span>
            </button>
          </div>

          {/* Sidebar */}
          <div className={`w-full lg:w-64 lg:flex-shrink-0 ${
            mobileMenuOpen ? 'block' : 'hidden lg:block'
          }`}>
            <nav className="bg-white rounded-xl shadow-lg p-4">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-all duration-200 group ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-2 border-blue-600 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2 lg:space-x-3">
                        <Icon className={`w-4 h-4 lg:w-5 lg:h-5 transition-colors ${
                          activeTab === item.id ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                        }`} />
                        <span className="font-medium text-xs lg:text-sm">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full font-medium">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;