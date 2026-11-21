'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, X } from 'lucide-react';
const links=[{href:'/',label:'Главная'},{href:'/products',label:'Продукция'},{href:'/production',label:'Производство'},{href:'/manufacturing-by-drawings',label:'Изготовление по чертежам'},{href:'/about',label:'О компании'},{href:'/delivery',label:'Доставка'},{href:'/payment',label:'Оплата'},{href:'/warranty',label:'Гарантия'},{href:'/contacts',label:'Контакты'}];
export function Header(){
  const [open,setOpen]=useState(false);
  const toggleRef=useRef<HTMLButtonElement>(null);
  const menuRef=useRef<HTMLDivElement>(null);
  const pathname=usePathname();
  useEffect(()=>{setOpen(false)},[pathname]);
  useEffect(()=>{
    if(!open)return;
    const previousOverflow=document.body.style.overflow;
    const previousFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
    document.body.style.overflow='hidden';
    const firstLink=menuRef.current?.querySelector<HTMLElement>('a[href]');
    firstLink?.focus();
    function onKey(e:KeyboardEvent){
      if(e.key==='Escape'){e.preventDefault();setOpen(false);return}
      if(e.key!=='Tab')return;
      const focusable=[toggleRef.current,...Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')??[])].filter((el):el is HTMLElement=>!!el);
      if(!focusable.length)return;
      const current=focusable.indexOf(document.activeElement as HTMLElement);
      if(e.shiftKey&&(current<=0)){e.preventDefault();focusable[focusable.length-1].focus()}
      else if(!e.shiftKey&&(current===focusable.length-1||current<0)){e.preventDefault();focusable[0].focus()}
    }
    document.addEventListener('keydown',onKey);
    return()=>{document.body.style.overflow=previousOverflow;document.removeEventListener('keydown',onKey);(previousFocus?.isConnected?previousFocus:toggleRef.current)?.focus()};
  },[open]);
  return <><header className="header"><div className="container header-inner"><Link href="/" className="brand" aria-label="МЗСО — на главную" onClick={()=>setOpen(false)}><Image src="/logo.svg" alt="МЗСО" width={160} height={50} priority className="brand-logo"/></Link><div className="header-actions"><Link className="header-cta" href="/request-quote" onClick={()=>setOpen(false)}>Запросить КП <ArrowUpRight size={16}/></Link><button ref={toggleRef} className="menu-toggle" type="button" onClick={()=>setOpen(!open)} aria-label={open?'Закрыть меню':'Открыть меню'} aria-expanded={open} aria-controls="site-menu">{open?<X/>:<Menu/>}</button></div></div></header><div className={'menu-overlay '+(open?'is-open':'')} id="site-menu" ref={menuRef} aria-hidden={!open} inert={!open}><div className="menu-curtains" aria-hidden="true">{[0,1,2,3].map(i=><span key={i}/>)}</div><nav className="container menu-links" aria-label="Основное меню">{links.map((link,i)=><Link tabIndex={open?0:-1} href={link.href} key={link.href} onClick={()=>setOpen(false)}><span>{String(i+1).padStart(2,'0')}</span>{link.label}<ArrowUpRight size={22}/></Link>)}</nav></div></>}
export function Footer(){return <footer className="footer"><div className="container footer-top"><div><Image src="/logo.svg" alt="МЗСО" width={180} height={56} className="brand-logo"/><p>Миасский завод специального оборудования</p></div><div><strong>Навигация</strong><Link href="/products">Продукция</Link><Link href="/production">Производство</Link><Link href="/manufacturing-by-drawings">По чертежам</Link><Link href="/about">О компании</Link></div><div><strong>Информация</strong><Link href="/delivery">Доставка</Link><Link href="/payment">Оплата</Link><Link href="/warranty">Гарантия</Link><Link href="/contacts">Контакты</Link></div><div><strong>Связаться с нами</strong><Link href="/request-quote" className="footer-request">Запросить КП <ArrowUpRight size={16}/></Link><p>Миасс, Челябинская область</p></div></div><div className="container footer-bottom"><span>© МЗСО. Все права защищены.</span><span>Сведения о продукции уточняются при запросе</span></div></footer>}