import {
  ArrowLeft,
  Download,
  Eye,
  MessageCircleWarning,
  RefreshCcw,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

interface ContactForm {
  name: string;
  email: string;
  phone: number | string;
  subject: string;
  message: string;
  time_stamp: string;
}

const ContactManager = () => {
  const [contacts, setContacts] = useState<ContactForm[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  //load data
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        "https://api.sheetbest.com/sheets/4a39b25e-98e9-4d0d-b940-161743cc9b89"
      );
      const data = response.data;
      setContacts(data);
    } catch (error) {
      console.error("failed to fetch contact list", error);
    } finally {
      setLoading(false);
    }
  };

  //sorted contacts
  const sortContacts = (sortOption: string) => {
    if (sortOption === "") {
      return contacts;
    } else if (sortOption === "A-Z") {
      return [...contacts].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "Z-A") {
      return [...contacts].sort((a, b) => b.name.localeCompare(a.name));
    }
  };

  //export csv
  

  useEffect(() => {
    fetchContacts();
  }, []);

  const sortContact = sortContacts(searchTerm);

  return (
    <div>
      {loading ? (
        <div className="px-5 text-center py-2 fixed top-10 w-36 mx-auto rounded-md left-[25%] right-[25%] transform translate-x-1/2  bg-red-300 text-white">
          <p>Loading...</p>
        </div>
      ) : null}
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
            <div className="flex items-center gap-2 max-sm:flex-col max-sm:items-start">
              <button
                className="flex items-center btn-secondary text-red-300 border-red-300 hover:bg-red-300"
                type="button"
                onClick={fetchContacts}
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button className="flex items-center btn-secondary text-red-300 border-red-300 hover:bg-red-300">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl w-[90%] bg-red-300 mx-auto mt-10 py-8 text-white rounded-md">
        <div className="py-4 text-center border-b border-white">
          <h2 className="text-3xl font-bold">Total Contact Received</h2>
          <p className="text-2xl mt-2 font-bold">{contacts.length}</p>
        </div>
        <div>
          <div className="flex justify-between items-center m-4">
            <select
              name="filter"
              id="filter"
              className="input-field bg-none max-w-[250px] w-[95%] text-black"
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <option value="">sort by</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
              {/* <option value="status">Status</option> */}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-black relative min-h-[300px]">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Phone</th>
                  <th className="py-2 px-4 border-b">Subject</th>
                  <th className="py-2 px-4 border-b">Message</th>
                  <th className="py-2 px-4 border-b">Date</th>
                </tr>
              </thead>

              {contacts.length === 0 ? (
                <div className="flex flex-col gap-4 items-center justify-center w-64 h-64 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <MessageCircleWarning className="w-10 h-10 text-red-600" />
                  <p>No contacts available</p>
                  {/* <button className="btn-primary flex items-center"><RefreshCcw className="w-4 h-4 mr-2" /></button> */}
                </div>
              ) : (
                <tbody>
                  {sortContact
                    ? sortContact.map((contact, index) => (
                        <tr
                          key={index + " " + contact.name}
                          className="bg-gray-100 hover:bg-gray-200 text-center border-b border-white"
                        >
                          <td className="py-2 px-4 text-sm">{contact.name}</td>
                          <td className="py-2 px-4 text-sm">{contact.email}</td>
                          <td className="py-2 px-4 text-sm">{contact.phone}</td>
                          <td className="py-2 px-4 text-sm">
                            {contact.subject}
                          </td>
                          <td className="py-2 px-4 text-sm max-w-[250px]">
                            {contact.message}
                          </td>
                          <td className="py-2 px-4 text-sm">
                            {contact.time_stamp}
                          </td>
                        </tr>
                      ))
                    : contacts.map((contact, index) => (
                        <tr
                          key={index + " " + contact.name}
                          className="bg-gray-100 hover:bg-gray-200 text-center border-b border-white"
                        >
                          <td className="py-2 px-4 text-sm">{contact.name}</td>
                          <td className="py-2 px-4 text-sm">{contact.email}</td>
                          <td className="py-2 px-4 text-sm">{contact.phone}</td>
                          <td className="py-2 px-4 text-sm">
                            {contact.subject}
                          </td>
                          <td className="py-2 px-4 text-sm max-w-[250px]">
                            {contact.message}
                          </td>
                          <td className="py-2 px-4 text-sm">
                            {contact.time_stamp}
                          </td>
                        </tr>
                      ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactManager;
function fetchContacts() {
  throw new Error("Function not implemented.");
}
