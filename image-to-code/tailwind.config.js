/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-out': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '10%': { opacity: '1', transform: 'translateY(0)' },
          '90%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        'fade-in-out': 'fade-in-out 5s ease-in-out',
        'slide-in': 'slide-in 0.5s ease-out'
      },
      typography: {
        xs: {
          css: {
            fontSize: '0.75rem',
            lineHeight: '1.2',
            color: '#374151',
            p: {
              marginBottom: '0.5rem',
            },
            h1: {
              fontSize: '1rem',
              marginBottom: '0.75rem',
            },
            h2: {
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
            },
            h3: {
              fontSize: '0.75rem',
              marginBottom: '0.5rem',
            },
            'code': {
              fontSize: '0.7rem !important',
              padding: '0.1rem 0.2rem',
              backgroundColor: '#f8fafc',
              color: '#0f172a !important',
              borderRadius: '0.25rem',
              border: '1px solid #e2e8f0',
            },
            'pre': {
              fontSize: '0.7rem !important',
              padding: '0.75rem',
              marginBottom: '0.75rem',
              backgroundColor: '#f8fafc',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              code: {
                fontSize: '0.7rem !important',
                backgroundColor: 'transparent',
                padding: 0,
                border: 'none',
                color: '#0f172a',
              }
            },
            'ul': {
              marginBottom: '0.75rem',
            },
            'ol': {
              marginBottom: '0.75rem',
            },
            'li': {
              marginBottom: '0.25rem',
            }
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 