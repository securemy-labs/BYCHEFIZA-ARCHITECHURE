import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const [apiStatus, setApiStatus] = useState('Checking...');

  useEffect(() => {
    fetch('http://localhost:3000/health')
      .then(res => res.json())
      .then(data => setApiStatus(data.status))
      .catch(() => setApiStatus('Error'));
  }, []);

  return (
    <>
      <Head>
        <title>BYCHEFIZA - E-Commerce Platform</title>
        <meta name="description" content="Enterprise-grade e-commerce platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={styles.main}>
        <h1 style={styles.title}>Welcome to BYCHEFIZA</h1>
        <p style={styles.description}>
          Enterprise-Grade E-Commerce Platform
        </p>
        
        <div style={styles.statusCard}>
          <h2>API Gateway Status</h2>
          <p style={styles.status}>{apiStatus}</p>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h2>Products →</h2>
            <p>Browse our extensive catalog of products</p>
          </div>

          <div style={styles.card}>
            <h2>Orders →</h2>
            <p>Track and manage your orders</p>
          </div>

          <div style={styles.card}>
            <h2>Account →</h2>
            <p>Manage your account settings</p>
          </div>

          <div style={styles.card}>
            <h2>Support →</h2>
            <p>Get help from our support team</p>
          </div>
        </div>
      </main>
    </>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    padding: '4rem 0',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  title: {
    margin: 0,
    fontSize: '4rem',
    lineHeight: 1.15,
    textAlign: 'center',
    color: '#0070f3'
  },
  description: {
    textAlign: 'center',
    fontSize: '1.5rem',
    lineHeight: 1.5,
    marginTop: '1rem'
  },
  statusCard: {
    marginTop: '2rem',
    padding: '1.5rem',
    textAlign: 'center',
    border: '1px solid #eaeaea',
    borderRadius: '10px',
    backgroundColor: '#fafafa'
  },
  status: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#0070f3'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '800px',
    marginTop: '3rem'
  },
  card: {
    padding: '1.5rem',
    textAlign: 'left',
    color: 'inherit',
    textDecoration: 'none',
    border: '1px solid #eaeaea',
    borderRadius: '10px',
    transition: 'color 0.15s ease, border-color 0.15s ease',
    cursor: 'pointer'
  }
};
