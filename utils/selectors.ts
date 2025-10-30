export const S = {
  login: {
    user: '[data-testid="login-username"]',
    pass: '[data-testid="login-password"]',
    submit: '[data-testid="login-submit"]',
    otp: '[data-testid="login-otp"]',
    remember: '[data-testid="login-remember"]',
    forgot: 'a:has-text("Forgot Password")'
  },
  header: {
    userMenu: '[data-testid="header-user-menu"]',
    logout: '[data-testid="menu-logout"]',
    exchange: '[data-testid="header-exchange-select"]'
  },
  home: {
    shell: '[data-testid="home-shell"]',
    marketsTab: '[data-testid="tab-markets"]'
  },
  market: {
    wsIndicator: '[data-testid="ws-indicator"]',
    bestBid: '[data-testid="best-bid"]',
    bestAsk: '[data-testid="best-ask"]'
  },
  order: {
    sideBuy: '[data-testid="order-side-buy"]',
    sideSell: '[data-testid="order-side-sell"]',
    price: '[data-testid="order-price"]',
    qty: '[data-testid="order-qty"]',
    submit: '[data-testid="order-submit"]',
    error: '[data-testid="form-error"]'
  },
  settings: {
    menu: '[data-testid="settings-menu"]',
    currency: '[data-testid="select-currency"]',
    timezone: '[data-testid="select-timezone"]',
    save: '[data-testid="settings-save"]',
    toast: '[data-testid="toast-success"]'
  }
} as const;
