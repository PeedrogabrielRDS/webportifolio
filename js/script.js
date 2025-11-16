const header = document.getElementById("menu-desktop");

window.addEventListener('scroll', () => {
  const limit = window.innerHeight * 0.8;
  header.classList.toggle('scrolled', window.scrollY > limit);
});

// ------------------------------------ Menu Mobile ------------------------------------

const menuOpenClose = document.getElementById("menu-mobile-open-close")
const menuDiv = document.getElementById("all-menu-mobile")
const blurBackGround = document.getElementById("blur-background")


blurBackGround.addEventListener('click', () => {
  fecharMenu()
});

menuOpenClose.addEventListener('click', () => {
  const menuIsOpen = menuDiv.style.transform === ("translateX(0%)")

  if (menuIsOpen) {
    fecharMenu()
  } else {
    abrirMenu()
  }
})



function abrirMenu() {
  menuDiv.style.transform = "translateX(0%)"

  blurBackGround.style.visibility = "visible"
  blurBackGround.style.opacity = "1"
  blurBackGround.style.pointerEvents = "auto"
}

function fecharMenu() {
  menuDiv.style.transform = "translateX(100%)"

  blurBackGround.style.opacity = "0"
  blurBackGround.style.pointerEvents = "none"
  blurBackGround.style.visibility = "hidden";
}

document.getElementById("home-direction").addEventListener('click', () => {
  fecharMenu()
  window.location.hash = "#header";
})
document.getElementById("about-me-direction").addEventListener('click', () => {
  fecharMenu()
  window.location.hash = "#about-me";
})
document.getElementById("habilities-direction").addEventListener('click', () => {
  fecharMenu()
  window.location.hash = "#habilities";
})
document.getElementById("projects-direction").addEventListener('click', () => {
  fecharMenu()
  window.location.hash = "#projects";
})