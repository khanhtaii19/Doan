import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { api } from '../services';
import { ChatConversation, ChatMessage, User } from '../types';

interface ChatWidgetProps {
  currentUser: User | null;
  users: User[];
  onNavigateLogin: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ currentUser, users, onNavigateLogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('Admin');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  const adminKnownUsers = useMemo(
    () => users.filter((u) => u.role !== 'admin'),
    [users]
  );

  const resolveTargetUserId = () => (isAdmin ? selectedUserId : undefined);

  const loadConversations = async () => {
    if (!currentUser || !isAdmin) return;
    const data = await api.getChatConversations();
    setConversations(data);
    if (!selectedUserId && data.length > 0) {
      setSelectedUserId(data[0].peerUser.id);
      setSelectedUserName(data[0].peerUser.name || data[0].peerUser.email || 'Khach hang');
    }
  };

  const loadMessages = async (forceTargetId?: string) => {
    if (!currentUser) return;
    const targetId = isAdmin ? (forceTargetId || selectedUserId) : undefined;
    if (isAdmin && !targetId) return;

    setLoading(true);
    setError('');
    try {
      const data = await api.getChatMessages(targetId);
      setMessages(data.messages);

      if (data.peerUser?.name) {
        setSelectedUserName(data.peerUser.name);
      } else if (isAdmin && targetId) {
        const fallback = adminKnownUsers.find((u) => u.id === targetId);
        if (fallback) setSelectedUserName(fallback.name || fallback.email || 'Khach hang');
      } else {
        setSelectedUserName('Admin');
      }
    } catch (err: any) {
      setError(err?.message || 'Khong the tai tin nhan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !currentUser) return;
    let cancelled = false;

    const sync = async () => {
      if (cancelled) return;
      try {
        if (isAdmin) await loadConversations();
        await loadMessages();
      } catch {
        // no-op
      }
    };

    sync();
    const intervalId = setInterval(sync, 4000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [isOpen, currentUser, selectedUserId]);

  const handleAdminPickUser = async (userId: string) => {
    setSelectedUserId(userId);
    const user = adminKnownUsers.find((u) => u.id === userId)
      || conversations.find((c) => c.peerUser.id === userId)?.peerUser;
    setSelectedUserName(user?.name || user?.email || 'Khach hang');
    await loadMessages(userId);
  };

  const handleSend = async () => {
    if (!currentUser) {
      onNavigateLogin();
      return;
    }

    const text = draft.trim();
    if (!text) return;
    if (isAdmin && !selectedUserId) {
      setError('Hay chon khach hang de nhan tin.');
      return;
    }

    try {
      setError('');
      const sent = await api.sendChatMessage(text, resolveTargetUserId());
      setMessages((prev) => [...prev, sent]);
      setDraft('');
      if (isAdmin) await loadConversations();
    } catch (err: any) {
      setError(err?.message || 'Khong the gui tin nhan.');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#ff5c62] text-white shadow-xl transition hover:scale-105"
        aria-label="Open chat"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 h-[520px] w-[360px] max-w-[calc(100vw-24px)] rounded-2xl border border-red-100 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-red-100 bg-gradient-to-r from-red-50 to-white px-4 py-3">
            <div>
              <div className="text-sm font-bold text-slate-900">Chat ho tro</div>
              <div className="text-xs text-slate-500">
                {currentUser ? `Dang tro chuyen voi ${selectedUserName}` : 'Dang nhap de bat dau chat'}
              </div>
            </div>
          </div>

          {!currentUser && (
            <div className="flex h-[calc(100%-62px)] flex-col items-center justify-center gap-3 px-5 text-center">
              <p className="text-sm text-slate-600">Ban can dang nhap de nhan tin truc tiep voi admin.</p>
              <button
                onClick={onNavigateLogin}
                className="rounded-lg bg-[#ff5c62] px-4 py-2 text-sm font-semibold text-white"
              >
                Dang nhap ngay
              </button>
            </div>
          )}

          {currentUser && (
            <div className="flex h-[calc(100%-62px)]">
              {isAdmin && (
                <div className="w-[120px] border-r border-slate-100 p-2">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Hoi thoai</div>
                  <div className="space-y-1 overflow-auto pr-1">
                    {conversations.map((conv) => (
                      <button
                        key={conv.peerUser.id}
                        onClick={() => handleAdminPickUser(conv.peerUser.id)}
                        className={`w-full rounded-lg px-2 py-2 text-left text-xs transition ${
                          selectedUserId === conv.peerUser.id
                            ? 'bg-red-50 text-[#ff5c62]'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="truncate font-semibold">{conv.peerUser.name || conv.peerUser.email}</div>
                        <div className="truncate text-[10px]">{conv.lastMessage?.text || ''}</div>
                      </button>
                    ))}

                    {conversations.length === 0 && adminKnownUsers.length > 0 && (
                      adminKnownUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => handleAdminPickUser(u.id)}
                          className={`w-full rounded-lg px-2 py-2 text-left text-xs transition ${
                            selectedUserId === u.id
                              ? 'bg-red-50 text-[#ff5c62]'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="truncate font-semibold">{u.name || u.email}</div>
                          <div className="truncate text-[10px]">Bat dau chat</div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col">
                <div className="flex-1 space-y-2 overflow-auto p-3">
                  {loading && <div className="text-xs text-slate-500">Dang tai tin nhan...</div>}
                  {!loading && messages.length === 0 && (
                    <div className="text-xs text-slate-500">Chua co tin nhan nao.</div>
                  )}
                  {messages.map((msg) => {
                    const mine = msg.senderId === currentUser.id;
                    return (
                      <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                          mine ? 'bg-[#ff5c62] text-white' : 'bg-slate-100 text-slate-800'
                        }`}
                        >
                          <div>{msg.text}</div>
                          <div className={`mt-1 text-[10px] ${mine ? 'text-red-100' : 'text-slate-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 p-3">
                  {error && <div className="mb-2 text-xs text-red-500">{error}</div>}
                  <div className="flex gap-2">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                      placeholder="Nhap tin nhan..."
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#ff5c62]"
                    />
                    <button
                      onClick={handleSend}
                      className="rounded-xl bg-[#ff5c62] px-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isAdmin && !selectedUserId}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
