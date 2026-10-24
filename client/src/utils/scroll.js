export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', `#${id}`);
    }
  }
};

export const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  });
  if (window.history && window.history.pushState) {
    window.history.pushState(null, '', '#bottom');
  }
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  if (window.history && window.history.pushState) {
    window.history.pushState(null, '', '#hero');
  }
};
