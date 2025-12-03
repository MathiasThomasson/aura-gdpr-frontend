import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Card from '@/components/Card';
import { blogPosts } from './blogPosts';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <Card title="Post not found" subtitle="The blog post you are looking for does not exist.">
            <Link to="/blog" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
              Back to blog
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 space-y-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-800">
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>
        <Card title={post.title} subtitle={new Date(post.date).toLocaleDateString('en-US')}>
          <div className="space-y-3 text-sm text-slate-700">
            <p>
              This is a preview article for <strong>{post.title}</strong>. Detailed content will be published soon. In the
              meantime, contact our team to learn how AURA-GDPR can help with GDPR automation and AI.
            </p>
            <p>
              AURA-GDPR brings AI-powered workflows to DPIA, ROPA, incidents, and policies. Customers use our platform to
              generate documentation, track tasks, and keep regulators happy with always-on audit readiness.
            </p>
            <p>Stay tuned for more insights, customer stories, and deep dives into privacy engineering.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BlogDetailPage;
