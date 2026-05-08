function ensureFocusStyle(): void {
  const styleId = 'flow-direction-focus-style';
  if (document.getElementById(styleId)) {
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = `
[data-flow-direction-focused="true"] {
  outline: 3px solid #f59e0b !important;
  outline-offset: 2px;
  animation: flowDirectionPulse 1.2s ease-out;
}

@keyframes flowDirectionPulse {
  0% { box-shadow: 0 0 0 0 rgb(245 158 11 / 45%); }
  70% { box-shadow: 0 0 0 8px rgb(245 158 11 / 0%); }
  100% { box-shadow: 0 0 0 0 rgb(245 158 11 / 0%); }
}
`;
  document.head.appendChild(styleElement);
}

function clearFocused(root: ParentNode): void {
  const focused = root.querySelectorAll('[data-flow-direction-focused]');
  focused.forEach((element) => element.removeAttribute('data-flow-direction-focused'));
}

export function focusOffender(root: ParentNode, selector?: string): void {
  if (!selector) {
    return;
  }

  const target = root.querySelector(selector);
  if (!target) {
    return;
  }

  ensureFocusStyle();
  clearFocused(root);
  target.setAttribute('data-flow-direction-focused', 'true');
  target.scrollIntoView({ block: 'center', behavior: 'smooth', inline: 'nearest' });
  window.setTimeout(() => {
    target.removeAttribute('data-flow-direction-focused');
  }, 1200);
}
