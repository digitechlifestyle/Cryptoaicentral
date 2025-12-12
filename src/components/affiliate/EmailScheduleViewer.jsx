
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { base44 } from "@/api/base44Client";
import { Calendar, Clock, Mail, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EmailScheduleViewer({ affiliate }) {
  const [subscribers, setSubscribers] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [scheduledEmails, setScheduledEmails] = useState([]);
  const [selectedSubscribers, setSelectedSubscribers] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [subsData, seqData] = await Promise.all([
        base44.entities.NewsletterSubscriber.list("-created_date", 1000),
        base44.entities.AutoresponderSequence.filter({ 
          affiliate_id: affiliate.id,
          active: true 
        })
      ]);

      setSubscribers(subsData);
      setSequences(seqData);
      generateSchedule(subsData, seqData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
    setIsLoading(false);
  };

  const generateSchedule = (subs, seqs) => {
    const schedule = [];
    const today = new Date();

    subs.forEach(subscriber => {
      const subDate = new Date(subscriber.created_date);
      
      seqs.forEach(sequence => {
        if (sequence.emails) {
          sequence.emails.forEach((email, index) => {
            const sendDate = new Date(subDate);
            sendDate.setDate(sendDate.getDate() + (email.delay_days || 0));

            schedule.push({
              id: `${subscriber.id}-${sequence.id}-${index}`,
              subscriber_email: subscriber.email,
              subscriber_name: subscriber.name,
              sequence_name: sequence.name,
              email_subject: email.subject,
              send_date: sendDate,
              delay_days: email.delay_days || 0,
              status: sendDate <= today ? 'sent' : 'scheduled',
              email_index: index + 1,
              total_emails: sequence.emails.length
            });
          });
        }
      });
    });

    // Sort by send date
    schedule.sort((a, b) => a.send_date - b.send_date);
    setScheduledEmails(schedule);
  };

  const toggleSubscriber = (email) => {
    const newSelected = new Set(selectedSubscribers);
    if (newSelected.has(email)) {
      newSelected.delete(email);
    } else {
      newSelected.add(email);
    }
    setSelectedSubscribers(newSelected);
  };

  const toggleAll = () => {
    if (selectedSubscribers.size === subscribers.length) {
      setSelectedSubscribers(new Set());
    } else {
      setSelectedSubscribers(new Set(subscribers.map(s => s.email)));
    }
  };

  const getUpcomingEmails = () => {
    const today = new Date();
    return scheduledEmails.filter(e => e.send_date > today).slice(0, 10);
  };

  const getRecentlySent = () => {
    const today = new Date();
    return scheduledEmails.filter(e => e.send_date <= today).slice(0, 10);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Spam Prevention Panel */}
      <Card className="border-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Spam Prevention & Subscriber Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertDescription>
              Select subscribers to exclude from specific campaigns. Checked subscribers will still receive scheduled autoresponders but can be excluded from manual broadcasts.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between mb-4 pb-3 border-b">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedSubscribers.size === subscribers.length}
                onCheckedChange={toggleAll}
              />
              <span className="font-semibold">
                Select All ({subscribers.length} subscribers)
              </span>
            </div>
            <Badge variant="outline">
              {selectedSubscribers.size} selected
            </Badge>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {subscribers.map(subscriber => (
              <div key={subscriber.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded">
                <Checkbox
                  checked={selectedSubscribers.has(subscriber.email)}
                  onCheckedChange={() => toggleSubscriber(subscriber.email)}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{subscriber.name}</p>
                  <p className="text-xs text-slate-500">{subscriber.email}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {scheduledEmails.filter(e => e.subscriber_email === subscriber.email && e.status === 'sent').length} sent
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Schedule Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Email Schedule Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upcoming Emails */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              Upcoming Scheduled Emails
            </h3>
            {getUpcomingEmails().length === 0 ? (
              <p className="text-slate-500 text-sm">No emails scheduled</p>
            ) : (
              <div className="space-y-2">
                {getUpcomingEmails().map(email => (
                  <div key={email.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{email.email_subject}</p>
                        <p className="text-xs text-slate-600">
                          To: {email.subscriber_name} ({email.subscriber_email})
                        </p>
                      </div>
                      <Badge className="bg-green-600">
                        {email.send_date.toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail className="w-3 h-3" />
                      {email.sequence_name} - Email {email.email_index}/{email.total_emails}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Sent */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Recently Sent Emails
            </h3>
            {getRecentlySent().length === 0 ? (
              <p className="text-slate-500 text-sm">No emails sent yet</p>
            ) : (
              <div className="space-y-2">
                {getRecentlySent().map(email => (
                  <div key={email.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{email.email_subject}</p>
                        <p className="text-xs text-slate-600">
                          To: {email.subscriber_name} ({email.subscriber_email})
                        </p>
                      </div>
                      <Badge variant="outline">
                        {email.send_date.toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail className="w-3 h-3" />
                      {email.sequence_name} - Email {email.email_index}/{email.total_emails}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{getUpcomingEmails().length}</div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{getRecentlySent().length}</div>
                <p className="text-sm text-muted-foreground">Sent</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{subscribers.length}</div>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
