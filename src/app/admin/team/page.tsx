'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import MediaUpload from '@/components/admin/MediaUpload';
import { Plus, Trash2, Loader2, Save, X } from 'lucide-react';

interface TeamMember {
  id?: string;
  full_name: string;
  role: string;
  bio: string;
  photo_url: string;
  specialization: string;
  instagram_url: string;
  display_order: number;
}

const EMPTY: TeamMember = { full_name: '', role: '', bio: '', photo_url: '', specialization: '', instagram_url: '', display_order: 0 };

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const sb = createClient();
    const { data } = await sb.from('team_members').select('*').order('display_order');
    setMembers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setError('');
    const sb = createClient();
    const { error: err } = editing.id
      ? await sb.from('team_members').update({ ...editing, updated_at: new Date().toISOString() }).eq('id', editing.id)
      : await sb.from('team_members').insert(editing);
    if (err) setError(err.message);
    else { setEditing(null); load(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    await createClient().from('team_members').delete().eq('id', id);
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-[#C9A86C] animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-white font-light tracking-wide">Team Members</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage your photographers and studio artists</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY, display_order: members.length + 1 })} className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-5 py-2.5 rounded-lg transition-all">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.length === 0 && (
          <div className="col-span-2 text-center py-16 text-neutral-600 border border-dashed border-neutral-700 rounded-xl">No team members yet.</div>
        )}
        {members.map((member) => (
          <div key={member.id} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-5 flex items-start gap-4">
            {member.photo_url ? (
              <img src={member.photo_url} alt={member.full_name} className="w-14 h-14 object-cover rounded-full shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 text-lg font-serif shrink-0">
                {member.full_name[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{member.full_name}</p>
              <p className="text-[#C9A86C] text-xs mt-0.5">{member.role}</p>
              <p className="text-neutral-500 text-xs mt-1 line-clamp-2">{member.bio}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={() => setEditing(member)} className="text-xs text-[#C9A86C] border border-[#C9A86C]/30 px-3 py-1.5 rounded-lg hover:border-[#C9A86C] transition-all">Edit</button>
              <button onClick={() => handleDelete(member.id!)} className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/40 transition-all self-center"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-white font-semibold">{editing.id ? 'Edit' : 'New'} Team Member</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-neutral-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <MediaUpload type="image" folder="team" currentUrl={editing.photo_url} onUpload={url => setEditing({ ...editing, photo_url: url })} label="Profile Photo" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input required value={editing.full_name} onChange={e => setEditing({ ...editing, full_name: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Role / Title</label>
                  <input value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })} placeholder="Lead Photographer" className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Specialization</label>
                <input value={editing.specialization} onChange={e => setEditing({ ...editing, specialization: e.target.value })} placeholder="e.g. Weddings & High Fashion" className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Bio</label>
                <textarea value={editing.bio} onChange={e => setEditing({ ...editing, bio: e.target.value })} rows={4} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Instagram URL</label>
                  <input type="url" value={editing.instagram_url} onChange={e => setEditing({ ...editing, instagram_url: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Display Order</label>
                  <input type="number" value={editing.display_order} onChange={e => setEditing({ ...editing, display_order: +e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors" />
                </div>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-6 py-2.5 rounded-lg transition-all disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Member'}
                </button>
                <button type="button" onClick={() => setEditing(null)} className="text-neutral-400 hover:text-white border border-neutral-700 px-6 py-2.5 rounded-lg text-sm transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
