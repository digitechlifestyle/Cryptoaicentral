import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, MessageCircle, HelpCircle, Shield, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SeoMeta from "../components/shared/SeoMeta";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      await base44.integrations.Core.SendEmail({
        to: 'support@cryptoaidirectory.com',
        subject: `[${formData.category}] ${formData.subject}`,
        body: `
Name: ${formData.name}
Email: ${formData.email}
Category: ${formData.category}

Message:
${formData.message}
        `
      });

      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to send message. Please try again or email us directly at support@cryptoaidirectory.com');
      console.error('Contact form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <SeoMeta 
        title="Contact Us | Crypto AI Central"
        description="Get in touch with Crypto AI Central. We're here to help with questions, partnership proposals, and platform suggestions."
        keywords="contact, support, crypto ai central, partnerships, help"
      />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Have a question, partnership proposal, or suggestion? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  Send us a message
                </CardTitle>
                <CardDescription>
                  Our team will get back to you within 24-48 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-10">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">Message Sent!</h3>
                    <p className="text-slate-600 mb-4">
                      Thank you for contacting CRYPTO AND AI CENTRAL. We'll be in touch soon.
                    </p>
                    <Button onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', category: '', message: '' });
                    }}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          aria-invalid={errors.name ? 'true' : 'false'}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                          <p id="name-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          aria-invalid={errors.email ? 'true' : 'false'}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                          <p id="email-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <Select onValueChange={(value) => handleSelectChange('category', value)} value={formData.category} required>
                        <SelectTrigger id="category" className={errors.category ? 'border-red-500' : ''}>
                          <SelectValue placeholder="What's this about?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                          <SelectItem value="Platform Suggestion">Platform Suggestion</SelectItem>
                          <SelectItem value="Technical Support">Technical Support</SelectItem>
                          <SelectItem value="Partnership">Partnership</SelectItem>
                          <SelectItem value="Press & Media">Press & Media</SelectItem>
                          <SelectItem value="Feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        aria-invalid={errors.subject ? 'true' : 'false'}
                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                        className={errors.subject ? 'border-red-500' : ''}
                      />
                      {errors.subject && (
                        <p id="subject-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        required
                        aria-invalid={errors.message ? 'true' : 'false'}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                        className={errors.message ? 'border-red-500' : ''}
                      />
                      {errors.message && (
                        <p id="message-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & FAQs */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-green-600" />
                  Direct Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-slate-900">General Inquiries</p>
                  <a href="mailto:hello@cryptoaidirectory.com" className="text-blue-600 hover:underline">
                    hello@cryptoaidirectory.com
                  </a>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Technical Support</p>
                  <a href="mailto:support@cryptoaidirectory.com" className="text-blue-600 hover:underline">
                    support@cryptoaidirectory.com
                  </a>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Partnerships</p>
                  <a href="mailto:partnerships@cryptoaidirectory.com" className="text-blue-600 hover:underline">
                    partnerships@cryptoaidirectory.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-700">General Inquiries</span>
                  <span className="text-slate-900 font-medium">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Technical Support</span>
                  <span className="text-slate-900 font-medium">12 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Platform Reviews</span>
                  <span className="text-slate-900 font-medium">48-72 hours</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-orange-600" />
                  Quick Answers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-slate-900 mb-1">How do I submit a platform?</p>
                  <p className="text-sm text-slate-600">Click "Add Listing" in the sidebar and fill out our form.</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900 mb-1">How long does review take?</p>
                  <p className="text-sm text-slate-600">48-72 hours for standard reviews, longer for complex platforms.</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900 mb-1">Is listing free?</p>
                  <p className="text-sm text-slate-600">Basic listings are free. Featured and sponsored tiers have fees.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}