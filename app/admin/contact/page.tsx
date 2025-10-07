"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { formatDistanceToNow } from "date-fns";

type ContactMessage = {
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

function MessageDetailDialog({ message, onStatusUpdate }: { 
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
        <p className="text-muted-foreground">
          Manage customer inquiries and support requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.all}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <Badge className="bg-red-100 text-red-800">{statusCounts.NEW}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusCounts.NEW}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
            <Badge className="bg-yellow-100 text-yellow-800">{statusCounts.READ}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.READ}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replied</CardTitle>
            <Badge className="bg-green-100 text-green-800">{statusCounts.REPLIED}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.REPLIED}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Messages</CardTitle>
          <CardDescription>Search and filter contact messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // Debounce search
                    setTimeout(() => fetchMessages(), 500);
                  }}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {["all", "NEW", "READ", "REPLIED"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {status === "all" ? "All" : getStatusLabel(status)}
                  {status !== "all" && ` (${statusCounts[status as keyof typeof statusCounts]})`}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Messages ({filteredMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchMessages}
                className="mt-2 text-blue-600 hover:underline"
              >
                Try Again
              </button>
            </div>
          )}
          
          {!loading && !error && (
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">
                    {message.firstName} {message.lastName}
                  </TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(message.status)}>
                      {getStatusLabel(message.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(message.createdAt))} ago
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <MessageDetailDialog message={message} onStatusUpdate={updateMessageStatus} />
                      <Button variant="outline" size="sm" onClick={() => deleteMessage(message.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}