
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, TrendingUp, Globe, CheckCircle, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            About CRYPTO AND AI CENTRAL
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your trusted guide to the best AI and crypto tools, platforms, and services in the rapidly evolving digital finance ecosystem.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed">
              We exist to democratize access to high-quality financial technology. In a space filled with complexity and risk, we provide clarity and trust. Our mission is to help individuals and institutions navigate the AI and crypto landscape with confidence, connecting them to vetted, innovative solutions that drive real value.
            </p>
          </CardContent>
        </Card>

        {/* What We Do */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Rigorous Vetting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">
                Every project in our directory undergoes comprehensive evaluation. We assess security audits, team credentials, regulatory compliance, and community feedback to ensure only trustworthy platforms make it to our users.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Market Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">
                Our team of analysts continuously monitors the market, identifying emerging trends, promising new protocols, and shifts in the regulatory landscape to keep our directory current and valuable.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Core Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Transparency</h3>
                <p className="text-sm text-slate-600">Open about our methodology, funding, and any potential conflicts of interest.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Security First</h3>
                <p className="text-sm text-slate-600">Prioritizing user safety and only featuring platforms with strong security practices.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Excellence</h3>
                <p className="text-sm text-slate-600">Maintaining the highest standards in curation, research, and user experience.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Our Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 mb-4">
              Our team combines deep expertise in traditional finance, blockchain technology, and artificial intelligence. With backgrounds from leading financial institutions, tech companies, and crypto protocols, we bring both industry knowledge and technical depth to our analysis.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Financial Analysis</Badge>
              <Badge variant="outline">Blockchain Technology</Badge>
              <Badge variant="outline">AI/ML Engineering</Badge>
              <Badge variant="outline">Regulatory Compliance</Badge>
              <Badge variant="outline">Security Auditing</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Questions? We're Here to Help</h2>
          <p className="text-slate-600 mb-6">
            Have questions about our methodology or want to suggest a platform for review?
          </p>
          <div className="flex justify-center gap-4">
            <a href="mailto:hello@cryptoaidirectory.com" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
