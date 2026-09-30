'use client';

import { useState, useEffect } from 'react';

interface Application {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function AdminPanel() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/staff-applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      const response = await fetch(`/api/staff-applications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setApplications(applications.filter((app) => app.id !== id));
      } else {
        setError('Failed to delete application');
      }
    } catch (err) {
      setError('Error deleting application');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400">View and manage staff applications</p>
          </div>
          <button
            onClick={fetchApplications}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 mt-4">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-700">
            <p className="text-gray-400 text-lg">No applications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{application.name}</h3>
                    <p className="text-gray-400 text-sm">{application.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-sm">
                      {new Date(application.created_at).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDelete(application.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap">{application.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
