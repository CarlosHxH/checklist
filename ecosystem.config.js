module.exports = {
  apps: [
    {
      name: 'next-app-homologacao', // Nome da sua aplicação
      script: 'node_modules/next/dist/bin/next', // Caminho para o script do Next.js
      args: 'start', // Argumento para iniciar a aplicação
      instances: 'max', // Número de instâncias (use 'max' para usar todos os núcleos disponíveis)
      exec_mode: 'cluster', // Modo de execução em cluster
      env: {
        NODE_ENV: 'production', // Defina o ambiente como produção
      },
      env_development: {
        NODE_ENV: 'development', // Defina o ambiente como desenvolvimento
      },
      watch: false, // Não habilitar o watch em produção
    },
  ],
  deploy : {
    production : {
      user : 'checklist',
      host : '192.168.136.72',
      ref  : 'origin/main',
      repo : 'https://github.com/CarlosHxH/checklist-app',
      path : '/var/www/homologacao',
      'pre-deploy-local': 'yarn build',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};