import { test, expect } from '@playwright/test';
const widths=[320,375,768,1024,1440,1920];
const routes=['/','/products','/production','/manufacturing-by-drawings','/about','/delivery','/payment','/warranty','/contacts','/request-quote'];
for(const width of widths){
 test.describe('Industrial Dark '+width+'px',()=>{
  test.use({viewport:{width,height:900}});
  for(const route of routes){
   test(route+' layout and assets',async({page})=>{
    const failures:string[]=[];
    page.on('pageerror',error=>failures.push(error.message));
    await page.goto(route,{waitUntil:'networkidle'});
    await expect(page.locator('main')).toBeVisible();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
    expect(overflow,'horizontal scroll on '+route+' at '+width).toBe(false);
    await expect(page.locator('header img[src*="logo"]')).toBeVisible();
    const badImages=await page.locator('img').evaluateAll(images=>images.filter(i=>!(i as HTMLImageElement).complete||(i as HTMLImageElement).naturalWidth===0).map(i=>i.getAttribute('src')));
    expect(badImages,'broken images on '+route).toEqual([]);
    expect(failures,'page JS errors on '+route).toEqual([]);
   });
  }
  test('menu opens, keyboard closes, focus returns',async({page})=>{
   await page.goto('/');
   const button=page.getByRole('button',{name:'Открыть меню'});
   await button.focus();
   await page.keyboard.press('Enter');
   await expect(page.getByRole('button',{name:'Закрыть меню'})).toHaveAttribute('aria-expanded','true');
   await expect(page.getByRole('navigation',{name:'Основное меню'}).getByRole('link').first()).toBeFocused();
   await page.keyboard.press('Escape');
   await expect(page.getByRole('button',{name:'Открыть меню'})).toBeFocused();
   await expect(page.locator('#site-menu')).toHaveAttribute('aria-hidden','true');
  });
  test('reduced motion disables animation',async({page})=>{
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.goto('/');
   const duration=await page.locator('.menu-curtains span').first().evaluate(el=>getComputedStyle(el).transitionDuration);
   expect(duration).toMatch(/0s|0\.00001s|1e-05s|\.01ms/);
  });
 });
}
