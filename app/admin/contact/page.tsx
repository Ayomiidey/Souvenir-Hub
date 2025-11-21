"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MessageCircle,
  Eye,
  Trash2,
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  User
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";type ContactMessage = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED";
  createdAt: string;
  updatedAt: string;
};

function getStatusColor(status: string) {
  switch (status) {
    case "NEW": return "bg-red-100 text-red-800";
    case "READ": return "bg-yellow-100 text-yellow-800";
    case "REPLIED": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "NEW": return "New";
    case "READ": return "Read";
    case "REPLIED": return "Replied";
    default: return status;
  }
}

function MessageDialog({ message, onStatusUpdate }: { 
  message: ContactMessage; 
  onStatusUpdate: (messageId: string, status: string) => void;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [replySubject, setReplySubject] = useState(`Re: ${message.subject}`);
  const [isSending, setIsSending] = useState(false);

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setIsSending(true);
    
    try {
      const response = await fetch('/api/contact/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: message.email,
          subject: replySubject,
          message: replyMessage,
          originalMessageId: message.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reply');
      }

      // Update message status to replied
      onStatusUpdate(message.id, "REPLIED");
      
      // Reset form
      setReplyMessage("");
      setIsReplying(false);
      
      toast.success("Reply sent successfully!");
      
    } catch (error) {
      console.error('Reply error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to send reply");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>{message.subject}</span>
          </DialogTitle>
          <DialogDescription>
            Message from {message.firstName} {message.lastName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Name:</span>
              <span className="text-sm">{message.firstName} {message.lastName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm">{message.email}</span>
            </div>
            {message.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Phone:</span>
                <span className="text-sm">{message.phone}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Received:</span>
              <span className="text-sm">{formatDistanceToNow(new Date(message.createdAt))} ago</span>
            </div>
          </div>
          
          <div>
            <Badge className={getStatusColor(message.status)}>
              {getStatusLabel(message.status)}
            </Badge>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Message:</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
          </div>
        </div>
        
        {isReplying && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Reply to Customer:</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="replySubject">Subject</Label>
                <Input
                  id="replySubject"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  placeholder="Reply subject"
                />
              </div>
              <div>
                <Label htmlFor="replyMessage">Your Reply</Label>
                <Textarea
                  id="replyMessage"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={6}
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          {isReplying ? (
            <>
              <Button variant="outline" onClick={() => setIsReplying(false)} disabled={isSending}>
                Cancel Reply
              </Button>
              <Button onClick={handleSendReply} disabled={isSending || !replyMessage.trim()}>
                {isSending ? "Sending..." : "Send Reply"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsReplying(true)}>
                <Mail className="h-4 w-4 mr-2" />
                Reply via Email
              </Button>
              <Button variant="outline" onClick={() => window.open(`mailto:${message.email}?subject=Re: ${message.subject}`)}>
                Open Email Client
              </Button>
              {message.status !== "REPLIED" && (
                <Button onClick={() => onStatusUpdate(message.id, "REPLIED")}>
                  Mark as Replied
                </Button>
              )}
            </>
          )}
          {!isReplying && message.status === "NEW" && (
            <Button variant="secondary" onClick={() => onStatusUpdate(message.id, "READ")}>
              Mark as Read
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);
      
      const response = await fetch(`/api/contact?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      
      const data = await response.json();
      setMessages(data.messages || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
      toast.error("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  // Fetch messages on component mount and when filters change
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        fetchMessages(); // Refresh the list
        toast.success("Message status updated successfully");
      } else {
        toast.error("Failed to update message status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update message status");
    }
  };

  const deleteMessage = async (messageId: string) => {
    toast.promise(
      new Promise((resolve, reject) => {
        if (!confirm("Are you sure you want to delete this message?")) {
          reject(new Error("Cancelled"));
          return;
        }
        
        fetch(`/api/contact/${messageId}`, {
          method: "DELETE",
        })
        .then(response => {
          if (response.ok) {
            fetchMessages(); // Refresh the list
            resolve("Message deleted successfully");
          } else {
            reject(new Error("Failed to delete message"));
          }
        })
        .catch(error => {
          console.error("Error deleting message:", error);
          reject(error);
        });
      }),
      {
        loading: "Deleting message...",
        success: "Message deleted successfully",
        error: (err) => err.message === "Cancelled" ? "" : "Failed to delete message",
      }
    );
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch = 
      message.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: messages.length,
    NEW: messages.filter(m => m.status === "NEW").length,
    READ: messages.filter(m => m.status === "READ").length,
    REPLIED: messages.filter(m => m.status === "REPLIED").length,
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Contact Messages
          </h1>
          <p className="text-gray-600 mt-2">
            Manage customer inquiries and support requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Total Messages</h3>
              <MessageCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{statusCounts.all}</div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-100/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">New</h3>
              <Badge className="bg-red-100 text-red-800 border-red-200">{statusCounts.NEW}</Badge>
            </div>
            <div className="text-3xl font-bold text-red-600">{statusCounts.NEW}</div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-100/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Read</h3>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{statusCounts.READ}</Badge>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{statusCounts.READ}</div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Replied</h3>
              <Badge className="bg-green-100 text-green-800 border-green-200">{statusCounts.REPLIED}</Badge>
            </div>
            <div className="text-3xl font-bold text-green-600">{statusCounts.REPLIED}</div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-xl border border-slate-100/50 shadow-sm mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-slate-500 to-gray-500 rounded-full"></div>
              Filter Messages
            </h2>
            <p className="text-gray-600 text-sm">
              Search and filter contact messages
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // Debounce search
                    setTimeout(() => fetchMessages(), 500);
                  }}
                  className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "NEW", "READ", "REPLIED"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status
                    ? "bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white border-0"
                    : "bg-white/80 hover:bg-white border-gray-200"
                  }
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {status === "all" ? "All" : getStatusLabel(status)}
                  {status !== "all" && ` (${statusCounts[status as keyof typeof statusCounts]})`}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-xl border border-violet-100/50 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
              Messages ({filteredMessages.length})
            </h2>
            <p className="text-gray-600 text-sm">
              View and manage all contact messages.
            </p>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="animate-pulse">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={fetchMessages}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0"
              >
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-violet-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-violet-600 transition-colors">
                        {message.firstName} {message.lastName}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{message.email}</span>
                        </div>
                        {message.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{message.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">{message.subject}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </span>
                      <Badge
                        className={`${
                          message.status === "NEW"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : message.status === "READ"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-green-100 text-green-800 border-green-200"
                        }`}
                      >
                        {getStatusLabel(message.status)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                      <MessageDialog
                        message={message}
                        onStatusUpdate={updateMessageStatus}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMessage(message.id)}
                        className="bg-white/80 hover:bg-white border-gray-200 text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredMessages.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No messages found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}