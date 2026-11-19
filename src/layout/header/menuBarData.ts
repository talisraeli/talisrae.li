export interface DropdownButtonData {
  name: string;
  action: string;
  type?: "checkbox";
  underlineIndex: number;
  shortcutLabel?: string;
}

export interface MenuBarItemData {
  name: string;
  shortcutKey: string;
  underlineIndex: number;
  items: (DropdownButtonData | "Divider")[];
}

export const menuBarData: MenuBarItemData[] = [
  {
    name: "View",
    shortcutKey: "v",
    underlineIndex: 0,
    items: [
      { name: "Light Theme", action: "theme-light", type: "checkbox", underlineIndex: 0 },
      { name: "Dark Theme", action: "theme-dark", type: "checkbox", underlineIndex: 0 },
      "Divider",
      { name: "Rickroll", action: "rickroll", underlineIndex: 0 },
    ],
  },
  {
    name: "Share",
    shortcutKey: "s",
    underlineIndex: 0,
    items: [
      { name: "X (Twitter)", action: "share-x", underlineIndex: 0 },
      { name: "LinkedIn", action: "share-linkedin", underlineIndex: 0 },
      { name: "Facebook", action: "share-facebook", underlineIndex: 0 },
      { name: "WhatsApp", action: "share-whatsapp", underlineIndex: 0 },
      { name: "Copy URL", action: "share-copy", underlineIndex: 0, shortcutLabel: "Ctrl+Shift+C" },
      { name: "Other...", action: "share-other", underlineIndex: 0 },
    ],
  },
  {
    name: "Connect",
    shortcutKey: "c",
    underlineIndex: 0,
    items: [
      { name: "Send an Email", action: "connect-email", underlineIndex: 0 },
      { name: "LinkedIn", action: "connect-linkedin", underlineIndex: 0 },
      { name: "GitHub", action: "connect-github", underlineIndex: 0 },
      { name: "X (Twitter)", action: "connect-x", underlineIndex: 0 },
    ],
  },
  {
    name: "Help",
    shortcutKey: "h",
    underlineIndex: 0,
    items: [
      { name: "Terms of Services", action: "help-terms", underlineIndex: 0 },
      { name: "Privacy Policy", action: "help-privacy", underlineIndex: 0 },
      { name: "Manage Cookies", action: "help-cookies", underlineIndex: 0 },
      "Divider",
      { name: "GitHub Repository", action: "help-github", underlineIndex: 0 },
      { name: "Keyboard Shortcuts", action: "help-shortcuts", underlineIndex: 0, shortcutLabel: "F1" },
      { name: "About", action: "help-about", underlineIndex: 0 },
    ],
  },
];
