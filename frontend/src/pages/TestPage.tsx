import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Test Page - UI System Working
        </h1>
        <p className="text-gray-600 mb-6">
          If you can see this, the basic setup is working.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Test Button
        </button>
      </div>
    </div>
  );
};

export default TestPage;