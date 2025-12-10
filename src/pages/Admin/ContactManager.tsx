import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Eye,
  MessageCircleWarning,
  RefreshCcw,
  Trash2,
  Mail,
  Phone,
  X,
} from "lucide-react";
import {
  getContactMessages,
  deleteContactMessage,
  ContactMessage,
} from "../../services/contactService";

const ContactManager: React.FC = () => {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await getContactMessages();
      setContacts(data);
    } catch (error) {
      console.error("Failed to fetch contact messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await deleteContactMessage(id);
      await fetchContacts();
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert("Failed to delete message. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Unknown date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Unknown date";
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Subject", "Message", "Date"];
    const csvContent = [
      headers.join(","),
      ...contacts.map((contact) =>
        [
          `"${contact.name}"`,
          `"${contact.email}"`,
          `"${contact.phone || ""}"`,
          `"${contact.subject}"`,
          `"${contact.message.replace(/"/g, '""')}"`,
          `"${formatDate(contact.created_at)}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const today = new Date().toISOString().split("T")[0];
    a.download = `contact-messages-${today}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center text-gray hover:text-primary mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-dark">Contact Manager</h1>
              <p className="text-gray">Manage client contacts and inquiries</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn-secondary inline-flex items-center"
                type="button"
                onClick={fetchContacts}
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                className="btn-primary inline-flex items-center"
                onClick={exportToCSV}
                disabled={contacts.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray">Total Messages</p>
              <p className="text-3xl font-bold text-dark">{contacts.length}</p>
            </div>
            <Mail className="w-12 h-12 text-primary" />
          </div>
        </motion.div>

        {/* Messages List */}
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <MessageCircleWarning className="w-16 h-16 text-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark mb-2">
                No messages yet
              </h3>
              <p className="text-gray">
                Contact form submissions will appear here
              </p>
            </div>
          ) : (
            contacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-dark mr-3">
                        {contact.name}
                      </h3>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {contact.subject}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        <a
                          href={`mailto:${contact.email}`}
                          className="hover:text-primary"
                        >
                          {contact.email}
                        </a>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <a
                            href={`tel:${contact.phone}`}
                            className="hover:text-primary"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    <p className="text-gray mb-3 line-clamp-2">
                      {contact.message}
                    </p>

                    <p className="text-xs text-gray">
                      Received: {formatDate(contact.created_at)}
                    </p>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedMessage(contact)}
                      className="btn-secondary text-sm inline-flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-dark">Message Details</h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray hover:text-dark"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray mb-1">
                  From
                </label>
                <p className="text-dark font-semibold">{selectedMessage.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray mb-1">
                    Email
                  </label>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-primary hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray mb-1">
                    Phone
                  </label>
                  <p className="text-dark">
                    {selectedMessage.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray mb-1">
                  Subject
                </label>
                <p className="text-dark">{selectedMessage.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray mb-1">
                  Message
                </label>
                <p className="text-dark whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {selectedMessage.message}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray mb-1">
                  Received
                </label>
                <p className="text-dark">
                  {formatDate(selectedMessage.created_at)}
                </p>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                className="btn-primary inline-flex items-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Reply via Email
              </a>
              <button
                onClick={() => setSelectedMessage(null)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContactManager;
