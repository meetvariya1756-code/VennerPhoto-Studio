'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Mail, Trash2, Loader2, Calendar, MapPin, User, Phone, Eye, X, CheckCircle2, Circle } from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  location: string | null;
  message: string;
  created_at: string;
  is_completed?: boolean;
}

export default function InquiriesAdminPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const sb = createClient();
    const { data, error: err } = await sb
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (err) {
      setError('Supabase error: ' + err.message);
      setInquiries([]);
    } else {
      setInquiries(data || []);
      setError('');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggleCompleted = async (id: string, currentVal: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    const sb = createClient();
    const { error: err } = await sb
      .from('contact_inquiries')
      .update({ is_completed: !currentVal })
      .eq('id', id);

    if (err) {
      alert('Failed to update status: ' + err.message);
    } else {
      if (selected?.id === id) {
        setSelected({ ...selected, is_completed: !currentVal });
      }
      load();
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    const sb = createClient();
    const { error: err } = await sb.from('contact_inquiries').delete().eq('id', id);
    if (err) {
      alert('Delete failed: ' + err.message);
    } else {
      if (selected?.id === id) setSelected(null);
      load();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-[#C9A86C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#1A1A1A] font-medium tracking-wide">Client Inquiries</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage and track client bookings and contact messages</p>
        </div>
      </div>

      {error && (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-800 font-semibold text-sm mb-1">{error}</p>
          <p className="text-amber-700/80 text-xs leading-relaxed mb-4">
            If you haven\'t created the table or set up the RLS permissions, please execute the SQL script below in your Supabase SQL Editor:
          </p>
          <pre className="bg-neutral-900 text-neutral-100 text-[11px] p-4 rounded-lg overflow-x-auto select-all font-mono">
{`CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts from the public contact form
CREATE POLICY "Anon insert contact_inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);

-- Allow authenticated reads and deletes for administrators
CREATE POLICY "Auth read contact_inquiries" ON contact_inquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete contact_inquiries" ON contact_inquiries FOR DELETE USING (auth.role() = 'authenticated');`}
          </pre>
        </div>
      )}

      {inquiries.length === 0 ? (
        <div className="text-center py-16 text-neutral-400 bg-white border border-neutral-200 rounded-xl shadow-sm">
          <Mail className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="font-medium text-sm text-[#1A1A1A]">No inquiries received yet</p>
          <p className="text-xs text-neutral-400 mt-1">Form submissions from your Contact Us page will display here.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200/60 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-sm">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-200/60 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Service Interest</th>
                  <th className="px-6 py-4">Preferred Date</th>
                  <th className="px-6 py-4">Received On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {inquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    onClick={() => setSelected(inq)}
                    className={cn(
                      "hover:bg-neutral-50/40 cursor-pointer transition-colors",
                      inq.is_completed && "bg-emerald-50/10 opacity-75"
                    )}
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <button
                        onClick={(e) => handleToggleCompleted(inq.id, !!inq.is_completed, e)}
                        className="text-neutral-400 hover:text-emerald-600 transition-colors"
                        title={inq.is_completed ? "Mark as New Inquiry" : "Mark as Conversation Completed"}
                      >
                        {inq.is_completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      <div>
                        <div className={cn("font-semibold text-[#1A1A1A]", inq.is_completed && "line-through text-neutral-400 font-normal")}>
                          {inq.name}
                        </div>
                        <div className="text-neutral-400 text-xs mt-0.5">{inq.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 font-medium">
                      {inq.service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td className="px-6 py-4 text-neutral-600 text-xs">
                      {formatDate(inq.date)}
                    </td>
                    <td className="px-6 py-4 text-neutral-400 text-xs">
                      {formatDate(inq.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setSelected(inq)}
                          className="text-[#C9A86C] hover:bg-neutral-50 p-1.5 rounded-lg border border-neutral-200/30 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(inq.id, e)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Detail Lightbox Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-[#1A1A1A] font-serif text-xl font-medium tracking-wide">Client Inquiry Details</h2>
              <button onClick={() => setSelected(null)}>
                <X className="w-5 h-5 text-neutral-400 hover:text-[#1A1A1A]" />
              </button>
            </div>
            <div className="p-6 space-y-6 text-left font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/40">
                  <User className="w-5 h-5 text-[#C9A86C]" />
                  <div>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Client Name</p>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{selected.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/40">
                  <Phone className="w-5 h-5 text-[#C9A86C]" />
                  <div>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Phone Number</p>
                    <a href={`tel:${selected.phone}`} className="text-sm font-semibold text-[#C9A86C] hover:underline">
                      {selected.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/40 col-span-1 md:col-span-2">
                  <Mail className="w-5 h-5 text-[#C9A86C]" />
                  <div>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Email Address</p>
                    <a href={`mailto:${selected.email}`} className="text-sm font-semibold text-[#C9A86C] hover:underline">
                      {selected.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/40">
                  <Calendar className="w-5 h-5 text-[#C9A86C]" />
                  <div>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Preferred Date</p>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{formatDate(selected.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/40">
                  <MapPin className="w-5 h-5 text-[#C9A86C]" />
                  <div>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Event Location</p>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{selected.location || 'Not Specified'}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold mb-2">Detailed Message</p>
                <div className="bg-neutral-50 border border-neutral-200/50 p-5 rounded-2xl text-neutral-700 text-sm leading-relaxed whitespace-pre-wrap italic">
                  "{selected.message}"
                </div>
              </div>

              <div className="flex gap-3 border-t border-neutral-100 pt-5">
                <button
                  type="button"
                  onClick={(e) => {
                    handleDelete(selected.id, e);
                  }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs px-5 py-2.5 rounded-lg tracking-wider uppercase transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete Inquiry
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    handleToggleCompleted(selected.id, !!selected.is_completed, e);
                  }}
                  className={cn(
                    "flex items-center gap-2 font-semibold text-xs px-5 py-2.5 rounded-lg tracking-wider uppercase transition-colors",
                    selected.is_completed
                      ? "bg-amber-600 hover:bg-amber-500 text-white"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white"
                  )}
                >
                  {selected.is_completed ? (
                    <>
                      <Circle className="w-4 h-4" /> Mark New Lead
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Mark Completed
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-neutral-500 hover:text-neutral-700 border border-neutral-300 hover:bg-neutral-50 px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ml-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
