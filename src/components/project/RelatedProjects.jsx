import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function RelatedProjects({ projects }) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Related Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => {
          const avatar = project.name.charAt(0).toUpperCase();
          
          return (
            <Link
              key={project.id}
              to={createPageUrl("Project") + `?id=${project.id}`}
              className="block group"
            >
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                {/* Avatar/Logo - uniform 48x48px square */}
                <div className="flex-shrink-0">
                  {project.logo_url ? (
                    <img
                      src={project.logo_url}
                      alt={`${project.name} logo`}
                      className="w-12 h-12 rounded-[14px] bg-white border border-slate-200 object-cover"
                      style={{ aspectRatio: '1/1' }}
                    />
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-[14px] flex items-center justify-center border border-blue-500/30 relative overflow-hidden"
                      style={{ 
                        aspectRatio: '1/1',
                        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(124, 58, 237, 0.26))',
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <span className="text-blue-600 text-xl font-bold tracking-wider relative z-10">
                        {avatar}
                      </span>
                      <div 
                        className="absolute inset-0 opacity-60 pointer-events-none"
                        style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.7), transparent 60%)' }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                    {project.name}
                  </h4>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {project.description}
                  </p>
                  <Badge variant="secondary" className="text-xs mt-2">
                    {project.category}
                  </Badge>
                </div>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}