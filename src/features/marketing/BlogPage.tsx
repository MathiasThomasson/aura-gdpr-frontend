import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '@/components/Card';
import { blogPosts } from './blogPosts';

const BlogPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Blog</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Insights from the AURA-GDPR team</h1>
          <p className="text-slate-600">Guides and updates on GDPR, AI compliance, and running privacy programs.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {blogPosts.map((post) => (
            <Card key={post.slug} title={post.title} subtitle={new Date(post.date).toLocaleDateString('en-US')}>
              <p className="text-sm text-slate-600">{post.summary}</p>
              <Link
                to={`/blog/${post.slug}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-800"
              >
                Read more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
