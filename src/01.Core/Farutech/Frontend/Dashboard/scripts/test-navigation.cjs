// scripts/test-navigation.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando pruebas de navegación...\n');

// Verificar que el build funciona
console.log('1. Verificando build...');
exec('npm run build --silent', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error en build:', error);
    return;
  }
  console.log('✅ Build exitoso\n');

  // Verificar archivos de entorno
  console.log('2. Verificando archivos de entorno...');
  const envDev = path.join(__dirname, '..', '.env.development');
  const envProd = path.join(__dirname, '..', '.env.production');

  if (fs.existsSync(envDev)) {
    console.log('✅ .env.development existe');
  } else {
    console.log('❌ .env.development no encontrado');
  }

  if (fs.existsSync(envProd)) {
    console.log('✅ .env.production existe');
  } else {
    console.log('❌ .env.production no encontrado');
  }

  console.log('\n3. Verificando componentes críticos...');
  const criticalFiles = [
    'src/hooks/useInstanceNavigation.ts',
    'src/services/navigationService.ts',
    'src/services/navigationDebugger.ts',
    'src/contexts/AppContext.tsx',
    'src/components/debug/NavigationDebugPanel.tsx'
  ];

  criticalFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} existe`);
    } else {
      console.log(`❌ ${file} no encontrado`);
    }
  });

  console.log('\n🎉 Verificación completa!');
  console.log('\nPróximos pasos:');
  console.log('1. Iniciar servidor de desarrollo: npm run dev');
  console.log('2. Abrir navegador en http://localhost:62310');
  console.log('3. Probar navegación a instancias');
  console.log('4. Verificar logs en consola y panel de debug');
});