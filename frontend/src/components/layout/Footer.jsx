import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>© 2026 BlogHub. All rights reserved.</p>
      <p>Created by Your Name</p>
    </footer>
  );
};

const styles = {
  footer: {
    textAlign: 'center',
    padding: '15px 0',
    backgroundColor: '#f5f5f5',
    marginTop: 'auto',
  },
};

export default Footer;
