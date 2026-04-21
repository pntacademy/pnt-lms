const fs = require('fs');

const files = [
  'app/dashboard/admin/page.tsx',
  'app/dashboard/assignments/page.tsx',
  'app/dashboard/attendance/page.tsx',
  'app/dashboard/calendar/page.tsx',
  'app/dashboard/courses/[courseId]/page.tsx',
  'app/dashboard/courses/page.tsx',
  'app/dashboard/internships/page.tsx',
  'app/dashboard/layout.tsx',
  'app/dashboard/page.tsx',
  'app/login/page.tsx',
  'app/page.tsx',
  'components/layout/DesktopSidebar.tsx',
  'components/layout/MobileBottomNav.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Softer warm reds instead of harsh rose-to-red
    content = content.replace(/from-rose-500 to-red-600/g, 'from-red-400 to-rose-500');
    content = content.replace(/text-rose-600/g, 'text-red-500');
    content = content.replace(/border-rose-200/g, 'border-red-200');
    
    // Softer warm orange instead of bright amber
    content = content.replace(/from-amber-400 to-orange-500/g, 'from-orange-300 to-amber-400');
    content = content.replace(/text-amber-500/g, 'text-orange-400');
    content = content.replace(/border-amber-200/g, 'border-orange-200');

    // On login page specifically, make sure the login button is also the red gradient since user requested "make the login page red"
    if (file === 'app/login/page.tsx') {
      content = content.replace(/from-orange-300 to-amber-400/g, 'from-red-400 to-rose-500');
      // Fix the green blob
      content = content.replace(/bg-\[\#43a047\]/g, 'bg-gradient-to-br from-orange-300 to-amber-400');
      
      // Fix selection colors in login page
      content = content.replace(/selection:bg-gradient-to-br from-orange-300 to-amber-400/g, 'selection:bg-gradient-to-br from-red-400 to-rose-500');
    }
    
    fs.writeFileSync(file, content);
  }
});

console.log('UI softened to warm colors successfully!');
