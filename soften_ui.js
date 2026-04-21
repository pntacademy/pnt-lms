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
    
    // Gradients for colors
    content = content.replace(/bg-\[#dc0a2d\]/g, 'bg-gradient-to-br from-rose-500 to-red-600');
    content = content.replace(/text-\[#dc0a2d\]/g, 'text-rose-600');
    content = content.replace(/border-\[#dc0a2d\]/g, 'border-rose-200');
    
    content = content.replace(/bg-\[#ffcb05\]/g, 'bg-gradient-to-br from-amber-400 to-orange-500');
    content = content.replace(/text-\[#ffcb05\]/g, 'text-amber-500');
    content = content.replace(/border-\[#ffcb05\]/g, 'border-amber-200');

    // Reduce black contrast to slate-800/900
    content = content.replace(/text-black/g, 'text-slate-800');
    
    // Softer Borders
    content = content.replace(/border-4 border-black/g, 'border border-slate-200');
    content = content.replace(/border-2 border-black/g, 'border border-slate-200');
    content = content.replace(/border-b-4 border-black/g, 'border-b border-slate-200');
    content = content.replace(/border-r-4 border-black/g, 'border-r border-slate-200');
    content = content.replace(/border-t-4 border-black/g, 'border-t border-slate-200');
    content = content.replace(/border-black/g, 'border-slate-200');

    // Shadows
    content = content.replace(/neo-shadow-sm/g, 'shadow-sm hover:shadow-md');
    content = content.replace(/neo-shadow/g, 'shadow-xl shadow-slate-200\/50');
    content = content.replace(/hover:shadow-\[4px_4px_0_rgba\(0,0,0,1\)\]/g, 'hover:shadow-lg');
    content = content.replace(/hover:shadow-\[6px_6px_0_rgba\(0,0,0,1\)\]/g, 'hover:shadow-xl');
    content = content.replace(/active:shadow-none/g, ''); // Remove the snap-back shadow effect
    
    fs.writeFileSync(file, content);
  }
});

console.log('UI softened successfully!');
