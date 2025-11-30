import React from 'react';

export type PageInfoBoxProps = {
  title: string;
  description: string;
};

const PageInfoBox: React.FC<PageInfoBoxProps> = ({ title, description }) => (
  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
    <h2 className="font-semibold text-blue-900">{title}</h2>
    <p className="text-sm text-blue-700 mt-1">{description}</p>
  </div>
);

export default PageInfoBox;
