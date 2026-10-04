import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { fetchSupportTickets } from '../../services/supportService';

export default function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response = await fetchSupportTickets();
        setTickets(response?.data?.data || []);
      } catch (error) {
        console.error('Failed to load support tickets:', error);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Support Tickets"
        subtitle="Track customer and product support requests."
      />

      <div className="soft-card p-3">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 muted">
                    Loading support tickets...
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 muted">
                    No support tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket, index) => (
                  <tr key={ticket._id}>
                    <td>
                      #{String(index + 1).padStart(4, '0')}
                    </td>

                    <td className="font-black">
                      {ticket.subject || 'No subject'}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          ticket.priority === 'High'
                            ? 'pending'
                            : ticket.priority === 'Medium'
                            ? 'review'
                            : 'info'
                        }`}
                      >
                        {ticket.priority || 'Medium'}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          ticket.status === 'Resolved' ||
                          ticket.status === 'Closed'
                            ? 'success'
                            : ticket.status === 'In Progress'
                            ? 'review'
                            : 'pending'
                        }`}
                      >
                        {ticket.status || 'Open'}
                      </span>
                    </td>

                    <td>
                      {ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleString()
                        : 'Unknown'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}