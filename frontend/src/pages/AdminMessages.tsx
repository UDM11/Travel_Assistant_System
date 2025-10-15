import { useState, useEffect } from "react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/contact/messages");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      if (data.success && data.data) {
        setMessages(data.data.messages || []);
      } else {
        setMessages(data.messages || []);
      }
    } catch (err) {
      setError("Failed to fetch messages. Make sure the backend server is running.");
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchMessages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>
            <button
              onClick={fetchMessages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No messages found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{message.name}</h3>
                      <p className="text-sm text-gray-600">{message.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{formatDate(message.created_at)}</p>
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        {message.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
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
      </div>
    </div>
  );
};

export default AdminMessages;