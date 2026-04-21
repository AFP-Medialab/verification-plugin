export function scrollToElement(id, padding = 0) {
  const element = document.getElementById(id);
  if (element) {
    const targetPosition =
      element.getBoundingClientRect().top + window.scrollY - padding;
    window.scrollTo({ top: targetPosition, behavior: "smooth" });
  }
}
