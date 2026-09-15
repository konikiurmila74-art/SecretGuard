import type { Finding, ScanHistoryEntry, ScanResult } from '@/types';

export const DEMO_PROJECT_NAME = 'demo-project';

export const DEMO_FINDINGS: Finding[] = [
  {
    id: 'demo-1',
    type: 'AWS Access Key',
    severity: 'critical',
    file: '.env',
    line: 1,
    maskedSecret: 'AKIA************X7F2',
    codeSnippet: `AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=ap-south-1
DATABASE_URL=postgresql://user:pass@localhost:5432/db`,
    highlightedLine: 1,
    description: 'Detected AWS Access Key in .env',
    danger: 'Exposed cloud credentials can allow unauthorized access to your AWS infrastructure, potentially leading to data theft, resource abuse, or full account compromise.',
    fixes: [
      'Revoke the exposed AWS access key immediately in the IAM console',
      'Generate a new access key pair',
      'Store credentials in AWS Secrets Manager or environment variables',
      'Add .env to .gitignore',
      'Audit CloudTrail logs for unauthorized API calls',
    ],
    status: 'exposed',
    confidence: 92,
    project: DEMO_PROJECT_NAME,
  },
  {
    id: 'demo-2',
    type: 'GitHub Token',
    severity: 'critical',
    file: '.env',
    line: 5,
    maskedSecret: 'ghp_****************************',
    codeSnippet: `GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz
JWT_SECRET=mySuperSecretKey12345
API_KEY=sk_live_4eC39HqLyjWDarjtT1zdp7dc`,
    highlightedLine: 1,
    description: 'Detected GitHub Personal Access Token in .env',
    danger: 'An exposed GitHub token can grant attackers access to your repositories, allowing them to modify code, steal intellectual property, or inject malicious commits.',
    fixes: [
      'Revoke the exposed token in GitHub Settings > Developer settings > Tokens',
      'Generate a new token with minimal required scopes',
      'Store the new token in environment variables',
      'Add config files to .gitignore',
      'Review repository access logs for suspicious activity',
    ],
    status: 'exposed',
    confidence: 95,
    project: DEMO_PROJECT_NAME,
  },
  {
    id: 'demo-3',
    type: 'Stripe Secret Key',
    severity: 'critical',
    file: 'config.py',
    line: 6,
    maskedSecret: 'sk_l****************************',
    codeSnippet: `STRIPE_SECRET = "sk_test_4eC39HqLyjWDarjtT1zdp7dc"
API_SECRET = "secret_abc123xyz789"`,
    highlightedLine: 1,
    description: 'Detected Stripe Secret Key in config.py',
    danger: 'An exposed Stripe secret key can allow attackers to process fraudulent charges, access customer payment data, and compromise your payment infrastructure.',
    fixes: [
      'Revoke the exposed Stripe key in the Stripe Dashboard',
      'Generate a new restricted key',
      'Store the new key in environment variables',
      'Add config.py to .gitignore',
      'Review Stripe logs for unauthorized charges',
    ],
    status: 'exposed',
    confidence: 88,
    project: DEMO_PROJECT_NAME,
  },
  {
    id: 'demo-4',
    type: 'Database Password',
    severity: 'high',
    file: 'database.py',
    line: 6,
    maskedSecret: 'Pass********',
    codeSnippet: `conn = psycopg2.connect(
    host="localhost",
    database="mydb",
    user="admin",
    password="Password123!"
)`,
    highlightedLine: 5,
    description: 'Detected database password in database.py',
    danger: 'Exposed database credentials can allow attackers to access, modify, or delete your entire database, leading to data breaches and data loss.',
    fixes: [
      'Change the database password immediately',
      'Store credentials in environment variables',
      'Add database.py to .gitignore',
      'Audit database access logs',
      'Enable database connection encryption',
    ],
    status: 'exposed',
    confidence: 78,
    project: DEMO_PROJECT_NAME,
  },
  {
    id: 'demo-5',
    type: 'JWT Secret',
    severity: 'high',
    file: 'auth.ts',
    line: 1,
    maskedSecret: 'supe************2024',
    codeSnippet: `const JWT_SECRET = "super-secret-jwt-key-2024";
const REFRESH_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0";
const API_TOKEN = "tok_abc123def456ghi789";`,
    highlightedLine: 1,
    description: 'Detected JWT Secret in auth.ts',
    danger: 'An exposed JWT secret allows attackers to forge valid authentication tokens, impersonate any user, and gain full access to your application.',
    fixes: [
      'Rotate the JWT signing secret immediately',
      'Store the new secret in environment variables',
      'Add auth.ts to .gitignore',
      'Invalidate all active sessions',
      'Review authentication logs for suspicious activity',
    ],
    status: 'exposed',
    confidence: 82,
    project: DEMO_PROJECT_NAME,
  },
  {
    id: 'demo-6',
    type: 'Secret Key',
    severity: 'high',
    file: 'config.py',
    line: 3,
    maskedSecret: 'dja************789',
    codeSnippet: `import os

DEBUG = True
SECRET_KEY = 'django-insecure-abc123def456ghi789'
DB_PASSWORD = "SuperSecret123!"`,
    highlightedLine: 3,
    description: 'Detected Django Secret Key in config.py',
    danger: 'An exposed secret key can compromise your application security, allowing attackers to bypass security measures and access protected resources.',
    fixes: [
      'Rotate the secret key immediately',
      'Store the new key in environment variables',
      'Add config.py to .gitignore',
      'Review application logs for security incidents',
    ],
    status: 'exposed',
    confidence: 75,
    project: DEMO_PROJECT_NAME,
  },
  {
    id: 'demo-7',
    type: 'Google API Key',
    severity: 'medium',
    file: 'settings.json',
    line: 2,
    maskedSecret: 'AIza****...****56',
    codeSnippet: `{
  "api_key": "AIzaSyBcDeFgHiJkLmNoPqRsTuVwXyZ123456",
  "secret_key": "prod_secret_xyz_789",
  "aws_access_key": "AKIAI44QH8GB3EXAMPLE"`,
    highlightedLine: 2,
    description: 'Detected Google API Key in settings.json',
    danger: 'Exposed Google API keys can be abused for quota theft, unauthorized API access, or unexpected billing charges on your Google Cloud account.',
    fixes: [
      'Restrict the API key to specific domains/IPs in Google Cloud Console',
      'Regenerate the API key',
      'Store the new key in environment variables',
      'Add settings.json to .gitignore',
    ],
    status: 'exposed',
    confidence: 65,
    project: DEMO_PROJECT_NAME,
  },
];

export const DASHBOARD_STATS = {
  totalProjects: 12,
  filesScanned: 4827,
  totalFindings: 34,
  criticalCount: 5,
  highCount: 14,
  mediumCount: 15,
};

export const RECENT_SCANS: ScanHistoryEntry[] = [
  { id: 'h1', project: 'ecommerce-api', date: 'Today, 10:42 AM', filesScanned: 542, secretsDetected: 2, securityScore: 92, status: 'Secure' },
  { id: 'h2', project: 'student-portal', date: 'Today, 9:18 AM', filesScanned: 318, secretsDetected: 7, securityScore: 62, status: 'At Risk' },
  { id: 'h3', project: 'payment-service', date: 'Yesterday, 4:30 PM', filesScanned: 821, secretsDetected: 1, securityScore: 78, status: 'Needs Attention' },
  { id: 'h4', project: 'college-management-system', date: 'Yesterday, 2:15 PM', filesScanned: 634, secretsDetected: 7, securityScore: 62, status: 'At Risk' },
  { id: 'h5', project: 'auth-microservice', date: '2 days ago', filesScanned: 289, secretsDetected: 0, securityScore: 100, status: 'Secure' },
  { id: 'h6', project: 'inventory-api', date: '3 days ago', filesScanned: 445, secretsDetected: 3, securityScore: 85, status: 'Secure' },
];

export const SCAN_STAGES = [
  'Initializing scanner',
  'Discovering files',
  'Analyzing source code',
  'Detecting credentials',
  'Calculating entropy',
  'Classifying severity',
  'Generating security report',
];

export const SCANNING_FILES = ['.env', 'config.py', 'app.py', 'database.js', 'settings.json', 'auth.ts'];

export function createDemoScanResult(): ScanResult {
  return {
    id: `scan-${Date.now()}`,
    project: DEMO_PROJECT_NAME,
    date: new Date().toLocaleString(),
    filesScanned: 124,
    linesAnalyzed: 18492,
    secretsDetected: DEMO_FINDINGS.length,
    securityScore: 30,
    status: 'critical',
    findings: DEMO_FINDINGS,
  };
}
