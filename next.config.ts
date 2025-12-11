import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

// Use the default path that next-intl expects
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
    // Optional: Add basePath if deploying to a subdirectory
    // basePath: '/mihaly-portfolio', 
};

export default withNextIntl(nextConfig);
