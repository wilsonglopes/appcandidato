#!/bin/bash
set -e

echo "Starting deployment for Zé Milton..."
sudo mkdir -p /var/www/app-zm
sudo chown -R ubuntu:ubuntu /var/www/app-zm

if [ ! -d "/var/www/app-zm/.git" ]; then
    echo "Cloning repository..."
    git clone https://github.com/wilsonglopes/appcandidato.git /var/www/app-zm
else
    echo "Pulling latest changes..."
    cd /var/www/app-zm
    git pull origin main
fi

cd /var/www/app-zm

if ! command -v pm2 &> /dev/null
then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

echo "Creating .env file..."
cat << 'EOF' > .env
DATABASE_URL="postgresql://postgres.tkokztokfjfguwonkuwh:YJps3fUX1u4Y43g2@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
AUTH_SECRET="ze-milton-secret-key-1234567890abcdef"
NEXT_PUBLIC_APP_NAME="Zé Milton"
PORT=3001
EOF

echo "Installing dependencies..."
npm install

echo "Running prisma db push e generate..."
npx prisma db push
npx prisma generate

echo "Building Next.js app..."
npm run build

echo "Starting PM2 process..."
pm2 delete app-zm || true
pm2 start npm --name "app-zm" -- run start -- -p 3001
pm2 save

echo "Configuring Nginx..."
cat << 'EOF' | sudo tee /etc/nginx/sites-available/zm.xmnews.com.br
server {
    listen 80;
    server_name zm.xmnews.com.br;
    client_max_body_size 500M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/zm.xmnews.com.br /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo "Running certbot for HTTPS..."
sudo certbot --nginx -d zm.xmnews.com.br --non-interactive --agree-tos --register-unsafely-without-email || echo "Certbot executed."

echo "Deployment complete!"
