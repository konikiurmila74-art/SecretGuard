import type { Finding, Severity } from '@/types';

interface DemoFile {
  name: string;
  content: string;
}

export const DEMO_FILES: DemoFile[] = [
  {
    name: '.env',
    content: `AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=ap-south-1
DATABASE_URL=postgresql://user:pass@localhost:5432/db
GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz
JWT_SECRET=mySuperSecretKey12345
API_KEY=sk_live_4eC39HqLyjWDarjtT1zdp7dc
GOOGLE_API_KEY=AIzaSyDQ9pXMbKQvL3z5Q8rN4tY6uW2xZ1aBcDe`,
  },
  {
    name: 'config.py',
    content: `import os

DEBUG = True
SECRET_KEY = 'django-insecure-abc123def456ghi789'
DB_PASSWORD = "SuperSecret123!"
STRIPE_SECRET = "sk_test_4eC39HqLyjWDarjtT1zdp7dc"
API_SECRET = "secret_abc123xyz789"`,
  },
  {
    name: 'app.js',
    content: `const express = require('express');
const app = express();

const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----MIIEvQIB";
const PASSWORD = "admin123";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

app.listen(3000);`,
  },
  {
    name: 'database.py',
    content: `import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="mydb",
    user="admin",
    password="Password123!"
)

MONGO_URI = "mongodb+srv://user:secret@cluster.mongodb.net/db"`,
  },
  {
    name: 'settings.json',
    content: `{
  "api_key": "AIzaSyBcDeFgHiJkLmNoPqRsTuVwXyZ123456",
  "secret_key": "prod_secret_xyz_789",
  "aws_access_key": "AKIAI44QH8GB3EXAMPLE",
  "github_pat": "github_pat_11ABCDEFG0123456789"
}`,
  },
  {
    name: 'auth.ts',
    content: `const JWT_SECRET = "super-secret-jwt-key-2024";
const REFRESH_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0";
const API_TOKEN = "tok_abc123def456ghi789";

export function authenticate(user: string, pass: string) {
  return API_TOKEN;
}`,
  },
];

const SECRET_PATTERNS: { type: string; pattern: RegExp; severity: Severity }[] = [
  { type: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/g, severity: 'critical' },
  { type: 'GitHub Token', pattern: /ghp_[a-zA-Z0-9]{36}/g, severity: 'critical' },
  { type: 'GitHub Token', pattern: /github_pat_[a-zA-Z0-9_]{22,}/g, severity: 'critical' },
  { type: 'Google API Key', pattern: /AIza[a-zA-Z0-9_\-]{35}/g, severity: 'medium' },
  { type: 'JWT Token', pattern: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+/g, severity: 'high' },
  { type: 'Private Key', pattern: /-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/g, severity: 'critical' },
  { type: 'Stripe Secret Key', pattern: /sk_(?:live|test)_[a-zA-Z0-9]{24,}/g, severity: 'critical' },
];

const ASSIGNMENT_PATTERNS: { type: string; pattern: RegExp; severity: Severity }[] = [
  { type: 'Database Password', pattern: /(?:DB_PASSWORD|DATABASE_PASSWORD|DB_PASS)\s*[=:]\s*["']([^"']{4,})["']/gi, severity: 'high' },
  { type: 'Database Password', pattern: /password\s*[=:]\s*["']([^"']{4,})["']/gi, severity: 'high' },
  { type: 'JWT Secret', pattern: /(?:JWT_SECRET|JWT_KEY)\s*[=:]\s*["']([^"']{4,})["']/gi, severity: 'high' },
  { type: 'API Key', pattern: /(?:API_KEY|APIKEY|api_key)\s*[=:]\s*["']([^"']{4,})["']/gi, severity: 'medium' },
  { type: 'Secret Key', pattern: /(?:SECRET_KEY|SECRET|secret_key)\s*[=:]\s*["']([^"']{4,})["']/gi, severity: 'high' },
  { type: 'AWS Secret Key', pattern: /(?:AWS_SECRET_ACCESS_KEY|AWS_SECRET)\s*[=:]\s*["']?([A-Za-z0-9/+]{16,})/gi, severity: 'critical' },
  { type: 'Private Key', pattern: /(?:PRIVATE_KEY)\s*[=:]\s*["']([^"']{10,})["']/gi, severity: 'critical' },
  { type: 'Token', pattern: /(?:TOKEN|ACCESS_TOKEN|REFRESH_TOKEN)\s*[=:]\s*["']([^"']{8,})["']/gi, severity: 'high' },
  { type: 'MongoDB URI', pattern: /mongodb(?:\+srv)?:\/\/[^:]+:([^@]+)@/gi, severity: 'high' },
  { type: 'Database URL', pattern: /postgresql:\/\/[^:]+:([^@]+)@/gi, severity: 'high' },
];

const DANGER_DESCRIPTIONS: Record<string, string> = {
  'AWS Access Key': 'Exposed cloud credentials can allow unauthorized access to your AWS infrastructure, potentially leading to data theft, resource abuse, or full account compromise.',
  'GitHub Token': 'An exposed GitHub token can grant attackers access to your repositories, allowing them to modify code, steal intellectual property, or inject malicious commits.',
  'Google API Key': 'Exposed Google API keys can be abused for quota theft, unauthorized API access, or unexpected billing charges on your Google Cloud account.',
  'JWT Token': 'Exposed JWT tokens can be used to impersonate authenticated users, bypass access controls, and gain unauthorized access to protected resources.',
  'Private Key': 'An exposed private key compromises the entire cryptographic security of your system, allowing attackers to decrypt sensitive data or impersonate your service.',
  'Stripe Secret Key': 'An exposed Stripe secret key can allow attackers to process fraudulent charges, access customer payment data, and compromise your payment infrastructure.',
  'Database Password': 'Exposed database credentials can allow attackers to access, modify, or delete your entire database, leading to data breaches and data loss.',
  'JWT Secret': 'An exposed JWT secret allows attackers to forge valid authentication tokens, impersonate any user, and gain full access to your application.',
  'API Key': 'Exposed API keys can be used to abuse your services, exhaust rate limits, or access sensitive data through your API endpoints.',
  'Secret Key': 'An exposed secret key can compromise your application security, allowing attackers to bypass security measures and access protected resources.',
  'AWS Secret Key': 'An exposed AWS secret key combined with an access key grants full access to your cloud infrastructure and resources.',
  'Token': 'An exposed token can be used to impersonate authenticated sessions and bypass security controls.',
  'MongoDB URI': 'An exposed MongoDB connection string can allow attackers to access, modify, or destroy your entire database.',
  'Database URL': 'An exposed database connection string can allow attackers to connect directly to your database and access sensitive data.',
};

const FIX_STEPS: Record<string, string[]> = {
  'AWS Access Key': [
    'Revoke the exposed AWS access key immediately in the IAM console',
    'Generate a new access key pair',
    'Store credentials in AWS Secrets Manager or environment variables',
    'Add .env to .gitignore',
    'Audit CloudTrail logs for unauthorized API calls',
  ],
  'GitHub Token': [
    'Revoke the exposed token in GitHub Settings > Developer settings > Tokens',
    'Generate a new token with minimal required scopes',
    'Store the new token in environment variables',
    'Add config files to .gitignore',
    'Review repository access logs for suspicious activity',
  ],
  default: [
    'Revoke or rotate the exposed credential immediately',
    'Generate a new credential',
    'Move secrets into environment variables or a secrets manager',
    'Add the file to .gitignore',
    'Audit access logs for unauthorized usage',
  ],
};

function maskSecret(value: string): string {
  if (value.length <= 8) return '*'.repeat(value.length);
  const prefix = value.slice(0, 4);
  const suffix = value.slice(-4);
  const masked = '*'.repeat(Math.min(value.length - 8, 20));
  return `${prefix}${masked}${suffix}`;
}

function calculateEntropy(value: string): number {
  const chars = new Map<string, number>();
  for (const c of value) {
    chars.set(c, (chars.get(c) || 0) + 1);
  }
  let entropy = 0;
  for (const count of chars.values()) {
    const p = count / value.length;
    entropy -= p * Math.log2(p);
  }
  return Math.min(100, Math.round((entropy / 4) * 100));
}

function getDanger(type: string): string {
  return DANGER_DESCRIPTIONS[type] || 'This exposed credential can be exploited by attackers to gain unauthorized access to your systems and data.';
}

function getFixes(type: string): string[] {
  return FIX_STEPS[type] || FIX_STEPS.default;
}

let findingIdCounter = 0;

function createFinding(
  type: string,
  severity: Severity,
  fileName: string,
  lineNum: number,
  secretValue: string,
  fullLine: string,
  project: string
): Finding {
  findingIdCounter += 1;
  const lines = fullLine.split('\n');
  const snippetLines = lines.length > 1 ? lines : [fullLine];
  const snippet = snippetLines.slice(Math.max(0, lineNum - 3), lineNum + 2).join('\n');

  return {
    id: `finding-${findingIdCounter}`,
    type,
    severity,
    file: fileName,
    line: lineNum,
    maskedSecret: maskSecret(secretValue),
    codeSnippet: snippet,
    highlightedLine: lineNum,
    description: `Detected ${type} in ${fileName}`,
    danger: getDanger(type),
    fixes: getFixes(type),
    status: 'exposed',
    confidence: calculateEntropy(secretValue),
    project,
  };
}

export function scanFiles(files: DemoFile[], projectName: string): Finding[] {
  const findings: Finding[] = [];
  const seen = new Set<string>();

  for (const file of files) {
    const lines = file.content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      for (const { type, pattern, severity } of SECRET_PATTERNS) {
        pattern.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(line)) !== null) {
          const key = `${file.name}-${i}-${match[0]}`;
          if (!seen.has(key)) {
            seen.add(key);
            findings.push(createFinding(type, severity, file.name, i + 1, match[0], line, projectName));
          }
        }
      }

      for (const { type, pattern, severity } of ASSIGNMENT_PATTERNS) {
        pattern.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(line)) !== null) {
          const secretValue = match[1] || match[0];
          const key = `${file.name}-${i}-${secretValue}`;
          if (!seen.has(key) && secretValue.length >= 4) {
            seen.add(key);
            findings.push(createFinding(type, severity, file.name, i + 1, secretValue, line, projectName));
          }
        }
      }
    }
  }

  return findings;
}
