import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { Send, MessageSquare, Info } from 'lucide-react';
import { Student } from '../../types';

export const Messages: React.FC = () => {
  const { currentUser, students, connections, directMessages, sendDirectMessage } = useApp();
  
  // Select which connection to chat with
  const connectedStudents = currentUser
    ? connections
        .filter(c => c.status === 'Connected' && (c.senderId === currentUser.id || c.receiverId === currentUser.id))
        .map(c => {
          const otherId = c.senderId === currentUser.id ? c.receiverId : c.senderId;
          return students.find(s => s.id === otherId);
        })
        .filter(Boolean) as Student[]
    : [];

  const [activeRecipientId, setActiveRecipientId] = useState<string>(
    connectedStudents.length > 0 ? connectedStudents[0].id : ''
  );

  const [messageText, setMessageText] = useState('');

  if (!currentUser) return null;

  const activeStudent = students.find(s => s.id === activeRecipientId);
  const activeChat = activeRecipientId ? directMessages[activeRecipientId] || [] : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeRecipientId) return;

    sendDirectMessage(activeRecipientId, messageText);
    setMessageText('');
  };

  return (
    <div className="space-y-6 fade-in-up text-left font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Direct Messages</h1>
        <p className="text-xs text-slate-500 mt-1">Communicate directly with your confirmed classmate connections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[550px] overflow-hidden">
        
        {/* Connection sidebar */}
        <Card className="p-0 border border-slate-100 flex flex-col h-full overflow-y-auto">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-700 uppercase tracking-wider shrink-0">
            Confirmed Connections ({connectedStudents.length})
          </div>
          
          <div className="flex-1 divide-y divide-slate-50">
            {connectedStudents.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-slate-400">
                You have no connections revealed yet. Select student cards in Team Builder to connect.
              </div>
            ) : (
              connectedStudents.map(student => (
                <div
                  key={student.id}
                  onClick={() => setActiveRecipientId(student.id)}
                  className={`p-3.5 flex items-center space-x-3 cursor-pointer transition-colors ${
                    student.id === activeRecipientId 
                      ? 'bg-primary-50/50 border-l-4 border-l-primary-500 font-medium' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <Avatar name={student.name} src={student.avatarUrl} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 truncate leading-snug">{student.name}</p>
                    <p className="text-[10px] text-slate-400 truncate leading-none mt-1">{student.course}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Messaging window */}
        <Card className="md:col-span-2 p-0 border border-slate-100 flex flex-col h-full overflow-hidden">
          {activeStudent ? (
            <>
              {/* Header profile details */}
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                <div className="flex items-center space-x-2.5">
                  <Avatar name={activeStudent.name} src={activeStudent.avatarUrl} size="sm" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-850 leading-snug truncate">{activeStudent.name}</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-medium leading-none">{activeStudent.college}</p>
                  </div>
                </div>
                <Badge variant="primary" size="sm">Score: {activeStudent.collaborationScore}</Badge>
              </div>

              {/* Chat timeline */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {activeChat.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 text-center">
                    <MessageSquare className="h-8 w-8 text-slate-200 mb-2" />
                    <span>No message logs with {activeStudent.name}. Type below to send a message.</span>
                  </div>
                ) : (
                  activeChat.map((msg, idx) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div key={idx} className={`flex items-start space-x-2.5 ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Avatar name={msg.senderName} src={msg.senderAvatar} size="xs" className="mt-0.5 shrink-0" />
                        <div className="max-w-[70%]">
                          <div className={`flex items-center space-x-1.5 mb-1 ${isMe ? 'justify-end' : ''}`}>
                            <span className="text-[9px] font-bold text-slate-700">{msg.senderName}</span>
                            <span className="text-[8px] text-slate-400">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className={`p-3 rounded-2xl text-xs leading-normal shadow-sm ${
                            isMe 
                              ? 'bg-primary-600 text-white rounded-tr-none' 
                              : 'bg-slate-100 text-slate-800 rounded-tl-none border'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Messaging input bar */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 shrink-0 flex items-center space-x-3 bg-white">
                <input
                  type="text"
                  placeholder={`Send private message to ${activeStudent.name}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
                <Button type="submit" size="sm" rightIcon={<Send className="h-3.5 w-3.5" />}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 text-center p-8">
              <MessageSquare className="h-10 w-10 text-slate-200 mb-3" />
              <h3 className="font-bold text-slate-600 mb-1">No Active Chat Session</h3>
              <p className="max-w-xs leading-relaxed">Select a connection from the left sidebar panel to exchange private messages.</p>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};
export default Messages;
