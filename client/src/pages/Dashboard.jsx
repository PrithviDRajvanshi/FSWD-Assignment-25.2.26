import React from 'react';

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>
      <p>This is a placeholder for authenticated users.</p>
      <p>You'll see your posts and stats here once you're logged in.</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    textAlign: 'center',
  },
};

export default Dashboard;
