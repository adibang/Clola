import { useState, useEffect, useCallback } from "react";

// ============================================================
// DESIGN TOKENS & GLOBAL STYLES (injected via style tag)
// ============================================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --c-brand: #00523e;
      --c-brand-mid: #006B54;
      --c-brand-light: #00a876;
      --c-brand-xlight: #e6f5f1;
      --c-danger: #c0392b;
      --c-danger-light: #fdecea;
      --c-success: #1e8449;
      --c-success-light: #eafaf1;
      --c-warning: #d68910;
      --c-warning-light: #fef9e7;
      --c-info: #1a5276;
      --c-bg: #f0f4f3;
      --c-white: #ffffff;
      --c-ink: #1a2e27;
      --c-ink-2: #3d5247;
      --c-ink-3: #7a9186;
      --c-border: #dde8e4;
      --c-border-2: #c8dbd5;
      --r-sm: 8px;
      --r-md: 12px;
      --r-lg: 16px;
      --r-xl: 24px;
      --sh-sm: 0 1px 3px rgba(0,82,62,0.08);
      --sh-md: 0 4px 12px rgba(0,82,62,0.10);
      --sh-lg: 0 8px 24px rgba(0,82,62,0.14);
      --font: 'Plus Jakarta Sans', sans-serif;
      --font-mono: 'DM Mono', monospace;
    }

    body { font-family: var(--font); background: var(--c-bg); color: var(--c-ink); font-size: 14px; line-height: 1.5; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--c-border-2); border-radius: 99px; }

    /* Layout */
    .app-shell { display: flex; height: 100vh; overflow: hidden; }

    /* Sidebar */
    .sidebar {
      width: 240px; min-width: 240px; background: var(--c-brand);
      display: flex; flex-direction: column; overflow-y: auto;
      box-shadow: 4px 0 20px rgba(0,0,0,0.12);
      position: relative; z-index: 10;
      transition: width 0.2s ease;
    }
    .sidebar.collapsed { width: 64px; min-width: 64px; }
    .sidebar-logo {
      padding: 20px 20px 16px;
      display: flex; align-items: center; gap: 10px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .sidebar.collapsed .sidebar-logo { justify-content: center; padding: 20px 0 16px; }
    .logo-icon {
      width: 36px; height: 36px; background: #00a876; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      font-size: 18px; font-weight: 800; color: white; letter-spacing: -1px;
    }
    .logo-text { color: white; font-weight: 800; font-size: 16px; letter-spacing: -0.5px; overflow: hidden; white-space: nowrap; }
    .logo-text span { color: #00e89c; }
    .sidebar-nav { padding: 12px 0; flex: 1; }
    .nav-section-label {
      padding: 8px 20px 4px; font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 1.2px; color: rgba(255,255,255,0.35);
      overflow: hidden; white-space: nowrap;
    }
    .sidebar.collapsed .nav-section-label { opacity: 0; }
    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 20px; cursor: pointer; border-radius: 0;
      transition: all 0.15s; position: relative;
      color: rgba(255,255,255,0.65); font-size: 13.5px; font-weight: 500;
      user-select: none;
    }
    .sidebar.collapsed .nav-item { justify-content: center; padding: 12px 0; }
    .nav-item:hover { background: rgba(255,255,255,0.08); color: white; }
    .nav-item.active { background: rgba(255,255,255,0.14); color: white; font-weight: 600; }
    .nav-item.active::before {
      content: ''; position: absolute; left: 0; top: 6px; bottom: 6px;
      width: 3px; background: #00e89c; border-radius: 0 3px 3px 0;
    }
    .nav-icon { font-size: 16px; flex-shrink: 0; width: 20px; text-align: center; }
    .nav-label { overflow: hidden; white-space: nowrap; }
    .sidebar.collapsed .nav-label { display: none; }
    .sidebar-footer {
      padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.1);
    }
    .sidebar.collapsed .sidebar-footer { padding: 12px 0; display: flex; justify-content: center; }
    .user-card {
      display: flex; align-items: center; gap: 10px; padding: 8px;
      border-radius: var(--r-md); background: rgba(255,255,255,0.08); cursor: pointer;
    }
    .sidebar.collapsed .user-card { background: none; padding: 0; }
    .avatar {
      width: 32px; height: 32px; border-radius: 50%; background: #00e89c;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; color: var(--c-brand); flex-shrink: 0;
    }
    .user-info { overflow: hidden; }
    .user-name { font-size: 13px; font-weight: 600; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-role { font-size: 11px; color: rgba(255,255,255,0.45); }
    .sidebar.collapsed .user-info { display: none; }

    /* Main area */
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .topbar {
      background: var(--c-white); border-bottom: 1px solid var(--c-border);
      padding: 0 24px; height: 60px; display: flex; align-items: center;
      justify-content: space-between; flex-shrink: 0;
      box-shadow: var(--sh-sm);
    }
    .topbar-left { display: flex; align-items: center; gap: 12px; }
    .page-title { font-size: 17px; font-weight: 700; color: var(--c-ink); }
    .breadcrumb { font-size: 12px; color: var(--c-ink-3); }
    .topbar-right { display: flex; align-items: center; gap: 8px; }
    .content { flex: 1; overflow-y: auto; padding: 24px; }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 14px; border-radius: var(--r-sm); border: none; cursor: pointer;
      font-family: var(--font); font-size: 13px; font-weight: 600;
      transition: all 0.15s; user-select: none; white-space: nowrap;
    }
    .btn-sm { padding: 5px 10px; font-size: 12px; }
    .btn-lg { padding: 11px 20px; font-size: 14px; }
    .btn-primary { background: var(--c-brand-mid); color: white; }
    .btn-primary:hover { background: var(--c-brand); }
    .btn-secondary { background: var(--c-brand-xlight); color: var(--c-brand-mid); }
    .btn-secondary:hover { background: #c9e8df; }
    .btn-danger { background: var(--c-danger); color: white; }
    .btn-danger:hover { background: #a93226; }
    .btn-ghost { background: transparent; color: var(--c-ink-2); border: 1px solid var(--c-border-2); }
    .btn-ghost:hover { background: var(--c-bg); }
    .btn-icon { padding: 8px; border-radius: var(--r-sm); background: transparent; border: 1px solid var(--c-border); cursor: pointer; color: var(--c-ink-2); transition: all 0.15s; display: inline-flex; align-items: center; justify-content: center; }
    .btn-icon:hover { background: var(--c-bg); }

    /* Cards */
    .card {
      background: var(--c-white); border-radius: var(--r-lg);
      border: 1px solid var(--c-border); padding: 20px;
      box-shadow: var(--sh-sm);
    }
    .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
    .card-title { font-size: 15px; font-weight: 700; color: var(--c-ink); }

    /* Stats */
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
    .stat-card {
      background: var(--c-white); border-radius: var(--r-lg);
      border: 1px solid var(--c-border); padding: 18px 20px;
      box-shadow: var(--sh-sm); position: relative; overflow: hidden;
    }
    .stat-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    }
    .stat-card.green::before { background: var(--c-brand-light); }
    .stat-card.blue::before { background: #2980b9; }
    .stat-card.orange::before { background: #e67e22; }
    .stat-card.purple::before { background: #8e44ad; }
    .stat-label { font-size: 12px; font-weight: 600; color: var(--c-ink-3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .stat-value { font-size: 24px; font-weight: 800; color: var(--c-ink); line-height: 1.1; margin-bottom: 4px; font-feature-settings: "tnum"; }
    .stat-change { font-size: 12px; display: flex; align-items: center; gap: 3px; font-weight: 500; }
    .stat-change.up { color: var(--c-success); }
    .stat-change.down { color: var(--c-danger); }
    .stat-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 28px; opacity: 0.12; }

    /* Tables */
    .table-wrapper { overflow-x: auto; border-radius: var(--r-md); border: 1px solid var(--c-border); }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: var(--c-bg); }
    th { padding: 10px 14px; text-align: left; font-size: 11.5px; font-weight: 700; color: var(--c-ink-3); text-transform: uppercase; letter-spacing: 0.6px; white-space: nowrap; border-bottom: 1px solid var(--c-border); }
    td { padding: 11px 14px; font-size: 13.5px; color: var(--c-ink); border-bottom: 1px solid var(--c-border); }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: #f8fbfa; }
    .td-mono { font-family: var(--font-mono); font-size: 12.5px; }

    /* Badges */
    .badge {
      display: inline-flex; align-items: center;
      padding: 3px 8px; border-radius: 99px; font-size: 11.5px; font-weight: 600;
    }
    .badge-success { background: var(--c-success-light); color: var(--c-success); }
    .badge-danger { background: var(--c-danger-light); color: var(--c-danger); }
    .badge-warning { background: var(--c-warning-light); color: var(--c-warning); }
    .badge-info { background: #e8f1f7; color: var(--c-info); }
    .badge-neutral { background: var(--c-bg); color: var(--c-ink-2); }

    /* Forms */
    .form-group { margin-bottom: 14px; }
    label { display: block; font-size: 12.5px; font-weight: 600; color: var(--c-ink-2); margin-bottom: 5px; }
    input, select, textarea {
      width: 100%; padding: 9px 12px; border-radius: var(--r-sm);
      border: 1.5px solid var(--c-border-2); background: var(--c-white);
      font-family: var(--font); font-size: 13.5px; color: var(--c-ink);
      transition: border-color 0.15s, box-shadow 0.15s; outline: none;
    }
    input:focus, select:focus, textarea:focus {
      border-color: var(--c-brand-light); box-shadow: 0 0 0 3px rgba(0,168,118,0.12);
    }
    textarea { resize: vertical; min-height: 80px; }
    .input-group { display: flex; gap: 8px; }
    .input-prefix { display: flex; align-items: center; padding: 0 12px; background: var(--c-bg); border: 1.5px solid var(--c-border-2); border-radius: var(--r-sm) 0 0 var(--r-sm); font-size: 13px; color: var(--c-ink-3); white-space: nowrap; }
    .input-group input { border-radius: 0 var(--r-sm) var(--r-sm) 0; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(26,46,39,0.55); z-index: 1000;
      display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(2px); animation: fadeIn 0.15s ease;
    }
    .modal {
      background: var(--c-white); border-radius: var(--r-xl);
      box-shadow: var(--sh-lg); width: 100%; max-height: 90vh;
      overflow-y: auto; animation: slideUp 0.2s ease;
    }
    .modal-sm { max-width: 380px; }
    .modal-md { max-width: 560px; }
    .modal-lg { max-width: 720px; }
    .modal-xl { max-width: 900px; }
    .modal-header { padding: 20px 24px 16px; border-bottom: 1px solid var(--c-border); display: flex; align-items: center; justify-content: space-between; }
    .modal-title { font-size: 16px; font-weight: 700; color: var(--c-ink); }
    .modal-body { padding: 20px 24px; }
    .modal-footer { padding: 16px 24px; border-top: 1px solid var(--c-border); display: flex; justify-content: flex-end; gap: 8px; }

    /* Search bar */
    .search-bar {
      display: flex; align-items: center; gap: 8px; padding: 8px 12px;
      background: var(--c-bg); border: 1.5px solid var(--c-border-2);
      border-radius: var(--r-sm); flex: 1; max-width: 320px;
    }
    .search-bar input { background: none; border: none; box-shadow: none; padding: 0; font-size: 13.5px; }
    .search-bar input:focus { border: none; box-shadow: none; }

    /* Toast */
    .toast-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; }
    .toast {
      display: flex; align-items: center; gap: 10px; padding: 12px 16px;
      background: var(--c-ink); color: white; border-radius: var(--r-md);
      box-shadow: var(--sh-lg); font-size: 13px; font-weight: 500;
      animation: slideIn 0.2s ease; max-width: 320px;
    }
    .toast-success { background: var(--c-success); }
    .toast-error { background: var(--c-danger); }
    .toast-warning { background: var(--c-warning); color: var(--c-ink); }

    /* POS specific */
    .pos-layout { display: grid; grid-template-columns: 1fr 360px; gap: 0; height: 100%; overflow: hidden; margin: -24px; }
    .pos-left { overflow-y: auto; padding: 20px; border-right: 1px solid var(--c-border); }
    .pos-right { display: flex; flex-direction: column; background: var(--c-white); }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
    .product-card {
      border: 1.5px solid var(--c-border); border-radius: var(--r-md); padding: 12px;
      cursor: pointer; transition: all 0.15s; background: var(--c-white);
    }
    .product-card:hover { border-color: var(--c-brand-light); background: var(--c-brand-xlight); transform: translateY(-1px); box-shadow: var(--sh-md); }
    .product-card-name { font-size: 13px; font-weight: 600; margin-bottom: 4px; line-height: 1.3; }
    .product-card-code { font-size: 11px; color: var(--c-ink-3); font-family: var(--font-mono); margin-bottom: 6px; }
    .product-card-price { font-size: 14px; font-weight: 700; color: var(--c-brand-mid); }
    .product-card-stock { font-size: 11px; color: var(--c-ink-3); margin-top: 2px; }
    .cart-header { padding: 16px; border-bottom: 1px solid var(--c-border); }
    .cart-title { font-size: 14px; font-weight: 700; }
    .cart-items { flex: 1; overflow-y: auto; padding: 8px; }
    .cart-item { display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: var(--r-sm); border: 1px solid var(--c-border); margin-bottom: 6px; background: var(--c-bg); }
    .cart-item-name { font-size: 13px; font-weight: 600; flex: 1; }
    .cart-item-qty { display: flex; align-items: center; gap: 4px; }
    .qty-btn { width: 24px; height: 24px; border-radius: 6px; border: 1px solid var(--c-border-2); background: var(--c-white); cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; font-weight: 700; transition: all 0.1s; }
    .qty-btn:hover { background: var(--c-brand-mid); color: white; border-color: var(--c-brand-mid); }
    .qty-value { width: 28px; text-align: center; font-size: 13px; font-weight: 700; }
    .cart-item-total { font-size: 13px; font-weight: 700; color: var(--c-brand-mid); min-width: 70px; text-align: right; }
    .cart-summary { padding: 14px; border-top: 1px solid var(--c-border); border-bottom: 1px solid var(--c-border); }
    .summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 13px; }
    .summary-row:last-child { margin-bottom: 0; }
    .summary-total { font-size: 18px; font-weight: 800; color: var(--c-brand); }
    .cart-actions { padding: 14px; }

    /* Dashboard charts area */
    .chart-bar-container { display: flex; align-items: flex-end; gap: 4px; height: 80px; padding: 0 4px; }
    .chart-bar-col { display: flex; flex-direction: column; align-items: center; gap: 3px; flex: 1; }
    .chart-bar { width: 100%; background: var(--c-brand-xlight); border-radius: 3px 3px 0 0; transition: all 0.3s; cursor: pointer; }
    .chart-bar:hover { background: var(--c-brand-light); }
    .chart-bar.active { background: var(--c-brand-mid); }
    .chart-bar-label { font-size: 9px; color: var(--c-ink-3); font-weight: 600; }

    /* Empty state */
    .empty-state { text-align: center; padding: 48px 24px; }
    .empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.3; }
    .empty-title { font-size: 15px; font-weight: 700; color: var(--c-ink-2); margin-bottom: 6px; }
    .empty-desc { font-size: 13px; color: var(--c-ink-3); }

    /* Toolbar */
    .page-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
    .toolbar-left { display: flex; align-items: center; gap: 8px; }
    .toolbar-right { display: flex; align-items: center; gap: 8px; }

    /* Animations */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    /* Auth page */
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--c-brand) 0%, #003828 100%); }
    .auth-card { background: white; border-radius: 24px; padding: 40px; width: 100%; max-width: 400px; box-shadow: 0 24px 64px rgba(0,0,0,0.2); }
    .auth-logo { text-align: center; margin-bottom: 28px; }
    .auth-logo-icon { width: 56px; height: 56px; background: var(--c-brand-mid); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; color: white; margin-bottom: 10px; }
    .auth-logo-name { font-size: 22px; font-weight: 800; color: var(--c-ink); }
    .auth-logo-name span { color: var(--c-brand-mid); }
    .auth-subtitle { font-size: 13px; color: var(--c-ink-3); text-align: center; margin-bottom: 24px; }
    .auth-btn { width: 100%; padding: 12px; background: var(--c-brand-mid); color: white; border: none; border-radius: var(--r-sm); font-family: var(--font); font-size: 15px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
    .auth-btn:hover { background: var(--c-brand); }
    .auth-demo { background: var(--c-brand-xlight); border: 1px solid #c0ddd5; border-radius: var(--r-md); padding: 12px; margin-top: 16px; font-size: 12.5px; color: var(--c-ink-2); }
    .auth-demo strong { color: var(--c-brand-mid); }

    /* Responsive tweaks */
    @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

    /* Tabs */
    .tabs { display: flex; gap: 0; border-bottom: 2px solid var(--c-border); margin-bottom: 20px; }
    .tab { padding: 10px 18px; font-size: 13.5px; font-weight: 600; color: var(--c-ink-3); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.15s; }
    .tab.active { color: var(--c-brand-mid); border-bottom-color: var(--c-brand-mid); }
    .tab:hover:not(.active) { color: var(--c-ink-2); }

    /* Pagination */
    .pagination { display: flex; align-items: center; justify-content: between; gap: 4px; padding-top: 12px; border-top: 1px solid var(--c-border); }
    .page-btn { width: 32px; height: 32px; border-radius: var(--r-sm); border: 1px solid var(--c-border); background: white; cursor: pointer; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; transition: all 0.1s; color: var(--c-ink-2); }
    .page-btn:hover { background: var(--c-brand-xlight); border-color: var(--c-brand-light); color: var(--c-brand-mid); }
    .page-btn.active { background: var(--c-brand-mid); border-color: var(--c-brand-mid); color: white; }
    .page-info { flex: 1; font-size: 12.5px; color: var(--c-ink-3); }

    /* Toggle sidebar btn */
    .toggle-sidebar-btn { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.6); padding: 4px; border-radius: 6px; display: flex; align-items: center; }
    .toggle-sidebar-btn:hover { color: white; background: rgba(255,255,255,0.1); }

    .mr-auto { margin-right: auto; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .gap-8 { gap: 8px; }
    .text-sm { font-size: 12px; color: var(--c-ink-3); }
    .font-bold { font-weight: 700; }
    .mt-8 { margin-top: 8px; }
    .mt-16 { margin-top: 16px; }
    .mb-4 { margin-bottom: 4px; }
    .full-span { grid-column: 1 / -1; }
    .text-right { text-align: right; }
    .divider { height: 1px; background: var(--c-border); margin: 12px 0; }
  `}</style>
);

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_PRODUCTS = [
  { id: '1', code: 'PRD-001', name: 'Beras Premium 5kg', category: 'Sembako', buy_price: 72000, sell_price: 85000, stock: 142, min_stock: 20, unit: 'karung', is_active: true },
  { id: '2', code: 'PRD-002', name: 'Minyak Goreng 2L', category: 'Sembako', buy_price: 32000, sell_price: 38500, stock: 87, min_stock: 15, unit: 'botol', is_active: true },
  { id: '3', code: 'PRD-003', name: 'Gula Pasir 1kg', category: 'Sembako', buy_price: 15000, sell_price: 18000, stock: 4, min_stock: 10, unit: 'kg', is_active: true },
  { id: '4', code: 'PRD-004', name: 'Teh Botol Sosro', category: 'Minuman', buy_price: 4500, sell_price: 6000, stock: 240, min_stock: 30, unit: 'botol', is_active: true },
  { id: '5', code: 'PRD-005', name: 'Indomie Goreng', category: 'Makanan', buy_price: 2700, sell_price: 3500, stock: 312, min_stock: 50, unit: 'pcs', is_active: true },
  { id: '6', code: 'PRD-006', name: 'Sabun Mandi Lifebuoy', category: 'Perawatan', buy_price: 5000, sell_price: 6500, stock: 0, min_stock: 15, unit: 'pcs', is_active: false },
  { id: '7', code: 'PRD-007', name: 'Aqua Galon 19L', category: 'Minuman', buy_price: 18000, sell_price: 22000, stock: 58, min_stock: 10, unit: 'galon', is_active: true },
  { id: '8', code: 'PRD-008', name: 'Kopi Kapal Api Spesial', category: 'Minuman', buy_price: 9500, sell_price: 12500, stock: 96, min_stock: 20, unit: 'sachet', is_active: true },
  { id: '9', code: 'PRD-009', name: 'Detergen Rinso 800g', category: 'Perawatan', buy_price: 18000, sell_price: 23000, stock: 44, min_stock: 10, unit: 'pcs', is_active: true },
  { id: '10', code: 'PRD-010', name: 'Susu Indomilk 1L', category: 'Minuman', buy_price: 14000, sell_price: 18000, stock: 35, min_stock: 12, unit: 'pack', is_active: true },
];

const MOCK_CUSTOMERS = [
  { id: '1', code: 'CST-001', name: 'Ahmad Fauzi', phone: '081234567890', email: 'ahmad@email.com', level: 'gold', points: 1250, outstanding: 0 },
  { id: '2', code: 'CST-002', name: 'Siti Rahayu', phone: '087654321098', email: 'siti@email.com', level: 'silver', points: 480, outstanding: 150000 },
  { id: '3', code: 'CST-003', name: 'Budi Santoso', phone: '085612349876', email: 'budi@email.com', level: 'regular', points: 90, outstanding: 0 },
  { id: '4', code: 'CST-004', name: 'Dewi Lestari', phone: '082198765432', email: 'dewi@email.com', level: 'gold', points: 3200, outstanding: 0 },
];

const MOCK_SALES = [
  { id: '1', transaction_number: 'TRX-20240322-001', customer_name: 'Ahmad Fauzi', subtotal: 230000, discount_amount: 10000, total: 220000, payment_method: 'cash', status: 'completed', created_at: new Date(Date.now() - 2 * 3600000) },
  { id: '2', transaction_number: 'TRX-20240322-002', customer_name: 'Walk-in', subtotal: 87500, discount_amount: 0, total: 87500, payment_method: 'transfer', status: 'completed', created_at: new Date(Date.now() - 4 * 3600000) },
  { id: '3', transaction_number: 'TRX-20240322-003', customer_name: 'Siti Rahayu', subtotal: 450000, discount_amount: 25000, total: 425000, payment_method: 'credit', status: 'pending', created_at: new Date(Date.now() - 6 * 3600000) },
  { id: '4', transaction_number: 'TRX-20240321-012', customer_name: 'Budi Santoso', subtotal: 63000, discount_amount: 0, total: 63000, payment_method: 'cash', status: 'completed', created_at: new Date(Date.now() - 28 * 3600000) },
  { id: '5', transaction_number: 'TRX-20240321-011', customer_name: 'Walk-in', subtotal: 124000, discount_amount: 0, total: 124000, payment_method: 'cash', status: 'cancelled', created_at: new Date(Date.now() - 30 * 3600000) },
];

const MOCK_SUPPLIERS = [
  { id: '1', code: 'SUP-001', name: 'CV Sumber Makmur', phone: '021-5551234', email: 'sourcing@sumbermakmur.co.id', outstanding: 2500000 },
  { id: '2', code: 'SUP-002', name: 'PT Distributor Nasional', phone: '021-7778888', email: 'order@disnas.co.id', outstanding: 0 },
  { id: '3', code: 'SUP-003', name: 'UD Berkah Jaya', phone: '022-9996666', email: 'admin@berkah.co.id', outstanding: 750000 },
];

// ============================================================
// HELPERS
// ============================================================
const formatRp = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);
const formatNum = (v) => new Intl.NumberFormat('id-ID').format(v || 0);
const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const formatDateShort = (d) => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

// ============================================================
// TOAST COMPONENT
// ============================================================
function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => removeToast(t.id)} style={{ cursor: 'pointer' }}>
          <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// AUTH PAGE
// ============================================================
function AuthPage({ onLogin }) {
  const [email, setEmail] = useState('admin@mudapos.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 800));
    if (email === 'admin@mudapos.com' && password === 'password123') {
      onLogin({ name: 'Admin MUDA', email, role: 'admin' });
    } else {
      setError('Email atau password salah'); setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">M</div>
          <div className="auth-logo-name">MUDA <span>POS</span></div>
        </div>
        <p className="auth-subtitle">Masuk ke sistem point of sale Anda</p>
        {error && <div style={{ background: '#fdecea', color: '#c0392b', padding: '8px 12px', borderRadius: 8, marginBottom: 12, fontSize: 13 }}>{error}</div>}
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <button className="auth-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
        <div className="auth-demo">
          <div style={{ marginBottom: 4, fontWeight: 700, color: 'var(--c-ink-2)' }}>Demo Credentials</div>
          <strong>Email:</strong> admin@mudapos.com<br />
          <strong>Password:</strong> password123
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SIDEBAR
// ============================================================
const NAV_ITEMS = [
  { key: 'dashboard', icon: '◉', label: 'Dashboard', section: 'main' },
  { key: 'pos', icon: '⊞', label: 'Point of Sale', section: 'main' },
  { key: 'products', icon: '⬡', label: 'Produk', section: 'master' },
  { key: 'customers', icon: '◎', label: 'Pelanggan', section: 'master' },
  { key: 'suppliers', icon: '⬡', label: 'Supplier', section: 'master' },
  { key: 'sales', icon: '↗', label: 'Penjualan', section: 'transaksi' },
  { key: 'purchases', icon: '↙', label: 'Pembelian', section: 'transaksi' },
  { key: 'reports', icon: '▤', label: 'Laporan', section: 'analisis' },
  { key: 'settings', icon: '⚙', label: 'Pengaturan', section: 'sistem' },
];

function Sidebar({ activePage, onNavigate, collapsed, onToggle, user }) {
  const sections = [...new Set(NAV_ITEMS.map(n => n.section))];
  const sectionLabels = { main: 'Menu Utama', master: 'Master Data', transaksi: 'Transaksi', analisis: 'Analisis', sistem: 'Sistem' };

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">M</div>
        {!collapsed && <div className="logo-text">MUDA <span>POS</span></div>}
        <button className="toggle-sidebar-btn" style={{ marginLeft: 'auto' }} onClick={onToggle}>
          <span style={{ fontSize: 14 }}>{collapsed ? '→' : '←'}</span>
        </button>
      </div>
      <nav className="sidebar-nav">
        {sections.map(sec => (
          <div key={sec}>
            <div className="nav-section-label">{sectionLabels[sec]}</div>
            {NAV_ITEMS.filter(n => n.section === sec).map(item => (
              <div key={item.key} className={`nav-item${activePage === item.key ? ' active' : ''}`} onClick={() => onNavigate(item.key)} title={collapsed ? item.label : ''}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar">{user?.name?.[0] || 'A'}</div>
          {!collapsed && (
            <div className="user-info">
              <div className="user-name">{user?.name || 'Admin'}</div>
              <div className="user-role">{user?.role || 'admin'}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// ============================================================
// DASHBOARD PAGE
// ============================================================
function DashboardPage() {
  const barData = [
    { label: 'Sen', val: 65 }, { label: 'Sel', val: 78 }, { label: 'Rab', val: 52 },
    { label: 'Kam', val: 90 }, { label: 'Jum', val: 110 }, { label: 'Sab', val: 145 },
    { label: 'Min', val: 88 },
  ];
  const maxVal = Math.max(...barData.map(b => b.val));

  const lowStock = MOCK_PRODUCTS.filter(p => p.stock < p.min_stock);

  return (
    <div>
      <div className="stats-grid">
        {[
          { label: 'Penjualan Hari Ini', value: 'Rp 4,2 Jt', change: '+12.4%', dir: 'up', icon: '↗', cls: 'green' },
          { label: 'Total Transaksi', value: '38', change: '+5 dari kemarin', dir: 'up', icon: '⊞', cls: 'blue' },
          { label: 'Pelanggan Aktif', value: '142', change: '+3 baru', dir: 'up', icon: '◎', cls: 'orange' },
          { label: 'Stok Menipis', value: `${lowStock.length} produk`, change: 'Perlu restock', dir: 'down', icon: '⚠', cls: 'purple' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.cls}`}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-change ${s.dir}`}>{s.dir === 'up' ? '▲' : '▼'} {s.change}</div>
            <div className="stat-icon">{s.icon}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Penjualan Minggu Ini</span>
            <span className="text-sm">Rp 18,2 Jt total</span>
          </div>
          <div className="chart-bar-container">
            {barData.map((b, i) => (
              <div key={i} className="chart-bar-col">
                <div className="chart-bar" style={{ height: `${(b.val / maxVal) * 100}%`, maxHeight: 64 }} title={`Rp ${b.val * 50}k`} />
                <div className="chart-bar-label">{b.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Stok Menipis ⚠</span>
            <span className="badge badge-warning">{lowStock.length} produk</span>
          </div>
          {lowStock.length === 0 ? (
            <div style={{ color: 'var(--c-success)', fontSize: 13 }}>Semua stok aman ✓</div>
          ) : (
            lowStock.slice(0, 4).map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--c-border)', fontSize: 13 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--c-ink-3)' }}>{p.code}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: p.stock === 0 ? 'var(--c-danger)' : 'var(--c-warning)', fontWeight: 700 }}>{p.stock} {p.unit}</div>
                  <div style={{ fontSize: 11, color: 'var(--c-ink-3)' }}>min: {p.min_stock}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Transaksi Terbaru</span>
          <span className="text-sm">Hari ini</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>No. Transaksi</th>
                <th>Pelanggan</th>
                <th>Total</th>
                <th>Pembayaran</th>
                <th>Status</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SALES.slice(0, 5).map(s => (
                <tr key={s.id}>
                  <td className="td-mono">{s.transaction_number}</td>
                  <td>{s.customer_name}</td>
                  <td style={{ fontWeight: 700 }}>{formatRp(s.total)}</td>
                  <td><span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>{s.payment_method}</span></td>
                  <td><span className={`badge badge-${s.status === 'completed' ? 'success' : s.status === 'cancelled' ? 'danger' : 'warning'}`}>{s.status === 'completed' ? 'Selesai' : s.status === 'cancelled' ? 'Batal' : 'Pending'}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--c-ink-3)' }}>{formatDate(s.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// POS PAGE
// ============================================================
function POSPage({ showToast }) {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customer, setCustomer] = useState('');

  const categories = ['all', ...new Set(MOCK_PRODUCTS.map(p => p.category))];
  const filtered = MOCK_PRODUCTS.filter(p =>
    p.is_active &&
    (category === 'all' || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()))
  );

  const addToCart = (product) => {
    if (product.stock === 0) { showToast('Stok habis!', 'error'); return; }
    setCart(prev => {
      const ex = prev.find(c => c.id === product.id);
      if (ex) {
        if (ex.qty >= product.stock) { showToast('Melebihi stok!', 'warning'); return prev; }
        return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c).filter(c => c.qty > 0));
  };

  const removeItem = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const subtotal = cart.reduce((s, c) => s + c.sell_price * c.qty, 0);
  const discount = 0;
  const total = subtotal - discount;
  const change = parseFloat(paidAmount || 0) - total;

  const processPayment = () => {
    if (cart.length === 0) { showToast('Keranjang kosong!', 'error'); return; }
    if (paymentMethod === 'cash' && parseFloat(paidAmount || 0) < total) { showToast('Jumlah bayar kurang!', 'error'); return; }
    setCart([]); setPaidAmount(''); setShowPaymentModal(false); setCustomer('');
    showToast('Transaksi berhasil! 🎉', 'success');
  };

  return (
    <div className="pos-layout">
      {/* Left: Product Grid */}
      <div className="pos-left">
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ maxWidth: '100%', flex: 1 }}>
            <span>🔍</span>
            <input placeholder="Cari produk / barcode..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setCategory(cat)}>
              {cat === 'all' ? 'Semua' : cat}
            </button>
          ))}
        </div>
        <div className="product-grid">
          {filtered.map(p => (
            <div key={p.id} className={`product-card${p.stock === 0 ? ' opacity-50' : ''}`} onClick={() => addToCart(p)} style={{ opacity: p.stock === 0 ? 0.5 : 1 }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>📦</div>
              <div className="product-card-name">{p.name}</div>
              <div className="product-card-code">{p.code}</div>
              <div className="product-card-price">{formatRp(p.sell_price)}</div>
              <div className="product-card-stock">{p.stock === 0 ? '⚠ Stok habis' : `Stok: ${formatNum(p.stock)} ${p.unit}`}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <div className="empty-icon">🔍</div>
              <div className="empty-title">Produk tidak ditemukan</div>
              <div className="empty-desc">Coba kata kunci lain</div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="pos-right">
        <div className="cart-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="cart-title">🛒 Keranjang ({cart.length} item)</div>
            {cart.length > 0 && <button className="btn btn-sm btn-danger" onClick={() => setCart([])}>Kosongkan</button>}
          </div>
          <div style={{ marginTop: 8 }}>
            <select value={customer} onChange={e => setCustomer(e.target.value)} style={{ fontSize: 12.5, padding: '6px 10px' }}>
              <option value="">Walk-in Customer</option>
              {MOCK_CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 16px' }}>
              <div className="empty-icon">🛒</div>
              <div className="empty-title">Keranjang kosong</div>
              <div className="empty-desc">Klik produk untuk menambah</div>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="cart-item">
              <div style={{ flex: 1 }}>
                <div className="cart-item-name">{item.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--c-ink-3)' }}>{formatRp(item.sell_price)} / {item.unit}</div>
              </div>
              <div className="cart-item-qty">
                <button className="qty-btn" onClick={() => item.qty === 1 ? removeItem(item.id) : updateQty(item.id, -1)}>
                  {item.qty === 1 ? '🗑' : '−'}
                </button>
                <span className="qty-value">{item.qty}</span>
                <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
              </div>
              <div className="cart-item-total">{formatRp(item.sell_price * item.qty)}</div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row"><span>Subtotal</span><span>{formatRp(subtotal)}</span></div>
          <div className="summary-row"><span>Diskon</span><span>-{formatRp(discount)}</span></div>
          <div className="divider" />
          <div className="summary-row"><span style={{ fontWeight: 700 }}>TOTAL</span><span className="summary-total">{formatRp(total)}</span></div>
        </div>

        <div className="cart-actions">
          <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}
            onClick={() => setShowPaymentModal(true)} disabled={cart.length === 0}>
            Proses Pembayaran →
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal modal-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">💳 Proses Pembayaran</span>
              <button className="btn-icon" onClick={() => setShowPaymentModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ background: 'var(--c-brand-xlight)', border: '1px solid var(--c-border-2)', borderRadius: 12, padding: 16, marginBottom: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--c-ink-3)', marginBottom: 4 }}>Total yang harus dibayar</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--c-brand)' }}>{formatRp(total)}</div>
              </div>
              <div className="form-group">
                <label>Metode Pembayaran</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[['cash', '💵 Tunai'], ['transfer', '🏦 Transfer'], ['credit', '💳 Piutang']].map(([val, lbl]) => (
                    <button key={val} className={`btn ${paymentMethod === val ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, justifyContent: 'center' }} onClick={() => setPaymentMethod(val)}>{lbl}</button>
                  ))}
                </div>
              </div>
              {paymentMethod === 'cash' && (
                <div className="form-group">
                  <label>Jumlah Diterima</label>
                  <input type="number" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} placeholder="0" />
                  {parseFloat(paidAmount || 0) >= total && (
                    <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--c-success-light)', borderRadius: 8, fontSize: 13, color: 'var(--c-success)', fontWeight: 600 }}>
                      Kembalian: {formatRp(change)}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowPaymentModal(false)}>Batal</button>
              <button className="btn btn-primary btn-lg" onClick={processPayment}>Bayar Sekarang ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PRODUCTS PAGE
// ============================================================
function ProductsPage({ showToast }) {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});
  const [activeTab, setActiveTab] = useState('all');

  const cats = ['all', ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p =>
    (activeTab === 'all' || p.category === activeTab) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => {
    setEditItem(null);
    setForm({ code: `PRD-${String(products.length + 1).padStart(3, '0')}`, name: '', category: '', buy_price: 0, sell_price: 0, stock: 0, min_stock: 5, unit: 'pcs', is_active: true });
    setShowModal(true);
  };

  const openEdit = (p) => { setEditItem(p); setForm({ ...p }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name || !form.code) { showToast('Nama dan kode wajib diisi', 'error'); return; }
    if (editItem) {
      setProducts(prev => prev.map(p => p.id === editItem.id ? { ...p, ...form } : p));
      showToast('Produk berhasil diperbarui', 'success');
    } else {
      setProducts(prev => [...prev, { ...form, id: String(Date.now()) }]);
      showToast('Produk berhasil ditambahkan', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (p) => {
    setProducts(prev => prev.filter(x => x.id !== p.id));
    showToast('Produk dihapus', 'success');
  };

  return (
    <div>
      <div className="tabs">
        {cats.map(c => <div key={c} className={`tab${activeTab === c ? ' active' : ''}`} onClick={() => setActiveTab(c)}>{c === 'all' ? `Semua (${products.length})` : c}</div>)}
      </div>

      <div className="page-toolbar">
        <div className="toolbar-left">
          <div className="search-bar">
            <span>🔍</span>
            <input placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span className="text-sm">{filtered.length} produk</span>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-ghost btn-sm">📥 Import</button>
          <button className="btn btn-ghost btn-sm">📤 Export</button>
          <button className="btn btn-primary" onClick={openAdd}>+ Tambah Produk</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga Beli</th>
                <th>Harga Jual</th>
                <th>Stok</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td className="td-mono">{p.code}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td><span className="badge badge-neutral">{p.category}</span></td>
                  <td>{formatRp(p.buy_price)}</td>
                  <td style={{ fontWeight: 600, color: 'var(--c-brand-mid)' }}>{formatRp(p.sell_price)}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: p.stock === 0 ? 'var(--c-danger)' : p.stock < p.min_stock ? 'var(--c-warning)' : 'var(--c-success)' }}>
                      {formatNum(p.stock)} {p.unit}
                    </span>
                  </td>
                  <td><span className={`badge ${p.is_active ? 'badge-success' : 'badge-danger'}`}>{p.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8}><div className="empty-state"><div className="empty-icon">📦</div><div className="empty-title">Tidak ada produk</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editItem ? 'Edit Produk' : 'Tambah Produk Baru'}</span>
              <button className="btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group"><label>Kode Produk *</label><input value={form.code || ''} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
                <div className="form-group"><label>Nama Produk *</label><input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="form-group"><label>Kategori</label><input value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
                <div className="form-group"><label>Satuan</label><select value={form.unit || 'pcs'} onChange={e => setForm({ ...form, unit: e.target.value })}><option>pcs</option><option>kg</option><option>liter</option><option>dus</option><option>botol</option><option>karung</option><option>galon</option><option>pack</option><option>sachet</option></select></div>
                <div className="form-group"><label>Harga Beli</label><div className="input-group"><div className="input-prefix">Rp</div><input type="number" value={form.buy_price || 0} onChange={e => setForm({ ...form, buy_price: parseFloat(e.target.value) })} /></div></div>
                <div className="form-group"><label>Harga Jual</label><div className="input-group"><div className="input-prefix">Rp</div><input type="number" value={form.sell_price || 0} onChange={e => setForm({ ...form, sell_price: parseFloat(e.target.value) })} /></div></div>
                <div className="form-group"><label>Stok</label><input type="number" value={form.stock || 0} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) })} /></div>
                <div className="form-group"><label>Min. Stok</label><input type="number" value={form.min_stock || 0} onChange={e => setForm({ ...form, min_stock: parseInt(e.target.value) })} /></div>
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_active !== false} onChange={e => setForm({ ...form, is_active: e.target.checked })} style={{ width: 'auto' }} />
                  Produk Aktif
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CUSTOMERS PAGE
// ============================================================
function CustomersPage({ showToast }) {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  );

  const levelBadge = (l) => ({ gold: 'badge-warning', silver: 'badge-info', regular: 'badge-neutral' }[l] || 'badge-neutral');
  const openAdd = () => {
    setEditItem(null);
    setForm({ code: `CST-${String(customers.length + 1).padStart(3, '0')}`, name: '', phone: '', email: '', address: '', level: 'regular', points: 0 });
    setShowModal(true);
  };
  const handleSave = () => {
    if (!form.name) { showToast('Nama wajib diisi', 'error'); return; }
    if (editItem) { setCustomers(prev => prev.map(c => c.id === editItem.id ? { ...c, ...form } : c)); showToast('Pelanggan diperbarui', 'success'); }
    else { setCustomers(prev => [...prev, { ...form, id: String(Date.now()), outstanding: 0 }]); showToast('Pelanggan ditambahkan', 'success'); }
    setShowModal(false);
  };

  return (
    <div>
      <div className="page-toolbar">
        <div className="toolbar-left">
          <div className="search-bar"><span>🔍</span><input placeholder="Cari pelanggan..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <span className="text-sm">{filtered.length} pelanggan</span>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-ghost btn-sm">📤 Export</button>
          <button className="btn btn-primary" onClick={openAdd}>+ Tambah Pelanggan</button>
        </div>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Kode</th><th>Nama</th><th>Telepon</th><th>Email</th><th>Level</th><th>Poin</th><th>Piutang</th><th>Aksi</th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td className="td-mono">{c.code}</td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.phone || '-'}</td>
                  <td>{c.email || '-'}</td>
                  <td><span className={`badge ${levelBadge(c.level)}`} style={{ textTransform: 'capitalize' }}>{c.level}</span></td>
                  <td style={{ fontWeight: 600 }}>{formatNum(c.points)}</td>
                  <td style={{ color: c.outstanding > 0 ? 'var(--c-danger)' : 'var(--c-ink-3)', fontWeight: c.outstanding > 0 ? 700 : 400 }}>{formatRp(c.outstanding)}</td>
                  <td><div style={{ display: 'flex', gap: 4 }}><button className="btn btn-sm btn-secondary" onClick={() => { setEditItem(c); setForm({ ...c }); setShowModal(true); }}>Edit</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><span className="modal-title">{editItem ? 'Edit Pelanggan' : 'Tambah Pelanggan'}</span><button className="btn-icon" onClick={() => setShowModal(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group"><label>Kode</label><input value={form.code || ''} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
                <div className="form-group"><label>Nama *</label><input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="form-group"><label>Telepon</label><input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="form-group"><label>Email</label><input value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div className="form-group"><label>Level</label><select value={form.level || 'regular'} onChange={e => setForm({ ...form, level: e.target.value })}><option value="regular">Regular</option><option value="silver">Silver</option><option value="gold">Gold</option></select></div>
                <div className="form-group"><label>Poin</label><input type="number" value={form.points || 0} onChange={e => setForm({ ...form, points: parseInt(e.target.value) })} /></div>
                <div className="form-group full-span"><label>Alamat</label><textarea value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
              </div>
            </div>
            <div className="modal-footer"><button className="btn btn-ghost" onClick={() => setShowModal(false)}>Batal</button><button className="btn btn-primary" onClick={handleSave}>Simpan</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SALES PAGE
// ============================================================
function SalesPage({ showToast }) {
  const [sales] = useState(MOCK_SALES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = sales.filter(s =>
    (statusFilter === 'all' || s.status === statusFilter) &&
    (s.transaction_number.toLowerCase().includes(search.toLowerCase()) || s.customer_name.toLowerCase().includes(search.toLowerCase()))
  );

  const totals = {
    revenue: sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.total, 0),
    count: sales.filter(s => s.status === 'completed').length,
  };

  return (
    <div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 16 }}>
        <div className="stat-card green"><div className="stat-label">Total Pendapatan</div><div className="stat-value" style={{ fontSize: 18 }}>{formatRp(totals.revenue)}</div></div>
        <div className="stat-card blue"><div className="stat-label">Transaksi Selesai</div><div className="stat-value">{totals.count}</div></div>
        <div className="stat-card orange"><div className="stat-label">Rata-rata / Transaksi</div><div className="stat-value" style={{ fontSize: 18 }}>{totals.count ? formatRp(totals.revenue / totals.count) : 'Rp 0'}</div></div>
      </div>

      <div className="page-toolbar">
        <div className="toolbar-left">
          <div className="search-bar"><span>🔍</span><input placeholder="Cari transaksi..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          {['all', 'completed', 'pending', 'cancelled'].map(s => (
            <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setStatusFilter(s)}>
              {s === 'all' ? 'Semua' : s === 'completed' ? 'Selesai' : s === 'pending' ? 'Pending' : 'Batal'}
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          <button className="btn btn-ghost btn-sm">📤 Export</button>
          <button className="btn btn-primary">+ Buat Penjualan</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>No. Transaksi</th><th>Pelanggan</th><th>Subtotal</th><th>Diskon</th><th>Total</th><th>Pembayaran</th><th>Status</th><th>Tanggal</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td className="td-mono">{s.transaction_number}</td>
                  <td style={{ fontWeight: 600 }}>{s.customer_name}</td>
                  <td>{formatRp(s.subtotal)}</td>
                  <td style={{ color: s.discount_amount > 0 ? 'var(--c-danger)' : 'var(--c-ink-3)' }}>{s.discount_amount > 0 ? `-${formatRp(s.discount_amount)}` : '-'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--c-brand-mid)' }}>{formatRp(s.total)}</td>
                  <td><span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>{s.payment_method}</span></td>
                  <td><span className={`badge badge-${s.status === 'completed' ? 'success' : s.status === 'cancelled' ? 'danger' : 'warning'}`}>{s.status === 'completed' ? 'Selesai' : s.status === 'cancelled' ? 'Batal' : 'Pending'}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--c-ink-3)' }}>{formatDate(s.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--c-border)' }}>
          <span className="text-sm">Menampilkan {filtered.length} dari {sales.length} transaksi</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3].map(p => <button key={p} className={`page-btn${p === 1 ? ' active' : ''}`}>{p}</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SUPPLIERS PAGE
// ============================================================
function SuppliersPage({ showToast }) {
  const [suppliers] = useState(MOCK_SUPPLIERS);
  const [search, setSearch] = useState('');

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-toolbar">
        <div className="toolbar-left">
          <div className="search-bar"><span>🔍</span><input placeholder="Cari supplier..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary">+ Tambah Supplier</button>
        </div>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Kode</th><th>Nama</th><th>Telepon</th><th>Email</th><th>Piutang</th><th>Aksi</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td className="td-mono">{s.code}</td>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.phone}</td>
                  <td>{s.email}</td>
                  <td style={{ color: s.outstanding > 0 ? 'var(--c-danger)' : 'var(--c-ink-3)', fontWeight: s.outstanding > 0 ? 700 : 400 }}>{formatRp(s.outstanding)}</td>
                  <td><div style={{ display: 'flex', gap: 4 }}><button className="btn btn-sm btn-secondary">Edit</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PURCHASES PAGE
// ============================================================
function PurchasesPage({ showToast }) {
  return (
    <div>
      <div className="page-toolbar">
        <div className="toolbar-right"><button className="btn btn-primary">+ Buat Pembelian</button></div>
      </div>
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">Belum ada data pembelian</div>
          <div className="empty-desc">Buat transaksi pembelian pertama Anda</div>
          <button className="btn btn-primary" style={{ marginTop: 16 }}>+ Buat Pembelian</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// REPORTS PAGE
// ============================================================
function ReportsPage() {
  const [activeReport, setActiveReport] = useState('sales');

  const reports = [
    { key: 'sales', label: 'Laporan Penjualan' },
    { key: 'purchases', label: 'Laporan Pembelian' },
    { key: 'stock', label: 'Laporan Stok' },
    { key: 'profit', label: 'Laba Rugi' },
  ];

  return (
    <div>
      <div className="tabs">
        {reports.map(r => <div key={r.key} className={`tab${activeReport === r.key ? ' active' : ''}`} onClick={() => setActiveReport(r.key)}>{r.label}</div>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
        {activeReport === 'sales' && [
          { label: 'Total Penjualan', val: 'Rp 84,2 Jt', period: 'Bulan ini' },
          { label: 'Jumlah Transaksi', val: '342', period: 'Bulan ini' },
          { label: 'Rata-rata Transaksi', val: 'Rp 246k', period: 'Bulan ini' },
        ].map((s, i) => (
          <div key={i} className="stat-card green">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: 22 }}>{s.val}</div>
            <div className="text-sm" style={{ marginTop: 4 }}>{s.period}</div>
          </div>
        ))}
        {activeReport === 'profit' && [
          { label: 'Pendapatan', val: 'Rp 84,2 Jt', cls: 'green' },
          { label: 'HPP', val: 'Rp 61,4 Jt', cls: 'blue' },
          { label: 'Laba Bersih', val: 'Rp 22,8 Jt', cls: 'orange' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.cls}`}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: 20 }}>{s.val}</div>
          </div>
        ))}
        {(activeReport === 'stock' || activeReport === 'purchases') && (
          <div className="stat-card green" style={{ gridColumn: '1/-1' }}>
            <div className="stat-label">Periode</div>
            <div style={{ fontSize: 14, marginTop: 4, color: 'var(--c-ink-2)' }}>April 2024 — Data sample tersedia</div>
          </div>
        )}
      </div>

      {activeReport === 'stock' && (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Kode</th><th>Nama Produk</th><th>Stok Awal</th><th>Masuk</th><th>Keluar</th><th>Stok Akhir</th><th>Nilai Stok</th></tr></thead>
              <tbody>
                {MOCK_PRODUCTS.map(p => (
                  <tr key={p.id}>
                    <td className="td-mono">{p.code}</td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{formatNum(p.stock + 20)}</td>
                    <td style={{ color: 'var(--c-success)' }}>+{formatNum(Math.floor(Math.random() * 50))}</td>
                    <td style={{ color: 'var(--c-danger)' }}>-{formatNum(20)}</td>
                    <td style={{ fontWeight: 700 }}>{formatNum(p.stock)}</td>
                    <td>{formatRp(p.stock * p.buy_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReport !== 'stock' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span className="card-title">Data {reports.find(r => r.key === activeReport)?.label}</span>
            <button className="btn btn-ghost btn-sm">📤 Export CSV</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>No. Referensi</th>
                  <th>Keterangan</th>
                  <th>Nominal</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SALES.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontSize: 12, color: 'var(--c-ink-3)' }}>{formatDateShort(s.created_at)}</td>
                    <td className="td-mono">{s.transaction_number}</td>
                    <td>{s.customer_name}</td>
                    <td style={{ fontWeight: 700, color: 'var(--c-brand-mid)' }}>{formatRp(s.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SETTINGS PAGE
// ============================================================
function SettingsPage({ showToast }) {
  const [settings, setSettings] = useState({
    store_name: 'MUDA Store', store_phone: '021-12345678', store_address: 'Jl. Merdeka No. 1, Jakarta',
    tax_enabled: false, tax_rate: 11, print_receipt: true, currency: 'IDR', timezone: 'Asia/Jakarta',
  });

  const handleSave = () => showToast('Pengaturan disimpan', 'success');

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><span className="card-title">Informasi Toko</span></div>
        <div className="form-grid">
          <div className="form-group"><label>Nama Toko</label><input value={settings.store_name} onChange={e => setSettings({ ...settings, store_name: e.target.value })} /></div>
          <div className="form-group"><label>Telepon</label><input value={settings.store_phone} onChange={e => setSettings({ ...settings, store_phone: e.target.value })} /></div>
          <div className="form-group full-span"><label>Alamat</label><textarea value={settings.store_address} onChange={e => setSettings({ ...settings, store_address: e.target.value })} style={{ minHeight: 60 }} /></div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><span className="card-title">Pengaturan Transaksi</span></div>
        <div className="form-grid">
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.tax_enabled} onChange={e => setSettings({ ...settings, tax_enabled: e.target.checked })} style={{ width: 'auto' }} />
              Aktifkan Pajak (PPN)
            </label>
          </div>
          {settings.tax_enabled && (
            <div className="form-group"><label>Tarif Pajak (%)</label><input type="number" value={settings.tax_rate} onChange={e => setSettings({ ...settings, tax_rate: parseFloat(e.target.value) })} /></div>
          )}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.print_receipt} onChange={e => setSettings({ ...settings, print_receipt: e.target.checked })} style={{ width: 'auto' }} />
              Cetak Struk Otomatis
            </label>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary btn-lg" onClick={handleSave}>💾 Simpan Pengaturan</button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
const PAGE_TITLES = {
  dashboard: 'Dashboard', pos: 'Point of Sale', products: 'Manajemen Produk',
  customers: 'Data Pelanggan', suppliers: 'Data Supplier', sales: 'Riwayat Penjualan',
  purchases: 'Pembelian', reports: 'Laporan', settings: 'Pengaturan',
};

export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  if (!user) return (
    <>
      <GlobalStyles />
      <AuthPage onLogin={setUser} />
    </>
  );

  const renderPage = () => {
    const props = { showToast };
    switch (activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'pos': return <POSPage {...props} />;
      case 'products': return <ProductsPage {...props} />;
      case 'customers': return <CustomersPage {...props} />;
      case 'suppliers': return <SuppliersPage {...props} />;
      case 'sales': return <SalesPage {...props} />;
      case 'purchases': return <PurchasesPage {...props} />;
      case 'reports': return <ReportsPage />;
      case 'settings': return <SettingsPage {...props} />;
      default: return <DashboardPage />;
    }
  };

  const isPOS = activePage === 'pos';

  return (
    <>
      <GlobalStyles />
      <div className="app-shell">
        <Sidebar activePage={activePage} onNavigate={setActivePage} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} user={user} />
        <div className="main">
          <div className="topbar">
            <div className="topbar-left">
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-ink)' }}>{PAGE_TITLES[activePage]}</div>
              <div style={{ width: 1, height: 18, background: 'var(--c-border-2)', margin: '0 4px' }} />
              <div className="breadcrumb">MUDA POS / {PAGE_TITLES[activePage]}</div>
            </div>
            <div className="topbar-right">
              {activePage !== 'pos' && (
                <button className="btn btn-primary btn-sm" onClick={() => setActivePage('pos')}>⊞ Buka Kasir</button>
              )}
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--c-brand-xlight)', border: '1.5px solid var(--c-border-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 700, color: 'var(--c-brand-mid)', fontSize: 14 }} title={user.name}>
                {user.name[0]}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setUser(null)}>Keluar</button>
            </div>
          </div>
          <div className={`content${isPOS ? '' : ''}`} style={isPOS ? { padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' } : {}}>
            {renderPage()}
          </div>
        </div>
      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  );
}
