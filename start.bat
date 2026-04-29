@echo off
echo Iniciando o Banco de Dados (PostgreSQL)...
docker-compose up -d

echo =======================================
echo Banco de dados iniciado.
echo Iniciando a interface do App Candidato...
echo =======================================

npm run dev
