
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, AlertTriangle, FileText, Users, Clock } from "lucide-react";

export default function EditorialStandardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Editorial Standards for CRYPTO AND AI CENTRAL
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Our commitment to providing trustworthy, accurate, and unbiased information is at the core of everything we do.
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Our Evaluation Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed mb-4">
              Every project submitted to our directory undergoes a rigorous multi-stage evaluation process. We maintain independence and objectivity while ensuring comprehensive coverage of the most important factors affecting user safety and experience.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-semibold text-slate-900">48-72 Hours</p>
                <p className="text-sm text-slate-600">Average Review Time</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-slate-900">3+ Reviewers</p>
                <p className="text-sm text-slate-600">Independent Analysis</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="font-semibold text-slate-900">15+ Criteria</p>
                <p className="text-sm text-slate-600">Evaluation Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Trust */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600" />
              Security & Trust Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Smart Contract Security</h4>
                <ul className="text-slate-700 space-y-1 ml-4">
                  <li>• Third-party security audits from reputable firms</li>
                  <li>• Code verification and open-source availability</li>
                  <li>• Bug bounty programs and responsible disclosure</li>
                  <li>• Historical security incident analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Team & Governance</h4>
                <ul className="text-slate-700 space-y-1 ml-4">
                  <li>• Team member credentials and track record</li>
                  <li>• Regulatory compliance and legal structure</li>
                  <li>• Governance model and community involvement</li>
                  <li>• Transparency in operations and decision-making</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Evaluation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Technical & Performance Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  What We Look For
                </h4>
                <ul className="text-slate-700 space-y-2">
                  <li>• Proven track record and user adoption</li>
                  <li>• Robust technical architecture</li>
                  <li>• Active development and maintenance</li>
                  <li>• Clear documentation and support</li>
                  <li>• Competitive features and pricing</li>
                  <li>•• Strong community and ecosystem</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Red Flags
                </h4>
                <ul className="text-slate-700 space-y-2">
                  <li>• Unaudited or recently audited code</li>
                  <li>• Anonymous teams with no verification</li>
                  <li>• Unrealistic promises or guarantees</li>
                  <li>• Lack of regulatory clarity</li>
                  <li>• Poor user reviews or community feedback</li>
                  <li>• History of security incidents</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tier System */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Tier System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Sponsored</Badge>
                  <span className="font-semibold text-slate-900">Premium Partners</span>
                </div>
                <p className="text-slate-700 text-sm">
                  Thoroughly vetted platforms that have undergone extended due diligence and maintain ongoing partnerships with our team.
                </p>
              </div>
              
              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">Featured</Badge>
                  <span className="font-semibold text-slate-900">Editor's Choice</span>
                </div>
                <p className="text-slate-700 text-sm">
                  Exceptional projects that meet our highest standards for security, innovation, and user experience.
                </p>
              </div>
              
              <div className="p-4 border border-slate-200 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Basic</Badge>
                  <span className="font-semibold text-slate-900">Verified Listings</span>
                </div>
                <p className="text-slate-700 text-sm">
                  Quality platforms that have passed our standard evaluation process and meet baseline security requirements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Continuous Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 mb-4">
              Our work doesn't end after initial approval. We continuously monitor listed projects for:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="text-slate-700 space-y-1">
                <li>• Security incidents or vulnerabilities</li>
                <li>• Changes in team or governance</li>
                <li>• Regulatory developments</li>
              </ul>
              <ul className="text-slate-700 space-y-1">
                <li>• User feedback and community sentiment</li>
                <li>• Technical updates and improvements</li>
                <li>• Market performance and adoption</li>
              </ul>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">
                Projects may be reclassified or removed if they no longer meet our standards.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
