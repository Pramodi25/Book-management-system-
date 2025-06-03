import React from 'react';

const TestPage = () => {
  console.log('TestPage rendering');
  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-blue-600">Test Page</h1>
      <p className="mt-2">If you can see this, the UI is working!</p>
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => alert('Button clicked!')}
      >
        Click Me
      </button>
    </div>
  );
};

export default TestPage;
